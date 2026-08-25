# ChatWithMe

Full-stack real-time chat app — React + Vite + Tailwind frontend, Express +
MongoDB (Mongoose) + Socket.IO + JWT backend, images via Cloudinary. No
dummy/mock data anywhere — auth, chat, admin dashboard, and profile settings
all read and write to your real MongoDB database.

## What's included

- **Auth** — signup/login/logout with JWT in an httpOnly cookie. The first
  account ever created becomes an **admin** automatically.
- **Real-time chat** — instant message delivery, typing indicator, live
  online/offline status, and seen (read) receipts, all via Socket.IO.
- **Image messages** — attach a photo in chat; it's uploaded to Cloudinary
  and only the link is stored in MongoDB (keeps your Atlas free-tier small).
- **Profile settings** (`/settings`) — change your name and avatar.
- **Admin dashboard** (`/admin`, admin accounts only) — total users, total
  messages, online-now count, new signups this week, a 7-day activity
  chart, and a user table with search + suspend/reactivate + delete.
- **Unread badges** — per-contact unread counts in the sidebar.

## 1. Local setup

### Backend

```
cd Backend
npm install
```

Fill in `Backend/.env`:

```
PORT=3000
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/chatwithme
JWT_SECRET=<any long random string>
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=development
```

- `MONGO_URL` — MongoDB Atlas → create a free cluster at
  https://www.mongodb.com/cloud/atlas → **Database → Connect → Drivers** →
  copy the string, swap in your DB user/password.
- `CLOUDINARY_*` — free account at https://cloudinary.com → Dashboard shows
  all three values directly.

```
npm run dev
```

You should see `Server running on port: 3000` and `MongoDB connected: ...`.

### Frontend

```
cd Fronted
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). No `.env` needed
locally — it already falls back to `localhost:3000`.

## 2. Deploying: Vercel (frontend) + Render (backend) + MongoDB Atlas

**Important:** this app uses Socket.IO for real-time chat, which needs a
long-lived server connection. Vercel's backend hosting is serverless
(functions spin up per request and don't hold persistent connections), so
**Socket.IO will not work if the backend itself is deployed to Vercel.**
The frontend belongs on Vercel — the backend belongs on a regular Node host
like **Render** or **Railway**. This is the standard setup for this kind of
app and it's still completely free to run this way.

### Step 1 — MongoDB Atlas

Already covered above. Just make sure, in Atlas → **Network Access**, you
add `0.0.0.0/0` (allow from anywhere) so your Render server can reach it.

### Step 2 — Backend on Render

1. Push this repo to GitHub.
2. On https://render.com → **New → Web Service** → connect the repo.
3. Root directory: `Backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all the `Backend/.env` variables in Render's **Environment** tab,
   with two changes for production:
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-frontend.vercel.app` (set this after step 3,
     once you know your Vercel URL — comma-separate if you need more than one)
7. Deploy. Note the URL Render gives you, e.g.
   `https://chatwithme-api.onrender.com`.

### Step 3 — Frontend on Vercel

1. On https://vercel.com → **New Project** → import the repo.
2. Root directory: `Fronted`
3. Framework preset: Vite (auto-detected).
4. Add environment variables:
   - `VITE_API_URL=https://chatwithme-api.onrender.com/api`
   - `VITE_SOCKET_URL=https://chatwithme-api.onrender.com`
5. Deploy. Then go back to Render and set `CORS_ORIGIN` to this Vercel URL
   (step 2.6 above), and redeploy the backend so the cookie/CORS settings
   pick it up.

### Free-tier note

Render's free web services sleep after inactivity and take ~30–60s to wake
on the next request — the first login after idle time will feel slow. This
is normal on the free tier, not a bug in the app.

## Endpoints

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/check
PUT    /api/auth/update-profile

GET    /api/messages/users        (sidebar contacts, with unread counts)
GET    /api/messages/:id          (conversation with user :id)
POST   /api/messages/send/:id     (send a message — text and/or image)

GET    /api/admin/stats           (admin only)
GET    /api/admin/users           (admin only)
GET    /api/admin/weekly-activity (admin only)
PATCH  /api/admin/users/:id/suspend  (admin only)
DELETE /api/admin/users/:id       (admin only)
```

## Socket.IO events

```
getOnlineUsers   server -> client   array of currently-connected user IDs
newMessage       server -> client   a message that just arrived for you
typing           both directions    { senderId } / emitted with { receiverId }
stopTyping       both directions    same shape as typing
messagesSeen     server -> client   { by } — the other user just read your messages
```
