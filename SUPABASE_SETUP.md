# Guide d'Installation Supabase - Star's Clean Conciergerie

Ce guide vous explique comment configurer votre projet Supabase pour qu'il soit lié à votre application.

## 1. Récupérer les identifiants Supabase

1. Connectez-vous à votre [Tableau de bord Supabase](https://app.supabase.com/).
2. Allez dans **Project Settings** (l'icône engrenage en bas à gauche).
3. Cliquez sur **API**.
4. Copiez les deux valeurs suivantes :
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **Anon Key** (la clé publique `service_role` n'est pas nécessaire ici, utilisez bien la `anon public`).

## 2. Configurer AI Studio

1. Dans AI Studio Build, allez dans le menu **Settings** (ou Secrets).
2. Ajoutez les deux variables d'environnement suivantes :
   - `SUPABASE_URL` : Collez votre Project URL.
   - `SUPABASE_ANON_KEY` : Collez votre Anon Key.
3. Cliquez sur **Save**. L'application redémarrera pour prendre en compte ces clés.

## 3. Créer la table des Biens (Base de données)

1. Dans Supabase, allez dans l'onglet **SQL Editor** (icône `>_`).
2. Cliquez sur **New Query**.
3. Copiez et collez le script SQL suivant, puis cliquez sur **Run** :

```sql
-- Création de la table des propriétés
create table properties (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  category text check (category in ('studios', 'minivillas', 'villas')),
  location text not null,
  capacity text,
  beds numeric default 0,
  bathrooms numeric default 0,
  pmr boolean default false,
  "desc" text,
  images text[] default '{}',
  features text[] default '{}',
  "isVisible" boolean default true
);

-- Activer la sécurité Row Level Security (RLS)
alter table properties enable row level security;

-- Créer une politique pour permettre la lecture publique (pour le site)
create policy "Lecture publique pour tous" 
on properties for select 
using (true);

-- Créer une politique pour permettre toutes les actions (pour l'admin)
-- Note : Dans un vrai projet, on restreindrait cela aux utilisateurs authentifiés
create policy "Accès complet pour admin" 
on properties for all 
using (true);
```

## 4. Configurer le Stockage d'Images

1. Allez dans l'onglet **Storage** (icône seau).
2. Cliquez sur **New Bucket**.
3. Nommez le bucket : `property-images`.
4. Cochez la case **Public bucket** (très important pour que les images s'affichent sur le site).
5. Cliquez sur **Save**.
6. Cliquez sur **Policies** (à gauche dans Storage).
7. Dans la section `property-images`, cliquez sur **New Policy** pour autoriser l'upload :
   - Choisissez **Full customization**.
   - Nom : `Allow all uploads`.
   - Allowed operations : Cochez **INSERT**, **SELECT**, **UPDATE**, **DELETE**.
   - Policy definition (Target roles) : `public` (ou `authenticated` si vous utilisez l'auth).
   - Cliquez sur **Review** puis **Save**.

---
**Félicitations !** Votre application est maintenant entièrement liée à Supabase. Toutes les modifications faites dans le panel admin seront sauvegardées dans votre base de données et les images seront stockées dans votre bucket.
