# Sales ERP V2 — mobile-first

ERP commercial Next.js + Prisma + PostgreSQL, conçu pour être utilisé sur ordinateur et téléphone.

## Fonctionnalités V2
- Dashboard commercial
- CRM clients: création et liste
- Produits: création, prix, stock
- Devis: création multi-lignes
- Commandes: suivi + génération de facture
- Factures: suivi des paiements
- Paiements: cash, carte, virement, chèque, autre
- PWA installable sur Android/iPhone depuis le navigateur
- Interface mobile-first avec navigation basse

## Installation
1. `npm install`
2. Copier `.env.example` vers `.env` et renseigner `DATABASE_URL` PostgreSQL.
3. `npx prisma generate`
4. `npm run db:push`
5. `npm run db:seed`
6. `npm run dev`

Ouvrir `http://localhost:3000`.

## Téléphone
Déployer l'application sur un hébergement HTTPS (Vercel, VPS, etc.), ouvrir l'URL sur le téléphone puis choisir **Ajouter à l'écran d'accueil / Installer l'application**. La PWA fournit une expérience proche d'une application native.

## Production
Pour une vraie mise en production: PostgreSQL managé, authentification sécurisée (Auth.js/Clerk), stockage fichiers, sauvegardes, HTTPS, permissions serveur et audit complet.
