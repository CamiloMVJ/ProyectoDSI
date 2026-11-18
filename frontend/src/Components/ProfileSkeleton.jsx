function Block({ className = '' }) {
  return <div className={`perfil-skeleton-block ${className}`} />
}

export default function ProfileSkeleton() {
  return <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-10 sm:px-10" role="status" aria-label="Cargando información del lugar">
    <span className="sr-only">Cargando información del lugar…</span>
    <div aria-hidden="true">
      <header className="mb-8 space-y-4">
        <Block className="h-6 w-32 rounded-full" />
        <Block className="h-11 w-3/4 max-w-xl rounded-xl sm:h-14" />
      </header>
      <section className="mb-12">
        <Block className="aspect-[16/10] max-h-[520px] w-full rounded-2xl sm:aspect-[16/8]" />
        <Block className="mt-4 h-4 w-48 rounded-full" />
        <div className="mt-4 flex gap-3"><Block className="h-20 w-28 rounded-xl sm:h-24 sm:w-36" /><Block className="h-20 w-28 rounded-xl sm:h-24 sm:w-36" /><Block className="h-20 w-28 rounded-xl sm:h-24 sm:w-36" /></div>
      </section>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section className="space-y-4"><Block className="h-8 w-52 rounded-lg" /><Block className="h-4 w-full rounded-full" /><Block className="h-4 w-11/12 rounded-full" /><Block className="h-4 w-4/5 rounded-full" /></section>
          <section className="space-y-4"><Block className="h-8 w-44 rounded-lg" /><div className="grid gap-4 sm:grid-cols-2"><Block className="h-14 rounded-xl" /><Block className="h-14 rounded-xl" /></div></section>
          <section className="space-y-4"><Block className="h-8 w-28 rounded-lg" /><Block className="h-44 rounded-2xl" /></section>
        </div>
        <aside className="space-y-6"><Block className="h-36 rounded-2xl" /><Block className="h-56 rounded-2xl" /><Block className="h-40 rounded-2xl" /></aside>
      </div>
    </div>
  </main>
}
