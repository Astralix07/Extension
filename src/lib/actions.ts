'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addApp, updateApp, deleteApp } from '@/lib/data';

const AppSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Must be a valid URL'),
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
