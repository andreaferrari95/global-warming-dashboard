# 🌍 GreenPulse – Climate Data Explorer

GreenPulse is a modern, responsive web app built with React and Vite to visualize key climate indicators using real-world, up-to-date environmental datasets.

This project is part of my **study path at [Start2Impact University](https://www.start2impact.it/)**, where the goal was to design a clean, user-friendly dashboard that raises awareness about global warming.

---

## ✨ Features

- 📊 Interactive charts for:
  - Global land and ocean **temperatures**
  - Atmospheric **CO₂**, **CH₄ (Methane)**, and **N₂O (Nitrous Oxide)**
  - **Polar sea ice** extent

- 🌦️ Live weather widget with 7-day forecast
- ⚡ Powered by modern APIs and updated datasets
- 🧭 Easy navigation and mobile-first responsive layout
- 🌈 Light animations & skeleton loaders for a polished UX
- 📤 Export charts as PNG or PDF
- 💡 Built using best practices in component structure and data handling

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React + Vite** | Fast modern frontend development |
| **Hero UI** | Clean and accessible component library |
| **Recharts** | Lightweight charting library |
| **Framer Motion** | Smooth animations |
| **Tailwind CSS** | Utility-first styling (via Hero UI) |
| **Weatherbit API** | Real-time weather data |
| **Global Warming API** | Climate metrics and historical datasets |

---

## 🧱 Project Architecture

```
src/
├── api/                // API clients (co2, methane, weather etc.)
├── components/         // Shared and page-specific UI components
├── layouts/            // Reusable layout wrappers
├── pages/              // Route-based pages (Home, About, etc.)
├── utils/              // Custom hooks and utilities
├── styles/             // Custom global or component styles
```

### ✅ Highlights:
- API calls abstracted in `api/` modules (not directly in components)
- Functional components and React Hooks only
- Each component in its own folder (logic + optional styles)
- Skeletons and loading states using Hero UI
- Mobile-first responsiveness and conditional rendering
- Collapsible **weather widget** for small screens

---

## 🚀 How to Use Locally

### 1. Clone the repository

```bash
git clone https://github.com/andreaferrari95/global-warming-dashboard.git
cd global-warming-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your `.env` file

Create a file called `.env` at the root and add your Weatherbit API key:

```
VITE_WEATHERBIT_API_KEY=your_api_key_here
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the app running.

---

## 🌐 Deployment

This app is easily deployable via **Netlify**, **Vercel**, or **Firebase Hosting**.

If using **Netlify**:

1. Push your repo to GitHub
2. Create a Netlify account and connect the GitHub repo
3. Set build command to `npm run build`
4. Set publish directory to `dist`
5. Add the env variable `VITE_WEATHERBIT_API_KEY` in Netlify settings
6. Deploy!

---

## 📚 Data Sources

- [Global Warming API](https://global-warming.org/)
- [Weatherbit API](https://www.weatherbit.io/)

---

## 👤 Author & Credits

This project was developed as part of the **Front-End Development path** at [Start2Impact University](https://www.start2impact.it/), a learning platform focused on real-world skills.

If you'd like to collaborate, provide feedback, or just say hi:

- 💌 Email: `andreaferraridev@`
- 🌐 LinkedIn: [`Let's Connect!`](https://www.linkedin.com/in/andrea-ferrari-developer/)

---

## 📄 License

This project is for educational purposes and is open source under the MIT License.

---

> “Climate change is no longer some far-off problem; it is happening here, it is happening now.”  
> — Barack Obama
