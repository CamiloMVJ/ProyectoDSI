import { useEffect, useRef, useState } from 'react'
import { ImagePlus, LoaderCircle, Trash2, Images } from 'lucide-react'
import { getLocalImages, deleteLocalImage } from '../services/establishments.api.js'
import { uploadStorageFile } from '../services/uploads.api.js'

const MAX_BATCH = 10
const statusText = {
  preparing: 'Preparando imagen',
  authorizing: 'Autorizando',
  uploading: 'Subiendo',
  confirming: 'Guardando en el local',
  complete: 'Lista',
}

export default function LocalImagesGallery({ idLocal, token, readOnly = false }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tasks, setTasks] = useState([])
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(null)
  const busy = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    getLocalImages(token, idLocal, controller.signal)
      .then(data => { if (!controller.signal.aborted) setImages(data) })
      .catch(() => { if (!controller.signal.aborted) setError('No se pudieron cargar las imágenes. Actualiza para reintentar.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [idLocal, token])

  async function selectFiles(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length || busy.current) return
    if (files.length > MAX_BATCH) {
      setError(`Selecciona hasta ${MAX_BATCH} imágenes por tanda.`)
      return
    }
    setError('')
    busy.current = true
    setUploading(true)
    const queue = files.map(file => ({ id: crypto.randomUUID(), file }))
    setTasks(queue.map(({ id, file }) => ({ id, name: file.name, status: 'En espera' })))
    let next = 0
    let rateLimited = false
    const update = (id, change) => setTasks(current => current.map(task => task.id === id ? { ...task, ...change } : task))
    const worker = async () => {
      while (!rateLimited && next < queue.length) {
        const { id, file } = queue[next++]
        try {
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
            throw new Error('Usa una imagen JPG, PNG o WebP.')
          const result = await uploadStorageFile(file, token, {
            context: { type: 'local-image', localId: Number(idLocal) },
            onStatus: status => update(id, { status: statusText[status] || status }),
          })
          setImages(current => [result.image, ...current])
        } catch (uploadError) {
          update(id, { status: 'Error', error: uploadError.message || 'No se pudo subir esta imagen.' })
          if (uploadError.status === 429) {
            rateLimited = true
            setError('Se alcanzó el límite de subidas. Vuelve a intentarlo más tarde con las imágenes pendientes.')
          }
        }
      }
    }
    try {
      await Promise.all(Array.from({ length: Math.min(3, queue.length) }, worker))
      if (rateLimited) {
        const pendingIds = new Set(queue.slice(next).map(({ id }) => id))
        setTasks(current => current.map(task => pendingIds.has(task.id)
          ? { ...task, status: 'Pendiente', error: 'No se intentó subir; vuelve a seleccionar esta imagen más tarde.' }
          : task))
      }
    } finally {
      busy.current = false
      setUploading(false)
    }
  }

  async function removeImage(image) {
    if (removing !== null) return
    setRemoving(image.id_imagen)
    setError('')
    try {
      await deleteLocalImage(token, idLocal, image.id_imagen)
      setImages(current => current.filter(item => item.id_imagen !== image.id_imagen))
    } catch (removeError) {
      setError(removeError.message || 'No se pudo eliminar la imagen.')
    } finally {
      setRemoving(null)
    }
  }

  return <section className="ge-form-section ge-images-section" aria-labelledby="ge-images-heading">
    <div className="ge-images-header">
      <div className="ge-section-heading"><span className="ge-section-icon"><Images size={20} aria-hidden="true" /></span><div><h3 id="ge-images-heading">Imágenes del establecimiento</h3><p>Muestra el espacio, los servicios y lo que hace especial a tu local.</p></div></div>
      {!readOnly && <label className="ge-button ge-primary ge-images-upload"><ImagePlus size={17} aria-hidden="true" /> {uploading ? 'Subiendo imágenes…' : 'Añadir imágenes'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectFiles} disabled={uploading} aria-label="Seleccionar imágenes del establecimiento" /></label>}
    </div>
    {!readOnly && <p className="ge-images-hint">JPG, PNG o WebP. Hasta {MAX_BATCH} imágenes por tanda; se subirán hasta 3 a la vez. Las fotos se guardan al subirlas, sin esperar a «Guardar cambios».</p>}
    {error && <p className="ge-error" role="alert">{error}</p>}
    {loading ? <p className="ge-empty-section">Cargando imágenes…</p> : images.length ? <div className="ge-images-grid">{images.map(image => <figure className="ge-image-card" key={image.id_imagen}><img src={image.url_imagen} alt={image.descripcion || `Imagen del establecimiento ${image.id_imagen}`} loading="lazy" /><figcaption>{image.descripcion || 'Imagen del local'}</figcaption>{!readOnly && <button type="button" className="ge-image-remove" onClick={() => removeImage(image)} disabled={removing !== null} aria-label={`Eliminar imagen ${image.id_imagen}`}>{removing === image.id_imagen ? <LoaderCircle className="ge-spinner" size={16} /> : <Trash2 size={16} />}</button>}</figure>)}</div> : <p className="ge-empty-section">Este local todavía no tiene imágenes. Añade algunas para que los visitantes lo conozcan mejor.</p>}
    {tasks.length > 0 && <div className="ge-upload-results" role="status" aria-live="polite"><strong>Resultado de la selección</strong><ul>{tasks.map(task => <li key={task.id}><span className="ge-upload-name">{task.name}</span><span className={task.error ? 'ge-upload-error' : ''}>{task.error || task.status}</span></li>)}</ul></div>}
  </section>
}
