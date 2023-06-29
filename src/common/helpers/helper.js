export function getUniqId () {
  return Math.random().toString().slice(5, 15)
}

export function shortenCoords (coords) {
  return Object.fromEntries(Object.entries(coords).map(([key, value]) => {
    return [key, value.toFixed(5)]
  }))
}

export function getColorById (value) {
  const blue = Math.floor(value % 256);
  const green = Math.floor(value / 256 % 256);
  const red = Math.floor(value / 256 / 256 % 256);

  return `rgba(${red}, ${green}, ${blue}, 0.7`
}
