# Empower – Amplifying Stories from Under-represented Communities

Empower is an open-source publishing platform that pairs **Next.js 14** with **Tailwind CSS 3** and **Sanity CMS** to provide a clean, inclusive Medium-like experience.  
Its goal is simple: make it effortless for writers from historically marginalised groups to publish, discover, and discuss authentic stories.

&nbsp;

## ✨  Key Features
- **Rich-text editing with media uploads** via Sanity Studio
- **Comment threads & reactions** (moderation-friendly)
- **Static generation + ISR** for speed, SEO, and real-time updates
- **Accessibility first**: semantic markup, keyboard navigation, and colour-contrast checks
- **Vercel Analytics & Edge Functions** ready

&nbsp;

## 🚀  Live Demo
Deployed on Vercel — check it out here:

```text
[https://empower.vercel.app](https://empower-lilac.vercel.app/)


# 1 Clone the repo
git clone https://github.com/tkflare1/empower-website.git
cd empower-website

# 2 Install dependencies
pnpm install        # or npm / yarn

# 3 Create .env.local and add your keys
#    NEXT_PUBLIC_SANITY_PROJECT_ID=...
#    NEXT_PUBLIC_SANITY_DATASET=production
#    NEXT_PUBLIC_SANITY_TOKEN=*****

# 4 Run the Next.js dev server
pnpm dev
# Studio is served automatically at /studio
