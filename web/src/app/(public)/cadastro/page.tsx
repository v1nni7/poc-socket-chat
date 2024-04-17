'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import api from '@/lib/api'
import Loading from '@/components/loading'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { SignupData, signupSchema } from '@/schemas/userSchema'

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  })

  const { toast } = useToast()
  const { push } = useRouter()

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      await api.post('/user', data)

      toast({
        title: 'Usuário cadastrado com sucesso',
        description: 'Agora você pode fazer login na plataforma',
      })

      push('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border p-4 shadow">
        <h1 className="text-xl font-semibold">Cadastrar-se na plataforma</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Nome"
              {...register('name')}
              disabled={isSubmitting}
            />

            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

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

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Confirmar senha"
              {...register('confirmPassword')}
              disabled={isSubmitting}
            />

            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <span className="mr-2">Cadastrar</span>
            {isSubmitting && <Loading color="#ffffff" darkColor="#000000" />}
          </Button>
        </form>

        <div className="mt-6 space-y-4 text-center">
          <Link href="/login" className="block hover:underline">
            Já possui uma conta?
          </Link>
        </div>
      </div>
    </main>
  )
}
