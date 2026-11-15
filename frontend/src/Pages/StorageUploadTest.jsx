import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getPrivateDownload, uploadStorageFile } from '../services/uploads.api.js'

const statusText = {
  preparing: 'Preparando archivo…',
  authorizing: 'Autorizando subida…',
  uploading: 'Subiendo a Supabase…',
  confirming: 'Validando archivo…',
}

export default function StorageUploadTest() {
  const { sesion } = useAuth()
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [busy, setBusy] = useState(false)

  if (!sesion) return <Navigate to="/ingresar" replace />

  async function handleUpload(event) {
    event.preventDefault()
    if (!file || busy) return
    setBusy(true)
    setError('')
    setResult(null)
    setDownloadUrl('')
    setStatus('preparing')
    try {
      const uploaded = await uploadStorageFile(file, sesion.token, { onStatus: setStatus })
      setResult(uploaded)
    } catch (uploadError) {
      setError(uploadError.message || 'No se pudo subir el archivo.')
    } finally {
      setStatus('')
      setBusy(false)
    }
  }

  async function handleDownload() {
    setError('')
    try {
      const { url } = await getPrivateDownload(result.fileId, sesion.token)
      setDownloadUrl(url)
    } catch (downloadError) {
      setError(downloadError.message || 'No se pudo descargar el archivo.')
    }
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-12 text-[#25382e]">
      <Link to="/account" className="text-sm underline">← Volver a mi cuenta</Link>
      <h1 className="mt-8 text-2xl font-bold">Probar subida de archivos</h1>
      <p className="mt-2 text-sm text-[#526554]">
        Imágenes JPEG, PNG o WebP y documentos PDF. La imagen se convierte a WebP antes de subirla.
      </p>

      <form onSubmit={handleUpload} className="mt-6 space-y-4 rounded-xl border border-[#d8e1d5] bg-white p-5">
        <label htmlFor="storage-test-file" className="block text-sm font-semibold">Seleccionar archivo</label>
        <input
          id="storage-test-file"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          disabled={busy}
          onChange={(event) => {
            setFile(event.target.files?.[0] || null)
            setResult(null)
            setDownloadUrl('')
            setError('')
          }}
          className="block w-full text-sm"
        />
        <button
          type="submit"
          disabled={!file || busy}
          className="rounded-lg bg-[#344e3b] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Subiendo…' : 'Subir archivo'}
        </button>
      </form>

      {status && <p role="status" className="mt-4 text-sm">{statusText[status] || status}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {result && (
        <section className="mt-5 rounded-xl border border-green-300 bg-green-50 p-5" aria-label="Resultado de la subida">
          <p className="font-semibold">Archivo subido y validado.</p>
          {result.kind === 'image' && result.publicUrl && (
            <>
              <img src={result.publicUrl} alt="Imagen subida" className="mt-3 max-h-72 max-w-full rounded-lg object-contain" />
              <a href={result.publicUrl} target="_blank" rel="noreferrer" className="mt-3 block break-all text-sm underline">
                Abrir imagen publicada
              </a>
            </>
          )}
          {result.kind === 'document' && (
            <>
              <button type="button" onClick={handleDownload} className="mt-3 text-sm underline">
                Generar enlace de descarga privada
              </button>
              {downloadUrl && (
                <a href={downloadUrl} target="_blank" rel="noreferrer" className="mt-2 block text-sm underline">
                  Abrir PDF (enlace válido por 60 segundos)
                </a>
              )}
            </>
          )}
        </section>
      )}
    </main>
  )
}
