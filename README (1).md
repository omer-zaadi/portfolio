# Omer Zaadi — Portfolio

Personal portfolio built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
omer-zaadi-portfolio/
├── app/
│   ├── layout.tsx        # Root layout (Navbar included here)
│   ├── page.tsx          # Home page
│   ├── projects/
│   │   └── page.tsx      # Projects page
│   ├── resume/
│   │   └── page.tsx      # Resume page
│   └── about/
│       └── page.tsx      # About page
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── PageHeader.tsx
├── lib/
│   └── data.ts           # ← All site content lives here
└── public/
    ├── logo.png
    └── crew-management.png
```

## Updating Content

All text, links, projects, and skills are in **`lib/data.ts`**.
To update your GitHub/LinkedIn links, edit the `contact` object in that file.

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Vercel auto-detects Next.js — click Deploy

Done.
