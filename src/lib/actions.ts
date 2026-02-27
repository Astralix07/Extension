'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addApp, updateApp, deleteApp } from '@/lib/data';
import { generateAppDescription } from '@/ai/flows/generate-app-description';

const AppSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  version: z.string().min(1, 'Version is required'),
  downloadUrl: z.string().url('Must be a valid URL'),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().default(''),
});

export async function saveApp(prevState: any, formData: FormData) {
  const validatedFields = AppSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to save app.',
    };
  }

  const { id, ...appData } = validatedFields.data;

  try {
    if (id) {
      await updateApp(id, appData);
    } else {
      await addApp(appData);
    }
  } catch (error) {
    return { message: 'Database Error: Failed to Save App.' };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/apps');

  const message = id ? 'App updated successfully.' : 'App created successfully.';
  return { success: true, message };
}

export async function deleteAppAction(id: string) {
    try {
        const success = await deleteApp(id);
        if (!success) throw new Error();
        revalidatePath('/admin');
        revalidatePath('/');
        return { message: 'Deleted app successfully.' };
    } catch (error) {
        return { message: 'Database Error: Failed to delete app.' };
    }
}

export async function generateDescriptionAction(appName: string, appUrl?: string) {
  if (!appName) {
    return { error: 'App name is required to generate a description.' };
  }
  
  try {
    const result = await generateAppDescription({ appName, appUrl: appUrl || undefined });
    return { description: result.description };
  } catch (error) {
    console.error('AI Error:', error);
    return { error: 'Failed to generate description due to an internal error.' };
  }
}
