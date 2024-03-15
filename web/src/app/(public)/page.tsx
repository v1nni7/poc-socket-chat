'use client'

import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { nanoid } from 'nanoid'

export default function Home() {
  const { push } = useRouter()

  const schema = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    idToCall: z.string().min(1, { message: 'ID de conexão é obrigatório' }),
  })

  type SchemaData = z.infer<typeof schema>

  const { register, handleSubmit } = useForm<SchemaData>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<SchemaData> = (data) => {
    try {
      push(`/${data.idToCall}`)
    } catch (error) {
      console.log(error)
    }
  }

  const createCall = () => {
    const callId = nanoid(10)

    push(`/${callId}`)
  }

  const joinInCall = (callId: string) => {
    push(`/${callId}`)
  }

  return (
    <>
      <div className="group absolute left-6 top-6">
        <BsFillQuestionCircleFill className="text-2xl" />

        <p className="mt-4 hidden w-full max-w-md rounded-xl bg-slate-800 p-2 text-justify group-hover:block">
          Para usar o sistema é bem simples, basta pegar o ID de conexão da
          pessoa que você quer entrar em contato e colocar no campo de ID de
          conexão e clicar em ligar.
        </p>
      </div>

      <section className="mx-auto flex h-screen max-w-xl items-center justify-center">
        <div className=" space-y-4 text-center">
          <h1 className="text-4xl font-bold">
            Videochamadas para equipes e clientes
          </h1>
          <p className="text-lg">
            Converse com seus colegas e clientes em tempo real com videochamadas
            e compartilhamento de tela
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-xs space-y-4"
          >
            <input
              type="text"
              {...register('name')}
              placeholder="Nome"
              className="h-12 w-full rounded-xl bg-slate-900 p-2 outline-none focus:bg-slate-800/40"
            />

            <input
              type="text"
              placeholder="Insira o ID de conexão"
              {...register('idToCall')}
              className="h-12 w-full rounded-xl bg-slate-900 p-2 outline-none focus:bg-slate-800/40"
            />

            <button
              onClick={() => joinInCall('TqkCA7slzO')}
              className="h-12 w-full rounded-xl bg-slate-800 px-4 hover:bg-slate-800/80"
            >
              Entrar
            </button>
          </form>

          <button
            onClick={createCall}
            className="rounded-xl bg-blue-800 p-2.5 transition-colors hover:bg-blue-800/80"
          >
            Criar chamada
          </button>
        </div>
      </section>
    </>
  )
}
