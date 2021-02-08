import { Point } from "../types/geometry/point";
import { Vector } from "../types/geometry/vector";

export function subtractPoints(a: Point, b: Point): Vector{
  return {
    dw: a.w - b.w,
    dh: a.h - b.h
  }
}

export function subtractVectorFromPoint(point: Point, vector: Vector): Point{
  return {
    w: point.w - vector.dw,
    h: point.h - vector.dh
  }
}

export function multiplyVector(vector: Vector, factor: number): Vector{
  return {
    dw: vector.dw * factor,
    dh: vector.dh * factor
  }
}
