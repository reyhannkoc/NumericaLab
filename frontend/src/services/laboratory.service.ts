import api from './api'
import type { ComparisonParams, ComparisonResult } from '@/types/laboratory.types'
import { COMPARISON_METHODS } from '@/config/laboratory'

interface SolveResponse {
  root: number
  iterations: Array<{ error: number }>
  converged: boolean
  function_value: number
}

export async function runSingleMethod(
  params: ComparisonParams,
  methodId: string,
): Promise<ComparisonResult> {
  const methodDef = COMPARISON_METHODS.find((m) => m.id === methodId)
  if (!methodDef) throw new Error(`Unknown method: ${methodId}`)

  const t0 = performance.now()

  const body: Record<string, unknown> = {
    method: methodDef.apiMethod,
    expression: params.expression,
    tolerance: params.tolerance,
    max_iterations: params.maxIterations,
  }

  if (methodDef.requiresInterval) {
    body.a = params.a
    body.b = params.b
  } else {
    body.x0 = params.x0
    if (methodId === 'secant') body.x1 = params.x1
  }

  if (methodDef.requiresDerivative) {
    body.derivative_expression = params.derivativeExpression
  }

  const { data } = await api.post<SolveResponse>(`/${params.category}/solve`, body)
  const elapsed = performance.now() - t0

  const history = (data.iterations ?? []).map((it: { error: number }) => it.error)
  const lastError = history.length > 0 ? history[history.length - 1] : 0

  return {
    methodId,
    methodName: methodDef.name,
    root: data.root ?? null,
    absoluteError: lastError,
    relativeError: data.root ? lastError / Math.abs(data.root) : 0,
    iterations: data.iterations?.length ?? 0,
    executionTimeMs: parseFloat(elapsed.toFixed(2)),
    converged: data.converged,
    stable: data.converged && Math.abs(data.function_value ?? 0) < params.tolerance * 10,
    convergenceHistory: history,
  }
}

export async function runComparison(params: ComparisonParams): Promise<ComparisonResult[]> {
  const results = await Promise.allSettled(
    params.selectedMethodIds.map((id) => runSingleMethod(params, id)),
  )

  return results
    .filter((r): r is PromiseFulfilledResult<ComparisonResult> => r.status === 'fulfilled')
    .map((r) => r.value)
}
