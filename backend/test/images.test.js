import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import app from '../src/app.js';

const originalUploadStream = cloudinary.uploader.upload_stream;
const originalEnv = {
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

test('POST /api/imagenes protege y convierte la subida a WebP', async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  process.env.CLOUDINARY_API_KEY = 'test-key';
  process.env.CLOUDINARY_API_SECRET = 'test-api-secret';
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}/api/imagenes`;

  try {
    const noAuth = await fetch(base, { method: 'POST' });
    assert.equal(noAuth.status, 401);

    const token = jwt.sign({ rol: 'Propietario' }, process.env.JWT_SECRET);
    const headers = { Authorization: `Bearer ${token}` };
    const missing = await fetch(base, { method: 'POST', headers });
    assert.equal(missing.status, 400);

    const invalidForm = new FormData();
    invalidForm.append('imagen', new Blob(['text'], { type: 'text/plain' }), 'file.txt');
    const invalid = await fetch(base, { method: 'POST', headers, body: invalidForm });
    assert.equal(invalid.status, 400);

    let options;
    let uploaded;
    cloudinary.uploader.upload_stream = (uploadOptions, callback) => {
      options = uploadOptions;
      const chunks = [];
      return new Writable({
        write(chunk, encoding, done) { chunks.push(chunk); done(); },
        final(done) {
          uploaded = Buffer.concat(chunks);
          callback(null, {
            public_id: 'proyecto-dsi/test', secure_url: 'https://res.cloudinary.com/test/image/upload/test.webp',
            format: 'webp', width: 1, height: 1, bytes: 12,
          });
          done();
        },
      });
    };

    const form = new FormData();
    form.append('imagen', new Blob([Buffer.from('image-bytes')], { type: 'image/png' }), 'photo.png');
    const response = await fetch(base, { method: 'POST', headers, body: form });
    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.data.format, 'webp');
    assert.match(body.data.url, /^https:\/\//);
    assert.equal(options.format, 'webp');
    assert.deepEqual(options.transformation, [{ quality: 'auto' }]);
    assert.deepEqual(uploaded, Buffer.from('image-bytes'));
  } finally {
    cloudinary.uploader.upload_stream = originalUploadStream;
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await new Promise((resolve) => server.close(resolve));
  }
});
