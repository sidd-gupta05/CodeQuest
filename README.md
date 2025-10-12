LabSphere is a modern web platform for managing **labs, doctors, and patients** with seamless authentication, booking, and verification flows. Built with [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/), it provides a scalable and responsive application foundation.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://labsphere-three.vercel.app](http://labsphere-three.vercel.app) in your browser to see the app.

You can start editing the UI by modifying files in the `app/` directory (e.g., `app/page.tsx`). The app will auto-update as you make changes.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## ⚙️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Authentication**: Supabase (Email, Phone OTP, Social Logins) + Twilio OTP integration
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase Storage for certificates and documents
- **Deployment**: Vercel (for frontend)

## 📖 Learn More

To dive deeper into the core technologies:

- [Next.js Documentation](https://nextjs.org/docs) – Next.js features and API.
- [Supabase Documentation](https://supabase.com/docs) – Authentication, Database, and Storage.
- [Prisma Documentation](https://www.prisma.io/docs) – Database ORM for PostgreSQL.

## 🚢 Deployment

The easiest way to deploy **LabSphere** is to use [Vercel](https://vercel.com/new) for the frontend.
For the backend (Supabase + PostgreSQL), check out the [Supabase Deployment Guide](https://supabase.com/docs/guides/hosting/overview).
