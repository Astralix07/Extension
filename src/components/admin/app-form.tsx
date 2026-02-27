'use client';

import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { App } from '@/lib/types';
import { saveApp, generateDescriptionAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';

export function AppForm({ app }: { app?: App }) {
  const { toast } = useToast();
  const router = useRouter();
  const [description, setDescription] = useState(app?.description || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(saveApp, initialState);

  const [appName, setAppName] = useState(app?.name || '');
  const [appUrl, setAppUrl] = useState(app?.websiteUrl || '');

  useEffect(() => {
    if (state.success) {
      toast({ title: 'Success', description: state.message });
      router.push('/admin');
    } else if (state.message) {
      toast({ title: 'Error', description: state.message, variant: 'destructive' });
    }
  }, [state, toast, router]);

  const handleGenerateDescription = async () => {
    if (!appName) {
      toast({ title: 'App Name Required', description: 'Please enter an app name to generate a description.', variant: 'destructive'});
      return;
    }
    setIsGenerating(true);
    const result = await generateDescriptionAction(appName, appUrl);
    setIsGenerating(false);

    if (result.description) {
      setDescription(result.description);
      toast({ title: 'Description Generated', description: 'The AI-powered description has been added.'});
    } else if (result.error) {
       toast({ title: 'Generation Failed', description: result.error, variant: 'destructive'});
    }
  };

  return (
    <Card>
      <form action={dispatch}>
        <CardHeader>
          <CardTitle>{app ? 'Edit App' : 'Add New App'}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
            {app && <input type="hidden" name="id" value={app.id} />}
            <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="name">App Name</Label>
                    <Input id="name" name="name" defaultValue={app?.name} onChange={(e) => setAppName(e.target.value)} required />
                    {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" defaultValue={app?.category} required />
                    {state.errors?.category && <p className="text-sm text-destructive mt-1">{state.errors.category.join(', ')}</p>}
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="relative">
                <Textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} className="pr-28" required/>
                <Button type="button" variant="outline" size="sm" className="absolute top-2 right-2" onClick={handleGenerateDescription} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Wand2 className="h-4 w-4 mr-2" /><span>Generate</span></>}
                </Button>
              </div>
              {state.errors?.description && <p className="text-sm text-destructive mt-1">{state.errors.description.join(', ')}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" name="version" defaultValue={app?.version} required/>
                    {state.errors?.version && <p className="text-sm text-destructive mt-1">{state.errors.version.join(', ')}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="downloadUrl">Download URL</Label>
                    <Input id="downloadUrl" name="downloadUrl" type="url" defaultValue={app?.downloadUrl} required/>
                    {state.errors?.downloadUrl && <p className="text-sm text-destructive mt-1">{state.errors.downloadUrl.join(', ')}</p>}
                </div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
                    <Input id="websiteUrl" name="websiteUrl" type="url" defaultValue={app?.websiteUrl} onChange={(e) => setAppUrl(e.target.value)} />
                    {state.errors?.websiteUrl && <p className="text-sm text-destructive mt-1">{state.errors.websiteUrl.join(', ')}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" type="url" defaultValue={app?.imageUrl ?? ''} placeholder="https://..." required/>
                    {state.errors?.imageUrl && <p className="text-sm text-destructive mt-1">{state.errors.imageUrl.join(', ')}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="imageHint">Image Hint</Label>
                <Input id="imageHint" name="imageHint" defaultValue={app?.imageHint} placeholder="e.g. 'gaming mouse'"/>
                <p className="text-sm text-muted-foreground">One or two keywords for AI image generation hint.</p>
                {state.errors?.imageHint && <p className="text-sm text-destructive mt-1">{state.errors.imageHint.join(', ')}</p>}
            </div>
        </CardContent>
        <CardFooter className="justify-end">
          <SubmitButton label={app ? 'Save Changes' : 'Create App'} />
        </CardFooter>
      </form>
    </Card>
  );
}
