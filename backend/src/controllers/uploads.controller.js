import * as uploads from "../storage/uploads.service.js"
import { AppError } from "../errors/app-error.js"

const safeError = (error) =>
  error instanceof AppError
    ? error
    : new AppError("No se pudo completar la operación de archivos", 502)

export async function authorize(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: await uploads.authorizeUpload(req.user, req.body),
    })
  } catch (error) {
    next(safeError(error))
  }
}

export async function confirm(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: await uploads.confirmUpload(req.user, req.body.receipt),
    })
  } catch (error) {
    next(safeError(error))
  }
}

export async function signedDownload(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: await uploads.signedDownload(req.user, req.body.fileId),
    })
  } catch (error) {
    next(safeError(error))
  }
}

export async function remove(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: await uploads.deleteUpload(req.user, req.body.fileId),
    })
  } catch (error) {
    next(safeError(error))
  }
}
