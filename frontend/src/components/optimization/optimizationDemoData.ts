const PHI = (1 + Math.sqrt(5)) / 2

// Demo function: f(x) = (x−2)² on [0, 4]
export const DEMO_FN   = (x: number) => (x - 2) ** 2
export const DEMO_DFN  = (x: number) => 2 * (x - 2)
export const DEMO_A    = 0
export const DEMO_B    = 4
export const DEMO_X0   = 3.5
export const DEMO_ALPHA = 0.3

export interface GSFrame {
  a: number; b: number; x1: number; x2: number; step: number; desc: string
}

export function buildGSFrames(): GSFrame[] {
  const frames: GSFrame[] = []
  let a = DEMO_A, b = DEMO_B
  let x1 = b - (b - a) / PHI
  let x2 = a + (b - a) / PHI
  frames.push({ a, b, x1, x2, step: 0, desc: `Initial: [${a.toFixed(3)}, ${b.toFixed(3)}]. Probes: x₁=${x1.toFixed(3)}, x₂=${x2.toFixed(3)}` })
  for (let k = 0; k < 20; k++) {
    const f1 = DEMO_FN(x1), f2 = DEMO_FN(x2)
    if (f1 > f2) {
      a = x1; x1 = x2; x2 = a + (b - a) / PHI
      frames.push({ a, b, x1, x2, step: k+1, desc: `f(x₁)>f(x₂): keep [x₁,b]. New x₂=${x2.toFixed(5)}, width=${(b-a).toFixed(5)}` })
    } else {
      b = x2; x2 = x1; x1 = b - (b - a) / PHI
      frames.push({ a, b, x1, x2, step: k+1, desc: `f(x₁)<f(x₂): keep [a,x₂]. New x₁=${x1.toFixed(5)}, width=${(b-a).toFixed(5)}` })
    }
    if (b - a < 1e-6) break
  }
  return frames
}

export interface GDFrame {
  x: number; fx: number; grad: number; step: number; desc: string
}

export function buildGDFrames(alpha: number = DEMO_ALPHA): GDFrame[] {
  const frames: GDFrame[] = []
  let x = DEMO_X0
  frames.push({ x, fx: DEMO_FN(x), grad: DEMO_DFN(x), step: 0, desc: `x₀ = ${x.toFixed(5)}, f(x₀) = ${DEMO_FN(x).toFixed(6)}` })
  for (let k = 0; k < 30; k++) {
    const grad = DEMO_DFN(x)
    x = x - alpha * grad
    const fx = DEMO_FN(x)
    frames.push({ x, fx, grad, step: k + 1, desc: `x${k+1} = ${x.toFixed(6)}, f=${fx.toFixed(8)}, ‖grad‖=${Math.abs(grad).toExponential(3)}` })
    if (Math.abs(grad) < 1e-9) break
  }
  return frames
}
