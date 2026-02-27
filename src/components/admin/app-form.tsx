'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { App } from '@/lib/types';
import { saveApp } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';

export function AppForm({ app }: { app?: App }) {
  const { toast } = useToast();
  const router = useRouter();
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(saveApp, initialState);

  useEffect(() => {
    if (state.success) {
      toast({ title: 'Success', description: state.message });
      router.push('/admin');
    } else if (state.message) {
      toast({ title: 'Error', description: state.message, variant: 'destructive' });
    }
  }, [state, toast, router]);

  return (
    <Card>
      <form action={dispatch}>
        <CardHeader>
          <CardTitle>{app ? 'Edit App' : 'Add New App'}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
            {app && <input type="hidden" name="id" value={app.id} />}
            <div className="space-y-2">
                <Label htmlFor="name">App Name</Label>
                <Input id="name" name="name" defaultValue={app?.name} required />
                {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={app?.description} rows={5} required/>
              {state.errors?.description && <p className="text-sm text-destructive mt-1">{state.errors.description.join(', ')}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" type="url" defaultValue={app?.url} required/>
                {state.errors?.url && <p className="text-sm text-destructive mt-1">{state.errors.url.join(', ')}</p>}
            </div>
        </CardContent>
        <CardFooter className="justify-end">
          <SubmitButton label={app ? 'Save Changes' : 'Create App'} />
        </CardFooter>
      </form>
    </Card>
  );
}
