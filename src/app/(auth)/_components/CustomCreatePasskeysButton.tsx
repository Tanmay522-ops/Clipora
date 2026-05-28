'use client';

import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CreatePasskeyButtonProps {
    onSuccess?: () => void;
    onAlreadyExists?: () => void;
}

export function CreatePasskeyButton({
    onSuccess,
    onAlreadyExists,
}: CreatePasskeyButtonProps) {
    const { isSignedIn, user } = useUser();
    const [loading, setLoading] = useState(false);

    const createClerkPasskey = async () => {
        if (!isSignedIn) return;

        setLoading(true); // ✅ was missing

        try {
            await user?.createPasskey();
            toast.success('Passkey created successfully!');
            onSuccess?.();
        } catch (err: any) {
            // ✅ handle empty error object (browser cancelled or unsupported)
            if (!err || Object.keys(err).length === 0) {
                toast.error('Passkey registration was cancelled or is not supported in this browser.');
                return;
            }

            // ✅ handle DOMException (WebAuthn browser-level errors)
            if (err instanceof DOMException) {
                if (err.name === 'NotAllowedError') {
                    toast.error('Passkey registration was cancelled or timed out.');
                } else {
                    toast.error(`Passkey error: ${err.message}`);
                }
                return;
            }

            if (err.errors && err.errors.length > 0) {
                err.errors.forEach((error: any) => {
                    switch (error.code) {
                        case 'passkey_registration_cancelled':
                            toast.error('Passkey registration was cancelled.');
                            break;
                        case 'session_reverification_required':
                            toast.error(
                                'Please reauthenticate to add a new passkey. Log out and back in or open your account settings.'
                            );
                            break;
                        case 'passkey_already_exists':
                            toast.warning('You already have a registered passkey.');
                            onAlreadyExists?.();
                            break;
                        default:
                            toast.error('An unexpected error occurred during passkey creation.');
                    }
                });
            } else {
                toast.error('An unexpected error occurred during passkey creation.');
            }
        } finally {
            setLoading(false); // ✅ already correct
        }
    };

    return (
        <Button onClick={createClerkPasskey} disabled={loading}>
            {loading ? 'Registering…' : 'Register Passkey'}
        </Button>
    );
}