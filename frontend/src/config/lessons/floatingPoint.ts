import type { LessonConfig } from '@/types/lesson.types'

export const FLOATING_POINT_CONFIG: LessonConfig = {
  // ─── 1. Header ─────────────────────────────────────────────────────────────
  header: {
    moduleId: 'floating-point',
    moduleColor: '#f59e0b',
    title: 'Floating Point Error Analysis & Numerical Stability',
    subtitle: 'How computers approximate real numbers — and why that matters',
    difficulty: 'introductory',
    estimatedMinutes: 90,
    objectives: [
      'Understand how IEEE 754 encodes real numbers in binary (sign, exponent, mantissa)',
      'Distinguish float16, float32, and float64 in terms of range and precision',
      'Compute absolute error, relative error, and machine epsilon',
      'Identify overflow, underflow, and catastrophic cancellation',
      'Analyze how small errors propagate and grow through repeated computation',
      'Recognize numerically unstable algorithms and apply stable reformulations',
      'Apply floating-point knowledge to real engineering and AI problems',
    ],
    prerequisites: [],
    tags: ['IEEE 754', 'binary', 'machine epsilon', 'rounding error', 'numerical stability'],
  },

  // ─── 2. Motivation ─────────────────────────────────────────────────────────
  motivation: {
    problemStatement:
      'Type 0.1 + 0.2 into any calculator app, JavaScript console, or Python REPL. ' +
      'The answer is not 0.3. It is 0.30000000000000004. This is not a software bug — ' +
      'it is a fundamental property of how every modern computer stores numbers.',
    whyItMatters:
      'Floating-point errors have caused real disasters. In 1991, a Patriot missile battery ' +
      'failed to intercept a Scud because a 0.34-second clock drift accumulated over 100 hours ' +
      'into a 687-meter targeting error. In 1996, the Ariane 5 rocket exploded 37 seconds after ' +
      'launch because a 64-bit float was converted to a 16-bit integer that overflowed. ' +
      'Every engineer who uses a computer for numerical work must understand these limits.',
    historicalBackground:
      'Before IEEE 754 (1985), every processor used its own floating-point format — ' +
      'the same program gave different answers on different machines. William Kahan and the ' +
      'IEEE 754 committee standardized the format used by virtually every CPU today. ' +
      'The standard defines not just the format, but exactly how rounding must behave.',
    engineeringMotivation:
      'In deep learning, switching from float64 to float16 cuts GPU memory in half and ' +
      'doubles throughput — enabling models that would otherwise be impossible to train. ' +
      'In structural FEM analysis, accumulated errors in large linear systems can make the ' +
      'solver report a safe structure when the true solution indicates failure. ' +
      'Choosing the right precision and algorithm is not optional — it is engineering.',
    motivatingExample: {
      title: 'The 0.1 + 0.2 Problem',
      description:
        'In binary, 0.1 is a repeating fraction — just as 1/3 is a repeating decimal. ' +
        'No finite number of bits can represent it exactly. The stored value is the ' +
        'nearest representable number, and the small rounding error becomes visible when printed.',
      expression: '0.1 + 0.2 = 0.30000000000000004  (JavaScript, Python, C++, Java — all the same)',
      result: 'The 17-digit "error" is not a mistake in the language. It is the cost of binary floating-point.',
    },
  },

  // ─── 3. Theory ─────────────────────────────────────────────────────────────
  theory: {
    overview:
      'A floating-point number stores a value as three parts: a sign bit, a biased exponent, ' +
      'and a fractional mantissa (significand). This is essentially scientific notation in binary: ' +
      '±1.mantissa × 2^(exponent−bias). The number of bits in the exponent controls the range ' +
      '(how large or small the number can be), while the mantissa bits control precision ' +
      '(how many significant binary digits are available).',
    intuition:
      'Imagine a ruler with exactly 23 tick marks between every pair of consecutive powers of two. ' +
      'Numbers that happen to land exactly on a tick mark are represented perfectly. ' +
      'All other numbers are rounded to the nearest tick mark — and that rounding distance ' +
      'is the floating-point error. The tick marks are equally spaced between [1, 2), ' +
      'then equally spaced (but twice as far apart) between [2, 4), and so on. ' +
      'Near zero, the marks are very close together. Near large numbers, they are far apart.',
    advantages: [
      'Covers an enormous magnitude range: float64 goes from ~5×10⁻³²⁴ to ~1.8×10³⁰⁸',
      'IEEE 754 guarantees identical results on every compliant processor worldwide',
      'Hardware-accelerated: a single float64 multiplication takes one CPU clock cycle',
      'Represents ±∞ and NaN, enabling graceful overflow handling in computation',
    ],
    limitations: [
      '0.1, 0.3, and most decimal fractions have no exact binary representation',
      'Precision is relative — more ticks near zero, fewer near large numbers',
      'Subtracting two nearly-equal numbers causes catastrophic loss of significance',
      'Floating-point arithmetic is not associative: (a+b)+c ≠ a+(b+c) in general',
      'Iterative algorithms can amplify per-step errors exponentially (instability)',
    ],
    keyInsights: [
      'The gap between 1.0 and the next representable float is machine epsilon — the fundamental precision limit',
      'float64 provides ~15 significant decimal digits; that is sufficient for almost all engineering',
      'Never compare floats with ==; always use |a−b| < tolerance',
      'The quadratic formula is famous for catastrophic cancellation — stable alternatives exist',
    ],
  },

  // ─── 4. Mathematical Foundation ────────────────────────────────────────────
  mathFoundation: {
    formulas: [
      {
        label: 'IEEE 754 Floating-Point Value',
        latex:
          'x = (-1)^{s} \\times 2^{\\,e - \\text{bias}} \\times \\left(1 + \\sum_{i=1}^{p} m_i \\cdot 2^{-i}\\right)',
        description: 's = sign bit (0/1), e = stored exponent, bias = 2^(k−1)−1, m = mantissa bits',
        isKeyFormula: true,
      },
      {
        label: 'Absolute Error',
        latex: 'E_{\\text{abs}} = |\\tilde{x} - x|',
        description: 'Raw magnitude of the difference between the approximation x̃ and the true value x',
        isKeyFormula: true,
      },
      {
        label: 'Relative Error',
        latex: 'E_{\\text{rel}} = \\frac{|\\tilde{x} - x|}{|x|}, \\quad x \\neq 0',
        description: 'Error as a fraction of the true value — scale-independent measure of accuracy',
        isKeyFormula: true,
      },
      {
        label: 'Machine Epsilon',
        latex: '\\varepsilon_{\\text{mach}} = 2^{-p}',
        description:
          'Smallest positive ε such that fl(1+ε) ≠ 1. p = number of mantissa bits (10/23/52 for float16/32/64)',
        isKeyFormula: true,
      },
      {
        label: 'Rounding Error Bound',
        latex: '|fl(x) - x| \\leq \\tfrac{1}{2}\\,\\varepsilon_{\\text{mach}} \\cdot |x|',
        description:
          'Every single rounding introduces at most half an ε_mach of relative error — the "unit roundoff"',
      },
      {
        label: 'Cancellation Relative Error',
        latex:
          'E_{\\text{rel}} \\approx \\frac{2\\,\\varepsilon_{\\text{mach}}}{|x - y|\\,/\\,\\max(|x|,\\,|y|)}',
        description:
          'When x ≈ y, the denominator shrinks and the relative error of x−y explodes — catastrophic cancellation',
      },
    ],
    symbols: [
      { symbol: 's',                       definition: 'Sign bit (0 = positive, 1 = negative)',    unit: '1 bit'  },
      { symbol: 'e',                       definition: 'Stored (biased) exponent',                unit: 'k bits' },
      { symbol: 'p',                       definition: 'Number of mantissa (significand) bits',   unit: 'bits'   },
      { symbol: '\\text{bias}',            definition: '2^(k−1) − 1 — the exponent offset',                     },
      { symbol: 'fl(x)',                   definition: 'Floating-point representation of real number x'          },
      { symbol: '\\varepsilon_{\\text{mach}}', definition: 'Machine epsilon — fundamental precision limit'      },
      { symbol: 'E_{\\text{abs}}',         definition: 'Absolute error of an approximation'                     },
      { symbol: 'E_{\\text{rel}}',         definition: 'Relative error (dimensionless)'                         },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'float32 allocates 32 bits: 1 sign + 8 exponent + 23 mantissa',
        latex:
          '\\underbrace{s}_{1\\text{ bit}}\\;\\underbrace{e_7 \\cdots e_0}_{8\\text{ bits}}\\;\\underbrace{m_{22} \\cdots m_0}_{23\\text{ bits}}',
      },
      {
        step: 2,
        description: 'The exponent is stored with a bias of 127. True power of 2 = stored exponent − 127',
        latex: '\\text{true exponent} = e - 127',
        note: 'e = 0 and e = 255 are reserved for subnormals, ∞, and NaN',
      },
      {
        step: 3,
        description: 'Normalized numbers have an implicit leading 1 — the "hidden bit" — so the significand is 1.mantissa',
        latex: '\\text{significand} = 1.m_{22}\\,m_{21}\\cdots m_0 = 1 + \\sum_{i=1}^{23} m_{23-i} \\cdot 2^{-i}',
      },
      {
        step: 4,
        description: 'Combine sign, exponent, and significand into the final value',
        latex:
          'x_{32} = (-1)^{s} \\times 2^{e-127} \\times \\left(1 + \\sum_{i=1}^{23} m_{23-i} \\cdot 2^{-i}\\right)',
      },
    ],
    assumptions: [
      'All derivations assume IEEE 754 normalized numbers (subnormals near zero have different behavior)',
      'e = 0 denotes subnormal/zero; e = 255 (float32) denotes ±∞ or NaN',
      'Rounding mode assumed: round-to-nearest-even (the IEEE 754 default)',
    ],
    convergenceCondition: '|fl(x) - x| \\leq \\tfrac{1}{2}\\,\\varepsilon_{\\text{mach}}\\,|x|',
  },

  // ─── 9. Error Analysis ──────────────────────────────────────────────────────
  errorAnalysis: {
    metrics: [
      {
        label: 'Absolute Error',
        formula: 'E_{\\text{abs}} = |\\tilde{x} - x|',
        description:
          'Measures the raw magnitude of the mistake. Useful when you know the scale of the problem.',
      },
      {
        label: 'Relative Error',
        formula: 'E_{\\text{rel}} = \\dfrac{|\\tilde{x} - x|}{|x|}',
        description:
          'Scale-independent: 1e-6 error in 1.0 is catastrophic, but in 1e9 it is negligible. ' +
          'Always use relative error when comparing precision across different magnitudes.',
      },
      {
        label: 'Machine Epsilon',
        formula: '\\varepsilon_{\\text{mach}} = 2^{-p}',
        description:
          'The upper bound on relative rounding error per operation. ' +
          'float16: ~9.77×10⁻⁴ · float32: ~1.19×10⁻⁷ · float64: ~2.22×10⁻¹⁶',
      },
    ],
    stabilityNote:
      'Numerical stability means: small input perturbations produce proportionally small output perturbations. ' +
      'Subtracting two nearly-equal numbers is the most common source of instability — avoid it by ' +
      'algebraic reformulation. The quadratic formula for the smaller root is classic: compute the ' +
      'larger root first, then use Vieta\'s relation x₁x₂ = c/a.',
    floatingPointNote:
      'Prefer float64 for any scientific computation. Use float32 only when memory or GPU throughput ' +
      'is critical (graphics, ML). Use hypot(x,y) instead of sqrt(x²+y²) to avoid intermediate overflow. ' +
      'For summing many values, Kahan compensated summation reduces float32 accumulated error by a factor of ~10⁷.',
  },

  // ─── 10. Performance Analysis ───────────────────────────────────────────────
  performance: {
    complexity: {
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      convergenceOrder: 'N/A',
      convergenceOrderNote:
        'Floating-point is a storage format, not an iterative method. There is no convergence.',
    },
    bestCase: 'Values that are exact powers of 2 (1, 0.5, 0.25, 1024 …) are stored with zero error',
    worstCase:
      'Repeating binary fractions (0.1, 0.3, 1/3 …) incur rounding on every store. ' +
      'Accumulated additions can grow error linearly with iteration count.',
    typicalIterations: 'N/A — floating-point storage is a one-time conversion, not iteration',
  },

  // ─── 11. Comparison Center ──────────────────────────────────────────────────
  comparison: {
    methods: ['float16', 'float32', 'float64'],
    criteria: [
      'Total bits', 'Sign bits', 'Exponent bits', 'Mantissa bits',
      'Decimal digits', 'Max finite value', 'Min positive normal',
      'Machine epsilon', 'Memory', 'Typical application',
    ],
    table: [
      { criterion: 'Total bits',           float16: '16',             float32: '32',              float64: '64'             },
      { criterion: 'Sign bits',            float16: '1',              float32: '1',               float64: '1'              },
      { criterion: 'Exponent bits',        float16: '5',              float32: '8',               float64: '11'             },
      { criterion: 'Mantissa bits',        float16: '10',             float32: '23',              float64: '52'             },
      { criterion: 'Decimal digits',       float16: '~3.3',           float32: '~7.2',            float64: '~15.9'          },
      { criterion: 'Max finite value',     float16: '65,504',         float32: '3.4 × 10³⁸',     float64: '1.8 × 10³⁰⁸'   },
      { criterion: 'Min positive normal',  float16: '6.1 × 10⁻⁵',   float32: '1.2 × 10⁻³⁸',   float64: '2.2 × 10⁻³⁰⁸'  },
      { criterion: 'Machine epsilon',      float16: '9.77 × 10⁻⁴',  float32: '1.19 × 10⁻⁷',   float64: '2.22 × 10⁻¹⁶'  },
      { criterion: 'Memory',               float16: '2 bytes',        float32: '4 bytes',         float64: '8 bytes'        },
      { criterion: 'Typical application',  float16: 'AI/GPU training',float32: 'Graphics/games',  float64: 'Science/finance' },
    ],
    summary:
      'float64 is the default for any computation where accuracy matters. float32 is used in ' +
      'graphics and ML where memory bandwidth and GPU throughput are the bottleneck. float16 is ' +
      'used on AI accelerators where 3 decimal digits of precision suffice for training weights.',
  },

  // ─── 12. Engineering Applications ──────────────────────────────────────────
  engineeringApplications: [
    {
      field: 'Machine Learning & AI',
      title: 'Mixed-Precision GPU Training',
      description:
        'Modern deep learning uses float16 (or BF16) for the forward and backward pass, ' +
        'accumulating gradients in float32. This "mixed precision" strategy halves memory ' +
        'usage and doubles throughput on tensor cores, enabling models with billions of parameters.',
      example: 'GPT-4 training on A100s: BF16 activations, float32 gradient accumulation, float16 optimizer states.',
      icon: '🤖',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Scientific Computing',
      title: 'Climate Model Stability',
      description:
        'Atmospheric simulations integrate millions of coupled differential equations over thousands ' +
        'of time steps. Even ε_mach = 10⁻⁷ (float32) accumulated over 10⁵ steps can produce ' +
        'qualitatively wrong results. float64 (ε_mach ≈ 10⁻¹⁶) is mandatory for climate models.',
      example: 'ECMWF global weather forecast: 900 million grid cells, float64 throughout, 10-day forecasts.',
      icon: '🌍',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Computer Graphics',
      title: '3D Rendering Pipeline',
      description:
        'Real-time rendering runs entirely in float32 on the GPU. The human eye cannot perceive ' +
        'errors below float32 precision. Very large open worlds (GTA, No Man\'s Sky) switch to ' +
        'float64 for world-space coordinates to prevent "jitter" far from the origin.',
      example: 'Unreal Engine 5: float32 GPU shaders, float64 world coordinates beyond 2km from origin.',
      icon: '🎮',
      difficulty: 'introductory' as const,
    },
    {
      field: 'Robotics & Control',
      title: 'Kalman Filter Localization',
      description:
        'Robot state estimation using sensor fusion (IMU + GPS + LiDAR) requires careful precision ' +
        'management. The covariance matrix in the Extended Kalman Filter becomes ill-conditioned ' +
        'quickly with float32, causing the filter to diverge. ROS2 defaults to float64.',
      example: 'Boston Dynamics Atlas: float64 Kalman filter at 1 kHz. float32 prototype caused oscillations.',
      icon: '🦾',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Finance & Trading',
      title: 'Monetary Arithmetic',
      description:
        'Even a single penny of error per transaction accumulates to millions of dollars at scale. ' +
        'Financial systems use either float64 (acceptable for risk calculations) or exact decimal ' +
        'arithmetic (Python Decimal, Java BigDecimal) for monetary values. Never float32.',
      example: 'Knight Capital (2012): $440M loss in 45 minutes; partially due to mismanaged float precision in order routing.',
      icon: '💹',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Embedded Systems & IoT',
      title: 'MCU Sensor Averaging',
      description:
        'Microcontrollers without FPUs emulate float operations in software — extremely slow. ' +
        'Engineers use fixed-point arithmetic or float32 to balance precision with power. ' +
        'A common pitfall: accumulating 1000 float32 readings introduces systematic bias; ' +
        'using a float64 accumulator eliminates it.',
      example: 'ESP32 accelerometer: float32 for real-time filtering, float64 accumulator for calibration.',
      icon: '📡',
      difficulty: 'introductory' as const,
    },
  ],

  // ─── 13. Common Mistakes ────────────────────────────────────────────────────
  commonMistakes: [
    {
      id: 'fp-eq',
      title: 'Using == to compare floating-point numbers',
      description:
        'Because rounding makes mathematically identical computations return slightly different values, ' +
        'direct equality checks almost always fail. This is the single most common floating-point bug.',
      wrongApproach: 'if (0.1 + 0.2 === 0.3)  // Always false — result is 0.30000000000000004',
      correctApproach: 'if (Math.abs((0.1 + 0.2) - 0.3) < 1e-10)  // Use an absolute or relative tolerance',
      icon: '⚠',
    },
    {
      id: 'fp-cancel',
      title: 'Subtracting two nearly-equal numbers',
      description:
        'When x ≈ y, the subtraction x−y loses nearly all significant digits — catastrophic cancellation. ' +
        'The relative error can be millions of times larger than ε_mach. ' +
        'The fix is usually an algebraic reformulation that avoids the subtraction.',
      wrongApproach: 'f = (1 - Math.cos(x)) / (x * x)  // Cancellation for small x',
      correctApproach: 'f = 2 * Math.pow(Math.sin(x/2), 2) / (x * x)  // Equivalent, no cancellation',
      icon: '💥',
    },
    {
      id: 'fp-assoc',
      title: 'Assuming floating-point arithmetic is associative',
      description:
        'In real arithmetic, (a+b)+c = a+(b+c). In floating-point, this is NOT always true. ' +
        'The order in which you add a list of numbers can significantly change the result. ' +
        'Sort values smallest-first before summing to reduce accumulated error.',
      wrongApproach: 'total = 1e16 + 1.0 + (-1e16)  // Result: 0.0 (wrong — loses the 1.0)',
      correctApproach: 'total = 1e16 + (-1e16) + 1.0  // Result: 1.0 (correct with reordering)',
      icon: '∑',
    },
    {
      id: 'fp-overflow',
      title: 'Ignoring overflow in intermediate calculations',
      description:
        'A computation where the final answer fits in float32 can still overflow in an intermediate step. ' +
        'The canonical example is computing the Euclidean norm: √(x²+y²). If x = 1e20, ' +
        'x² = 1e40 overflows float32 even though the true answer is 1e20.',
      wrongApproach: 'norm = Math.sqrt(x*x + y*y)  // Overflows for large x or y',
      correctApproach: 'norm = Math.hypot(x, y)  // Handles scale internally — no overflow',
      icon: '🚫',
    },
    {
      id: 'fp-f32-money',
      title: 'Using float32 for monetary values',
      description:
        'float32 has only ~7 significant decimal digits. For amounts above $10,000.00, ' +
        'individual cent values start to get rounded away. Cumulative billing errors in ' +
        'financial systems have resulted in regulatory violations.',
      wrongApproach: 'let balance: f32 = 10000.01  // f32 rounds to ~10000.008',
      correctApproach: 'Use float64 (15 digits) or integer cents (no fractions) for all monetary values',
      icon: '💰',
    },
  ],

  // ─── 14. Practice Problems ──────────────────────────────────────────────────
  practiceProblems: [
    {
      id: 'fp-p1',
      title: 'Compute Absolute and Relative Error',
      description:
        '√2 = 1.41421356237… A 4-digit calculator displays 1.414. ' +
        'Compute the absolute error and the relative error of this approximation.',
      difficulty: 'easy',
      expression: '√2 ≈ 1.414',
      hint: 'Absolute error = |1.414 − 1.41421356237|. Relative error = absolute error ÷ true value.',
      expectedAnswer: 'Abs ≈ 2.135 × 10⁻⁴, Rel ≈ 1.510 × 10⁻⁴ (i.e. 0.015%)',
    },
    {
      id: 'fp-p2',
      title: 'Compute Machine Epsilon from Definition',
      description:
        'float32 has 23 mantissa bits. Using the formula ε_mach = 2^(−p), ' +
        'compute the machine epsilon and state how many significant decimal digits this corresponds to.',
      difficulty: 'easy',
      expression: 'ε_mach = 2^(−23)',
      hint: 'Significant decimal digits ≈ −log₁₀(ε_mach) ≈ p × log₁₀(2).',
      expectedAnswer: 'ε_mach ≈ 1.19 × 10⁻⁷, corresponding to approximately 7.2 significant decimal digits',
    },
    {
      id: 'fp-p3',
      title: 'Identify and Fix Catastrophic Cancellation',
      description:
        'The formula f(x) = (1 − cos x) / x² is used to approximate 1/2 for small x. ' +
        'For x = 10⁻⁵, compute using the original formula and using the identity ' +
        '1 − cos x = 2sin²(x/2). Compare the results in float64.',
      difficulty: 'medium',
      expression: 'f(x) = (1 − cos x) / x²  vs  g(x) = 2sin²(x/2) / x²',
      hint: 'For x = 1e-5: cos(1e-5) ≈ 0.999999999950000. The subtraction 1 − cos(x) ≈ 5e-11 loses ~10 digits.',
      expectedAnswer: 'True value: 0.5. Original gives ~0 (complete cancellation in float32). Reformulated gives 0.5.',
    },
    {
      id: 'fp-p4',
      title: 'Stable Quadratic Formula',
      description:
        'Solve x² − 1000x + 0.001 = 0 in float32 using both the standard quadratic formula ' +
        'and the numerically stable version: compute x₁ = (b + √D)/2a, then x₂ = c/(a·x₁) via Vieta\'s.',
      difficulty: 'hard',
      expression: 'x² − 1000x + 0.001 = 0  →  x₁ ≈ 1000, x₂ ≈ 0.000001',
      hint: 'D = b²−4ac ≈ 10⁶. In float32, √D ≈ b, so b − √D ≈ 0 (cancellation). Use x₂ = c/(a·x₁).',
      expectedAnswer: 'Standard float32 gives x₂ ≈ 0 (wrong). Stable version gives x₂ ≈ 1.0×10⁻⁶ (correct).',
    },
  ],

  // ─── 15. Interactive Challenges ─────────────────────────────────────────────
  interactiveChallenges: [
    {
      id: 'ch-epsilon',
      title: 'Discover Machine Epsilon',
      description: 'Find the machine epsilon of float64 by binary search — no looking it up!',
      objective: 'Find the smallest positive ε such that 1 + ε ≠ 1 in float64.',
      difficulty: 'easy',
      steps: [
        {
          step: 1,
          instruction: 'Open the Precision Explorer (Playground above). Enter the value 1 + 1e-15.',
          expectedOutcome: 'float64 stores 1 + 1e-15 as something slightly larger than 1',
        },
        {
          step: 2,
          instruction: 'Try 1 + 1e-16. Is the stored float64 value distinguishable from 1.0?',
          expectedOutcome: '1 + 1e-16 rounds to exactly 1.0 in float64 — epsilon is between 1e-16 and 1e-15',
        },
        {
          step: 3,
          instruction: 'Machine epsilon for float64 = 2^−52 ≈ 2.22 × 10⁻¹⁶. Confirm this.',
          expectedOutcome: 'fl(1 + 2.22e-16) ≠ 1.0  but  fl(1 + 1e-16) = 1.0',
        },
        {
          step: 4,
          instruction: 'Now switch to float16. What is its epsilon? Try 1 + 0.001 vs 1 + 0.0005.',
          expectedOutcome: 'float16 epsilon ≈ 9.77×10⁻⁴ ≈ 0.001 — only about 3 significant digits',
        },
      ],
    },
    {
      id: 'ch-overflow',
      title: 'Trigger float16 Overflow',
      description: 'Find exactly where float16 overflows to +Infinity.',
      objective: 'Determine the largest representable float16 value and what happens just above it.',
      difficulty: 'easy',
      steps: [
        {
          step: 1,
          instruction: 'In the Bit Visualizer above, enter 65504 with float16 selected.',
          expectedOutcome: 'float16 can represent 65504 exactly (maximum finite value)',
        },
        {
          step: 2,
          instruction: 'Enter 65505. What does float16 show?',
          expectedOutcome: 'float16 overflows to +∞. The exponent becomes all 1s with zero mantissa.',
        },
        {
          step: 3,
          instruction: 'Enter 65520, 65600, 100000. All map to +∞ in float16.',
          expectedOutcome: 'Any value > 65504 overflows float16, regardless of how large it is',
        },
      ],
    },
    {
      id: 'ch-cancellation',
      title: 'Observe Catastrophic Cancellation',
      description: 'Measure the dramatic loss of precision when subtracting nearly-equal numbers.',
      objective: 'Compute a−b where a ≈ b and measure the relative error across precisions.',
      difficulty: 'medium',
      steps: [
        {
          step: 1,
          instruction: 'Go to Laboratory → Error Analysis Lab → Cancellation tab. Use default values (1000000.1 and 1000000.0).',
          expectedOutcome: 'True difference = 0.1. See how each precision stores it.',
        },
        {
          step: 2,
          instruction: 'Observe the float32 computed sum column. The difference 1000000.1 − 1000000.0 in float32 is not 0.1.',
          expectedOutcome: 'float32 gives ~0.09375 — that is a 6% relative error from just one subtraction',
        },
        {
          step: 3,
          instruction: 'Now look at the float64 result. How many significant digits did we retain?',
          expectedOutcome: 'float64 gives ~0.099999 — better, but still only 5 significant digits (we "lost" 6 to cancellation)',
        },
        {
          step: 4,
          instruction: 'Explain: the inputs had 8 significant digits, the output has only 1–5. Where did the precision go?',
          expectedOutcome: 'The "cancelled" leading digits were subtracted away, leaving only the trailing noise digits',
        },
      ],
    },
    {
      id: 'ch-propagation',
      title: 'Watch Errors Accumulate',
      description: 'Use the Error Propagation Simulator to see how tiny rounding errors grow with iteration.',
      objective: 'Observe linear error growth in float32 accumulation vs float64.',
      difficulty: 'medium',
      steps: [
        {
          step: 1,
          instruction: 'In the Error Propagation Simulator above, set Step = 0.1, Precision = float32, Iterations = 1000.',
          expectedOutcome: 'See the error graph for accumulated addition in float32',
        },
        {
          step: 2,
          instruction: 'Press Play. Observe the error magnitude at iteration 1000.',
          expectedOutcome: 'Accumulated float32 error ≈ 10⁻⁵ — significant for 7-digit precision',
        },
        {
          step: 3,
          instruction: 'Switch precision to float64 and re-run. Compare the error scales.',
          expectedOutcome: 'float64 error ≈ 10⁻¹³ — 8 orders of magnitude smaller',
        },
        {
          step: 4,
          instruction: 'Increase iterations to 10,000. Does float32 error continue to grow?',
          expectedOutcome: 'Yes — error grows roughly linearly with iteration count (stable algorithm, but error accumulates)',
        },
      ],
    },
    {
      id: 'ch-compare',
      title: 'Float32 vs Float64 Head-to-Head',
      description: 'Compare stored precision of the same value across precisions.',
      objective: 'Quantify the precision difference between float32 and float64 for real constants.',
      difficulty: 'easy',
      steps: [
        {
          step: 1,
          instruction: 'Enter π = 3.14159265358979 in the Bit Visualizer. Compare float16, float32, float64 representations.',
          expectedOutcome: 'float16: 3.140625 (only 3 digits correct). float32: 3.1415927 (7 digits). float64: 3.14159265358979 (15 digits).',
        },
        {
          step: 2,
          instruction: 'Compute the absolute errors: |stored − true π| for each precision.',
          expectedOutcome: 'float16: ~1.3×10⁻³. float32: ~8.7×10⁻⁸. float64: ~4.4×10⁻¹⁶',
        },
        {
          step: 3,
          instruction: 'Now try 0.1. Notice that NONE of the precisions can store it exactly.',
          expectedOutcome: 'All three are approximations; float64 is just a much better approximation',
        },
      ],
    },
  ],

  // ─── 16. Summary ────────────────────────────────────────────────────────────
  summary: {
    keyPoints: [
      {
        title: 'Binary Cannot Represent All Decimals',
        description:
          '0.1, 0.3, and most decimal fractions are repeating binaries. Every store introduces ' +
          'a rounding error. This is not fixable — it is a mathematical property of binary representation.',
        icon: '🔢',
      },
      {
        title: 'IEEE 754 Defines Three Precisions',
        description:
          'float16: 3 sig-digits, 2 bytes. float32: 7 sig-digits, 4 bytes. float64: 15 sig-digits, 8 bytes. ' +
          'Choose based on accuracy requirement, not convenience.',
        icon: '📐',
      },
      {
        title: 'Machine Epsilon is the Precision Floor',
        description:
          'ε_mach = 2^(−p) is the smallest ε where 1 + ε ≠ 1. Every single floating-point operation ' +
          'introduces at most ½ε_mach relative error.',
        icon: 'ε',
      },
      {
        title: 'Catastrophic Cancellation Kills Precision',
        description:
          'Subtracting x − y where x ≈ y can amplify relative error by 1/|x−y|. ' +
          'Reformulate algebraically to avoid near-equal subtraction.',
        icon: '💥',
      },
      {
        title: 'Errors Grow Through Iteration',
        description:
          'Per-step errors of ε_mach accumulate linearly in stable algorithms and exponentially in unstable ones. ' +
          'Algorithm design must account for error growth — not just the per-step formula.',
        icon: '📈',
      },
    ],
    cheatSheetFormulas: [
      { label: 'Float value',       latex: 'x = (-1)^s \\times 2^{e-\\text{bias}} \\times 1.m', isKeyFormula: true },
      { label: 'Absolute error',    latex: 'E_{\\text{abs}} = |\\tilde{x} - x|'                                   },
      { label: 'Relative error',    latex: 'E_{\\text{rel}} = |\\tilde{x} - x|\\,/\\,|x|'                         },
      { label: 'Machine epsilon',   latex: '\\varepsilon_{\\text{mach}} = 2^{-p}',              isKeyFormula: true },
      { label: 'Rounding bound',    latex: '|fl(x) - x| \\leq \\tfrac{1}{2}\\varepsilon_{\\text{mach}}|x|'       },
      { label: 'float16 ε',         latex: '\\varepsilon_{16} = 2^{-10} \\approx 9.77 \\times 10^{-4}'           },
      { label: 'float32 ε',         latex: '\\varepsilon_{32} = 2^{-23} \\approx 1.19 \\times 10^{-7}'           },
      { label: 'float64 ε',         latex: '\\varepsilon_{64} = 2^{-52} \\approx 2.22 \\times 10^{-16}'          },
    ],
    nextSteps: [
      {
        label: 'Root Finding',
        description: 'Apply error analysis to iterative root-finding — bisection, Newton-Raphson, secant',
        path: '/root-finding',
      },
      {
        label: 'Error Analysis Lab',
        description: 'Freely experiment with float16/32/64 in the interactive laboratory',
        path: '/laboratory/error-analysis',
      },
    ],
  },
}
