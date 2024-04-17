'use client'

import { useTheme } from 'next-themes'
import { Oval } from 'react-loader-spinner'

type LoadingProps = {
  width?: number
  height?: number
  color?: string
  darkColor?: string
  strokeWidth?: number
}

export default function Loading(props: LoadingProps) {
  const {
    width = 20,
    height = 20,
    strokeWidth = 4,
    color = '#ffffff',
    darkColor = '#ffffff',
  } = props

  const { resolvedTheme } = useTheme()

  return (
    <Oval
      width={width}
      height={height}
      strokeWidth={strokeWidth}
      color={resolvedTheme === 'dark' ? darkColor : color}
      secondaryColor={resolvedTheme === 'dark' ? color : darkColor}
    />
  )
}
