# EduStream 🎓

EduStream inspired by live streaming platforms like Twitch and YouTube Live, but built specifically for education-focused content. EduStream is a role-based live teaching platform that allows teachers to broadcast live classes while students join as viewers, interact through real-time chat, and actively participate in quizzes and polls

## ✨ Core Features

-   **Interactive Live Sessions:** High-quality video streaming with low latency using WebRTC.
-   **Real-time Communication:** Built-in chat for instant Q&A and class discussions using Socket.IO.
-   **Engagement Tools:**
    -   **Live Quizzes:** Test student knowledge instantly during sessions.
    -   **Real-time Polls:** Gather feedback and opinions on the fly.
-   **Role-Based Access:** Distinct interfaces and permissions for **Teachers** (hosts) and **Students** (participants).
-   **Screen Sharing:** seamless screen sharing capabilities for demonstrators.
-   **Modern UI/UX:**
    -   Responsive design with a "wow" factor.
    -   **Dark/Light Mode** support with neon-tinted dark themes.
    -   Smooth animations using Framer Motion.
-   **Profile Management:** User avatars, profile personalization, and secure authentication.

## 🛠️ Tech Stack

### Frontend
-   **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
-   **Library:** [React](https://react.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend
-   **API:** Next.js API Routes (Serverless)
-   **Real-time Engine:** [Socket.IO](https://socket.io/) (Custom Server)
-   **Streaming:** [LiveKit](https://livekit.io/) (WebRTC SDK)
-   **Authentication:** JWT (JSON Web Tokens) & bcryptjs

### Database & Storage
-   **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
-   **Caching/PubSub:** [Redis](https://redis.io/) (ioredis)
-   **Image Storage:** [Cloudinary](https://cloudinary.com/)

## 🔄 Project Flow

### 1. Authentication Flow
-   **Sign Up/Login:** Users register as either a "Teacher" or "Student".
-   **Secure Access:** JWT tokens are issued upon login to secure protected routes and API endpoints.

### 2. Teacher Flow
-   **Dashboard:** Teachers access a dedicated dashboard to manage sessions.
-   **Create Session:** Teachers schedule or start generic/topic-specific live sessions.
-   **Go Live:** The teacher enters the "Meet" room, enabling camera/microphone and screen sharing.
-   **Manage Class:** Teachers can launch polls, broadcast messages, and moderate the session.

### 3. Student Flow
-   **Dashboard:** Students view specialized cards for Live, Upcoming, and Recent sessions.
-   **Join Session:** Students join via a link or a session ID from their dashboard.
-   **Interact:** Students participate by watching the stream, chatting, and responding to quizzes/polls in real-time.

## 📂 Folder Structure

```
edustream/
├── src/
│   ├── app/                # Next.js App Router pages & layouts
│   │   ├── api/            # Backend API routes (Auth, Sessions, LiveKit)
│   │   ├── dashboard/      # Teacher & Student Dashboard pages
│   │   ├── meet/           # Live Meeting Interface
│   │   ├── authpage/       # Login/Signup Page
│   │   ├── globals.css     # Global styles & Tailwind directives
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing Page
│   ├── components/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components (SessionCard, etc.)
│   │   ├── ui/             # shadcn/ui primitives (Button, Card, Input, etc.)
│   │   ├── DashboardFooter.tsx
│   │   ├── ProfileMenu.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── lib/                # Utilities, DB connection, & helper functions
│   ├── models/             # Mongoose Database Models (User, Session)
│   └── types/              # TypeScript definitions
├── public/                 # Static assets (images, icons)
├── SERVER.ts               # Custom Server entry point (Socket.IO + Next.js)
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Dependencies & Scripts
```

## 🙌 Acknowledgments

-   **Next.js Team:** For the amazing React framework.
-   **Vercel:** For hosting solutions and infrastructure.
-   **LiveKit:** For the robust WebRTC infrastructure.
-   **Shadcn:** For the beautiful and accessible UI components.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Abhinav Sharma**

-   **GitHub:** [Abhinavsharma005](https://github.com/Abhinavsharma005)
-   **Email:** [sharmaabhinav1013@gmail.com](mailto:sharmaabhinav1013@gmail.com)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---
