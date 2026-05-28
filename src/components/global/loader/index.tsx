import { Spinner } from './spinner'
import { cn } from '@/lib/utils'

type Props = {
  loading:boolean
  className?: string
  color?: string
  children?: React.ReactNode
}

const Loader = ({ loading, className, color, children }: Props) => {
  return loading ? (
    <div className={cn(className)}>
      <Spinner />
    </div>
  ) : (
    children
  )
}

export default Loader