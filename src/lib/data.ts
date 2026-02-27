'use server';

import { turso } from './turso';
import type { App } from './types';
import { randomUUID } from 'crypto';

export async function getApps(): Promise<App[]> {
  try {
    // The `rows` property will be an array of objects, matching the App type.
    const rs = await turso.execute("SELECT * FROM apps ORDER BY name COLLATE NOCASE");
    return rs.rows as App[];
  } catch (e) {
    if (e instanceof Error && e.message.includes('no such table: apps')) {
      console.log("Table 'apps' not found. Returning empty array. Please create it and seed it if you want initial data.");
      return [];
    }
    console.error(e);
    // Don't throw the error on build time
    if (process.env.NODE_ENV === 'development') {
        throw e;
    }
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
    if (e instanceof Error && e.message.includes('no such table: apps')) {
      return undefined;
    }
    console.error(e);
    throw e;
  }
}

export async function addApp(appData: Omit<App, 'id'>): Promise<App> {
  const newApp: App = {
    id: randomUUID(),
    ...appData,
    websiteUrl: appData.websiteUrl || '', // Ensure websiteUrl is not undefined
  };

  await turso.execute({
    sql: "INSERT INTO apps (id, name, description, category, version, downloadUrl, websiteUrl, imageUrl, imageHint) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [newApp.id, newApp.name, newApp.description, newApp.category, newApp.version, newApp.downloadUrl, newApp.websiteUrl, newApp.imageUrl, newApp.imageHint],
  });
  return newApp;
}

export async function updateApp(id: string, appData: Omit<App, 'id'>): Promise<App | undefined> {
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

  return { id, ...appData, websiteUrl: appData.websiteUrl || '' };
}

export async function deleteApp(id: string): Promise<boolean> {
  const rs = await turso.execute({
    sql: "DELETE FROM apps WHERE id = ?",
    args: [id],
  });
  return rs.rowsAffected > 0;
}
