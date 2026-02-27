'use server';

import { turso } from './turso';
import type { App } from './types';
import { randomUUID } from 'crypto';

export async function getApps(): Promise<App[]> {
  try {
    const rs = await turso.execute("SELECT * FROM apps ORDER BY name COLLATE NOCASE");
    // The `rows` from turso are not plain objects, so we need to convert them
    // to avoid errors when passing them to client components.
    return rs.rows.map(row => ({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      url: row.url as string,
    }));
  } catch (e) {
    console.error("Database Error: Failed to fetch apps.", e);
    // Return an empty array to prevent the app from crashing.
    return [];
  }
}

export async function getAppById(id: string): Promise<App | undefined> {
  try {
    const rs = await turso.execute({
      sql: "SELECT * FROM apps WHERE id = ?",
      args: [id],
    });
    if (rs.rows.length === 0) {
      return undefined;
    }
    const row = rs.rows[0];
    return {
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        url: row.url as string,
    };
  } catch (e) {
     console.error(`Database Error: Failed to fetch app with id '${id}'.`, e);
    // Return undefined to allow the page to render a 'Not Found' state.
    return undefined;
  }
}

export async function addApp(appData: Omit<App, 'id'>): Promise<App> {
  const newApp: App = {
    id: randomUUID(),
    ...appData,
  };
  try {
    await turso.execute({
      sql: "INSERT INTO apps (id, name, description, url) VALUES (?, ?, ?, ?)",
      args: [newApp.id, newApp.name, newApp.description, newApp.url],
    });
  } catch(e) {
    console.error("Database Error: Failed to add app.", e);
    throw new Error('Database Error: Failed to add app.');
  }
  return newApp;
}

export async function updateApp(id: string, appData: Omit<App, 'id'>): Promise<App | undefined> {
  try {
    const result = await turso.execute({
      sql: "UPDATE apps SET name = ?, description = ?, url = ? WHERE id = ?",
      args: [
        appData.name,
        appData.description,
        appData.url,
        id,
      ],
    });

    if (result.rowsAffected === 0) {
      return undefined; // App with ID not found
    }
  } catch(e) {
    console.error("Database Error: Failed to update app.", e);
    throw new Error('Database Error: Failed to update app.');
  }

  return { id, ...appData };
}

export async function deleteApp(id: string): Promise<boolean> {
  try {
    const rs = await turso.execute({
      sql: "DELETE FROM apps WHERE id = ?",
      args: [id],
    });
    return rs.rowsAffected > 0;
  } catch(e) {
    console.error("Database Error: Failed to delete app.", e);
    return false;
  }
}


export async function getAdminPassword(): Promise<string | undefined> {
  try {
    const rs = await turso.execute("SELECT password FROM admin WHERE id = 1");
    if (rs.rows.length === 0) {
      return undefined;
    }
    const row = rs.rows[0];
    return row.password as string;
  } catch (e) {
    console.error(`Database Error: Failed to fetch admin password.`, e);
    return undefined;
  }
}
