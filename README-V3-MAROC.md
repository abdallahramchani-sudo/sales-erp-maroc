# Sales ERP Maroc — V3 mobile

ERP commercial mobile-first pour PME marocaines.

## Contexte Maroc
- Devise MAD / DH
- Fiche société: ICE, IF, RC, TP, coordonnées
- Fiche client: ICE, IF, RC, TP, TVA
- TVA configurable par produit et au niveau société (20% par défaut)
- Numérotation configurable devis/commandes/factures
- Paiements: espèces, carte, virement, chèque, prélèvement, autre
- Adresse de livraison et ville
- Mouvements de stock

> Les paramètres fiscaux sont configurables. Fais valider les mentions et règles de facturation par ton comptable/CGI applicable à ton activité.

## APK sans PC
Cette version contient un workflow GitHub Actions qui fabrique automatiquement un APK Android à partir d'une URL HTTPS de ton ERP.

1. Mets le projet dans un dépôt GitHub depuis ton téléphone.
2. Déploie le web sur Vercel/équivalent et récupère l'URL HTTPS.
3. GitHub → Actions → Build Android APK → Run workflow.
4. Saisis l'URL HTTPS.
5. Télécharge `app-debug.apk` depuis l'Artifact de l'exécution et installe-le sur Android.

L'APK est une coquille native Capacitor autour de l'ERP web: les données restent sur le serveur PostgreSQL.
