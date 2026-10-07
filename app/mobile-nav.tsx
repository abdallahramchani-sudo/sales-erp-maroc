'use client';
import Link from 'next/link';
import {Home, Users, Package, FileText, ShoppingCart} from 'lucide-react';
const items=[['/','Accueil',Home],['/clients','Clients',Users],['/produits','Produits',Package],['/devis','Devis',FileText],['/commandes','Commandes',ShoppingCart]] as const;
export function MobileNav(){return <nav className="mobile-nav">{items.map(([href,label,Icon])=><Link href={href} key={href}><Icon size={20}/><span>{label}</span></Link>)}</nav>}
