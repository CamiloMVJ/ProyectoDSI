import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Search, UtensilsCrossed } from 'lucide-react'

const PAGE_SIZE = 4
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
const money = (amount, currency) => new Intl.NumberFormat('es-NI', {
  style: 'currency', currency: currency || 'NIO',
}).format(Number(amount || 0))

function MenuPanel({ menu, categories, single }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const items = menu.items || []
  const availableCategories = [...new Set(items.map(item => String(item.id_categoria_menu ?? '')))]
    .filter(id => categories.has(id))
  const filtered = items.filter(item => (!category || String(item.id_categoria_menu) === category) &&
    normalize([item.nombre_platillo, item.descripcion,
    categories.get(String(item.id_categoria_menu))].join(' ')).includes(normalize(query.trim())))
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const heading = <>
      <span className="ge-read-menu-icon"><UtensilsCrossed size={19} aria-hidden="true" /></span>
      <span className="ge-read-menu-name"><strong>{menu.titulo_menu || 'Menú sin título'}</strong><small>{items.length} {items.length === 1 ? 'ítem' : 'ítems'}</small></span>
      {!menu.esta_activo && <span className="ge-read-menu-hidden">Oculto</span>}
      {!single && <ChevronDown className="ge-read-menu-chevron" size={20} aria-hidden="true" />}
    </>
  const body = <div className="ge-read-menu-body">
      {menu.descripcion && <p className="ge-read-menu-description">{menu.descripcion}</p>}
      {items.length > PAGE_SIZE && <label className="ge-read-menu-search"><Search size={17} aria-hidden="true" /><input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Buscar platillo o categoría" aria-label={`Buscar en ${menu.titulo_menu || 'menú'}`} /></label>}
      {availableCategories.length > 1 && <div className="ge-read-menu-categories" role="group" aria-label={`Filtrar categorías de ${menu.titulo_menu || 'menú'}`}><button type="button" aria-pressed={!category} onClick={() => { setCategory(''); setPage(1) }}>Todos</button>{availableCategories.map(id => <button type="button" key={id} aria-pressed={category === id} onClick={() => { setCategory(id); setPage(1) }}>{categories.get(id)}</button>)}</div>}
      {!filtered.length ? <p className="ge-empty-section">{items.length ? 'No hay ítems que coincidan con la búsqueda.' : 'Este menú no tiene platillos todavía.'}</p> : <ul className="ge-read-items">{visible.map((item, index) => <li className="ge-read-item" key={item.id_item || `${currentPage}-${index}`}>
        {item.url_foto && <img src={item.url_foto} alt="" loading="lazy" />}
        <div className="ge-read-item-content"><div className="ge-read-item-title"><strong>{item.nombre_platillo}</strong><b>{money(item.precio, item.moneda)}</b></div>
          {item.descripcion && <p>{item.descripcion}</p>}
          <div className="ge-read-item-tags">{categories.get(String(item.id_categoria_menu)) && <span>{categories.get(String(item.id_categoria_menu))}</span>}{item.es_vegetariano && <span>Vegetariano</span>}{!item.esta_disponible && <span className="ge-read-item-unavailable">No disponible</span>}</div>
        </div>
      </li>)}</ul>}
      {pages > 1 && <nav className="ge-read-menu-pages" aria-label={`Páginas de ${menu.titulo_menu || 'menú'}`}><button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior"><ChevronLeft size={18} /></button><span>{currentPage} de {pages} · {filtered.length} resultados</span><button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pages} aria-label="Página siguiente"><ChevronRight size={18} /></button></nav>}
    </div>
  return single
    ? <div className="ge-read-menu ge-read-menu-single"><div className="ge-read-menu-summary">{heading}</div>{body}</div>
    : <details className="ge-read-menu"><summary className="ge-read-menu-summary">{heading}</summary>{body}</details>
}

export default function ReadOnlyMenus({ menus, categories }) {
  const categoryNames = new Map(categories.map(category => [String(category.id_categoria_menu), category.nombre]))
  return <div className="ge-read-menus">{menus.map((menu, index) => <MenuPanel key={menu.id_menu || `menu-${index}`} menu={menu} categories={categoryNames} single={menus.length === 1} />)}</div>
}
