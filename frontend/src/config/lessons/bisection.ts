import type { LessonConfig } from '@/types/lesson.types'

export const BISECTION_CONFIG: LessonConfig = {
  header: {
    moduleId: 'root-finding',
    moduleColor: '#10b981',
    title: 'Bisection Method',
    subtitle: 'Guaranteed root convergence by halving the interval',
    difficulty: 'introductory',
    estimatedMinutes: 60,
    objectives: [
      'Apply the Intermediate Value Theorem to guarantee a root exists in an interval',
      'Implement the bisection algorithm: midpoint selection and bracket update rule',
      'Derive the error bound (b−a)/2^n and predict required iterations before running',
      'Explain why bisection always converges when the conditions are met',
      'Identify when bisection is the right tool vs. faster open methods',
      'Compute absolute and relative errors at each iteration',
    ],
    prerequisites: [],
    tags: ['bracketing', 'IVT', 'guaranteed convergence', 'linear convergence', 'O(log n)'],
  },

  motivation: {
    problemStatement:
      'You need to find where a continuous function crosses zero. ' +
      'You know the root lies somewhere in [1, 2] because the function is negative at 1 and positive at 2 — ' +
      'but the function has no nice closed form and you can\'t solve it algebraically.',
    whyItMatters:
      'Root finding is one of the most common computational tasks in engineering. ' +
      'IRR (internal rate of return) has no closed form. ' +
      'Operating points of electrical circuits require solving transcendental equations. ' +
      'Structural deflection zeros need iterative search. ' +
      'Bisection is the baseline: always correct, predictably slow.',
    historicalBackground:
      'The bisection method is one of the oldest numerical algorithms — a formalization of the ancient ' +
      '"method of false position" known to Babylonian mathematicians. ' +
      'The modern formulation, backed by the Intermediate Value Theorem (Cauchy, 1821), makes it the ' +
      'gold standard for bracketing methods: simple to implement, impossible to fool if conditions are met.',
    engineeringMotivation:
      'In a control system, the time a projectile takes to reach a target height satisfies a quadratic — ' +
      'two solutions, one physical. In chemistry, the equilibrium concentration in a closed system ' +
      'satisfies a polynomial equation that may have no closed form. ' +
      'Bisection solves all of these reliably even when faster methods would oscillate or diverge.',
    motivatingExample: {
      title: 'Solving x³ − x − 2 = 0',
      description:
        'f(1) = 1 − 1 − 2 = −2 < 0 and f(2) = 8 − 2 − 2 = 4 > 0. ' +
        'By the IVT, there must be a root in [1, 2]. ' +
        'Bisection finds it to 10-decimal precision in just 34 iterations — with a guaranteed error bound at every step.',
      expression: 'x^3 - x - 2 = 0',
      result: 'Root ≈ 1.5213797 (verified: f(1.5213797) ≈ 3.6×10⁻⁷)',
    },
  },

  theory: {
    overview:
      'Bisection exploits a fundamental theorem of calculus: if f is continuous on [a, b] ' +
      'and f(a) and f(b) have opposite signs, there must exist at least one root in (a, b). ' +
      'The algorithm narrows the interval by half each iteration, always keeping the root inside. ' +
      'After n steps, the root is pinned to within (b−a)/2^n.',
    intuition:
      'Think of searching for a specific page in a textbook by feel (no page numbers visible). ' +
      'You open to the middle, decide which half contains the page, discard the other half, ' +
      'and repeat. After 10 halvings, a 1000-page book is narrowed to 1 page. ' +
      'Bisection does exactly this — but on the number line.',
    advantages: [
      'Absolutely guaranteed to converge if f is continuous and f(a)·f(b) < 0',
      'Error is bounded at every step: |error| ≤ (b−a)/2^n',
      'Required iteration count is predictable before running: n ≥ log₂((b−a)/ε)',
      'Robust to steep gradients, inflection points, and multiple roots in the interval',
      'No derivative required — works on any evaluable f(x)',
    ],
    limitations: [
      'Linear convergence (order 1): halves error each step. Newton-Raphson converges in half as many steps for smooth functions',
      'Requires a bracket [a, b] — finding one for a complex function may itself be difficult',
      'Only finds ONE root even if multiple roots exist in [a, b]',
      'Cannot detect roots at points where f touches but does not cross zero (even multiplicity)',
    ],
    keyInsights: [
      'The error bound is independent of the function shape — only the bracket width and step count matter',
      'Starting bracket width has log₂ impact: doubling the interval adds only 1 iteration',
      'For ε = 10⁻⁶ and [a, b] = [0, 1]: n = ⌈log₂(10⁶)⌉ = 20 iterations exactly',
      'Bisection is the fallback inside hybrid methods (Brent\'s method) when Newton-Raphson diverges',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Midpoint selection',
        latex: 'c_n = \\frac{a_n + b_n}{2}',
        description: 'The midpoint c_n bisects the current bracket [a_n, b_n]',
        isKeyFormula: true,
      },
      {
        label: 'Bracket update rule',
        latex: '\\begin{cases} b_{n+1} = c_n & \\text{if } f(a_n)\\cdot f(c_n) < 0 \\\\ a_{n+1} = c_n & \\text{otherwise} \\end{cases}',
        description: 'The half-bracket that contains the sign change is kept; the other is discarded',
        isKeyFormula: true,
      },
      {
        label: 'Error bound after n iterations',
        latex: '|e_n| \\leq \\frac{b - a}{2^{n+1}}',
        description: 'The error is halved every step, regardless of function shape',
        isKeyFormula: true,
      },
      {
        label: 'Required iteration count',
        latex: 'n \\geq \\left\\lceil \\log_2\\!\\left(\\frac{b - a}{\\varepsilon}\\right) \\right\\rceil - 1',
        description: 'Solve for n: find the minimum iterations to reach tolerance ε',
      },
      {
        label: 'Convergence criterion',
        latex: '\\frac{b_n - a_n}{2} < \\varepsilon \\quad \\text{or} \\quad |f(c_n)| < \\varepsilon',
        description: 'Stop when the bracket is narrower than tolerance, or f(c) is close enough to zero',
      },
    ],
    symbols: [
      { symbol: 'a_n, b_n', definition: 'Lower and upper bounds of bracket at iteration n'          },
      { symbol: 'c_n',      definition: 'Midpoint of bracket — the current root approximation'      },
      { symbol: 'f(c_n)',   definition: 'Function value at the midpoint'                             },
      { symbol: 'e_n',      definition: 'Error at iteration n: |c_n − x^*|'                         },
      { symbol: '\\varepsilon', definition: 'Convergence tolerance (e.g., 10⁻⁶)'                   },
      { symbol: 'n',        definition: 'Iteration count'                                            },
    ],
    derivationSteps: [
      { step: 1, description: 'Start: f(a)·f(b) < 0 guarantees a root r ∈ (a, b) by IVT', latex: 'f(a) \\cdot f(b) < 0 \\Rightarrow \\exists\\, r \\in (a,b): f(r) = 0' },
      { step: 2, description: 'Compute midpoint c = (a+b)/2. Check sign of f(c)·f(a).', latex: 'c = \\tfrac{a+b}{2}' },
      { step: 3, description: 'If f(a)·f(c) < 0, root is in [a, c]; set b = c. Otherwise set a = c.', latex: 'b_{n+1} = c_n \\;\\text{ or }\\; a_{n+1} = c_n' },
      { step: 4, description: 'After n halvings, bracket width = (b−a)/2^n. Root known to within half of that.', latex: '|c_n - r| \\leq \\frac{b_0 - a_0}{2^{n+1}}' },
    ],
    assumptions: [
      'f must be continuous on [a, b]',
      'f(a) and f(b) must have opposite signs: f(a)·f(b) < 0',
      'The interval [a, b] contains at least one root (may contain more — bisection finds one)',
    ],
    convergenceCondition: '|b_n - a_n| < \\varepsilon',
  },

  errorAnalysis: {
    metrics: [
      { label: 'Absolute error bound',  formula: '|e_n| \\leq (b-a)/2^{n+1}',          description: 'Computable before running — does not depend on the function' },
      { label: 'Relative error',        formula: 'E_{rel} = |c_n - r|/|r|',             description: 'Useful when the root magnitude is large' },
      { label: 'Residual',              formula: '|f(c_n)|',                             description: 'How close f is to zero at the midpoint — a second convergence measure' },
    ],
    stabilityNote:
      'Bisection is unconditionally stable. It cannot diverge. Each step strictly reduces the bracket width by half, so error is monotonically decreasing (in the bracket-width sense).',
    floatingPointNote:
      'For very small brackets, compute the midpoint as a + (b−a)/2 rather than (a+b)/2 to avoid cancellation when a and b are close in magnitude.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(log((b−a)/ε))',
      spaceComplexity: 'O(1)',
      convergenceOrder: '1 (linear)',
      convergenceOrderNote: 'Error halves each iteration: e_{n+1} = e_n / 2',
    },
    bestCase: 'f(c) = 0 exactly at the midpoint of the first iteration — terminates in 1 step',
    worstCase: 'Root is exactly at the boundary — takes maximum iterations to pin it down',
    typicalIterations: '20–50 for tolerances between 10⁻⁶ and 10⁻¹⁵ with a unit-width bracket',
  },

  comparison: {
    methods: ['bisection', 'newton-raphson', 'secant'],
    criteria: [
      'Initial requirements', 'Convergence order', 'Derivative needed',
      'Per-iteration cost', 'Typical iterations (ε=10⁻⁸)', 'Guaranteed?', 'Failure modes',
    ],
    table: [
      { criterion: 'Initial requirements',            bisection: 'Bracket [a,b], f(a)·f(b)<0',  'newton-raphson': 'Single guess x₀',              secant: 'Two guesses x₀, x₁'        },
      { criterion: 'Convergence order',               bisection: '1 (linear)',                    'newton-raphson': '2 (quadratic)',                 secant: '~1.618 (superlinear)'      },
      { criterion: 'Derivative needed',               bisection: 'No',                            'newton-raphson': 'Yes — f\'(x)',                  secant: 'No'                        },
      { criterion: 'Per-iteration cost',              bisection: '1 function eval',              'newton-raphson': '1 f + 1 f\' eval',             secant: '1 function eval'           },
      { criterion: 'Typical iterations (ε=10⁻⁸)',    bisection: '~27',                          'newton-raphson': '~5–8',                          secant: '~8–12'                     },
      { criterion: 'Guaranteed?',                     bisection: 'Yes — always converges',        'newton-raphson': 'No — can diverge',             secant: 'No — can diverge'          },
      { criterion: 'Failure modes',                   bisection: 'Only if f is discontinuous',    'newton-raphson': 'f\'(xₙ)=0; poor x₀; cycles', secant: 'f(xₙ)≈f(xₙ₋₁); poor pair' },
    ],
    summary: 'Use bisection when you need a guarantee and can afford ~30 iterations. Use Newton-Raphson for smooth functions where you have (or can compute) the derivative. Use Secant when derivatives are unavailable but you still want near-quadratic speed.',
  },

  engineeringApplications: [
    {
      field: 'Finance',
      title: 'Internal Rate of Return (IRR)',
      description:
        'Find the discount rate r that makes NPV(r) = 0 for a series of cash flows. ' +
        'There is no closed-form solution for IRR when there are more than 2 periods. ' +
        'Bisection is the industry-standard approach because IRR is always between 0% and some known upper bound.',
      example: 'NPV(r) = −10000 + 3000/(1+r) + 4000/(1+r)² + 5000/(1+r)³ = 0  →  IRR ≈ 14.5%',
      icon: '💹',
      difficulty: 'introductory' as const,
    },
    {
      field: 'Electrical Engineering',
      title: 'Diode Operating Point',
      description:
        'A diode circuit satisfies V = V_s − I(V)·R where I(V) = I_s(e^(V/V_T) − 1). ' +
        'Substituting gives f(V) = V − V_s + R·I_s·(e^(V/V_T) − 1) = 0. ' +
        'This transcendental equation has one solution for V in [0, V_s] — bisection finds it.',
      example: 'V_s = 5V, R = 1kΩ, I_s = 10⁻¹⁴ A, V_T = 0.026V → V ≈ 0.693V',
      icon: '⚡',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Projectile / Aerospace',
      title: 'Time of Flight',
      description:
        'A projectile\'s height is h(t) = v₀ sin(θ)·t − ½g·t². ' +
        'Setting h = 0 has the trivial solution t = 0 and the physical one at t = 2v₀ sin(θ)/g. ' +
        'With drag: h(t) = (v_T v₀ sin(θ)/g) · (1 − e^(−gt/v_T)) − v_T·t + v_T²/g has no closed form.',
      example: 'v₀=50 m/s, θ=45°, drag coefficient c=0.1 → solve h(t)=0 in [0.1, 10] for landing time',
      icon: '🚀',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Structural / Civil Engineering',
      title: 'Beam Zero-Deflection Point',
      description:
        'A uniformly loaded simply-supported beam has deflection y(x) = w·x(L³ − 2Lx² + x³)/(24EI). ' +
        'For asymmetric loading or beam-column problems, the zero-deflection point must be found numerically.',
      example: 'Find x where y(x) = P·x(3L² − 4x²)/(48EI) = 0 under a point load P at midspan',
      icon: '🏗',
      difficulty: 'introductory' as const,
    },
    {
      field: 'Chemical Engineering',
      title: 'Equilibrium Concentration',
      description:
        'For the reaction A ⇌ 2B with equilibrium constant K, starting from concentration C₀: ' +
        'K = (2x)²/(C₀ − x) where x is the extent of reaction. ' +
        'This cubic in x may not have a nice closed form depending on K.',
      example: 'K = 0.01, C₀ = 1.0 mol/L → f(x) = 4x² − K(1−x) = 0 → x ≈ 0.048 mol/L',
      icon: '⚗',
      difficulty: 'intermediate' as const,
    },
  ],

  commonMistakes: [
    {
      id: 'bis-sign',
      title: 'Not checking f(a)·f(b) < 0 before starting',
      description:
        'If both endpoints have the same sign, bisection gives NO error — it silently runs for max_iterations and returns the final midpoint, which is completely wrong.',
      wrongApproach: 'bisect(f, a=1, b=3)  # f(1)=−2, f(3)=22, OK  →  but f(2)=4 → [1,2], f(1.5)=−0.125 → [1.5,2] ✓',
      correctApproach: 'Always assert f(a)*f(b) < 0 before calling bisect. If you get NaN or the root is outside expectation, this check caught a bracket error.',
      icon: '⚠',
    },
    {
      id: 'bis-disc',
      title: 'Applying bisection to a discontinuous function',
      description:
        'tan(x) has vertical asymptotes at x = π/2 + kπ. The function changes sign there — but there is NO root! ' +
        'Bisection will "converge" to the asymptote and return a completely wrong answer.',
      wrongApproach: 'bisect(tan, a=1, b=2)  # tan(1)≈1.56, tan(2)≈−2.19 → bisection converges to π/2 ≈ 1.5708 — not a root!',
      correctApproach: 'Plot f before bisecting. If the sign change is due to a discontinuity (|f| is huge near the crossing), bracket more tightly or use a different approach.',
      icon: '∞',
    },
    {
      id: 'bis-midpoint',
      title: 'Computing midpoint as (a+b)/2 instead of a+(b−a)/2',
      description:
        'For large a and b, a+b can overflow or lose precision due to floating-point cancellation. ' +
        'The numerically stable form a + (b−a)/2 avoids this.',
      wrongApproach: 'c = (a + b) / 2  # can overflow for a,b near float max',
      correctApproach: 'c = a + (b - a) / 2  # always safe and numerically stable',
      icon: '🔢',
    },
    {
      id: 'bis-tol',
      title: 'Stopping only on |f(c)| < ε instead of also checking bracket width',
      description:
        'For a nearly-flat function near the root, |f(c)| can be tiny while c is still far from the root. ' +
        'Always also check the bracket width (b−a)/2 < ε to ensure positional accuracy.',
      wrongApproach: 'while abs(f(c)) > tol: ...  # may stop too early near flat regions',
      correctApproach: 'while (b-a)/2 > tol AND abs(f(c)) > tol: ...  # both checks',
      icon: '📏',
    },
  ],

  practiceProblems: [
    {
      id: 'bis-p1',
      title: 'Classic: Solve cos(x) = x',
      description: 'Find the root of f(x) = cos(x) − x on [0, π/2]. This is the famous Dottie number — the only fixed point of the cosine function.',
      difficulty: 'easy',
      expression: 'cos(x) - x',
      hint: 'f(0) = 1 > 0, f(π/2) = −π/2 < 0. IVT guarantees a root. Expected answer: x ≈ 0.739085.',
      expectedAnswer: 'x* ≈ 0.7390851332151607 (the Dottie number)',
    },
    {
      id: 'bis-p2',
      title: 'Predict the iterations before running',
      description: 'Before using the playground: compute how many bisection iterations are needed to solve x³ − x − 2 = 0 on [1, 2] to tolerance 10⁻¹⁰. Then verify.',
      difficulty: 'medium',
      expression: 'x**3 - x - 2',
      hint: 'n ≥ log₂((b−a)/ε) − 1 = log₂(1/10⁻¹⁰) − 1 = log₂(10¹⁰) − 1 ≈ 32.2, so n = 33 iterations.',
      expectedAnswer: '~33 iterations, root ≈ 1.5213797068045675',
    },
    {
      id: 'bis-p3',
      title: 'Find both roots of e^x = 3x',
      description: 'The equation e^x − 3x = 0 has two roots. Plot f(x) to identify appropriate brackets, then find both roots using two separate bisection calls.',
      difficulty: 'medium',
      expression: 'exp(x) - 3*x',
      hint: 'f(0)=1>0, f(0.5)≈0.15>0, f(1)=e-3≈-0.28<0, f(2)=e²-6≈1.39>0. Brackets: [0.5,1] and [1,2].',
      expectedAnswer: 'x₁ ≈ 0.6190612867, x₂ ≈ 1.5121345517',
    },
    {
      id: 'bis-p4',
      title: 'Break-even analysis',
      description: 'A product costs $5 + $0.5·q to make (fixed + variable). Revenue is $2·√q per unit. Find the quantity q where revenue equals cost.',
      difficulty: 'hard',
      expression: '2*sqrt(x) - 5 - 0.5*x',
      hint: 'f(x) = 2√x − 5 − 0.5x. Try bracket [0, 16]. Note f(0)=−5<0 and f(16)=8−5−8=−5<0. Hmm — try plotting. f(4)=4−5−2=−3, f(8)≈5.66−5−4=−3.34. There is NO real break-even! Revenue never exceeds cost for this pricing.',
      expectedAnswer: 'No real root — the business is unprofitable. Change the pricing model.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'ch-count',
      title: 'Verify the Iteration Count Formula',
      description: 'Before running, predict the number of iterations needed, then confirm with the playground.',
      objective: 'Show that n ≥ log₂((b−a)/ε) − 1 gives the exact iteration count.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set function = cos(x) - x, a=0, b=π, tol=1e-8.', expectedOutcome: 'Formula gives n ≥ log₂(π/10⁻⁸) − 1 ≈ 24.2, so 25 iterations.' },
        { step: 2, instruction: 'Run the playground and count iterations.', expectedOutcome: 'The playground reports exactly 25 iterations.' },
        { step: 3, instruction: 'Now widen the bracket to [0, 10]. How many more iterations?', expectedOutcome: 'log₂(10/10⁻⁸) ≈ 26.6 → 27 iterations — only 2 more despite 10× wider bracket!' },
      ],
    },
    {
      id: 'ch-disc',
      title: 'Make Bisection Give a Wrong Answer',
      description: 'Demonstrate that bisection fails on a discontinuous function and explain why.',
      objective: 'Observe bisection "converging" to a false root at a discontinuity.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Set function = 1/x, a=-1, b=1, tol=1e-6.', expectedOutcome: 'f(−1)=−1<0, f(1)=1>0. Bisection "finds a root" near 0 — but 1/x has no root!' },
        { step: 2, instruction: 'Look at the returned root value. What is it? Is f(root) = 0?', expectedOutcome: 'Root ≈ 0 (the asymptote). f(root) is extremely large, NOT zero.' },
        { step: 3, instruction: 'Fix: try bracket [0.5, 2] for a function you know has a root there.', expectedOutcome: 'With a valid bracket, bisection works correctly.' },
      ],
    },
    {
      id: 'ch-compare',
      title: 'Bisection vs Newton-Raphson: Iteration Race',
      description: 'Compare how many iterations each method needs for the same tolerance.',
      objective: 'Quantify the iteration cost of linear vs quadratic convergence.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Go to the Comparison Center. Set f(x) = x³ − x − 2, bracket [1,2], tol=1e-12.', expectedOutcome: 'Run all three methods simultaneously.' },
        { step: 2, instruction: 'Record: Bisection iterations vs Newton-Raphson iterations.', expectedOutcome: 'Bisection needs ~40 iterations; Newton needs ~6. Factor of ~7× difference.' },
        { step: 3, instruction: 'Now try tol=1e-14 (near machine epsilon). How do the iteration counts change?', expectedOutcome: 'Bisection needs ~47, Newton still only ~7. The gap widens as tolerance tightens.' },
      ],
    },
    {
      id: 'ch-guaranteed',
      title: 'Prove Bisection is Reliable',
      description: 'Try to make bisection fail on a valid bracket — you cannot.',
      objective: 'Understand that bisection\'s guarantee is unconditional for continuous functions.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Try f(x) = sin(x) + 0.5 on [-π, 0]. Run bisection.', expectedOutcome: 'Converges reliably to x ≈ -0.5236.' },
        { step: 2, instruction: 'Try a very wide bracket: x^3 - 100 on [-100, 1000]. Does bisection still find the root?', expectedOutcome: 'Yes — root is ∛100 ≈ 4.642. Bisection finds it in ~34 iterations.' },
        { step: 3, instruction: 'Try a near-flat function: f(x) = x^5 - 0.00001 on [0, 1].', expectedOutcome: 'Bisection converges to 5th root of 1e-5 ≈ 0.631. IVT still holds.' },
      ],
    },
    {
      id: 'ch-irr',
      title: 'Compute IRR with Bisection',
      description: 'Find the Internal Rate of Return for a 3-year investment project.',
      objective: 'Apply bisection to a real financial root-finding problem.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Enter f(r) = -10000 + 3000/(1+r) + 5000/(1+r)^2 + 4000/(1+r)^3. Use bracket [0.001, 0.5].', expectedOutcome: 'f(0.001) ≈ 1985 > 0, f(0.5) ≈ -3926 < 0. Valid bracket.' },
        { step: 2, instruction: 'Run bisection with tol=1e-6.', expectedOutcome: 'IRR ≈ 0.1849 → 18.49% annual return.' },
        { step: 3, instruction: 'Increase the Year-3 cash flow to 6000. How does IRR change?', expectedOutcome: 'Change expression to ..+6000/(1+r)^3. IRR rises to approximately 24.6%.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Guaranteed by the IVT', description: 'If f is continuous and f(a)·f(b) < 0, bisection always converges. This guarantee holds even when faster methods fail.', icon: '✓' },
      { title: 'Linear convergence — half per step', description: 'Error bound: |eₙ| ≤ (b−a)/2ⁿ⁺¹. Requires ~3.32 iterations per decimal digit of accuracy.', icon: '📉' },
      { title: 'Predictable iteration count', description: 'n ≥ log₂((b−a)/ε) − 1 tells you exactly how many iterations before you start.', icon: '🔢' },
      { title: 'Fallback in hybrid methods', description: "Brent's method uses bisection as a safety net when Newton-Raphson or inverse quadratic interpolation would diverge.", icon: '🛡' },
      { title: 'Only finds one root', description: 'Multiple roots in [a,b] are not a problem — but bisection will only converge to one of them (the one closest to the center, in general).', icon: '⚠' },
    ],
    cheatSheetFormulas: [
      { label: 'Midpoint',              latex: 'c_n = a_n + (b_n - a_n)/2',                      isKeyFormula: true },
      { label: 'Error bound',           latex: '|e_n| \\leq (b_0 - a_0)/2^{n+1}',               isKeyFormula: true },
      { label: 'Required iterations',   latex: 'n \\geq \\lceil \\log_2((b-a)/\\varepsilon) \\rceil - 1' },
      { label: 'Bracket check',         latex: 'f(a)\\cdot f(b) < 0'                                         },
      { label: 'Update rule (root in [a,c])', latex: 'b \\leftarrow c \\;\\text{if}\\; f(a)\\cdot f(c) < 0' },
    ],
    nextSteps: [
      { label: 'Newton-Raphson Method', description: 'Achieve quadratic convergence using tangent lines — needs f\'(x)', path: '/root-finding/newton-raphson' },
      { label: 'Secant Method',         description: 'Near-quadratic speed without derivatives', path: '/root-finding/secant' },
      { label: 'Comparison Center',     description: 'Race all three methods on the same equation', path: '/root-finding/comparison' },
    ],
  },
}
