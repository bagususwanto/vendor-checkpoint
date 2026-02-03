import { InteractiveBackground } from '@/components/interactive-background';
import { LoginForm } from './components/login-form';
import { LandingFooter } from '@/app/components/landing-footer';
import { LoginHeader } from './components/login-header';

export default function LoginPage() {
  return (
    <div className="bg-linear-to-br from-background to-muted/20 flex min-h-svh flex-col relative">
      <InteractiveBackground color="59, 130, 246" />
      <LoginHeader />
      <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10 z-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>
      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
  );
}
