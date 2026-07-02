// Demo system: [5,-1;-1,5]x=[4,4] — solution x=[1,1]
export const A = [[5, -1], [-1, 5]]
export const B = [4, 4]
export const EXACT = [1, 1]

export interface IterFrame {
  x: number[]
  error: number
  iteration: number
}

export function buildIterFrames(method: 'gauss_seidel' | 'jacobi'): IterFrame[] {
  const frames: IterFrame[] = [{ x: [0, 0], error: Math.hypot(...EXACT), iteration: 0 }]
  let x = [0, 0]
  for (let k = 0; k < 20; k++) {
    let xNew: number[]
    if (method === 'jacobi') {
      xNew = [
        (B[0] - A[0][1] * x[1]) / A[0][0],
        (B[1] - A[1][0] * x[0]) / A[1][1],
      ]
    } else {
      const xgs = [...x]
      xgs[0] = (B[0] - A[0][1] * xgs[1]) / A[0][0]
      xgs[1] = (B[1] - A[1][0] * xgs[0]) / A[1][1]
      xNew = xgs
    }
    const err = Math.hypot(xNew[0] - EXACT[0], xNew[1] - EXACT[1])
    frames.push({ x: xNew, error: err, iteration: k + 1 })
    if (err < 1e-10) break
    x = xNew
  }
  return frames
}
