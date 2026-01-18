import { LoginForm } from "@/components/organisms/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      {/* Background Decorativo */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-30"></div>
      
      <LoginForm />
    </div>
  )
}
