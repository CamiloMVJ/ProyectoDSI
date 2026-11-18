const animatedPages = new Set(['/', '/buscar', '/calendario', '/favoritos', '/account'])

export function shouldTransitionPage(from, to) {
  return from !== to && animatedPages.has(from) && animatedPages.has(to)
}

export function isAnimatedPage(pathname) {
  return animatedPages.has(pathname)
}
