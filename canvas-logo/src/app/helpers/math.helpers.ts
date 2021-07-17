export function degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function positiveMod(n: number, m: number): number {
    return ((n % m) + m) % m;
}
