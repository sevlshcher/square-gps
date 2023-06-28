export function getUniqId () {
  return Math.random().toString().slice(2, 15)
}

export function shortenCoords (coords) {
  return Object.fromEntries(Object.entries(coords).map(([key, value]) => {
    return [key, value.toFixed(5)]
  }))
}
