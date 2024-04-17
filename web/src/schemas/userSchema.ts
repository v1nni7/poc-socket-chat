import { z } from 'zod'

const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Insira seu e-mail' })
    .email({ message: 'Insira um e-mail válido' }),
  password: z.string().min(1, { message: 'Insira sua senha' }),
  remember: z.boolean(),
})

const signupSchema = z
  .object({
    name: z.string().min(1, { message: 'Insira seu nome' }),
    email: z
      .string()
      .min(1, { message: 'Insira seu e-mail' })
      .email({ message: 'Insira um e-mail válido' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string().min(1, { message: 'Confirme sua senha' }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'As senhas não coincidem',
      })
    }

    return data
  })

export type SigninData = z.infer<typeof signinSchema>
export type SignupData = z.infer<typeof signupSchema>

export { signinSchema, signupSchema }
