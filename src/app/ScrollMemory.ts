
let savedScrollY = 0

export function saveScroll() {
  savedScrollY = window.scrollY
}

export function restoreScroll() {
  requestAnimationFrame(() => {
    window.scrollTo({
      top: savedScrollY,
      behavior: 'auto'
    })
  })
}
