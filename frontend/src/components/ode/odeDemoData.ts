// Demo ODE: dy/dx = y  (exact: y = e^x)
export const ODE_FN  = (_x: number, y: number) => y
export const EXACT   = (x: number) => Math.exp(x)
export const X0 = 0, Y0 = 1, X_END = 2
export const DEMO_H  = 0.4

export interface EulerFrame {
  stepIdx: number
  xs: number[]
  ys: number[]
  x_cur: number
  y_cur: number
  slope: number
  desc: string
}

export interface RK4Frame {
  stepIdx: number
  xs: number[]
  ys: number[]
  x_cur: number
  y_cur: number
  k1: number; k2: number; k3: number; k4: number
  desc: string
}

export function buildEulerFrames(): EulerFrame[] {
  const frames: EulerFrame[] = []
  const xs: number[] = [X0], ys: number[] = [Y0]
  frames.push({
    stepIdx: 0,
    xs: [X0], ys: [Y0],
    x_cur: X0, y_cur: Y0,
    slope: ODE_FN(X0, Y0),
    desc: `Step 0: Start at (${X0}, ${Y0}). Slope = f(0, 1) = 1`,
  })
  let x = X0, y = Y0
  let step = 0
  while (x < X_END - 1e-12) {
    const h = Math.min(DEMO_H, X_END - x)
    const slope = ODE_FN(x, y)
    x += h; y += h * slope; step++
    xs.push(x); ys.push(y)
    const exact = EXACT(x)
    const err = Math.abs(y - exact)
    frames.push({
      stepIdx: step,
      xs: [...xs], ys: [...ys],
      x_cur: x, y_cur: y,
      slope: ODE_FN(x, y),
      desc: `Step ${step}: y${step} = ${ys[step-1].toFixed(5)} + ${h}×${slope.toFixed(5)} = ${y.toFixed(5)} | exact=${exact.toFixed(5)} | err=${err.toExponential(3)}`,
    })
  }
  return frames
}

export function buildRK4Frames(): RK4Frame[] {
  const frames: RK4Frame[] = []
  const xs: number[] = [X0], ys: number[] = [Y0]
  const k1_0 = ODE_FN(X0, Y0)
  frames.push({
    stepIdx: 0,
    xs: [X0], ys: [Y0],
    x_cur: X0, y_cur: Y0,
    k1: k1_0, k2: 0, k3: 0, k4: 0,
    desc: `Step 0: Start at (${X0}, ${Y0}). k₁ = f(0, 1) = ${k1_0.toFixed(4)}`,
  })
  let x = X0, y = Y0, step = 0
  while (x < X_END - 1e-12) {
    const h = Math.min(DEMO_H, X_END - x)
    const k1 = ODE_FN(x, y)
    const k2 = ODE_FN(x + h / 2, y + h / 2 * k1)
    const k3 = ODE_FN(x + h / 2, y + h / 2 * k2)
    const k4 = ODE_FN(x + h, y + h * k3)
    const y_new = y + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    x += h; y = y_new; step++
    xs.push(x); ys.push(y)
    const exact = EXACT(x)
    frames.push({
      stepIdx: step,
      xs: [...xs], ys: [...ys],
      x_cur: x, y_cur: y,
      k1, k2, k3, k4,
      desc: `Step ${step}: k₁=${k1.toFixed(4)} k₂=${k2.toFixed(4)} k₃=${k3.toFixed(4)} k₄=${k4.toFixed(4)} | y=${y.toFixed(6)} | err=${Math.abs(y - exact).toExponential(3)}`,
    })
  }
  return frames
}
