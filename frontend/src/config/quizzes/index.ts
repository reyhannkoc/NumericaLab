import type { QuizQuestion } from '@/types/progress.types'

const BISECTION: QuizQuestion[] = [
  {
    id: 'b1',
    question: 'What is the bisection method primarily used for?',
    options: ['Computing definite integrals', 'Finding roots of nonlinear equations', 'Solving linear systems', 'Minimizing functions'],
    correct: 1,
    explanation: 'Bisection locates a root of f(x) = 0 by repeatedly halving a bracket [a, b] where f(a)·f(b) < 0.',
  },
  {
    id: 'b2',
    question: 'What must be true about the interval [a, b] to start bisection?',
    options: ['f(a) = 0', 'f(a)·f(b) < 0 (sign change across the interval)', 'f\'(a) must exist', 'a and b must be integers'],
    correct: 1,
    explanation: 'By the Intermediate Value Theorem, a sign change f(a)·f(b) < 0 guarantees a root exists in [a, b].',
  },
  {
    id: 'b3',
    question: 'How does bisection select the next sub-interval?',
    options: ['Using Newton\'s formula', 'Linear interpolation between a and b', 'Evaluating the midpoint c = (a+b)/2 and checking the sign of f(c)', 'Following the gradient of f'],
    correct: 2,
    explanation: 'Bisection computes c = (a+b)/2 and retains whichever half [a,c] or [c,b] still contains a sign change.',
  },
  {
    id: 'b4',
    question: 'What is the convergence order of bisection?',
    options: ['Quadratic — error squares each step', 'Superlinear — order ≈ 1.618', 'Linear — the error halves each iteration', 'Cubic'],
    correct: 2,
    explanation: 'Bisection has linear convergence: the interval (and error bound) is exactly halved at every step.',
  },
  {
    id: 'b5',
    question: 'What is the biggest advantage of bisection over Newton-Raphson?',
    options: ['It converges in fewer iterations', 'It does not require f\'(x) and is guaranteed to converge given a valid bracket', 'It is faster per iteration', 'It can find complex roots'],
    correct: 1,
    explanation: 'Bisection is unconditionally convergent for continuous f with a bracket — no derivative or smoothness beyond continuity is needed.',
  },
]

const NEWTON_RAPHSON: QuizQuestion[] = [
  {
    id: 'nr1',
    question: 'What convergence order does Newton–Raphson typically achieve near a simple root?',
    options: ['Linear (order 1)', 'Superlinear (order ~1.618)', 'Quadratic (order 2)', 'Cubic (order 3)'],
    correct: 2,
    explanation: 'Near a simple root (f\'(x*) ≠ 0), Newton–Raphson converges quadratically: the number of correct digits roughly doubles each iteration.',
  },
  {
    id: 'nr2',
    question: 'What is the Newton–Raphson update formula?',
    options: ['x_{n+1} = (a + b)/2', 'x_{n+1} = x_n - f(x_n) / f\'(x_n)', 'x_{n+1} = x_n - f(x_n)·(x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))', 'x_{n+1} = f(x_n)'],
    correct: 1,
    explanation: 'The Newton–Raphson step tangent-line linearises f at x_n: the zero of that line is x_{n+1} = x_n - f(x_n)/f\'(x_n).',
  },
  {
    id: 'nr3',
    question: 'What happens when f\'(x_n) ≈ 0 during Newton–Raphson?',
    options: ['The method converges faster', 'The root has been found', 'Division by near-zero causes the step to diverge or fail', 'The method automatically switches to bisection'],
    correct: 2,
    explanation: 'A near-zero derivative makes the update x_n - f(x_n)/f\'(x_n) enormous. Near inflection points this is the primary failure mode.',
  },
  {
    id: 'nr4',
    question: 'What does Newton–Raphson require that bisection does not?',
    options: ['An initial bracket [a, b]', 'The analytical (or numerical) first derivative f\'(x)', 'Two initial guesses', 'A tolerance parameter'],
    correct: 1,
    explanation: 'Newton–Raphson uses f\'(x_n) explicitly in every step. If f\' is unavailable, the Secant method approximates it.',
  },
  {
    id: 'nr5',
    question: 'Newton–Raphson converges to the WRONG root when:',
    options: ['The initial guess is close to the desired root', 'The function is smooth and convex', 'The initial guess falls in a region that leads to a different root or divergence', 'The tolerance is set to 10⁻⁸'],
    correct: 2,
    explanation: 'Convergence is only local. A poor initial guess can send Newton–Raphson to a different root or cause divergence if the iteration escapes the basin of attraction.',
  },
]

const SECANT: QuizQuestion[] = [
  {
    id: 'sc1',
    question: 'What key difference sets the Secant method apart from Newton–Raphson?',
    options: ['It requires a bracket [a, b]', 'It approximates f\'(x) using a finite difference instead of the exact derivative', 'It converges quadratically', 'It requires three initial guesses'],
    correct: 1,
    explanation: 'The Secant method replaces f\'(x_n) with the finite-difference slope (f(x_n)-f(x_{n-1}))/(x_n-x_{n-1}), eliminating the need for an analytical derivative.',
  },
  {
    id: 'sc2',
    question: 'What is the convergence order of the Secant method?',
    options: ['Linear (order 1)', 'Quadratic (order 2)', 'Superlinear — order ≈ 1.618 (the golden ratio)', 'Cubic (order 3)'],
    correct: 2,
    explanation: 'The Secant method has order φ = (1+√5)/2 ≈ 1.618 — superlinear but slightly slower than Newton\'s quadratic convergence.',
  },
  {
    id: 'sc3',
    question: 'What is the Secant method update formula?',
    options: [
      'x_{n+1} = x_n - f(x_n)/f\'(x_n)',
      'x_{n+1} = x_n - f(x_n)·(x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))',
      'x_{n+1} = (x_n + x_{n-1}) / 2',
      'x_{n+1} = x_n - f(x_n)·h',
    ],
    correct: 1,
    explanation: 'The Secant update uses the slope of the secant line through (x_{n-1}, f(x_{n-1})) and (x_n, f(x_n)) as a proxy for the derivative.',
  },
  {
    id: 'sc4',
    question: 'How many initial points does the Secant method require?',
    options: ['One', 'Two', 'Three', 'None'],
    correct: 1,
    explanation: 'The Secant method needs two starting points x_0 and x_1 to compute the first finite-difference slope. Neither must bracket the root.',
  },
  {
    id: 'sc5',
    question: 'What can make the Secant method fail or slow down?',
    options: ['f being smooth', 'f(x_n) - f(x_{n-1}) ≈ 0 causing near-division-by-zero', 'Using a tight tolerance', 'The root being simple'],
    correct: 1,
    explanation: 'When two consecutive iterates have nearly equal function values, the denominator f(x_n)-f(x_{n-1}) ≈ 0 and the step size becomes unreliable.',
  },
]

const LAGRANGE: QuizQuestion[] = [
  {
    id: 'la1',
    question: 'If you have n+1 data points, what is the degree of the Lagrange interpolating polynomial?',
    options: ['n+1', 'n', 'n-1', '2n'],
    correct: 1,
    explanation: 'n+1 points determine a unique polynomial of degree at most n. This is the fundamental theorem of polynomial interpolation.',
  },
  {
    id: 'la2',
    question: 'Does the Lagrange polynomial pass through all given data points?',
    options: ['No — it minimizes the sum of squared errors', 'Yes — by construction it passes through every data point exactly', 'Only through the first and last points', 'Only if points are equally spaced'],
    correct: 1,
    explanation: 'Each Lagrange basis polynomial L_k(x_j) = δ_{kj}, so P(x_i) = y_i for all i. The polynomial interpolates exactly.',
  },
  {
    id: 'la3',
    question: 'What is Runge\'s phenomenon?',
    options: [
      'Quadratic convergence at the interval center',
      'Large oscillations near the endpoints of high-degree Lagrange polynomials on equally-spaced nodes',
      'Slow convergence for smooth functions',
      'Numerical instability only in divided differences',
    ],
    correct: 1,
    explanation: 'For functions like 1/(1+x²) on [-5,5], the degree-n Lagrange polynomial on equally-spaced nodes oscillates wildly near the endpoints as n increases.',
  },
  {
    id: 'la4',
    question: 'What is the computational cost of evaluating a Lagrange polynomial at one point for n+1 data points?',
    options: ['O(1)', 'O(log n)', 'O(n) multiplications', 'O(n²)'],
    correct: 2,
    explanation: 'Naïve evaluation of the Lagrange form loops over all n+1 basis polynomials, each requiring O(n) work: total O(n²). With precomputed barycentric weights, evaluation is O(n).',
  },
  {
    id: 'la5',
    question: 'Which statement about Lagrange interpolation is true?',
    options: [
      'It is always more accurate than cubic spline for large n',
      'A unique polynomial of degree ≤ n passes through any n+1 distinct points',
      'It requires equally-spaced nodes',
      'It cannot reproduce polynomials of degree < n exactly',
    ],
    correct: 1,
    explanation: 'Uniqueness is guaranteed by the Vandermonde argument: the n+1 coefficients are uniquely determined by n+1 interpolation conditions at distinct points.',
  },
]

const CUBIC_SPLINE: QuizQuestion[] = [
  {
    id: 'cs1',
    question: 'What degree polynomial is used in each segment of a cubic spline?',
    options: ['Linear (degree 1)', 'Quadratic (degree 2)', 'Cubic (degree 3)', 'Quartic (degree 4)'],
    correct: 2,
    explanation: 'A cubic spline uses a degree-3 polynomial S_i(x) = a_i + b_i(x-x_i) + c_i(x-x_i)² + d_i(x-x_i)³ on each interval [x_i, x_{i+1}].',
  },
  {
    id: 'cs2',
    question: 'What continuity conditions does a cubic spline satisfy at interior knots?',
    options: ['C⁰ only (no derivative continuity)', 'C¹ — value and first derivative continuous', 'C² — value, first, and second derivative continuous', 'C³ — all three derivatives continuous'],
    correct: 2,
    explanation: 'Cubic splines are C²: values, first derivatives, and second derivatives agree at every interior knot, giving a visually smooth curve with no kinks.',
  },
  {
    id: 'cs3',
    question: 'What boundary condition does a "natural" cubic spline impose?',
    options: ['f\'(a) = f\'(b) = 0', 'f\'\'(a) = f\'\'(b) = 0', 'f(a) = f(b) = 0', 'f\'\'\'(a) = f\'\'\'(b) = 0'],
    correct: 1,
    explanation: 'The natural (free-end) boundary condition sets the second derivative to zero at both endpoints, minimizing the bending energy of the spline.',
  },
  {
    id: 'cs4',
    question: 'Why is cubic spline preferred over high-degree Lagrange for many data points?',
    options: [
      'It is always faster to evaluate',
      'It avoids Runge\'s phenomenon because it is piecewise and local',
      'It requires fewer data points to define',
      'It does not need to solve any linear system',
    ],
    correct: 1,
    explanation: 'Cubic spline uses low-degree (degree 3) polynomials locally. Oscillations cannot propagate across segment boundaries, so Runge\'s phenomenon does not occur.',
  },
  {
    id: 'cs5',
    question: 'For n+1 data points, how many cubic spline segments are there?',
    options: ['n+1', 'n-1', 'n', '2n'],
    correct: 2,
    explanation: 'n+1 points define n intervals, hence n cubic segments. Each segment has 4 coefficients (a, b, c, d), giving 4n unknowns to solve.',
  },
]

const FORWARD_DIFF: QuizQuestion[] = [
  {
    id: 'fd1',
    question: 'What is the forward difference formula for f\'(x)?',
    options: [
      '[f(x) − f(x−h)] / h',
      '[f(x+h) − f(x−h)] / (2h)',
      '[f(x+h) − f(x)] / h',
      '[f(x+h) + f(x)] / h',
    ],
    correct: 2,
    explanation: 'Forward difference uses f at x and x+h: f\'(x) ≈ [f(x+h) − f(x)] / h. It is derived from the first-order Taylor expansion.',
  },
  {
    id: 'fd2',
    question: 'What is the truncation error order of forward difference?',
    options: ['O(h²)', 'O(h)', 'O(h³)', 'O(1/h)'],
    correct: 1,
    explanation: 'The Taylor expansion gives f(x+h) = f(x) + hf\'(x) + h²f\'\'(x)/2 + … so the leading truncation error is h f\'\'(x)/2 — first order O(h).',
  },
  {
    id: 'fd3',
    question: 'Approximately what is the optimal step size h for forward difference in float64?',
    options: ['h = 1', 'h ≈ 10⁻⁵', 'h ≈ 10⁻⁸', 'h → 0 (machine zero)'],
    correct: 2,
    explanation: 'Total error = truncation (∝ h) + round-off (∝ ε/h). Minimizing gives h* ≈ √(2ε) ≈ 2×10⁻⁸ for float64 (ε ≈ 2.2×10⁻¹⁶).',
  },
  {
    id: 'fd4',
    question: 'What happens to round-off error as h decreases past the optimal h*?',
    options: ['Round-off error also decreases proportionally', 'Round-off error increases due to catastrophic cancellation', 'Round-off error stays constant', 'Round-off error becomes negative'],
    correct: 1,
    explanation: 'f(x+h) and f(x) become nearly equal for tiny h. Their difference loses significant bits — catastrophic cancellation amplifies the floating-point error in the numerator.',
  },
  {
    id: 'fd5',
    question: 'Which term in the Taylor expansion of f(x+h) gives the truncation error of forward difference?',
    options: ['The hf\'(x) term', 'The h²f\'\'(x)/2 term — error ≈ h|f\'\'(x)|/2', 'The h³f\'\'\'(x)/6 term', 'The constant f(x) term'],
    correct: 1,
    explanation: 'After dividing [f(x+h)−f(x)]/h = f\'(x) + hf\'\'(x)/2 + …, the leading error is hf\'\'(x)/2 = O(h).',
  },
]

const BACKWARD_DIFF: QuizQuestion[] = [
  {
    id: 'bd1',
    question: 'What is the backward difference formula for f\'(x)?',
    options: [
      '[f(x+h) − f(x)] / h',
      '[f(x) − f(x−h)] / h',
      '[f(x+h) − f(x−h)] / (2h)',
      '[f(x+h) − f(x)] / (2h)',
    ],
    correct: 1,
    explanation: 'Backward difference: f\'(x) ≈ [f(x) − f(x−h)] / h. It uses f at x and the prior point x−h.',
  },
  {
    id: 'bd2',
    question: 'How does backward difference compare to forward difference in accuracy?',
    options: [
      'Backward is O(h²); forward is O(h)',
      'Both are O(h) — same convergence order',
      'Forward is O(h²); backward is O(h)',
      'Backward is more accurate for any h > 0',
    ],
    correct: 1,
    explanation: 'Both forward and backward difference have truncation error O(h). The difference is the sign of the bias: forward adds +h f\'\'(x)/2, backward subtracts −h f\'\'(x)/2.',
  },
  {
    id: 'bd3',
    question: 'What is the sign of the leading truncation error for backward difference?',
    options: ['Positive: +h f\'\'(x) / 2', 'Negative: −h f\'\'(x) / 2', 'Zero — backward difference is exact', 'Depends on h alone'],
    correct: 1,
    explanation: 'From the Taylor expansion: [f(x)−f(x−h)]/h = f\'(x) − hf\'\'(x)/2 + O(h²). The leading error is −hf\'\'(x)/2 — opposite sign to forward difference.',
  },
  {
    id: 'bd4',
    question: 'When is backward difference preferred over central difference?',
    options: [
      'When maximum accuracy is required at interior points',
      'When the function is non-smooth',
      'In causal real-time systems where the future value f(x+h) is unavailable',
      'When working with equally-spaced grids',
    ],
    correct: 2,
    explanation: 'Central difference needs f(x+h) — a "future" sample. Real-time controllers and causal digital filters can only use past values, so backward difference is the appropriate choice.',
  },
  {
    id: 'bd5',
    question: 'Which ODE time-stepping method is closely related to the backward difference formula?',
    options: ['Explicit Euler method', 'Adams–Bashforth 2-step', 'Implicit backward Euler method', 'Runge–Kutta 4'],
    correct: 2,
    explanation: 'The backward (implicit) Euler method: y_{n+1} = y_n + h f(t_{n+1}, y_{n+1}), uses the backward difference approximation to dy/dt at t_{n+1}.',
  },
]

const CENTRAL_DIFF: QuizQuestion[] = [
  {
    id: 'cd1',
    question: 'What is the central difference formula for f\'(x)?',
    options: [
      '[f(x+h) − f(x)] / h',
      '[f(x) − f(x−h)] / h',
      '[f(x+h) − f(x−h)] / (2h)',
      '[f(x+2h) − f(x−2h)] / (4h)',
    ],
    correct: 2,
    explanation: 'Central difference: f\'(x) ≈ [f(x+h) − f(x−h)] / (2h). Symmetry around x cancels the O(h) error term.',
  },
  {
    id: 'cd2',
    question: 'Why does central difference achieve O(h²) while forward/backward achieve O(h)?',
    options: [
      'It uses a smaller step size h',
      'The O(h) error terms from the two Taylor expansions have opposite signs and cancel exactly',
      'It evaluates f at three points instead of two',
      'It divides by 2h which inherently reduces error',
    ],
    correct: 1,
    explanation: 'f(x+h) − f(x−h) = 2hf\'(x) + h³f\'\'\'(x)/3 + …. The h²f\'\'(x) term cancels because it appears with the same sign in both expansions. Dividing by 2h gives O(h²).',
  },
  {
    id: 'cd3',
    question: 'What is the optimal step size h* for central difference in float64?',
    options: ['h ≈ 10⁻⁸', 'h ≈ 10⁻¹⁵', 'h ≈ 10⁻⁵', 'h = 1'],
    correct: 2,
    explanation: 'For central difference: h* ≈ (3ε)^(1/3) ≈ 10⁻⁵. This is much larger than forward/backward optimal h ≈ 10⁻⁸, making central difference more round-off robust.',
  },
  {
    id: 'cd4',
    question: 'When should central difference NOT be used?',
    options: [
      'For smooth functions at interior points',
      'At boundary points where f(x−h) lies outside the domain',
      'When h > 0.1',
      'For periodic functions',
    ],
    correct: 1,
    explanation: 'Central difference needs both f(x+h) and f(x−h). At the left boundary x=a, f(a−h) is outside the domain. Use forward difference at left boundaries and backward at right boundaries.',
  },
  {
    id: 'cd5',
    question: 'Halving h in central difference reduces the approximation error by approximately what factor?',
    options: ['2× (error halves)', '4× (error quarters)', '8× (error eighths)', 'No change — h doesn\'t affect error'],
    correct: 1,
    explanation: 'Central difference error ∝ h². Halving h: (h/2)² = h²/4. Error quarters. This quadratic convergence distinguishes central from the linear convergence of forward/backward.',
  },
]

const TRAPEZOIDAL: QuizQuestion[] = [
  {
    id: 'tr1',
    question: 'What is the global error order of the composite trapezoidal rule?',
    options: ['O(h)', 'O(h²)', 'O(h⁴)', 'O(h³)'],
    correct: 1,
    explanation: 'The composite trapezoidal rule has O(h²) global error: doubling the number of subintervals n reduces the error by a factor of 4.',
  },
  {
    id: 'tr2',
    question: 'For the trapezoidal rule with n subintervals, how many function evaluations are needed?',
    options: ['n', 'n−1', 'n+1', '2n'],
    correct: 2,
    explanation: 'n subintervals have n+1 endpoints (x₀, x₁, ..., xₙ), each requiring one function evaluation.',
  },
  {
    id: 'tr3',
    question: 'The trapezoidal rule is exact for which type of functions?',
    options: ['Constant functions only', 'Quadratic polynomials', 'Linear polynomials (degree ≤ 1)', 'Cubic polynomials'],
    correct: 2,
    explanation: "The trapezoidal rule fits a line through each pair of points. A line integrates exactly. For degree ≤ 1, there's no approximation error.",
  },
  {
    id: 'tr4',
    question: 'What does the error bound |E| ≤ (b−a)h²|f\'\'|_max/12 tell us?',
    options: ['Error depends on the fourth derivative', 'Larger curvature (|f\'\'|_max) means larger error', 'Error is independent of h', 'Smaller h always causes larger error'],
    correct: 1,
    explanation: 'The factor |f\'\'|_max is the maximum absolute curvature of f on [a,b]. Highly curved functions require more subintervals to achieve the same accuracy.',
  },
  {
    id: 'tr5',
    question: 'Which integrand type gives the trapezoidal rule spectral (exponential) convergence?',
    options: ['Functions with discontinuities', 'Periodic functions integrated over a full period', 'Polynomials of any degree', 'Functions with large derivatives'],
    correct: 1,
    explanation: 'For periodic functions on full periods, the Euler–Maclaurin formula shows all error terms cancel — giving exponential convergence, faster than any polynomial method.',
  },
]

const SIMPSONS_QUIZ: QuizQuestion[] = [
  {
    id: 'si1',
    question: "What geometric shape does Simpson's 1/3 rule fit to approximate the integrand?",
    options: ['A straight line (linear)', 'A parabola (quadratic polynomial)', 'A cubic polynomial', 'A trapezoid'],
    correct: 1,
    explanation: "Simpson's 1/3 rule fits a parabola through every three consecutive points (x₀, x₁, x₂) and integrates it analytically, achieving O(h⁴) accuracy.",
  },
  {
    id: 'si2',
    question: "Why must n be even in Simpson's 1/3 rule?",
    options: ['To make the formula symmetric', 'Each parabola spans 2 subintervals, requiring subintervals to pair up', 'To prevent round-off errors', 'The formula only applies to even-dimensional problems'],
    correct: 1,
    explanation: "Each parabolic arc covers two subintervals (3 points). You cannot have an unpaired last subinterval — hence n must be even.",
  },
  {
    id: 'si3',
    question: "What is the global error order of Simpson's 1/3 rule?",
    options: ['O(h²)', 'O(h³)', 'O(h⁴)', 'O(h⁵)'],
    correct: 2,
    explanation: "Simpson's rule has O(h⁴) global error: doubling n reduces error by 16×. This is much more efficient than trapezoidal O(h²) for smooth functions.",
  },
  {
    id: 'si4',
    question: "What is the weight pattern in Simpson's composite rule?",
    options: ['1:2:2:2:...:2:1', '1:4:4:4:...:4:1', '1:4:2:4:2:...:4:1', '1:3:3:1 (repeated)'],
    correct: 2,
    explanation: "The weights alternate 1, 4, 2, 4, 2, ..., 4, 1 — first and last have weight 1, then alternate 4 and 2 for interior points.",
  },
  {
    id: 'si5',
    question: "Simpson's rule integrates which polynomial degrees exactly?",
    options: ['Degree ≤ 1 (linear)', 'Degree ≤ 2 (quadratic)', 'Degree ≤ 3 (cubic)', 'Degree ≤ 4 (quartic)'],
    correct: 2,
    explanation: "Simpson's fits a quadratic (degree 2) per pair of intervals — yet due to symmetry, the integration is exact for degree ≤ 3. This unexpected bonus is called 'superconvergence'.",
  },
]

const GAUSSIAN_QUAD: QuizQuestion[] = [
  {
    id: 'gq1',
    question: 'How many polynomials of degree ≤ 2n−1 can n-point Gauss quadrature integrate exactly?',
    options: ['All polynomials of degree ≤ n−1', 'All polynomials of degree ≤ n', 'All polynomials of degree ≤ 2n−1', 'All polynomials of any degree'],
    correct: 2,
    explanation: 'n Gauss points exactly integrate polynomials of degree ≤ 2n−1 by choosing optimal (non-uniform) node positions — twice the exactness of n-point Newton-Cotes (uniform) quadrature.',
  },
  {
    id: 'gq2',
    question: 'Where are the Gauss-Legendre nodes located on [-1, 1]?',
    options: ['Equally spaced', 'At the roots of the Legendre polynomial Pₙ(x)', 'At the Chebyshev points', 'At the endpoints ±1 only'],
    correct: 1,
    explanation: 'Gauss-Legendre nodes are the zeros of Pₙ(x). They cluster near the endpoints — where polynomial approximation error concentrates — giving optimal accuracy.',
  },
  {
    id: 'gq3',
    question: 'What scale factor must multiply the Gauss sum when integrating over [a, b] instead of [-1, 1]?',
    options: ['b − a', '(b − a)/2', '(a + b)/2', '2/(b − a)'],
    correct: 1,
    explanation: 'The change-of-variable x = ((b−a)t + (a+b))/2 introduces a Jacobian dx/dt = (b−a)/2. The integral ∫ₐᵇ f dx = (b−a)/2 × Σwᵢf(mapped xᵢ).',
  },
  {
    id: 'gq4',
    question: 'For smooth analytic functions, how does Gauss quadrature convergence compare to O(h⁴)?',
    options: ['Slower — algebraic convergence', 'Same — also O(h⁴)', 'Faster — exponential convergence in n', 'No convergence guarantee'],
    correct: 2,
    explanation: 'For analytic functions, Gauss quadrature converges exponentially: each additional point roughly doubles the correct digits — vastly outpacing any O(hᵖ) polynomial method.',
  },
  {
    id: 'gq5',
    question: 'In which scenario does Gaussian quadrature perform POORLY compared to the trapezoidal rule?',
    options: ['For smooth polynomials', 'For exponential functions', 'For periodic functions integrated over a full period', 'For linear functions'],
    correct: 2,
    explanation: 'For periodic functions on full periods, the trapezoidal rule achieves spectral convergence (exponential). Gauss quadrature has fixed nodes and cannot exploit the periodicity cancellation.',
  },
]

// ─── Linear Systems ───────────────────────────────────────────────────────────

const GAUSSIAN_ELIMINATION_QUIZ: QuizQuestion[] = [
  {
    id: 'ge1',
    question: 'What is the time complexity of Gaussian elimination for an n×n system?',
    options: ['O(n²)', 'O(n³/3)', 'O(n log n)', 'O(2ⁿ)'],
    correct: 1,
    explanation: 'Forward elimination requires ~n³/3 floating-point operations (flops), making it O(n³). For n=100, that is ~333,000 flops.',
  },
  {
    id: 'ge2',
    question: 'Why is partial pivoting important in Gaussian elimination?',
    options: [
      'It speeds up the algorithm by reducing the number of steps',
      'It prevents division by zero and reduces round-off error magnification',
      'It ensures the system is diagonally dominant',
      'It finds multiple solutions simultaneously',
    ],
    correct: 1,
    explanation: 'Partial pivoting selects the largest available pivot, preventing catastrophic cancellation and division by a very small number (near-zero pivot) which would amplify round-off errors.',
  },
  {
    id: 'ge3',
    question: 'After forward elimination, in what form is the augmented matrix?',
    options: ['Diagonal', 'Lower triangular', 'Upper triangular [U|y]', 'Identity'],
    correct: 2,
    explanation: 'Forward elimination converts [A|b] to [U|y] where U is upper triangular. Back substitution then solves Ux=y starting from the last equation.',
  },
  {
    id: 'ge4',
    question: 'What is the multiplier mᵢₖ in the row operation Rᵢ ← Rᵢ − mᵢₖ·Rₖ?',
    options: ['mᵢₖ = aᵢₖ / aₖᵢ', 'mᵢₖ = aᵢₖ / aₖₖ', 'mᵢₖ = aₖₖ / aᵢₖ', 'mᵢₖ = aᵢᵢ / aₖₖ'],
    correct: 1,
    explanation: 'The multiplier mᵢₖ = aᵢₖ/aₖₖ is chosen so that subtracting mᵢₖ × (pivot row k) from row i zeroes out the entry aᵢₖ.',
  },
  {
    id: 'ge5',
    question: 'Gaussian elimination will FAIL if which condition occurs?',
    options: [
      'The system has more variables than equations',
      'A pivot element aₖₖ = 0 (zero pivot, no row swap available)',
      'The matrix is not symmetric',
      'The right-hand side b is non-zero',
    ],
    correct: 1,
    explanation: 'A zero pivot (after all possible row swaps) means the system is singular — either no solution or infinitely many. Without partial pivoting, even a near-zero pivot causes catastrophic numerical failure.',
  },
]

const GAUSS_SEIDEL_QUIZ: QuizQuestion[] = [
  {
    id: 'gs1',
    question: 'What is the key difference between Gauss-Seidel and Jacobi iterations?',
    options: [
      'Gauss-Seidel updates all components simultaneously; Jacobi updates them one at a time',
      'Gauss-Seidel immediately uses newly computed values in the same sweep; Jacobi uses only old values',
      'Gauss-Seidel requires diagonal dominance; Jacobi does not',
      'Gauss-Seidel solves direct systems; Jacobi is for optimization',
    ],
    correct: 1,
    explanation: 'In Gauss-Seidel, the updated x_i⁽ᵏ⁺¹⁾ is immediately used when computing x_{i+1}⁽ᵏ⁺¹⁾ in the same sweep. Jacobi completes the entire sweep using only old values x_j⁽ᵏ⁾.',
  },
  {
    id: 'gs2',
    question: 'A sufficient condition for Gauss-Seidel convergence is:',
    options: [
      'The matrix is orthogonal',
      'The matrix is strictly diagonally dominant: |aᵢᵢ| > Σⱼ≠ᵢ|aᵢⱼ|',
      'The system has a unique solution',
      'The matrix has all positive entries',
    ],
    correct: 1,
    explanation: 'Strict diagonal dominance (SDD) guarantees Gauss-Seidel converges for any starting vector. Symmetric positive definite (SPD) matrices also converge.',
  },
  {
    id: 'gs3',
    question: 'For a "consistently ordered" (e.g., tridiagonal) matrix, how do GS and Jacobi spectral radii compare?',
    options: [
      'ρ(M_GS) = ρ(M_J)',
      'ρ(M_GS) = ρ(M_J)²  — GS converges in roughly half the iterations',
      'ρ(M_GS) = ρ(M_J) / 2',
      'No relationship exists',
    ],
    correct: 1,
    explanation: 'For consistently ordered matrices (such as tridiagonals from FD discretizations), ρ(M_GS) = ρ(M_J)². Since ρ < 1, GS has a smaller spectral radius and converges in half as many iterations.',
  },
  {
    id: 'gs4',
    question: 'What stopping criterion is typically used for iterative methods like Gauss-Seidel?',
    options: [
      'Stop after exactly n² iterations',
      '‖x⁽ᵏ⁺¹⁾ − x⁽ᵏ⁾‖ / ‖x⁽ᵏ⁺¹⁾‖ < tolerance',
      'Stop when the determinant of A is computed',
      'Stop when the pivot equals 1',
    ],
    correct: 1,
    explanation: 'The relative change ‖x⁽ᵏ⁺¹⁾ − x⁽ᵏ⁾‖ / ‖x⁽ᵏ⁺¹⁾‖ < ε is a robust stopping criterion. The residual ‖Ax − b‖ < ε is also used when higher reliability is needed.',
  },
  {
    id: 'gs5',
    question: 'Gauss-Seidel applied to a 10,000-unknown FD heat equation: what is the MAIN advantage over direct Gaussian elimination?',
    options: [
      'Exact solution in fewer operations',
      'Only O(n) memory: stores only the sparse matrix and x vector',
      'No convergence condition required',
      'Can solve non-square systems',
    ],
    correct: 1,
    explanation: 'For large sparse systems (n=10⁴), Gaussian elimination needs O(n²) memory for the dense matrix — 800 MB for float64. GS stores only the nonzeros (O(nnz) ≈ O(5n) for tridiagonal), typically < 1 MB.',
  },
]

const JACOBI_QUIZ: QuizQuestion[] = [
  {
    id: 'j1',
    question: 'Why is Jacobi described as "fully parallel" while Gauss-Seidel is not?',
    options: [
      'Jacobi uses only old values to compute all x_i⁽ᵏ⁺¹⁾ simultaneously; no sequential dependency',
      'Jacobi requires fewer arithmetic operations per iteration',
      'Jacobi does not require matrix storage',
      'Jacobi is implemented in parallel programming languages',
    ],
    correct: 0,
    explanation: 'In Jacobi, every component x_i⁽ᵏ⁺¹⁾ = (bᵢ − Σⱼ≠ᵢ aᵢⱼxⱼ⁽ᵏ⁾)/aᵢᵢ depends only on OLD values. All n components can be computed independently and simultaneously — a perfectly parallel structure.',
  },
  {
    id: 'j2',
    question: 'What is the Jacobi iteration matrix M_J?',
    options: ['D⁻¹(L+U)', '−D⁻¹(L+U)', 'D(L+U)⁻¹', '(L+U)⁻¹D'],
    correct: 1,
    explanation: 'Splitting A = D + L + U gives the fixed-point iteration x⁽ᵏ⁺¹⁾ = D⁻¹b − D⁻¹(L+U)x⁽ᵏ⁾. The iteration matrix is M_J = −D⁻¹(L+U). Convergence requires ρ(M_J) < 1.',
  },
  {
    id: 'j3',
    question: 'A system is NOT strictly diagonally dominant. Which statement is correct for Jacobi?',
    options: [
      'Jacobi definitely converges — SDD is only sufficient, not necessary',
      'Jacobi definitely diverges',
      'Jacobi may or may not converge depending on ρ(M_J)',
      'Jacobi converges but Gauss-Seidel does not',
    ],
    correct: 2,
    explanation: 'SDD is sufficient for convergence but not necessary. Convergence depends on the spectral radius ρ(M_J). Non-SDD systems with ρ(M_J) < 1 still converge; those with ρ(M_J) ≥ 1 diverge.',
  },
  {
    id: 'j4',
    question: 'Jacobi requires storing two x vectors while Gauss-Seidel requires one. Why?',
    options: [
      'Jacobi has higher accuracy, requiring more memory',
      'Jacobi must keep x⁽ᵏ⁾ intact until ALL x_i⁽ᵏ⁺¹⁾ are computed; writing in-place would create Gauss-Seidel',
      'Jacobi is a second-order method needing two prior iterates',
      'One vector is for the matrix and one for the right-hand side',
    ],
    correct: 1,
    explanation: 'If you update x[i] in-place during the sweep, later components use the new x[i] — that is Gauss-Seidel. Jacobi requires a separate x_new array so all components see only x⁽ᵏ⁾.',
  },
  {
    id: 'j5',
    question: 'For a GPU with 1000 cores solving a 10,000-unknown SDD system where Jacobi needs 2× the iterations of Gauss-Seidel (serial): which is faster wall-clock?',
    options: [
      'Gauss-Seidel: fewer iterations always wins',
      'Jacobi on GPU: 2× iterations × (1/1000) parallel speedup = 1/500 of serial GS time',
      'Both take exactly the same time',
      'Neither can be accelerated by parallelism',
    ],
    correct: 1,
    explanation: 'With 1000 GPU cores, each Jacobi iteration costs 1/1000 of serial time. Total: 2k × (T/1000) = 2kT/1000 vs serial GS k × T. GPU Jacobi is 500× faster wall-clock — parallelism vastly outweighs the 2× iteration penalty.',
  },
]

// ─── Quiz registry: lesson path → questions ───────────────────────────────────

// ─── LU Decomposition ─────────────────────────────────────────────────────────

const LU_QUIZ: QuizQuestion[] = [
  {
    id: 'lu1',
    question: 'What is the key advantage of LU decomposition over running Gaussian elimination each time?',
    options: [
      'LU is more numerically stable than Gaussian elimination',
      'The O(n³) factorization is paid once; each additional right-hand side costs only O(n²)',
      'LU requires less memory than Gaussian elimination',
      'LU works on singular matrices that Gaussian elimination cannot handle',
    ],
    correct: 1,
    explanation: 'After the O(n³) LU factorization, solving for each new b costs only O(n²) via two triangular substitutions. For k right-hand sides, total cost is O(n³) + k·O(n²) vs k·O(n³) for repeated GE.',
  },
  {
    id: 'lu2',
    question: 'In the factorization PA = LU, what does the permutation matrix P represent?',
    options: [
      'A matrix of partial derivatives',
      'The row swap history from partial pivoting',
      'A projection onto the column space of A',
      'The product of all elimination multipliers',
    ],
    correct: 1,
    explanation: 'Partial pivoting swaps rows to place the largest available pivot on the diagonal. P records these swaps. When solving, b must be permuted first: solve Ly = Pb, then Ux = y.',
  },
  {
    id: 'lu3',
    question: 'What is stored in the lower-triangular part of L (below the diagonal)?',
    options: [
      'The original entries of A',
      'The elimination multipliers mᵢₖ = aᵢₖ/aₖₖ',
      'The eigenvalues of A',
      'The back-substitution coefficients',
    ],
    correct: 1,
    explanation: 'L stores the multipliers used in Gaussian elimination. L[i][k] = mᵢₖ = aᵢₖ/aₖₖ. The diagonal of L is all 1s (unit lower-triangular). U is exactly the upper-triangular result of elimination.',
  },
  {
    id: 'lu4',
    question: 'How is det(A) computed efficiently from the LU factorization?',
    options: [
      'det(A) = det(L) + det(U)',
      'det(A) = det(L) × det(U) = (±1) × Π uᵢᵢ',
      'det(A) = trace(L) × trace(U)',
      'det(A) must be computed separately by cofactor expansion',
    ],
    correct: 1,
    explanation: 'det(L) = 1 (unit lower-triangular), so det(A) = det(U) = product of diagonal entries of U, with sign determined by the number of row swaps in P.',
  },
  {
    id: 'lu5',
    question: 'LU decomposition is NOT recommended for which scenario?',
    options: [
      'Solving Ax=b for multiple b vectors with the same A',
      'Computing the matrix inverse A⁻¹',
      'Very large sparse systems (n > 10⁵) where fill-in creates a dense L,U',
      'Computing det(A)',
    ],
    correct: 2,
    explanation: 'LU fill-in: zeros in sparse A may become nonzeros in L and U. For a sparse tridiagonal 10⁶×10⁶ system, dense LU requires ~10¹² stored values (terabytes). Use sparse direct (UMFPACK, MUMPS) or iterative methods instead.',
  },
]

const CHOLESKY_QUIZ: QuizQuestion[] = [
  {
    id: 'ch1',
    question: 'For which class of matrices is Cholesky decomposition guaranteed to exist?',
    options: [
      'Any square invertible matrix',
      'Symmetric positive-definite (SPD) matrices only',
      'Upper-triangular matrices',
      'Diagonally dominant matrices',
    ],
    correct: 1,
    explanation: 'Cholesky decomposition A = LLᵀ exists and is unique if and only if A is symmetric positive-definite (xᵀAx > 0 for all non-zero x).',
  },
  {
    id: 'ch2',
    question: 'Why is Cholesky approximately 2× faster than LU for SPD matrices?',
    options: [
      'Cholesky uses integer arithmetic',
      'Cholesky exploits symmetry: U = Lᵀ, so only n²/2 entries need computation vs n² for LU',
      'Cholesky avoids pivoting entirely by using a special row ordering',
      'Cholesky works on smaller sub-matrices',
    ],
    correct: 1,
    explanation: 'Since A = Aᵀ, Cholesky uses U = Lᵀ — no separate U computation needed. This cuts the flop count from n³/3 (LU) to n³/6 (Cholesky), a factor-of-2 improvement.',
  },
  {
    id: 'ch3',
    question: 'What happens if Cholesky encounters a negative value under the square root during factorization?',
    options: [
      'The algorithm continues with a complex number',
      'This certifies that A is NOT positive-definite; the factorization fails',
      'Cholesky automatically switches to LU decomposition',
      'The matrix is reordered to fix the negative value',
    ],
    correct: 1,
    explanation: 'A negative value under the square root means a₁₁ − Σl²₁ₖ < 0, which contradicts A being positive-definite. Cholesky failure is a definitive certificate: A is not SPD.',
  },
  {
    id: 'ch4',
    question: 'Why should Cholesky NOT be used to solve least-squares problems when A is very ill-conditioned?',
    options: [
      'Cholesky requires symmetric A and least-squares A is always rectangular',
      'Forming the normal equations Aᵀ·A squares the condition number: κ(AᵀA) = κ(A)²',
      'Cholesky cannot handle overdetermined systems',
      'The Gram matrix AᵀA is never positive-definite',
    ],
    correct: 1,
    explanation: 'If κ(A) = 10⁶, then κ(AᵀA) = 10¹², which causes 12 digits of precision loss in float64 (which has only 16). Use QR decomposition instead for ill-conditioned least-squares problems.',
  },
  {
    id: 'ch5',
    question: 'In machine learning, Cholesky is used to generate correlated Gaussian samples via z = L·w where w ~ N(0,I). What is L?',
    options: [
      'The eigendecomposition of the covariance matrix Σ',
      'The Cholesky factor of the covariance matrix: Σ = LLᵀ',
      'The inverse of the covariance matrix',
      'A random orthogonal matrix',
    ],
    correct: 1,
    explanation: 'If w ~ N(0,I) and L = chol(Σ), then z = Lw has covariance E[zzᵀ] = L·E[wwᵀ]·Lᵀ = L·I·Lᵀ = Σ. Cholesky is the standard method for generating correlated multivariate normals.',
  },
]

// ─── Root Finding (Fixed Point) ───────────────────────────────────────────────

const FIXED_POINT_QUIZ: QuizQuestion[] = [
  {
    id: 'fp1',
    question: 'Fixed-point iteration converges when:',
    options: ['|g(x*)| < 1', '|g\'(x*)| < 1 (the derivative of g at the fixed point is less than 1)', 'g(x₀) = 0', 'f\'(x*) ≠ 0'],
    correct: 1,
    explanation: 'The Banach contraction condition: if |g\'(x*)| < 1, the iteration contracts toward x*. If |g\'| > 1, the iteration diverges exponentially.',
  },
  {
    id: 'fp2',
    question: 'For x³ − x − 2 = 0, which rearrangement g(x) CONVERGES near x*≈1.52?',
    options: ['g(x) = x³ − 2 (|g\'|≈6.9)', 'g(x) = (x+2)^{1/3} (|g\'|≈0.12)', 'g(x) = √(x+2) (not an inverse)', 'g(x) = 1 + 2/x² (unstable at x*)'],
    correct: 1,
    explanation: '|g\'| = |d/dx(x+2)^{1/3}| = (1/3)(x+2)^{-2/3} ≈ 0.12 at x=1.52 → convergent. g(x) = x³−2 gives |g\'| = 3x² ≈ 6.9 → divergent.',
  },
  {
    id: 'fp3',
    question: 'Fixed-point iteration has what convergence ORDER?',
    options: ['Quadratic (order 2)', 'Cubic (order 3)', 'Linear (order 1) with rate |g\'(x*)|', 'Superlinear (order 1.618)'],
    correct: 2,
    explanation: 'Fixed-point iteration is first-order: |eₙ₊₁| ≤ k|eₙ| where k = |g\'(x*)|. Newton\'s method is the special case g\'(x*) = 0, giving quadratic convergence.',
  },
  {
    id: 'fp4',
    question: 'Newton\'s method x_{n+1} = x_n − f(x_n)/f\'(x_n) is a fixed-point iteration with:',
    options: ['g(x) = x − f(x)', 'g(x) = x − f(x)/f\'(x), and g\'(x*) = 0', 'g(x) = f(x)/f\'(x)', "g(x) = x·f'(x)"],
    correct: 1,
    explanation: "Newton's method is fixed-point iteration with g(x) = x − f(x)/f'(x). At x*, g'(x*) = 0 (by the formula for g'), which is why Newton converges quadratically — the contraction rate is 0.",
  },
  {
    id: 'fp5',
    question: 'With |g\'(x*)| = 0.5 and initial error |x₀ − x*| = 1, how many iterations for error < 10⁻⁶?',
    options: ['About 5', 'About 10', 'About 20', 'About 40'],
    correct: 2,
    explanation: 'Error after n steps ≤ (0.5)ⁿ. Solve (0.5)ⁿ < 10⁻⁶: n > 6/log₂(10) ... wait: n log(0.5) < −6 log(10) → n > 6 log(10)/log(2) ≈ 19.9. About 20 iterations.',
  },
]

// ─── Interpolation (Newton Divided Diff) ──────────────────────────────────────

const NEWTON_DD_QUIZ: QuizQuestion[] = [
  {
    id: 'ndd1',
    question: 'What is the zeroth divided difference [yₖ]?',
    options: ['(yₖ₊₁ − yₖ)/(xₖ₊₁ − xₖ)', 'yₖ = f(xₖ)', 'The leading coefficient of pₙ(x)', 'Zero for all k'],
    correct: 1,
    explanation: 'The zeroth divided difference is simply the function value: [yₖ] = f(xₖ). Higher-order divided differences are built recursively from this base case.',
  },
  {
    id: 'ndd2',
    question: 'What is the key computational advantage of Newton divided differences over Lagrange?',
    options: [
      'Newton\'s polynomial is of lower degree',
      'Adding one new data point requires only O(n) work (update one table column)',
      'Newton evaluates the polynomial faster at query points',
      'Newton avoids the Runge phenomenon',
    ],
    correct: 1,
    explanation: 'Newton\'s form is incremental: adding the (n+1)-th point xₙ₊₁ requires computing only one new divided difference per existing point = O(n) work. Lagrange requires rebuilding all n+1 basis polynomials = O(n²).',
  },
  {
    id: 'ndd3',
    question: 'If data comes from a polynomial of degree 2, what do the 3rd-order divided differences equal?',
    options: ['Some large constant', '0 — divided differences of order > degree are zero', 'The leading coefficient', '1/(n+1)'],
    correct: 1,
    explanation: 'Divided differences of degree k of a polynomial of degree m < k are zero. This is a useful check: if the 3rd-order differences are all ≈ 0, the data fits a quadratic polynomial.',
  },
  {
    id: 'ndd4',
    question: 'Newton divided differences and Lagrange interpolation produce:',
    options: ['Different polynomials (Newton is degree n−1)', 'The same unique interpolating polynomial, just expressed differently', 'Newton\'s polynomial has lower degree', 'Lagrange is more accurate for non-uniform spacing'],
    correct: 1,
    explanation: 'There is a unique polynomial of degree ≤ n passing through n+1 distinct data points. Both Newton and Lagrange find THIS same polynomial — they are just different representations (bases) of the same object.',
  },
  {
    id: 'ndd5',
    question: 'The Runge phenomenon occurs when:',
    options: [
      'The divided difference table has negative entries',
      'High-degree polynomial interpolation with equidistant nodes causes oscillations near endpoints',
      'Two data points have the same x value',
      'The interpolating polynomial degree exceeds the data count',
    ],
    correct: 1,
    explanation: 'Runge (1901) showed f(x) = 1/(1+25x²) interpolated with equidistant nodes diverges near x=±1 as n→∞. Fix: use Chebyshev nodes which minimize the product |∏(x−xₖ)|.',
  },
]

// ─── Differentiation (Richardson) ─────────────────────────────────────────────

const RICHARDSON_QUIZ: QuizQuestion[] = [
  {
    id: 'ri1',
    question: 'Richardson extrapolation achieves O(h⁴) accuracy by:',
    options: [
      'Using more function evaluations than central difference',
      'Combining D(h) and D(h/2) to cancel the leading O(h²) error term',
      'Choosing a smaller h than central difference',
      'Using a higher-order Taylor expansion at each point',
    ],
    correct: 1,
    explanation: 'Richardson writes D(h) = L + a₁h² + a₂h⁴ + … and D(h/2) = L + a₁h²/4 + … Computing (4D(h/2)−D(h))/3 cancels the a₁h² term, leaving error O(h⁴) — no extra function evaluations needed.',
  },
  {
    id: 'ri2',
    question: 'The Richardson formula R = (4D(h/2) − D(h)) / 3 uses weight 4 because:',
    options: ['4 is a convenient round number', '2² = 4: the leading error in D(h) is a₁h² and in D(h/2) is a₁h²/4; multiply by 4 to match magnitudes', 'Four function evaluations are needed', 'The 4th-order polynomial approximation requires coefficient 4'],
    correct: 1,
    explanation: 'To eliminate a₁h²: 4×D(h/2) = 4L + a₁h² + … Subtract D(h) = L + a₁h² + … → 3L = 4D(h/2) − D(h) + O(h⁴). Divide by 3 → R = L + O(h⁴). The 4 comes from 2² = 4 (halving h).',
  },
  {
    id: 'ri3',
    question: 'Richardson extrapolation applied to the trapezoidal rule produces:',
    options: ['Romberg integration — achieving O(h^{2k}) for k extrapolation levels', "Simpson's rule at level 1 only", 'Gaussian quadrature', 'The midpoint rule'],
    correct: 0,
    explanation: "Richardson of trapezoidal gives Romberg integration. Level 1 = Simpson's (O(h⁴)), Level 2 = Boole's rule (O(h⁶)), and so on. The Romberg table is exactly the Richardson table applied to T(h).",
  },
  {
    id: 'ri4',
    question: 'When does Richardson extrapolation FAIL to improve accuracy?',
    options: [
      'When h is too large (truncation error dominates)',
      'When h is too small and floating-point roundoff in D(h) and D(h/2) dominates the difference',
      'For functions with discontinuous second derivatives',
      'When using forward difference instead of central difference',
    ],
    correct: 1,
    explanation: 'For very small h, D(h) ≈ D(h/2) ≈ L and their difference is dominated by rounding errors, not the mathematical correction. Richardson amplifies this noise. Optimal h ≈ ε_mach^{1/4} ≈ 10⁻⁴.',
  },
  {
    id: 'ri5',
    question: 'In CFD, Richardson extrapolation is used to estimate:',
    options: [
      'The mesh Reynolds number',
      'The grid-converged solution from coarse and fine mesh results',
      'The time step for explicit solvers',
      'The boundary condition error',
    ],
    correct: 1,
    explanation: 'Given solutions at mesh size h and h/2, Richardson extrapolation estimates the h→0 (exact) value. This is the Grid Convergence Index (GCI) method recommended by ASME and AIAA for CFD validation.',
  },
]

// ─── ODE ──────────────────────────────────────────────────────────────────────

const EULER_QUIZ: QuizQuestion[] = [
  {
    id: 'eu1',
    question: "Euler's method is derived from which mathematical concept?",
    options: ['Simpson\'s rule for integration', 'First-order Taylor expansion: y(x+h) ≈ y(x) + h·y\'(x)', 'Runge\'s 1895 paper on interpolation', 'Finite element method'],
    correct: 1,
    explanation: "Euler's method truncates the Taylor series after the first derivative term, giving y_{n+1} = y_n + h·f(x_n, y_n). The dropped term h²y''/2 is the local truncation error.",
  },
  {
    id: 'eu2',
    question: "What is Euler's method's global error order?",
    options: ['O(h²) — second order', 'O(h) — first order', 'O(h³)', 'O(1/n) where n is the number of steps'],
    correct: 1,
    explanation: "Euler's local truncation error is O(h²) per step. Over N = (b−a)/h steps, errors accumulate to O(h²/h) = O(h) globally. Halving h halves the global error.",
  },
  {
    id: 'eu3',
    question: "For y' = λy (λ < 0), Euler's method is stable when:",
    options: ['h < 1/|λ|', 'h|λ| ≤ 2', 'h can be any positive value', 'λ > 0 only'],
    correct: 1,
    explanation: "Euler applied to y'=λy gives y_{n+1} = (1+hλ)·y_n. For stability: |1+hλ| ≤ 1 → h|λ| ≤ 2. For stiff ODEs with large |λ|, the required h is very small.",
  },
  {
    id: 'eu4',
    question: 'Applied to the harmonic oscillator y\'\'=−y, explicit Euler will:',
    options: ['Exactly conserve energy', 'Show amplitude growth — Euler adds energy each step', 'Dampen the oscillation to zero', 'Produce a stationary solution'],
    correct: 1,
    explanation: "Explicit Euler is not symplectic: it does not conserve the Hamiltonian. The amplitude grows each period because the numerical method adds energy. Symplectic Euler (semi-implicit) avoids this.",
  },
  {
    id: 'eu5',
    question: "What is the LOCAL truncation error of Euler's method per step?",
    options: ['O(h)', 'O(h²)', 'O(h³)', 'O(h⁴)'],
    correct: 1,
    explanation: "The local truncation error at each step is (h²/2)·y''(ξ) = O(h²). This is the error introduced in a SINGLE step. The GLOBAL error is O(h) = O(h²) × O(1/h steps).",
  },
]

const RK4_QUIZ: QuizQuestion[] = [
  {
    id: 'rk1',
    question: 'How many function evaluations does RK4 require per step?',
    options: ['1', '2', '4', '6'],
    correct: 2,
    explanation: 'RK4 computes k₁ = f(xₙ, yₙ), k₂ = f(xₙ+h/2, ...), k₃ = f(xₙ+h/2, ...), k₄ = f(xₙ+h, ...) — four evaluations per step. The weighted average (1/6, 1/3, 1/3, 1/6) achieves 4th-order accuracy.',
  },
  {
    id: 'rk2',
    question: 'What is the global error order of RK4?',
    options: ['O(h)', 'O(h²)', 'O(h³)', 'O(h⁴)'],
    correct: 3,
    explanation: "RK4's local truncation error is O(h⁵) per step. Over N=1/h steps: global error = O(h⁵)/h = O(h⁴). Halving h reduces global error by 2⁴ = 16. This is why RK4 is dramatically more accurate than Euler.",
  },
  {
    id: 'rk3',
    question: 'In the RK4 formula, the stage k₃ uses:',
    options: ['The slope at xₙ', 'The midpoint estimate using k₁ to reach the midpoint', 'The midpoint estimate using k₂ to reach the midpoint', 'The slope at xₙ₊₁'],
    correct: 2,
    explanation: 'k₃ = f(xₙ + h/2, yₙ + h/2·k₂) — it uses k₂ (not k₁) to reach the midpoint. This second midpoint estimate is more accurate than k₂ and contributes to the 4th-order accuracy.',
  },
  {
    id: 'rk4',
    question: 'For which type of problem is RK4 NOT the right choice?',
    options: ['Smooth non-stiff ODEs', 'Orbital mechanics simulations', 'Stiff ODEs with widely separated eigenvalues (e.g., |λ_max|/|λ_min| >> 1)', 'Chemical kinetics with moderate rate constants'],
    correct: 2,
    explanation: "For stiff ODEs, RK4 requires h < 2.8/|λ_max| for stability. With large |λ_max|, this means extremely small steps — wasteful since the slow dynamics don't need them. Use implicit methods (BDF, Radau) instead.",
  },
  {
    id: 'rk5',
    question: 'RK4 with h=0.5 gives global error ε. With h=0.25, expected error is approximately:',
    options: ['ε/2 (first order)', 'ε/4 (second order)', 'ε/16 (fourth order)', 'ε/8 (third order)'],
    correct: 2,
    explanation: "RK4 is 4th order: halving h reduces error by 2⁴ = 16. Error with h=0.25 is ε/16. This is the key advantage over Euler (ε/2) and RK2 (ε/4) — the same accuracy with far larger step sizes.",
  },
]

// ─── Optimization ─────────────────────────────────────────────────────────────

const GOLDEN_SECTION_QUIZ: QuizQuestion[] = [
  {
    id: 'g1',
    question: 'What property must a function have for golden section search to be guaranteed to find the minimum?',
    options: ['Differentiable on [a, b]', 'Unimodal on [a, b]: exactly one minimum, decreasing then increasing', 'Polynomial', 'Symmetric around the minimum'],
    correct: 1,
    explanation: 'Golden section search requires unimodality: the function decreases to a single minimum then increases. With multiple minima, it can only find a local one.',
  },
  {
    id: 'g2',
    question: 'What is the golden ratio φ and why is it used?',
    options: ['φ = π ≈ 3.14, minimizes computation', 'φ = (1+√5)/2 ≈ 1.618; allows one probe to be reused after each bracket reduction', 'φ = √2 ≈ 1.414; gives geometric convergence', 'φ = e ≈ 2.718; natural for continuous functions'],
    correct: 1,
    explanation: 'The golden ratio φ = (1+√5)/2 ≈ 1.618 ensures that after discarding one side, the surviving probe point is exactly at the golden-ratio position of the new bracket — allowing it to be reused without a new function evaluation.',
  },
  {
    id: 'g3',
    question: 'How does the bracket width change after each golden section iteration?',
    options: ['Halved (bisection rate)', 'Reduced by factor 1/φ ≈ 0.618', 'Reduced by factor 0.5²', 'Reduced quadratically'],
    correct: 1,
    explanation: 'Each iteration reduces the bracket by factor 1/φ ≈ 0.618. After n iterations: width = initial_width × (1/φ)^n. This is linear convergence with rate 1/φ.',
  },
  {
    id: 'g4',
    question: 'After n = 25 golden section iterations on [0, 1], what is the approximate bracket width?',
    options: ['(1/φ)^25 ≈ 2.4×10⁻⁵', '(0.5)^25 ≈ 3×10⁻⁸', '10⁻²⁵', '1/(25×φ)'],
    correct: 0,
    explanation: '(1/φ)^25 ≈ (0.618)^25 ≈ 2.4×10⁻⁵. Bisection would give 2⁻²⁵ ≈ 3×10⁻⁸ — faster by ~1000×, but bisection finds roots, not minima, and requires a sign-change bracket.',
  },
  {
    id: 'g5',
    question: 'What is the key efficiency advantage of golden section search vs. ternary search (dividing [a,b] into thirds)?',
    options: ['Golden section is more accurate', 'Golden section evaluates one function value per iteration (after setup), ternary needs 2', 'Golden section works for multimodal functions', 'Golden section converges in fewer total iterations'],
    correct: 1,
    explanation: 'Ternary search evaluates f at 2 points each iteration. Golden section evaluates only 1 (reusing the surviving probe). For expensive function evaluations, this 2× reduction per iteration is significant.',
  },
]

const GRADIENT_DESCENT_QUIZ: QuizQuestion[] = [
  {
    id: 'gd1',
    question: 'For gradient descent to converge for a smooth function, what is the required condition on the learning rate α?',
    options: ['α can be any positive number', 'α < 2/L where L is the Lipschitz constant of the gradient', 'α must equal exactly 1/L', 'α < 1/μ where μ is the strong convexity constant'],
    correct: 1,
    explanation: 'For an L-smooth function, gradient descent converges for any α < 2/L. The optimal fixed learning rate is α = 1/L, giving fastest convergence.',
  },
  {
    id: 'gd2',
    question: 'What convergence rate does gradient descent achieve for a strongly convex function?',
    options: ['Quadratic: ‖xₖ−x*‖² ≤ (1−μ/L)ᵏ‖x₀−x*‖²', 'Linear: ‖xₖ−x*‖² ≤ (1−μ/L)ᵏ‖x₀−x*‖²', 'Sublinear: O(1/k)', 'Cubic: ‖xₖ−x*‖² decays cubically'],
    correct: 1,
    explanation: 'For strongly convex functions (constant μ > 0), gradient descent converges linearly: error decays geometrically with rate (1−μ/L) per iteration. The condition number κ = L/μ controls the rate.',
  },
  {
    id: 'gd3',
    question: 'Gradient descent on f(x,y) = x² + 100y² (κ = 100) vs f(x,y) = x² + y² (κ = 1). Which converges faster?',
    options: ['Both are identical — gradient magnitude is the same', 'κ=1 converges ~100× faster (fewer zigzags)', 'κ=100 converges faster (larger gradient)', 'They always converge in the same number of iterations'],
    correct: 1,
    explanation: 'The convergence rate is (1−1/κ)^k. For κ=1: rate=0, one step. For κ=100: rate≈0.99, needs ~690 steps to reduce error by 10⁶. High condition number causes slow zigzag convergence.',
  },
  {
    id: 'gd4',
    question: 'Gradient descent can get stuck at a saddle point. What is a saddle point?',
    options: ['A point where f = 0', 'A point where ∇f = 0 but it is neither a local min nor max', 'The global minimum', 'A point outside the domain'],
    correct: 1,
    explanation: 'A saddle point has ∇f = 0 (gradient zero) but is not a min or max — it is a min in some directions and a max in others. Gradient descent can converge to saddle points in nonconvex optimization.',
  },
  {
    id: 'gd5',
    question: 'Stochastic gradient descent (SGD) uses a mini-batch estimate of the gradient. What is the trade-off vs. full gradient descent?',
    options: ['SGD is always slower — noisy gradients hurt convergence', 'SGD reaches lower loss than full GD', 'SGD uses cheaper gradient estimates per step, allowing more steps for the same compute budget', 'SGD requires knowing the learning rate L'],
    correct: 2,
    explanation: 'SGD computes a gradient estimate from a small batch (e.g., 32 samples) instead of the full dataset. Each step is much cheaper (e.g., 32 samples vs 1M), allowing far more iterations per second. The noise can actually help escape local minima.',
  },
]

export const QUIZ_REGISTRY: Record<string, QuizQuestion[]> = {
  '/root-finding/bisection':                BISECTION,
  '/root-finding/newton-raphson':           NEWTON_RAPHSON,
  '/root-finding/secant':                   SECANT,
  '/interpolation/lagrange':                LAGRANGE,
  '/interpolation/cubic-spline':            CUBIC_SPLINE,
  '/differentiation/forward':               FORWARD_DIFF,
  '/differentiation/backward':              BACKWARD_DIFF,
  '/differentiation/central':               CENTRAL_DIFF,
  '/integration/trapezoidal':               TRAPEZOIDAL,
  '/integration/simpsons':                  SIMPSONS_QUIZ,
  '/integration/gaussian-quadrature':       GAUSSIAN_QUAD,
  '/linear-systems/gaussian-elimination':   GAUSSIAN_ELIMINATION_QUIZ,
  '/linear-systems/gauss-seidel':           GAUSS_SEIDEL_QUIZ,
  '/linear-systems/jacobi':                 JACOBI_QUIZ,
  '/lu-decomposition/lu':                   LU_QUIZ,
  '/lu-decomposition/cholesky':             CHOLESKY_QUIZ,
  '/optimization/golden-section':           GOLDEN_SECTION_QUIZ,
  '/optimization/gradient-descent':         GRADIENT_DESCENT_QUIZ,
  '/ode/euler':                             EULER_QUIZ,
  '/ode/runge-kutta':                       RK4_QUIZ,
  '/root-finding/fixed-point':             FIXED_POINT_QUIZ,
  '/interpolation/newton-divided-diff':    NEWTON_DD_QUIZ,
  '/differentiation/richardson':           RICHARDSON_QUIZ,
}
