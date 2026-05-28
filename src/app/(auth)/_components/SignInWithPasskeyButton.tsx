'use client';

import { useSignIn } from '@clerk/nextjs';
import type { ActiveSessionResource } from '@clerk/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useSignInWithPasskey() {
    const { signIn, setActive } = useSignIn() as any;
    const router = useRouter();

    const signInWithPasskey = async () => {
        if (!signIn) return;

        try {
            const signInAttempt = await signIn?.authenticateWithPasskey({
                flow: 'discoverable',
            });

            if (signInAttempt?.status === 'complete') {
                await setActive({
                    session: signInAttempt.createdSessionId,
                    redirectUrl: '/callback',
                    navigate: async ({ session }: { session: ActiveSessionResource | null }) => {
                        if (session?.currentTask) {
                            console.log(session?.currentTask);
                            return;
                        }
                        router.push('/callback');
                    },
                });
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            // ✅ Handle empty or non-standard error objects
            if (!err || Object.keys(err).length === 0) {
                toast.error('Passkeys are not supported in this browser or were cancelled.');
                return;
            }

            // ✅ Handle DOMException (browser-level passkey errors)
            if (err instanceof DOMException) {
                if (err.name === 'NotAllowedError') {
                    toast.error('Passkey sign-in was cancelled or timed out.');
                } else {
                    toast.error(`Passkey error: ${err.message}`);
                }
                return;
            }

            // ✅ Handle Clerk-specific errors
            if (err.errors && err.errors.length > 0) {
                err.errors.forEach((error: any) => {
                    switch (error.code) {
                        case 'passkey_not_registered':
                            toast.error('No passkey registered for this account.');
                            break;
                        case 'passkey_pa_not_supported':
                            toast.error('Passkeys are not supported on this device.');
                            break;
                        default:
                            toast.error(error.message || 'An unexpected error occurred during passkey sign-in.');
                    }
                });
            } else {
                toast.error('An unexpected error occurred during passkey sign-in.');
            }
        }
    };

    return signInWithPasskey;
}