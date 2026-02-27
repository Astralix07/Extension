'use server';

import { turso } from './turso';
import type { App } from './types';
import { randomUUID } from 'crypto';

export async function getApps(): Promise<App[]> {
  try {
    const rs = await turso.execute("SELECT * FROM apps ORDER BY name COLLATE NOCASE");
    return rs.rows as App[];
  } catch (e) {
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
    websiteUrl: appData.websiteUrl || '', // Ensure websiteUrl is not undefined
  };
  try {
    await turso.execute({
      sql: "INSERT INTO apps (id, name, description, category, version, downloadUrl, websiteUrl, imageUrl, imageHint) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [newApp.id, newApp.name, newApp.description, newApp.category, newApp.version, newApp.downloadUrl, newApp.websiteUrl, newApp.imageUrl, newApp.imageHint],
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
      sql: "UPDATE apps SET name = ?, description = ?, category = ?, version = ?, downloadUrl = ?, websiteUrl = ?, imageUrl = ?, imageHint = ? WHERE id = ?",
      args: [
        appData.name,
        appData.description,
        appData.category,
        appData.version,
        appData.downloadUrl,
        appData.websiteUrl || '',
        appData.imageUrl,
        appData.imageHint,
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

  return { id, ...appData, websiteUrl: appData.websiteUrl || '' };
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
