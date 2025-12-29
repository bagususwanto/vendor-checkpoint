'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLoginMutation } from '@/hooks/api/use-auth';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          toast.success('Login successful');
          router.push('/staff/dashboard');
        },
        onError: (error) => {
          console.error(error);
          toast.error('Invalid username or password');
        },
      },
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <ShieldCheck className="size-6" />
                  </div>
                  <span className="sr-only">Vendor Checkpoint</span>
                </a>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Vendor Checkpoint account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  disabled={loginMutation.isPending}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  disabled={loginMutation.isPending}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/login-cover.png"
              alt="Vendor Checkpoint"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
