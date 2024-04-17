'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [show, setShow] = React.useState(true)

    return (
      <div className="relative flex w-full items-center">
        <input
          type={show ? type : 'text'}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            className="absolute right-1"
            onClick={() => setShow(!show)}
          >
            {show ? <Eye /> : <EyeOff />}
          </button>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
