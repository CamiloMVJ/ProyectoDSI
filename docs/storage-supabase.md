# Infraestructura de archivos con Supabase Storage

## Estado y alcance

Esta infraestructura es independiente de los módulos de negocio actuales. La ruta de prueba `/probar-subidas` permite verificar imágenes y PDF con una sesión iniciada. PostgreSQL en Render y el esquema de Supabase no se modifican. La funcionalidad está deshabilitada por defecto (`SUPABASE_STORAGE_ENABLED=false`) y no se han creado ni cambiado buckets desde este código.

El backend sigue usando el JWT propio de SINATUR. `@supabase/supabase-js` se usa solo para Storage; no se usa Supabase Auth. La clave secreta permanece en el backend. El navegador usa únicamente la clave publicable y un token temporal de subida emitido por el backend.

## Flujo

1. React verifica el archivo. Una imagen JPEG, PNG o WebP se decodifica y convierte a WebP de hasta 1600 píxeles por lado y 2 MB. Un PDF conserva su formato y debe medir como máximo 10 MB.
2. `POST /api/uploads/authorize` valida el JWT, el rol configurado, el contexto `sandbox`, el tipo MIME y el tamaño. El backend elige el bucket y la ruta `pending/sandbox/{id_usuario}/{uuid}.{ext}` y entrega un token firmado de subida, con un comprobante HMAC ligado al usuario.
3. React sube el archivo directamente a Supabase con `uploadToSignedUrl`. El contenido no pasa por Express.
4. `POST /api/uploads/confirm` valida el comprobante, consulta metadatos, lee el archivo con límite de bytes y analiza su contenido real. Un WebP validado se publica desde un bucket privado de staging hacia el bucket público. Un PDF validado se mueve de `pending/` a `final/` dentro del bucket privado.
5. La confirmación devuelve un `fileId` firmado para operaciones posteriores. Para imágenes también devuelve `publicUrl`. `POST /api/uploads/signed-download` entrega una URL privada de 60 segundos. `DELETE /api/uploads` elimina un archivo final perteneciente al usuario del JWT.

Los comprobantes de subida vencen en dos horas. Las rutas finales usan UUID y no permiten sobrescritura. La validación en el servidor usa `sharp` para decodificar WebP y `pdf-lib` para analizar PDF, además de comprobar tamaño y metadatos. Esto verifica que el archivo sea procesable; no desinfecta contenido activo de un PDF. Los PDF deben ofrecerse como descarga y no incrustarse automáticamente en páginas confiables.

## Configuración manual

Crear o revisar en Supabase Dashboard los siguientes buckets, sin usar SQL:

| Variable | Acceso | MIME permitido | Límite |
| --- | --- | --- | --- |
| `SUPABASE_BUCKET_IMAGES` | Público (solo lectura pública) | `image/webp` | 2 MB |
| `SUPABASE_BUCKET_DOCUMENTS` | Privado | `application/pdf` | 10 MB |
| `SUPABASE_BUCKET_STAGING` | Privado | `image/webp` | 2 MB |

El tercer bucket es necesario para impedir que una imagen sea pública antes de validarse. Si no se configura, la autorización de imágenes devuelve 503; los documentos pueden funcionar con su bucket privado. El backend comprueba al arrancar visibilidad, MIME y límite de los buckets configurados, sin modificarlos.

Inspección de solo lectura del proyecto `ProyectoDSI` en `us-east-1` (15 de noviembre de 2026): `imagenes-publicas` y `documentos-privados` ya cumplen su visibilidad, MIME y límite. Existe además un bucket privado `Images` sin límites ni MIME configurados; podría servir de staging solo después de configurarlo manualmente como WebP de 2 MB y establecer `SUPABASE_BUCKET_STAGING=Images`. No se realizaron cambios en Supabase. No había políticas personalizadas de `storage.objects` al momento de la inspección.

Revisar manualmente las políticas de Storage: la clave publicable no debe tener escritura directa sobre esos buckets. El backend usa la clave secreta para emitir autorizaciones y administrar archivos. El bucket público solo debe permitir lectura pública. No crear políticas abiertas de INSERT, UPDATE o DELETE para clientes del navegador. Verificar también que el proyecto permita las solicitudes del origen del frontend al API de Storage y que Render permita el origen del frontend al API Express mediante `FRONTEND_URL1` o `FRONTEND_URL2`. La configuración de CORS puede requerir ajustes del proyecto o del proxy usado en producción.

Copiar [backend/.env.example](../backend/.env.example) y [frontend/.env.example](../frontend/.env.example) a variables de entorno locales y de Render/Vite, respectivamente. Generar `SUPABASE_RECEIPT_SECRET` con al menos 32 caracteres aleatorios. Mantener `SUPABASE_SECRET_KEY` exclusivamente en Render. Nunca ponerla en variables `VITE_`.

`SUPABASE_STORAGE_TEST_ROLE` debe asignarse explícitamente a uno de los roles actuales (`Usuario`, `Propietario`, `Administrador`) para probar el espacio `sandbox`. Vacía, todas las operaciones quedan denegadas. Esta política no concede acceso a negocios, lugares ni perfiles; esos módulos necesitarán reglas propias de propiedad antes de integrarse. La limitación de autorizaciones es de 20 por usuario y hora **por proceso**; para múltiples instancias en Render hace falta un limitador compartido antes de usarlo en producción.

Para usar la interfaz de prueba, configurar `SUPABASE_STORAGE_ENABLED=true`, `SUPABASE_BUCKET_STAGING` con el nombre exacto del bucket privado WebP, un `SUPABASE_RECEIPT_SECRET` aleatorio de al menos 32 caracteres y `SUPABASE_STORAGE_TEST_ROLE` con el rol de la cuenta de prueba. Iniciar sesión y abrir `/probar-subidas`. La imagen muestra su URL pública tras confirmarse; el PDF ofrece una descarga firmada. La ruta no aparece en la navegación principal.

## Limpieza

Definir `SUPABASE_STORAGE_EPOCH` como fecha ISO UTC del inicio de esta infraestructura, anterior al primer archivo creado. `npm run storage:cleanup` recorre únicamente `pending/sandbox/`, con paginación de 100 elementos, y considera candidatos solo archivos UUID creados después de esa fecha y con al menos cuatro horas de antigüedad. Nunca consulta `final/`. Por defecto informa candidatos sin eliminar. Solo `SUPABASE_CLEANUP_APPLY=true` activa la eliminación.

En Render puede configurarse un Cron Job con el mismo código y variables del backend, usando `npm run storage:cleanup` como comando. Ejecutar primero varias veces en modo simulación y revisar los conteos. No se hizo ninguna eliminación real.

## Ejemplo futuro en React

```jsx
import { uploadStorageFile, getPrivateDownload, deleteStorageFile } from './services/uploads.api.js'

// `token` viene de la sesión JWT existente. No integrar todavía este ejemplo
// con un módulo sin definir primero sus reglas de propiedad.
const result = await uploadStorageFile(file, token, { onStatus: setEstado })
// result.fileId identifica el archivo validado; result.publicUrl existe para WebP.
const { url } = await getPrivateDownload(result.fileId, token) // solo PDF propio
await deleteStorageFile(result.fileId, token)
```

Estados de subida: `preparing`, `authorizing`, `uploading`, `confirming`, `complete`. Un error interrumpe el flujo y deja un archivo pendiente para la limpieza si la subida ya ocurrió.

## Pruebas y limitaciones

- `cd backend && npm test`: política, comprobantes, JWT, buckets, límites, validación WebP/PDF, acceso cruzado y limpieza con mocks.
- `cd frontend && npm test`: conversión y fallos de autorización, subida y confirmación con mocks.
- `cd frontend && npm run lint && npm run build`: validación estática y compilación.
- Faltan pruebas con buckets y credenciales reales, verificación del CORS de producción y una prueba visual de conversión y transparencia en los navegadores objetivo. No habilitar el servicio antes de comprobarlos.
- La limitación de tasa en memoria no coordina instancias ni sobrevive reinicios. La limpieza requiere un Cron Job manual. No hay registro en PostgreSQL de archivos finales; los módulos futuros deberán guardar el `fileId` en sus mecanismos existentes o definir una solución compatible con sus permisos.
- El comprobante de archivo final no vence por sí solo. Siempre se exige JWT y el rol explícito; proteger el `fileId` como referencia sensible. Las URLs privadas sí vencen en 60 segundos.
- `npm audit` detectó dependencias preexistentes con avisos: en backend, `joi` y `body-parser` (altos) y `qs` (moderado); en frontend, dependencias de desarrollo de ESLint y `zod` (1 alto y 3 moderados). No se actualizaron aquí porque este cambio no debe alterar otros módulos; revisar y actualizar antes de activar Storage en producción.

## Archivos de esta infraestructura

Backend: `src/storage/`, `src/controllers/uploads.controller.js`, `src/dtos/upload.dto.js`, `src/routes/uploads.routes.js`, `test/storage.test.js`, `.env.example`; se añadieron la ruta en `src/routes/index.js`, validación estricta optativa en `src/middlewares/validate.middleware.js`, la comprobación de arranque en `src/server.js`, el script de limpieza en `package.json` y dependencias fijadas en `package-lock.json`.

Frontend: `src/services/storageClient.js`, `src/services/prepareWebp.js`, `src/services/uploads.api.js`, `test/uploads.test.js`, `.env.example`; se añadió el script de pruebas en `package.json` y la dependencia fijada en `package-lock.json`.

Documentación oficial consultada: [URLs firmadas de subida](https://supabase.com/docs/reference/javascript/file-buckets-createsigneduploadurl), [subida con token](https://supabase.com/docs/reference/javascript/file-buckets-uploadtosignedurl), [acceso a buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals), [metadatos de archivo](https://supabase.com/docs/reference/javascript/file-buckets-info), [URLs firmadas de lectura](https://supabase.com/docs/reference/javascript/file-buckets-createsignedurl) y [límites de Storage](https://supabase.com/docs/guides/storage/uploads/file-limits).
