import type { LessonConfig } from '@/types/lesson.types'

export const GOLDEN_SECTION_CONFIG: LessonConfig = {
  header: {
    moduleId: 'optimization',
    moduleColor: '#06b6d4',
    title: 'Golden Section Search',
    subtitle: 'Bracket-based minimization using the golden ratio φ ≈ 1.618',
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    objectives: [
      'Understand why the golden ratio minimizes function evaluations per iteration',
      'Implement the golden section bracket update rule',
      'Identify the convergence rate (linear) and efficiency guarantee',
      'Distinguish unimodal functions from multimodal',
      'Apply to engineering optimization problems with bracket bounds',
    ],
    prerequisites: [
      { title: 'Differentiation', path: '/differentiation', required: false },
    ],
    tags: ['optimization', 'bracket', 'golden ratio', 'unimodal', 'derivative-free'],
  },

  motivation: {
    problemStatement:
      'An aircraft wing profile has a drag-lift ratio f(θ) that depends on angle of attack θ. ' +
      'You need to find the optimal θ ∈ [0°, 20°] that minimizes drag. No derivative is available.',
    whyItMatters:
      'Golden section search finds the minimum of a unimodal function on [a, b] without computing ' +
      'any derivatives. It is the optimal strategy for bracket-based search — no algorithm can ' +
      'find the minimum with fewer function evaluations under the same information model.',
    historicalBackground:
      'The golden ratio φ = (1+√5)/2 ≈ 1.618 has been known since ancient Greece. ' +
      'Its application to one-dimensional optimization was formalized by Jack Kiefer (1953) who ' +
      'proved its optimality in the minimax sense.',
    engineeringMotivation:
      'Line-search algorithms in gradient descent, Newton\'s method, and quasi-Newton methods ' +
      'all rely on one-dimensional minimization. Golden section search is the derivative-free ' +
      'building block for many gradient-based methods.',
    motivatingExample: {
      title: 'Minimize f(x) = x² − 3x + 2 on [0, 3]',
      description:
        'Minimum at x* = 1.5. Golden section: start with [0,3], φ-ratio inner points, ' +
        'evaluate, shrink bracket. After 10 iterations: bracket width ≈ 0.05.',
      expression: 'Golden ratio: φ = (1+√5)/2 ≈ 1.618, reduction = 1/φ ≈ 0.618 per step',
      result: '10 iters → bracket < 0.05. Bisection needs ~17 iters for same width.',
    },
  },

  theory: {
    overview:
      'Golden section search maintains a bracket [a, b] containing the minimum of a unimodal function. ' +
      'Two interior probe points x₁ and x₂ are placed at the golden-ratio positions. ' +
      'Comparing f(x₁) vs f(x₂) discards one side, and the remaining probe is reused in the next step.',
    intuition:
      'Why the golden ratio? The interior points must satisfy a self-similarity property: ' +
      'after discarding one side, the surviving interior point must be exactly at the golden-ratio ' +
      'position of the new bracket. This reuse of one function evaluation is what makes ' +
      'golden section optimal.',
    advantages: [
      'Derivative-free — works on any continuous unimodal function',
      'Guaranteed convergence — bracket shrinks by factor 1/φ ≈ 0.618 per iteration',
      'Optimal efficiency — proven minimum evaluations under bracket-based strategy',
      'No learning rate, no step size: the golden ratio is a universal constant',
    ],
    limitations: [
      'Only works for unimodal functions on a bracket [a, b]',
      'Requires a bracket containing the minimum (as Goldfeld condition)',
      'Slower than gradient methods for smooth functions (linear vs superlinear convergence)',
      'No multimodal extension — must use multi-start or splitting',
    ],
    keyInsights: [
      'Golden ratio: φ = (1+√5)/2 ≈ 1.618, τ = 1 − 1/φ = 1/φ² ≈ 0.382',
      'After n iterations: bracket width ≤ (b−a)/φⁿ → linear convergence rate = 1/φ',
      'Each step costs exactly 1 function evaluation (after the first step which costs 2)',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Golden Ratio',
        latex: '\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1.61803398875 \\quad (\\varphi^2 = \\varphi + 1)',
        description: 'Self-similar: (b−x₁)/(b−a) = (x₂−a)/(b−a) = 1−1/φ ≈ 0.382',
        isKeyFormula: true,
      },
      {
        label: 'Interior Points',
        latex: 'x_1 = b - (b-a)/\\varphi, \\quad x_2 = a + (b-a)/\\varphi',
        description: 'Two probe points at golden-ratio positions within [a, b]',
        isKeyFormula: true,
      },
      {
        label: 'Update Rules',
        latex: '\\text{If } f(x_1) > f(x_2): a \\leftarrow x_1 \\text{ (keep right)} \\quad \\text{If } f(x_1) < f(x_2): b \\leftarrow x_2 \\text{ (keep left)}',
        description: 'After update, one existing probe is reused — only one new evaluation needed',
        isKeyFormula: true,
      },
      {
        label: 'Convergence',
        latex: '|b_n - a_n| = (b_0 - a_0) / \\varphi^n',
        description: 'Bracket width decays geometrically by factor 1/φ ≈ 0.618 per iteration',
      },
      {
        label: 'Iterations for tolerance ε',
        latex: 'n \\geq \\log_{\\varphi}\\left(\\frac{b-a}{\\varepsilon}\\right) = \\frac{\\ln((b-a)/\\varepsilon)}{\\ln\\varphi}',
        description: 'Exact number of iterations needed to achieve bracket width ε',
      },
    ],
    symbols: [
      { symbol: 'φ', definition: 'Golden ratio ≈ 1.618. Satisfies φ = 1 + 1/φ' },
      { symbol: '[a,b]', definition: 'Current bracket containing the minimum' },
      { symbol: 'x₁, x₂', definition: 'Two interior probe points (a < x₁ < x₂ < b)' },
      { symbol: 'τ', definition: '1/φ² ≈ 0.382 — ratio of inner interval to full interval' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'For self-similarity, the surviving probe after one update must be at the golden ratio of the new interval',
        latex: '\\frac{x_2 - a}{b - a} = \\frac{b - x_1}{b - x_1 + (x_2 - a)} \\implies \\text{golden ratio}',
      },
      {
        step: 2,
        description: 'This self-similarity equation has solution r = 1/φ',
        latex: 'r = 1 - 1/\\varphi \\approx 0.382',
      },
      {
        step: 3,
        description: 'Kiefer (1953) proved this is the UNIQUE optimal strategy under the information model "can only compare function values"',
        latex: 'n_{\\min} = \\lceil \\log_\\varphi((b-a)/\\varepsilon) \\rceil',
      },
    ],
    assumptions: [
      'f is unimodal on [a, b]: has a single minimum, decreasing then increasing',
      'f is continuous on [a, b]',
    ],
    convergenceCondition: 'Linear convergence: bracket width shrinks by factor 1/φ ≈ 0.618 each iteration',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Bracket Width',
        formula: 'b − a',
        description: 'Main convergence measure. Error bound: |x* − midpoint| ≤ (b−a)/2',
      },
      {
        label: 'Function Value Error',
        formula: '|f(midpoint) − f(x*)|',
        description: 'For smooth f: O((b−a)²) due to quadratic nature of minima',
      },
    ],
    stabilityNote:
      'Golden section search is unconditionally convergent for unimodal f. ' +
      'Unlike Newton\'s method, it cannot diverge or miss the minimum.',
    floatingPointNote:
      'Bracket width will eventually reach machine epsilon (~10⁻¹⁵ for float64) at which ' +
      'point subtraction catastrophe prevents further shrinkage. Practical tolerance 10⁻¹⁰ is safe.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n) function evaluations for n = ⌈log_φ((b-a)/ε)⌉',
      spaceComplexity: 'O(1) — stores only a, b, x₁, x₂, f(x₁), f(x₂)',
      convergenceOrder: 'Linear — rate = 1/φ ≈ 0.618',
      convergenceOrderNote: 'Optimal among all derivative-free bracket methods by Kiefer\'s theorem',
    },
    bestCase: 'Minimum at golden-ratio position of initial bracket: 2 evaluations total',
    worstCase: 'All n iterations needed: n ≈ log(width/ε)/log(φ) evaluations',
    typicalIterations: 'To achieve 10⁻⁸ precision from width=1: ~45 iterations. (Compare bisection: ~53)',
  },

  engineeringApplications: [
    {
      field: 'Aerospace',
      title: 'Wing Drag Minimization',
      description:
        'Optimize airfoil angle of attack θ ∈ [0°, 15°] to minimize drag-lift ratio. ' +
        'CFD evaluation is expensive (no analytic derivative) — golden section minimizes evaluations.',
      example: 'CFD: 50 sec per evaluation. Golden section: 15 evals → 750 sec total vs Newton needing analytic grad',
      icon: '✈️',
      difficulty: 'advanced',
    },
    {
      field: 'Chemical Engineering',
      title: 'Optimal Reactor Temperature',
      description:
        'In an exothermic reactor, yield f(T) is unimodal in temperature. ' +
        'Golden section finds the optimal T ∈ [T_min, T_max] without modeling the full kinetics.',
      example: 'Reactor optimization: T ∈ [100°C, 350°C], max yield at T* ≈ 210°C',
      icon: '⚗️',
      difficulty: 'intermediate',
    },
    {
      field: 'Signal Processing',
      title: 'FIR Filter Cutoff Optimization',
      description:
        'Minimize passband ripple as a function of cutoff frequency f_c. ' +
        'The objective is expensive (FFT-based) and derivative-free.',
      example: 'Filter design: 20 golden section iterations → 0.01 dB precision',
      icon: '📡',
      difficulty: 'intermediate',
    },
    {
      field: 'Machine Learning',
      title: '1D Line Search in Gradient Descent',
      description:
        'Armijo-Wolfe line search is the standard approach, but golden section can replace it ' +
        'for exact 1D minimization along the negative gradient direction.',
      example: 'Training step: minimize f(x + α·d) over α ∈ [0, α_max] using golden section',
      icon: '🤖',
      difficulty: 'advanced',
    },
    {
      field: 'Operations Research',
      title: 'Economic Order Quantity',
      description:
        'Total inventory cost C(Q) = holding + ordering costs. C(Q) is convex and unimodal in Q. ' +
        'Golden section finds optimal Q* without differentiation.',
      example: 'Inventory: C(Q) = holding·Q/2 + ordering·D/Q, minimize over Q ∈ [1, 1000]',
      icon: '📦',
      difficulty: 'intermediate',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Applying golden section to multimodal functions',
      description: 'Golden section only works for unimodal functions. On a multimodal f, the method may find a local (not global) minimum.',
      wrongApproach: 'Apply golden section to f(x) = sin(x) on [0, 6] — multiple minima exist',
      correctApproach: 'Verify unimodality on [a,b] first. For multimodal functions, use multi-start or divide into sub-intervals.',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Confusing the update rule',
      description: 'If f(x₁) > f(x₂), the minimum is in [x₁, b] — set a = x₁. If f(x₁) < f(x₂), minimum is in [a, x₂] — set b = x₂.',
      wrongApproach: 'Discard the side with the SMALLER f value',
      correctApproach: 'Discard the side containing the point with the LARGER f value',
      icon: '🔄',
    },
    {
      id: 'm3',
      title: 'Not reusing the surviving probe point',
      description: 'The key efficiency of golden section is that one probe is REUSED each iteration. Recomputing both probes every time wastes function evaluations.',
      wrongApproach: 'Recompute x₁ = b − (b−a)/φ and x₂ = a + (b−a)/φ from scratch each iteration',
      correctApproach: 'After discarding one side: the surviving probe becomes one of the new interior points, requiring only 1 new evaluation.',
      icon: '💡',
    },
    {
      id: 'm4',
      title: 'Stopping on function value instead of bracket width',
      description: 'For flat functions near the minimum, f(x) changes very slowly even when x is still far from x*. Stop on bracket width, not |f(x₁) - f(x₂)|.',
      wrongApproach: 'Stop when |f(x₂) − f(x₁)| < ε',
      correctApproach: 'Stop when (b − a) < ε — the bracket width directly bounds the error in x*.',
      icon: '📏',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'Two iterations by hand',
      description: 'Minimize f(x) = x² − 4x + 6 on [0, 4]. Compute 2 golden section iterations.',
      difficulty: 'easy',
      hint: 'φ ≈ 1.618. x₁ = 4 − 4/1.618 ≈ 1.528. x₂ = 4/1.618 ≈ 2.472. f(x₁)=f(1.528)≈2.26, f(x₂)=f(2.472)≈2.26 (symmetric — keep either half).',
      expectedAnswer: 'After 2 iters: bracket ≈ [1.528, 2.472] → [1.528, 2.472]... converging to x*=2.',
    },
    {
      id: 'p2',
      title: 'Compute required iterations',
      description: 'How many golden section iterations to achieve |x − x*| < 10⁻⁶ starting from [0, 1]?',
      difficulty: 'easy',
      hint: 'n = ⌈log_φ(1/10⁻⁶)⌉ = ⌈6 log_φ(10)⌉ = ⌈6 × 4.785⌉',
      expectedAnswer: 'n = ⌈log(10⁶)/log(1.618)⌉ = ⌈13.82/0.481⌉ = 29 iterations.',
    },
    {
      id: 'p3',
      title: 'Compare with bisection',
      description: 'For the same [0,1] → 10⁻⁶ tolerance, how many bisection iterations (for root finding)?',
      difficulty: 'medium',
      hint: 'Bisection halves each time: (b-a)/2ⁿ < ε → n > log₂(1/ε)',
      expectedAnswer: 'Bisection: n > log₂(10⁶) ≈ 20 iterations. Golden section: 29. But bisection solves roots, GS minimizes — different problem. GS is optimal for derivative-free minimization.',
    },
    {
      id: 'p4',
      title: 'Non-smooth function',
      description: 'Can golden section handle f(x) = |x − 2| + |x − 4| on [0, 6]? Find the minimum.',
      difficulty: 'medium',
      hint: 'This function is unimodal (V-shaped)! It decreases then increases. GS can find the flat minimum on [2, 4].',
      expectedAnswer: 'f is unimodal with minimum value 2 on x ∈ [2, 4]. GS converges but bracket may not pinpoint a single x* since f is flat on [2,4].',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Visualize the bracket shrinkage',
      description: 'Watch the bracket [a, b] shrink each iteration.',
      objective: 'Confirm the bracket width decays geometrically by ~0.618 per step.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Minimize f(x) = (x−2)² on [0, 4]. Play the animation.', actionLabel: 'Play animation' },
        { step: 2, instruction: 'Record the bracket width at iterations 1, 5, 10. Does it decay by factor ≈ 0.618?', expectedOutcome: 'Width at k: w₀×0.618ᵏ. At k=5: w ≈ 0.078×initial. Confirmed geometric decay.' },
      ],
    },
    {
      id: 'c2',
      title: 'Compare with gradient descent line search',
      description: 'Run golden section and check if it finds the same minimum as gradient descent.',
      objective: 'Understand when to prefer golden section over gradient methods.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Minimize f(x) = sin(x) + 0.1x² on [1, 5] using golden section.', actionLabel: 'Run GS' },
        { step: 2, instruction: 'What is x*? Would gradient descent need f\'(x) = cos(x) + 0.2x?', expectedOutcome: 'GS finds x* ≈ 2.86 without ever using f\'(x). GD would need the exact derivative.' },
      ],
    },
    {
      id: 'c3',
      title: 'Observe multimodal failure',
      description: 'Apply golden section to a multimodal function and observe the wrong result.',
      objective: 'See in real-time why unimodality is a hard requirement.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Minimize f(x) = sin(3x) + 0.5x² on [0, 5] — multimodal!', actionLabel: 'Run GS' },
        { step: 2, instruction: 'Does it find the global minimum (x* ≈ 1.0)?', expectedOutcome: 'GS finds a local minimum, not necessarily the global one. Try different starting brackets to find the global minimum.' },
      ],
    },
    {
      id: 'c4',
      title: 'Engineering: optimal reactor temperature',
      description: 'Find the temperature that maximizes reactor yield (= minimizes negative yield).',
      objective: 'Apply golden section to an engineering black-box function.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Minimize f(T) = −yield(T) = −(T−200)²·exp(−(T−200)²/10000) on [150, 300].', actionLabel: 'Optimize' },
        { step: 2, instruction: 'What is T*? How many function evaluations were needed?', expectedOutcome: 'T* ≈ 200°C (maximum yield). ~25 golden section evaluations.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Unimodal only', description: 'Requires a single minimum on [a, b]', icon: '📉' },
      { title: 'Golden ratio', description: 'φ ≈ 1.618 — bracket shrinks by 0.618 per step', icon: '🌟' },
      { title: 'Reuse probe', description: 'One new evaluation per iteration (after first 2)', icon: '🔄' },
      { title: 'Optimal', description: 'Proven minimum evaluations by Kiefer\'s theorem', icon: '🏆' },
      { title: 'Derivative-free', description: 'Works on black-box functions', icon: '📦' },
    ],
    cheatSheetFormulas: [
      { label: 'Interior points', latex: 'x_1 = b - (b-a)/\\varphi, \\quad x_2 = a + (b-a)/\\varphi', isKeyFormula: true },
      { label: 'Golden ratio', latex: '\\varphi = (1+\\sqrt{5})/2 \\approx 1.618', isKeyFormula: true },
      { label: 'After n iters', latex: '|b_n - a_n| = (b_0 - a_0)/\\varphi^n' },
    ],
    nextSteps: [
      { label: 'Gradient Descent', description: 'Derivative-based minimization for multivariate problems', path: '/optimization/gradient-descent' },
      { label: 'Optimization Comparison', description: 'When to use golden section vs gradient methods', path: '/optimization/comparison' },
    ],
  },
}
