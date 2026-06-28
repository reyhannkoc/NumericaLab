import type { LessonConfig } from '@/types/lesson.types'

export const SECANT_CONFIG: LessonConfig = {
  header: {
    moduleId: 'root-finding',
    moduleColor: '#10b981',
    title: 'Secant Method',
    subtitle: 'Superlinear convergence without computing derivatives',
    difficulty: 'intermediate',
    estimatedMinutes: 60,
    objectives: [
      'Derive the secant update from the finite-difference approximation of the Newton step',
      'Explain superlinear convergence of order φ ≈ 1.618 (the golden ratio)',
      'Identify when secant outperforms Newton on a per-function-evaluation basis',
      'Handle failure modes: secant line nearly parallel to x-axis, poor starting pair',
      'Apply the method to problems where derivatives are expensive or unavailable',
      'Compare secant, bisection, and Newton on total function evaluation count',
    ],
    prerequisites: [
      { title: 'Bisection Method',        path: '/root-finding/bisection',        required: false },
      { title: 'Newton-Raphson Method',   path: '/root-finding/newton-raphson',   required: false },
    ],
    tags: ['open method', 'superlinear', 'no derivative', 'secant line', 'golden ratio convergence'],
  },

  motivation: {
    problemStatement:
      'Newton-Raphson is fast but requires f′(x). ' +
      'What if differentiating f is analytically difficult, computationally expensive, ' +
      'or f is only available as a black box? ' +
      'The Secant Method approximates f′(xₙ) using a finite difference through two previous iterates — ' +
      'achieving convergence of order 1.618 (the golden ratio!) with only ONE function evaluation per iteration.',
    whyItMatters:
      'When f is an expensive simulation (CFD solver, circuit simulator, structural FEM), ' +
      'each function evaluation costs seconds to minutes. ' +
      'Newton-Raphson costs 2 evaluations per iteration (f and f′). ' +
      'Secant costs 1 evaluation per iteration — and converges nearly as fast. ' +
      'For expensive black-box functions, secant wins on wall-clock time.',
    historicalBackground:
      'The Secant Method predates Newton-Raphson. The "regula falsi" (method of false position) ' +
      'used in ancient Egypt and Babylon is a variant that maintains a bracket. ' +
      'The modern secant method as an open method (no bracketing guarantee) was formalized in the 19th century. ' +
      'Its order-1.618 convergence was proven by Brent in 1973.',
    engineeringMotivation:
      'In CFD pipeline design, computing f′ requires running a finite-difference sensitivity analysis — ' +
      'doubling the already-expensive simulation cost. The secant method uses two prior function values ' +
      'to approximate the slope, halving the number of costly simulations needed.',
    motivatingExample: {
      title: 'Solve x³ − x − 2 = 0, starting with x₀=1, x₁=2',
      description:
        'x₂ = x₁ − f(x₁)·(x₁−x₀)/(f(x₁)−f(x₀)) = 2 − 4·(1)/(4−(−2)) = 2 − 4/6 = 1.333. ' +
        'Then x₃ = 1.5254, x₄ = 1.5212, x₅ = 1.5213797. Converged in 5 iterations — same as Newton!',
      expression: 'x^3 - x - 2 = 0',
      result: 'Root ≈ 1.5213797 in 5 iterations using only 5 function evaluations (vs Newton\'s 10)',
    },
  },

  theory: {
    overview:
      'The Secant Method draws a straight line through the two most recent iterates ' +
      '(xₙ₋₁, f(xₙ₋₁)) and (xₙ, f(xₙ)) — the "secant line" — and uses its x-intercept as xₙ₊₁. ' +
      'This is algebraically equivalent to Newton-Raphson but with the derivative replaced by a finite difference: ' +
      'f′(xₙ) ≈ [f(xₙ) − f(xₙ₋₁)] / (xₙ − xₙ₋₁).',
    intuition:
      'Newton draws a tangent (one point on the curve, uses derivative). ' +
      'Secant draws a chord (two points on the curve, slope approximated). ' +
      'For a smooth function near the root, the chord increasingly resembles the tangent, ' +
      'so convergence is almost as fast as Newton — but the approximation error introduces ' +
      'an extra factor that brings the convergence order from 2 to φ ≈ 1.618.',
    advantages: [
      'No derivative required — works on black-box functions evaluable only numerically',
      'Order 1.618 convergence — faster than linear (bisection) and competitive with Newton',
      'Only ONE function evaluation per iteration (vs two for Newton)',
      'Naturally reuses the previous iterate — minimal extra memory',
      'No bracket needed — just two starting points (can be on same side of root)',
    ],
    limitations: [
      'Not guaranteed to converge — starting pair must be near the root',
      'Fails when f(xₙ) ≈ f(xₙ₋₁): secant slope is ~0, step is huge',
      'Slower than Newton per iteration — needs ~1.4× as many iterations for same accuracy',
      'Cannot reliably distinguish roots of even multiplicity',
      'Two starting values needed instead of one',
    ],
    keyInsights: [
      'The golden ratio φ = (1+√5)/2 ≈ 1.618 arises because the error equation is a Fibonacci recurrence',
      'Per function evaluation (counting both f and f′), secant often matches or beats Newton',
      'Regula falsi (false position) is the bracketed variant: same secant formula but keeps a bracket like bisection',
      'Steffensen\'s method and Illinois method are improved variants that prevent stagnation',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Secant update formula',
        latex: 'x_{n+1} = x_n - f(x_n) \\cdot \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}',
        description: 'Slope approximated by finite difference through the two most recent points',
        isKeyFormula: true,
      },
      {
        label: 'Finite-difference derivative approximation',
        latex: "f'(x_n) \\approx \\frac{f(x_n) - f(x_{n-1})}{x_n - x_{n-1}}",
        description: 'The secant slope used instead of the true derivative in the Newton formula',
        isKeyFormula: true,
      },
      {
        label: 'Superlinear convergence order',
        latex: '|e_{n+1}| \\leq C \\cdot |e_n|^\\varphi, \\quad \\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1.618',
        description: 'The error satisfies a power law with the golden ratio as the exponent',
        isKeyFormula: true,
      },
      {
        label: 'Convergence criterion',
        latex: '|x_{n+1} - x_n| < \\varepsilon \\quad \\text{or} \\quad |f(x_n)| < \\varepsilon',
        description: 'Stop when the step size or function value falls below tolerance',
      },
      {
        label: 'Secant slope singularity check',
        latex: '|f(x_n) - f(x_{n-1})| > \\delta \\quad (\\text{else: restart or switch})' ,
        description: 'If the two function values are equal, the secant is parallel to x-axis — no x-intercept exists',
      },
    ],
    symbols: [
      { symbol: 'x_{n-1}, x_n',  definition: 'The two most recent approximations (require two starting values)'         },
      { symbol: 'f(x_{n-1}), f(x_n)', definition: 'Function values at the two previous points'                          },
      { symbol: '\\varphi',      definition: 'Golden ratio ≈ 1.618 — the convergence order of the secant method'       },
      { symbol: 'C',             definition: 'Convergence constant depending on f″ and f′ at the root'                  },
      { symbol: 'e_n',           definition: 'Error at iteration n: |xₙ − x*|'                                          },
    ],
    derivationSteps: [
      { step: 1, description: 'Start from Newton: xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)', latex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}" },
      { step: 2, description: "Replace f'(xₙ) with finite difference through previous point", latex: "f'(x_n) \\approx \\frac{f(x_n) - f(x_{n-1})}{x_n - x_{n-1}}" },
      { step: 3, description: 'Substitute to get the secant update', latex: 'x_{n+1} = x_n - f(x_n) \\cdot \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}' },
      { step: 4, description: 'Error analysis: the secant approximation introduces an extra eₙ₋₁ factor, giving order φ', latex: '|e_{n+1}| \\sim C|e_n||e_{n-1}| \\sim C|e_n|^{\\varphi}' },
    ],
    assumptions: [
      'f must be twice continuously differentiable near the root',
      'f(x*) ≠ 0 at the root and f′(x*) ≠ 0 (simple root)',
      'Starting pair {x₀, x₁} must be "close enough" to the root',
      'f(xₙ) ≠ f(xₙ₋₁) at every iteration (no secant slope singularity)',
    ],
    convergenceCondition: '|f(x_n) - f(x_{n-1})| > \\delta_{\\min}',
  },

  errorAnalysis: {
    metrics: [
      { label: 'Successive difference', formula: '|x_{n+1} - x_n|',             description: 'Primary convergence check — how much xₙ changes per step'              },
      { label: 'Residual',              formula: '|f(x_n)|',                    description: 'How close f is to zero at current approximation'                        },
      { label: 'Convergence order',     formula: '\\varphi \\approx 1.618',     description: 'Between linear (1.0) and quadratic (2.0) — superlinear convergence'    },
    ],
    stabilityNote:
      'Secant can stagnate if the two iterates converge to the same value from the same side. ' +
      'If f(xₙ) − f(xₙ₋₁) is tiny, the secant slope is near zero and the next step is enormous. ' +
      'Illinois method fixes this by halving f(xₙ₋₁) when the iterate stays on the same side for two consecutive steps.',
    floatingPointNote:
      'When xₙ and xₙ₋₁ are nearly equal, the denominator f(xₙ) − f(xₙ₋₁) suffers cancellation. ' +
      'This limits how close the two iterates can be while still producing an accurate secant slope.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(log(1/ε)/log(φ)) iterations',
      spaceComplexity: 'O(1) — only two iterates stored',
      convergenceOrder: 'φ ≈ 1.618 (superlinear)',
      convergenceOrderNote: 'eₙ₊₁ ≈ C·|eₙ|^φ where φ = (1+√5)/2 ≈ 1.618 (the golden ratio!)',
    },
    bestCase: 'Near-linear function — secant line nearly matches the chord after 2 steps',
    worstCase: 'f(xₙ) ≈ f(xₙ₋₁) for two starting values — requires restart or fallback',
    typicalIterations: '8–15 for tolerances 10⁻⁶ to 10⁻¹⁵ from reasonable starting values',
  },

  comparison: {
    methods: ['bisection', 'newton-raphson', 'secant'],
    criteria: [
      'Initial requirements', 'Convergence order', 'Derivative needed',
      'Per-iteration cost', 'Total function evals (ε=10⁻⁸)', 'Guaranteed?', 'Best use case',
    ],
    table: [
      { criterion: 'Initial requirements',              bisection: 'Bracket [a,b], sign change',  'newton-raphson': 'Single guess x₀',         secant: 'Two guesses x₀, x₁'           },
      { criterion: 'Convergence order',                 bisection: '1 (linear)',                   'newton-raphson': '2 (quadratic)',             secant: '~1.618 (superlinear)'         },
      { criterion: 'Derivative needed',                 bisection: 'No',                           'newton-raphson': 'Yes — f\'(x)',              secant: 'No'                           },
      { criterion: 'Per-iteration cost',                bisection: '1 eval',                       'newton-raphson': '2 evals (f + f\')',         secant: '1 eval'                       },
      { criterion: 'Total function evals (ε=10⁻⁸)',    bisection: '~27 evals',                    'newton-raphson': '~12 evals (6×2)',           secant: '~10 evals (10×1)'             },
      { criterion: 'Guaranteed?',                       bisection: 'Yes',                          'newton-raphson': 'No',                        secant: 'No'                           },
      { criterion: 'Best use case',                     bisection: 'Safety + reliability',         'newton-raphson': 'Cheap derivative available', secant: 'Expensive black-box f' },
    ],
    summary: 'Secant is the choice when the derivative is unavailable or expensive. On total-function-evaluation count, secant often matches Newton. For expensive f evaluations, secant usually wins.',
  },

  engineeringApplications: [
    {
      field: 'Chemical Engineering',
      title: 'VLE Equilibrium — Peng-Robinson EOS',
      description:
        'The Peng-Robinson equation of state is a cubic polynomial in compressibility Z. ' +
        'Evaluating dEOS/dZ requires symbolic differentiation of a complex expression. ' +
        'Secant method solves Z(T,P) = 0 using only two EOS evaluations per iteration.',
      example: 'Z³ − (1−B)Z² + (A−3B²−2B)Z − (AB−B²−B³) = 0 for methane at 200K, 50 bar',
      icon: '⚗',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Structural Engineering',
      title: 'Finite Element Nonlinear Load Steps',
      description:
        'In nonlinear FEM, the residual force R(u) = Kext − Kint(u) = 0 must be solved for displacements u. ' +
        'Each residual evaluation is an FEM solve (expensive). ' +
        'Secant methods (Broyden\'s update in multi-D) approximate the Jacobian from prior residuals.',
      example: 'Beam buckling: load-deflection curve has a limit point. Secant updates arc-length path-following.',
      icon: '🏗',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Numerical Optimization',
      title: 'Secant as Quasi-Newton in 1D',
      description:
        "Setting f'(x) = 0 to find a minimum and applying the secant method to solve f'(x)=0 " +
        "is equivalent to applying a quasi-Newton optimization step. In 1D, this gives " +
        'superlinear convergence to the minimum without computing the Hessian.',
      example: "Minimize f(x) = x⁴ − 4x²: solve f'(x) = 4x³ − 8x = 0 with secant method",
      icon: '📉',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Embedded / Real-Time Systems',
      title: 'Root Finding Without Division or Derivatives',
      description:
        'On microcontrollers without FPUs, software floating-point division is expensive. ' +
        'The secant method can be reformulated to minimize divisions. ' +
        'For fast-settling control loops, secant converges in 5 steps vs bisection\'s 20.',
      example: 'Finding the zero-crossing of a PID error signal in a motor controller at 10kHz',
      icon: '⚙',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Data Science',
      title: 'Maximum Likelihood Estimation',
      description:
        'For complex likelihood functions L(θ), the score equation dL/dθ = 0 may have no closed form. ' +
        'When the Fisher Information (second derivative) is hard to compute, ' +
        'secant method applied to the score function provides near-Newton convergence.',
      example: 'Fitting a Weibull distribution: score equation involves ln(x) and Γ functions — no closed form',
      icon: '📊',
      difficulty: 'advanced' as const,
    },
  ],

  commonMistakes: [
    {
      id: 'sec-zero-denom',
      title: 'Division by zero when f(xₙ) ≈ f(xₙ₋₁)',
      description:
        'If the two function values are nearly equal, the denominator f(xₙ)−f(xₙ₋₁) ≈ 0. ' +
        'The next iterate jumps to ±Infinity. Always check the denominator before dividing.',
      wrongApproach: 'x_new = xn - f(xn)*(xn-xn1)/(f(xn)-f(xn1))  # Crashes when f(xn)≈f(xn1)',
      correctApproach: 'denom = f(xn) - f(xn1); if abs(denom) < 1e-14: raise Error("Secant denominator too small")',
      icon: '÷',
    },
    {
      id: 'sec-order',
      title: 'Confusing secant order (1.618) with bisection (1) and Newton (2)',
      description:
        'Secant is NOT the average of bisection and Newton. Its order φ ≈ 1.618 is exactly the golden ratio, ' +
        'arising from the Fibonacci-like error recurrence eₙ₊₁ ≈ C·eₙ·eₙ₋₁.',
      wrongApproach: '"Secant should converge in (27+6)/2 = 16.5 iterations" — this is wrong',
      correctApproach: 'Secant needs ~n iterations where n/φ ≈ n_Newton. For ε=10⁻⁸: ~10 secant vs ~6 Newton iterations.',
      icon: 'φ',
    },
    {
      id: 'sec-stagnation',
      title: 'Not handling stagnation (regula falsi bug)',
      description:
        'When f(x₀) and f(x₁) have the same sign, the secant method may still converge — ' +
        'but it can also stagnate (one endpoint never moves). ' +
        'Use Brent or Illinois method instead of plain regula falsi to avoid stagnation.',
      wrongApproach: 'Using regula falsi with f(a)f(b)<0 — the bracket endpoint can be stuck for hundreds of iterations',
      correctApproach: 'Use Illinois modification: if same bracket endpoint repeats, halve its f value to force movement',
      icon: '🐢',
    },
    {
      id: 'sec-starting',
      title: 'Choosing x₀ and x₁ too far apart',
      description:
        'Unlike bisection, secant does not need a bracket. But if the starting pair is far from the root, ' +
        'the first few secant lines may not intersect the x-axis near the root at all.',
      wrongApproach: 'x₀=0, x₁=100 for a root near x=2 — initial secant misses by miles',
      correctApproach: 'Start with x₀ and x₁ close together and near the expected root, or use bisection to get there',
      icon: '🎯',
    },
  ],

  practiceProblems: [
    {
      id: 'sec-p1',
      title: 'Verify convergence order manually',
      description: 'Apply the secant method to f(x) = x³ − x − 2 with x₀=1, x₁=2. Compute the ratio eₙ₊₁/eₙ^φ for iterations 2–5.',
      difficulty: 'easy',
      expression: 'x**3 - x - 2',
      hint: 'Compute exact root = 1.52138. Then eₙ = |xₙ − 1.52138|. Ratio should be approximately constant ≈ 0.3.',
      expectedAnswer: 'ratio ≈ 0.25–0.4 (constant), confirming φ-order convergence',
    },
    {
      id: 'sec-p2',
      title: 'Count total function evaluations vs Newton',
      description: 'Solve f(x) = cos(x) − x to tolerance 10⁻¹² using both Newton-Raphson and Secant. Count the total function evaluations including derivative evaluations for Newton.',
      difficulty: 'medium',
      expression: 'cos(x) - x',
      hint: 'Newton uses f + f\' = 2 evals per iteration. Secant uses 1 eval per iteration (after the first 2). Compare totals.',
      expectedAnswer: 'Newton: ~6 iters × 2 evals = 12. Secant: ~9 iters × 1 eval = 9. Secant wins on eval count!',
    },
    {
      id: 'sec-p3',
      title: 'Secant on a black-box expensive function',
      description: 'Suppose evaluating f(x) = ∫₀ˣ e^(−t²) dt costs 1 second. Find the root of f(x) − 0.5 = 0. How many seconds does secant save vs Newton?',
      difficulty: 'hard',
      expression: 'x - 0.5',
      hint: 'The Gaussian integral root is x* ≈ 0.4769. Newton needs ~12 evals = 12s. Secant needs ~9 evals = 9s. 3 seconds saved.',
      expectedAnswer: 'x* ≈ 0.4769. Secant saves ~3 seconds per solve (25% faster) for this expensive f.',
    },
    {
      id: 'sec-p4',
      title: 'Make secant stagnate',
      description: 'Apply secant to f(x) = x − sin(x) (triple root at 0). Observe the slow convergence. Try to accelerate with Aitken\'s Δ² method.',
      difficulty: 'hard',
      expression: 'x - sin(x)',
      hint: 'f(x) = x − sin(x) has a triple root at x=0 (f(0)=f\'(0)=f\'\'(0)=0, f\'\'\'(0)=1). Convergence is slow.',
      expectedAnswer: 'Secant converges linearly (like bisection) because of the triple root. Aitken\'s method accelerates it.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'ch-secant-faster',
      title: 'Find an Equation Where Secant Beats Newton on Total Evaluations',
      description: 'Choose a function where computing f′ is as expensive as f itself, then compare total evaluation counts.',
      objective: 'Understand when secant is strictly better than Newton.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Go to Comparison Center. Run secant and Newton on f(x) = x^3 - x - 2 with x₀=1.5, x₁=2, tol=1e-12.', expectedOutcome: 'Newton: ~6 iters × 2 evals = 12. Secant: ~10 × 1 = 10. Secant wins.' },
        { step: 2, instruction: 'Now try f(x) = exp(x) - 3x with x₀=0.5, x₁=1.', expectedOutcome: 'Compare total eval counts. Which wins depends on function complexity.' },
      ],
    },
    {
      id: 'ch-golden-ratio',
      title: 'Observe the Golden Ratio in Convergence',
      description: 'Compute the ratio of consecutive error ratios and confirm they approach φ.',
      objective: 'See the golden ratio emerge from the Fibonacci-like error recurrence.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Apply secant to f(x) = cos(x) − x with x₀=0, x₁=1. Record errors at each step.', expectedOutcome: 'Errors: e₁, e₂, e₃, e₄, ...' },
        { step: 2, instruction: 'Compute log(eₙ₊₁)/log(eₙ) for n=3,4,5. Does it approach 1.618?', expectedOutcome: 'Yes — the convergence order ratio approaches φ = (1+√5)/2 ≈ 1.618.' },
        { step: 3, instruction: 'Also compute eₙ₊₁/(eₙ·eₙ₋₁). Is this roughly constant?', expectedOutcome: 'Yes — the constant C ≈ 0.5 (depends on f″/f′ at root).' },
      ],
    },
    {
      id: 'ch-stagnation',
      title: 'Observe Secant Stagnation',
      description: 'Try to make the secant method stagnate on a function with equal function values at two points.',
      objective: 'Understand the denominator singularity and how to handle it.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Try f(x) = (x−2)² − 0.0001 with x₀=1, x₁=3. What happens?', expectedOutcome: 'f(1) = f(3) = 0.9999. Denominator ≈ 0 → secant explodes to huge values.' },
        { step: 2, instruction: 'Restart with x₀=1.5, x₁=2.5. Does it converge now?', expectedOutcome: 'Yes — different starting pair avoids the near-zero denominator.' },
      ],
    },
    {
      id: 'ch-triple-race',
      title: 'Three-Way Race: Same Equation, All Methods',
      description: 'Compare bisection, Newton-Raphson, and Secant on the same equation with maximum rigor.',
      objective: 'Synthesize the trade-offs of all three root-finding methods.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Go to Comparison Center. Set f(x) = x^3 - x - 2, bracket [1,2], x₀=1.5, x₁=2, tol=1e-10.', expectedOutcome: 'All three methods find root ≈ 1.5213797.' },
        { step: 2, instruction: 'Record: iterations, function evaluations, execution time for each.', expectedOutcome: 'Bisection: ~34 iters. Newton: ~6. Secant: ~9.' },
        { step: 3, instruction: 'Change tol to 1e-14. How do the iteration counts change?', expectedOutcome: 'Bisection needs ~47. Newton: ~7. Secant: ~11. Quadratic/superlinear advantage grows.' },
      ],
    },
    {
      id: 'ch-cfd-scenario',
      title: 'Simulate an Expensive Function Scenario',
      description: 'Use the Comparison Center to evaluate which method minimizes costly function calls for a realistic engineering scenario.',
      objective: 'Apply method selection reasoning to a practical cost-per-evaluation problem.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Set f(x) = x*exp(x) - 1. Assume each eval costs 1 unit. Compare: Newton 2 units/iter, Secant 1 unit/iter, Bisection 1 unit/iter.', expectedOutcome: 'Solve f(x)=0 (root near x≈0.567).' },
        { step: 2, instruction: 'Record total cost: Newton: iters × 2, Secant: iters × 1 + 1, Bisection: iters × 1.', expectedOutcome: 'Newton: ~12 cost units. Secant: ~8. Bisection: ~27. Secant wins this race.' },
        { step: 3, instruction: 'Now assume derivative is free (takes 0 time). Who wins?', expectedOutcome: 'Newton wins: same convergence at half the "cost" since f\' is free.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Superlinear convergence — order φ ≈ 1.618', description: 'The golden ratio! Faster than linear (bisection) but slightly slower per iteration than quadratic (Newton). The golden ratio emerges from the Fibonacci-like error recurrence.', icon: 'φ' },
      { title: 'No derivative required', description: 'Uses the slope of the secant line through two previous points to approximate f′. One function evaluation per iteration after the first two.', icon: '∇' },
      { title: 'Beats Newton on total function evaluations', description: 'Newton needs 2 evals/iter (f + f′). Secant needs 1 eval/iter. For the same convergence rate, secant often requires fewer total evaluations.', icon: '🏆' },
      { title: 'Not guaranteed to converge', description: 'Starting pair must be near root. Denominator f(xₙ)−f(xₙ₋₁)≈0 causes failure. Use bisection or plotting to get good starting values.', icon: '⚠' },
      { title: 'Ideal for expensive black-box functions', description: 'When f is a simulation, experiment, or compiled code where f′ is unavailable, secant is the natural choice.', icon: '📦' },
    ],
    cheatSheetFormulas: [
      { label: 'Secant update',         latex: 'x_{n+1} = x_n - f(x_n)\\,\\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}', isKeyFormula: true },
      { label: 'Convergence order',     latex: '\\varphi = (1+\\sqrt{5})/2 \\approx 1.618',                               isKeyFormula: true },
      { label: 'Error growth',          latex: '|e_{n+1}| \\approx C\\,|e_n|^\\varphi'                                                       },
      { label: 'Denominator check',     latex: '|f(x_n) - f(x_{n-1})| > \\delta_{\\min}'                                                   },
    ],
    nextSteps: [
      { label: 'Comparison Center',     description: 'Race all three methods on the same equation side by side',              path: '/root-finding/comparison'  },
      { label: 'Bisection Method',      description: 'The guaranteed baseline — revisit to appreciate trade-offs',             path: '/root-finding/bisection'   },
      { label: 'Interpolation',         description: 'Polynomial interpolation — generalizes the secant approximation idea',  path: '/interpolation'            },
    ],
  },
}
