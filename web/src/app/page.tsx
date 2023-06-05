"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSubmitUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = e.currentTarget[0].value;

    localStorage.setItem("username", value);
    router.push("/chat");
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmitUsername}
        className="w-full flex items-center justify-center gap-2"
      >
        <input
          type="text"
          placeholder="Username"
          className="p-2 rounded-lg outline-none placeholder:text-neutral-600 w-2/4 bg-transparent border-2 border-neutral-500 text-lg text-neutral-500 focus:border-neutral-600"
        />
        <button
          type="submit"
          className="bg-violet-500 p-2 border-2 border-violet-500 rounded-lg font-semibold text-neutral-300 hover:bg-violet-500/50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
