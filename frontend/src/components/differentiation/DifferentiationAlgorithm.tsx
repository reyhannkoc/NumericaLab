import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import { type DiffMethod, DEMO_X, DEMO_H, DEMO_LABEL, computeDerivative } from './differentiationDemoData'

interface Props {
  method: DiffMethod
}

type Row = Record<string, unknown>

export default function DifferentiationAlgorithm({ method }: Props) {
  const { derivative, fmt } = computeDerivative(method)

  const rows: Row[] = [
    {
      step: 'Evaluate',
      description: method === 'forward' ? `f(x+h) = f(${(DEMO_X + DEMO_H).toPrecision(4)})`
        : method === 'backward' ? `f(x−h) = f(${(DEMO_X - DEMO_H).toPrecision(4)})`
        : `f(x+h) = f(${(DEMO_X + DEMO_H).toPrecision(4)})`,
      value: fmt(derivative),
    },
    { step: 'Divide', description: `Divide by ${method === 'central' ? '2h = ' + (2 * DEMO_H).toExponential(2) : 'h = ' + DEMO_H.toExponential(2)}`, value: fmt(derivative) },
    { step: 'Result', description: `f'(x) ≈ ${fmt(derivative)}`, value: fmt(derivative) },
  ]

  return (
    <AlgorithmExecution<Row>
      iterations={rows}
      columns={[
        { key: 'step'        as never, header: 'Step',        tooltip: 'Computation step' },
        { key: 'description' as never, header: 'Description', tooltip: 'What is being computed', highlight: true },
        { key: 'value'       as never, header: 'Value',       tooltip: 'Numeric result', highlight: true },
      ]}
      status="converged"
      description={`${method.charAt(0).toUpperCase() + method.slice(1)} difference formula steps for the demonstration function f(x) = ${DEMO_LABEL}.`}
      executionLog={[
        `Method: ${method}`,
        `x = ${DEMO_X}, h = ${DEMO_H}`,
        `f'(x) ≈ ${derivative}`,
      ]}
    />
  )
}
