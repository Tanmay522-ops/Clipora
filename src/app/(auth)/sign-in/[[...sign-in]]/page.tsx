'use client';

import { useClerk, useSignIn } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import Loader from '@/components/global/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignInWithPasskey } from '../../_components/SignInWithPasskeyButton';


export default function Page() {
  const { signIn } = useSignIn();
  const { signOut } = useClerk();
  const signInWithPasskey = useSignInWithPasskey(); // ✅ use hook

  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // ← removed the if (!loaded || !signIn) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signIn) return; // ← guard moved here instead
    setErrors({});
    setIsLoading(true);

    try {
      const { error } = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (error) throw error;

      toast.success('Login successful!');
      router.push('/callback');
    } catch (err: any) {
      console.error(err);
      if (err.errors?.length > 0) {
        err.errors.forEach((error: any) => {
          switch (error.code) {
            case 'form_password_incorrect':
              setErrors((prev) => ({ ...prev, password: 'Incorrect password.' }));
              break;
            case 'form_identifier_not_found':
              setErrors((prev) => ({ ...prev, email: 'No account found with this email.' }));
              break;
            case 'strategy_for_user_invalid':
              setErrors((prev) => ({ ...prev, general: 'This account only supports Google Sign In.' }));
              break;
            default:
              setErrors((prev) => ({ ...prev, general: error.message || 'Authentication failed.' }));
          }
        });
      } else {
        setErrors({ general: 'An unexpected error occurred.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWith = async (strategy: OAuthStrategy) => {
    try {
      if (!signIn) return;
      await signOut();
      await signIn.sso({
        strategy,
        redirectUrl: '/callback',
        redirectCallbackUrl: '/callback',
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
        <p className="mt-2 text-sm text-neutral-400">Login to continue to Cliporra</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-2">
          <Label className="text-sm text-neutral-200">Email</Label>
          <Input
            type="email"
            placeholder="m@example.com"
            required
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:border-orange-400"
          />
          {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-neutral-200">Password</Label>
            <a href="/forgot-password" className="text-sm text-neutral-400 transition hover:text-white">
              Forgot Password?
            </a>
          </div>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:border-orange-400"
          />
          {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
        </div>

        {errors.general && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {errors.general}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 rounded-xl bg-white font-semibold text-black transition-all hover:bg-neutral-200"
        >
          <Loader loading={isLoading}>Login</Loader>
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-neutral-500">Or continue with</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => signInWith('oauth_google')}
          className="h-12 rounded-xl border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={signInWithPasskey}
          className="h-12 rounded-xl border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        >
          Sign in with Passkey
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-neutral-400">
        Don&apos;t have an account?{' '}
        <a href="/sign-up" className="font-medium text-white hover:underline">
          Sign Up
        </a>
      </div>
    </div>
  );
}