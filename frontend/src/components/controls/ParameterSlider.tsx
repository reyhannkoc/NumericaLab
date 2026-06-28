import Slider from '@components/ui/Slider'
import type { SliderConfig } from '@/types/ui.types'

/**
 * Thin wrapper that connects a slider to a numerical parameter.
 * Includes the parameter name rendered in LaTeX via a tooltip.
 */
export default function ParameterSlider(props: SliderConfig & { className?: string }) {
  return <Slider {...props} />
}
