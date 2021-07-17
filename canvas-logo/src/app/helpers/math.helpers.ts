export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function positiveMod(n, m) {
  return ((n % m) + m) % m;
}
