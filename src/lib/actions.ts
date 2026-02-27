'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addApp, updateApp, deleteApp, getAdminPassword } from '@/lib/data';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
    
    revalidatePath('/admin');
    revalidatePath('/');
    
    const message = id ? 'App updated successfully.' : 'App created successfully.';
    return { success: true, message };
  } catch (error) {
    return { message: 'Database Error: Failed to Save App.' };
  }
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

const LoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Password is required.',
    };
  }

  const { password } = validatedFields.data;
  const adminPassword = await getAdminPassword();
  
  if (!adminPassword) {
    return { message: 'Admin password not set up in the database. Please run the provided SQL query.' };
  }

  if (password === adminPassword) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    cookies().set('session', 'admin-logged-in', { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return { success: true };
  }

  return { message: 'Invalid password.' };
}

export async function logout() {
  cookies().delete('session');
  redirect('/admin/login');
}
