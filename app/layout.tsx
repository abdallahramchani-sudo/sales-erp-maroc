import './globals.css';
import type { Metadata } from 'next';
import { MobileNav } from './mobile-nav';
export const metadata: Metadata={title:'Sales ERP',description:'ERP commercial mobile-first',manifest:'/manifest.webmanifest',viewport:'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',themeColor:'#111827'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}<MobileNav/></body></html>}
