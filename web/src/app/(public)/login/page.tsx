'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import api from '@/lib/api'
import Loading from '@/components/loading'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SigninData, signinSchema } from '@/schemas/userSchema'
import { useSession } from '@/context/session-context'

export default function Login() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SigninData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      remember: false,
    },
  })

  const { push } = useRouter()
  const { setUser } = useSession()

  const onSubmit: SubmitHandler<SigninData> = async (data) => {
    try {
      const response = await api.post('/auth/sign-in', data)

      setUser(response.data)
      localStorage.setItem('session', JSON.stringify(response.data))

      push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border p-4 shadow">
        <h1 className="text-xl font-semibold">
          Acessar plataforma{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-indigo-800 bg-clip-text font-bold text-transparent">
            NanoMeet
          </span>
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="E-mail"
              {...register('email')}
              disabled={isSubmitting}
            />

            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <Input
                type="password"
                placeholder="Senha"
                {...register('password')}
                disabled={isSubmitting}
              />

              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="ml-0.5 flex items-center gap-2">
              <Checkbox
                id="remember"
                className="h-4 w-4"
                {...register('remember')}
                disabled={isSubmitting}
                onCheckedChange={(checked) => setValue('remember', !!checked)}
              />

              <label htmlFor="remember" className="text-sm">
                Lembre-se de mim
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <span className="mr-2">Acessar</span>
            {isSubmitting && <Loading color="#ffffff" darkColor="#000000" />}
          </Button>
        </form>

        <div className="mt-6 space-y-4 text-center">
          <Link href="/recuperar-senha" className="block hover:underline">
            Esqueceu a senha?
          </Link>

          <Link href="/cadastro" className="block hover:underline">
            Criar uma conta
          </Link>
        </div>
      </div>
    </main>
  )
}
