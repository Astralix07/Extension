'use client';

import { useFormState } from 'react-dom';
import { login } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/submit-button';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const initialState = { message: null, success: false };
  const [state, dispatch] = useFormState(login, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/admin');
    } else if (state.message) {
      toast({ title: 'Login Failed', description: state.message, variant: 'destructive' });
    }
  }, [state, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
      <Card className="w-full max-w-sm">
        <form action={dispatch}>
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter the password to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
             {state.message && (
              <p className="text-sm text-destructive mt-1">{state.message}</p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton label="Login" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
