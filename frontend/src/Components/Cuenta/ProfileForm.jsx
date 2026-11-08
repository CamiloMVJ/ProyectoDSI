import { useState } from 'react'
import { User, Mail, Phone, Save } from 'lucide-react'

const campos = [
    {
        name: 'nombre_completo',
        label: 'Nombre completo',
        type: 'text',
        autoComplete: 'name',
        Icon: User,
        required: true,
        minLength: 3,
        maxLength: 150,
    },
    {
        name: 'email',
        label: 'Correo electrónico',
        type: 'email',
        autoComplete: 'email',
        Icon: Mail,
        required: true,
        maxLength: 150,
    },
    {
        name: 'telefono',
        label: 'Teléfono',
        type: 'tel',
        autoComplete: 'tel',
        Icon: Phone,
        maxLength: 30,
    },
]

function valores(usuario) {
    return {
        nombre_completo: usuario.nombre_completo ?? '',
        email: usuario.email ?? '',
        telefono: usuario.telefono ?? '',
    }
}

export default function ProfileForm({
    usuario,
    guardando,
    onGuardar,
    onEditar,
}) {
    const [borrador, setBorrador] = useState(() => valores(usuario))
    const [error, setError] = useState('')

    const original = valores(usuario)

    const cambios = Object.fromEntries(
        Object.entries(borrador)
            .map(([key, value]) => [key, value.trim()])
            .filter(([key, value]) => value !== original[key])
    )

    const modificado = Object.keys(cambios).length > 0

    function cambiar(event) {
        const { name, value } = event.target

        setBorrador(actual => ({
            ...actual,
            [name]: value,
        }))

        setError('')
        onEditar?.()
    }

    async function enviar(event) {
        event.preventDefault()
        setError('')

        if (!modificado || guardando) return

        if (borrador.nombre_completo.trim().length < 3) {
            setError('El nombre debe contener al menos tres caracteres.')
            return
        }

        const actualizado = await onGuardar(cambios)

        if (actualizado) {
            setBorrador(valores(actualizado))
        }
    }

    function cancelar() {
        setBorrador(valores(usuario))
        setError('')
        onEditar?.()
    }

    return (
        <form onSubmit={enviar} aria-busy={guardando}>
            <fieldset
                disabled={guardando}
                className="m-0 min-w-0 border-0 p-0 disabled:opacity-70"
            >
                <legend className="sr-only">Datos personales</legend>

                <div className="grid gap-5 sm:grid-cols-2">
                    {campos.map(({ name, label, Icon, ...atributos }) => (
                        <div
                            key={name}
                            className={name === 'nombre_completo' ? 'sm:col-span-2' : ''}
                        >
                            <label
                                htmlFor={`perfil-${name}`}
                                className="mb-2 block text-sm font-semibold text-[#25382e]"
                            >
                                {label}

                                {!atributos.required && (
                                    <span className="font-normal text-[#526554]">
                                        {' '}(opcional)
                                    </span>
                                )}
                            </label>

                            <div
                                className="flex items-center gap-3 rounded-xl border
                  border-[#d8e1d5] bg-[#f8faf6] px-4
                  focus-within:border-[#c45111]
                  focus-within:ring-2 focus-within:ring-[#c45111]/15"
                            >
                                <Icon
                                    size={18}
                                    aria-hidden="true"
                                    className="shrink-0 text-[#526554]"
                                />

                                <input
                                    {...atributos}
                                    id={`perfil-${name}`}
                                    name={name}
                                    value={borrador[name]}
                                    onChange={cambiar}
                                    aria-describedby={
                                        name === 'nombre_completo' && error
                                            ? 'perfil-error'
                                            : undefined
                                    }
                                    className="min-h-12 w-full min-w-0 bg-transparent
                    text-sm text-[#25382e] outline-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {error && (
                    <p
                        id="perfil-error"
                        role="alert"
                        className="mt-4 text-sm text-[#9d3e0b]"
                    >
                        {error}
                    </p>
                )}

                <div
                    className="mt-8 flex flex-wrap items-center justify-end
            gap-3 border-t border-[#d8e1d5] pt-6"
                >
                    <button
                        type="button"
                        onClick={cancelar}
                        disabled={!modificado}
                        className="min-h-11 rounded-full border border-[#d8e1d5]
              px-5 text-sm font-semibold text-[#344e3b]
              hover:bg-[#f6f8f3] disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={!modificado}
                        className="inline-flex min-h-11 items-center gap-2
              rounded-full bg-[#c45111] px-6 text-sm font-semibold
              text-white hover:bg-[#9d3e0b]
              disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={17} aria-hidden="true" />

                        {guardando ? 'Guardando…' : 'Guardar cambios'}
                    </button>
                </div>
            </fieldset>
        </form>
    )
}