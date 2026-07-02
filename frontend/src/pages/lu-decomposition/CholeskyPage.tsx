import LessonPage from '@components/lesson/LessonPage'
import { CHOLESKY_CONFIG } from '@/config/lessons/cholesky'
import LUVisualization from '@components/lu/LUVisualization'
import LUAnimation from '@components/lu/LUAnimation'

export default function CholeskyPage() {
  return (
    <LessonPage
      config={CHOLESKY_CONFIG}
      primaryMethod="cholesky"
      renderVisualization={() => <LUVisualization method="cholesky" />}
      renderAnimation={() => <LUAnimation method="cholesky" />}
    />
  )
}
