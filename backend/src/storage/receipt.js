import { createHmac, timingSafeEqual } from "node:crypto"
import { AppError } from "../errors/app-error.js"

const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url")
const mac = (payload, secret) =>
  createHmac("sha256", secret).update(payload).digest("base64url")

export function signReceipt(data, secret) {
  const payload = encode(data)
  return `${payload}.${mac(payload, secret)}`
}

export function verifyReceipt(token, secret, now = Date.now()) {
  if (typeof token !== "string" || token.length > 4096)
    throw new AppError("Comprobante inválido", 400)
  const [payload, signature, extra] = token.split(".")
  if (!payload || !signature || extra)
    throw new AppError("Comprobante inválido", 400)
  const expected = Buffer.from(mac(payload, secret))
  const provided = Buffer.from(signature)
  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    throw new AppError("Comprobante inválido", 400)
  }
  let data
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
  } catch {
    /* handled below */
  }
  if (
    !data ||
    !["pending", "final"].includes(data.stage) ||
    (data.stage === "pending" &&
      (!Number.isSafeInteger(data.exp) ||
        data.exp <= now ||
        data.exp > now + 8 * 60 * 60 * 1000)) ||
    (data.stage === "final" && data.exp !== undefined)
  ) {
    throw new AppError("Comprobante vencido o inválido", 400)
  }
  return data
}
