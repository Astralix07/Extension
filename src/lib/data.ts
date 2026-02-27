'use server';

import { turso } from './turso';
import type { App } from './types';
import { randomUUID } from 'crypto';

export async function getApps(): Promise<App[]> {
  try {
    const rs = await turso.execute("SELECT * FROM apps ORDER BY name COLLATE NOCASE");
    return rs.rows as App[];
  } catch (e) {
    if (e instanceof Error && (e.message.includes('no such table: apps') || e.message.includes('Unexpected status code while fetching migration jobs: 400'))) {
       console.log("Table 'apps' not found or connection error. Attempting to create it.");
      try {
        await turso.execute(`
          CREATE TABLE apps (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            url TEXT NOT NULL
          );
        `);
        console.log("Table 'apps' created successfully.");
        return [];
      } catch (createError) {
        console.error("Failed to create 'apps' table:", createError);
        return [];
      }
    }
    console.error("Database Error: Failed to fetch apps. This might be due to connection issues, invalid credentials, or the 'apps' table not existing. Returning an empty list to prevent a crash.", e);
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
    return rs.rows[0] as App;
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
