import { useUser } from '@/context/user-context'

export default function NameInput() {
  const { userName, setUserName } = useUser()

  return (
    <input
      type="text"
      className="my-2 h-10 w-full rounded-md border p-2 text-black"
      placeholder="Insira seu nome"
      onChange={(e) => setUserName(e.target.value)}
      value={userName}
    />
  )
}
