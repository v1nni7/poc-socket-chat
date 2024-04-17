import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type VideoPlayerGridProps = {
  length: number
  children: ReactNode
}

export default function VideoPlayerGrid(props: VideoPlayerGridProps) {
  const { length, children } = props

  const gridLayout: { [key: number]: string } = {
    1: 'grid-cols-1 w-full max-w-4xl mx-auto',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  const displayGridLayout = gridLayout[length + 1] || 'grid-cols-4'

  return (
    <div className={twMerge('grid flex-1 gap-4 pt-4', displayGridLayout)}>
      {children}
    </div>
  )
}
