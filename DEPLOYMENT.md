# Deployment Guide for EduStream-2 🚀

## ❌ Do I need Vercel AND Render?
**No, you only need ONE platform.**

Because this project uses a detailed custom server (`server.ts`) that runs **both** your Next.js website **and** the real-time Socket.IO server in one place, you should host the **entire application** on a platform that supports "Long-Running Servers".

**We do NOT recommend Vercel** for this specific codebase because Vercel is designed for "Serverless" functions, which cannot keep a persistent Socket.IO connection open for chat and quizzes.

## ✅ Recommendation: Use Render OR Railway
Choose **one** of these platforms to host the entire app (Frontend + Backend + Sockets).

## 📋 Prerequisites

Before deploying, ensure you have the following accounts and connection strings:

1.  **MongoDB Atlas**: Get your connection string (`mongodb+srv://...`).
2.  **Cloudinary**: Get your Cloud Name, API Key, and API Secret.
3.  **LiveKit Cloud**: Get your URL, API Key, and Secret Key.
4.  **JWT Secret**: Generate a random string (e.g., `openssl rand -base64 32`).

## 🛠️ Recommended Platforms

We recommend platforms that support **long-running Node.js processes**:
-   **Railway** (Easiest & Best DX)
-   **Render** (Good free/paid tiers)
-   **DigitalOcean App Platform**
-   **VPS** (EC2, Droplets) with PM2

---

## 🚀 Option 1: Deploy on Railway (Recommended)

Railway automatically detects Next.js but we need to tell it to run our custom server.

1.  **Push your code** to GitHub.
2.  Create a **New Project** on Railway from your GitHub repo.
3.  **Configure Environment Variables** in Railway Dashboard:
    -   `NODE_ENV`: `production`
    -   `MONGODB_URI`: `your_mongodb_connection_string`
    -   `JWT_SECRET`: `your_random_secret`
    -   `NEXT_PUBLIC_LIVEKIT_URL`: `your_livekit_url`
    -   `LIVEKIT_API_KEY`: `your_livekit_key`
    -   `LIVEKIT_API_SECRET`: `your_livekit_secret`
    -   `CLOUDINARY_CLOUD_NAME`: `your_cloud_name`
    -   `CLOUDINARY_API_KEY`: `your_cloud_key`
    -   `CLOUDINARY_API_SECRET`: `your_cloud_secret`
    -   `NEXT_PUBLIC_APP_URL`: `https://your-project-name.up.railway.app` (The domain Railway gives you)

4.  **Update Start Command**:
    By default, Railway might try to run `pnpm start`. We need to ensure it runs `server.ts`.
    
    Go to **Settings** > **Deploy** > **Start Command** and set it to:
    ```bash
    tsx server.ts
    ```
    *(Note: Using `tsx` is fine for this scale. For maximum performance, you can compile with `tsc` first, but `tsx` is easier).*

5.  **Build Command**:
    Can remain default: `pnpm build` (or `npm run build`).

6.  **Deploy**!

---

## 🚀 Option 2: Deploy on Render

1.  Create a new **Web Service**.
2.  Connect your GitHub repo.
3.  **Environment**: `Node`
4.  **Build Command**: `pnpm install; pnpm build`
5.  **Start Command**: `pnpm dlx tsx server.ts`
6.  Add all **Environment Variables** (same as above).
7.  **Important**: Turn off "Auto-Deploy" initially to set up env vars first, or redeploy manually after setting them for the build to pick up public vars.

---

## ⚠️ Important Note on `server.ts`

Your `package.json` defines `"start": "next start"`. **This command only runs Next.js and skips your custom server.**

If you deploy to a generic Node.js host, you **MUST** run the server using:
```bash
npx tsx server.ts
```
OR update your `package.json`:
```json
"scripts": {
  "start": "NODE_ENV=production tsx server.ts"
}
```

## 🌐 Environment Variables Reference

```env
MONGODB_URI=
JWT_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_APP_URL=
```
