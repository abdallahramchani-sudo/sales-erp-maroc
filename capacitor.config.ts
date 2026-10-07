import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ma.saleserp.mobile',
  appName: 'Sales ERP Maroc',
  webDir: 'public',
  server: process.env.APP_URL ? { url: process.env.APP_URL, cleartext: false } : undefined,
};
export default config;
