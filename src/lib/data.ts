import type { App } from './types';

// In a real app, this would be a database.
// For this example, we'll use an in-memory array.
let apps: App[] = [
  {
    id: 'memreduct',
    name: 'Mem Reduct',
    description: 'A lightweight, real-time memory management application to monitor and clean your system\'s memory. It provides detailed memory usage information and can free up memory with a single click.',
    category: 'Utility',
    version: '3.4',
    downloadUrl: 'https://github.com/henrypp/memreduct/releases/download/v.3.4/memreduct-3.4-bin.zip',
    websiteUrl: 'https://www.henrypp.com/product/memreduct',
    imageUrl: 'https://picsum.photos/seed/memreduct/600/400',
    imageHint: 'computer code'
  },
  {
    id: 'msi-afterburner',
    name: 'MSI Afterburner',
    description: 'The world’s most recognized and widely used graphics card overclocking utility. It gives you full control of your graphics cards, and lets you monitor your hardware in real-time.',
    category: 'Gaming',
    version: '4.6.5',
    downloadUrl: 'https://download.msi.com/uti_exe/vga/MSIAfterburnerSetup.zip',
    websiteUrl: 'https://www.msi.com/Landing/afterburner/graphics-cards',
    imageUrl: 'https://picsum.photos/seed/msi/600/400',
    imageHint: 'circuit board'
  },
  {
    id: 'antesports-mouse',
    name: 'Ant Esports Mouse Software',
    description: 'Customize your Ant Esports gaming mouse with this software. Adjust DPI, polling rate, RGB lighting, and program macros to get the competitive edge in your favorite games.',
    category: 'Gaming',
    version: 'GM320 Pro',
    downloadUrl: 'https://antesports.com/uploads/2022/07/Ant-Esports-GM320-Pro-Optical-Gaming-Mouse-Software.zip',
    websiteUrl: 'https://antesports.com/product/ant-esports-gm320-pro-wireless-gaming-mouse/',
    imageUrl: 'https://picsum.photos/seed/ant-esports/600/400',
    imageHint: 'gaming mouse'
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    description: 'A powerful, lightweight code editor for Windows, macOS, and Linux. It has built-in support for JavaScript, TypeScript, and Node.js and a rich ecosystem of extensions for other languages and runtimes.',
    category: 'Productivity',
    version: '1.85',
    downloadUrl: 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user',
    websiteUrl: 'https://code.visualstudio.com/',
    imageUrl: 'https://picsum.photos/seed/vscode/600/400',
    imageHint: 'programming screen'
  },
];

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getApps(): Promise<App[]> {
  await delay(100);
  return apps;
}

export async function getAppById(id: string): Promise<App | undefined> {
  await delay(100);
  return apps.find(app => app.id === id);
}

export async function getCategories(): Promise<string[]> {
  await delay(50);
  const categories = new Set(apps.map(app => app.category));
  return Array.from(categories);
}

export async function addApp(appData: Omit<App, 'id'>): Promise<App> {
  await delay(200);
  const newApp: App = {
    ...appData,
    id: appData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
  };
  apps.unshift(newApp);
  return newApp;
}

export async function updateApp(id: string, appData: Partial<App>): Promise<App | undefined> {
  await delay(200);
  const appIndex = apps.findIndex(app => app.id === id);
  if (appIndex === -1) {
    return undefined;
  }
  apps[appIndex] = { ...apps[appIndex], ...appData };
  return apps[appIndex];
}

export async function deleteApp(id: string): Promise<boolean> {
  await delay(200);
  const initialLength = apps.length;
  apps = apps.filter(app => app.id !== id);
  return apps.length < initialLength;
}
