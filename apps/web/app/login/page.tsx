import { LoginForm } from "@/app/login/components/login-form"
import { InteractiveBackground } from "@/components/interactive-background"

export default function LoginPage() {
  return (
    <div className="bg-linear-to-br from-background to-muted/20 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
       <InteractiveBackground color="59, 130, 246" />
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
