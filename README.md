# AI Medical Symptom Checker (Educational)

An advanced, highly polished, production-ready full-stack AI-powered medical symptom checker designed **strictly for educational purposes**. It helps users learn about possible medical conditions based on physical complaints, duration, severity, and demographics while strictly enforcing clinical security limits, refusing to prescribe treatments or dosages, and advising clinical physical visits.

## 🌟 Key Features

* **Advanced Educational Symptom Analysis**: Secured server-side Google Gemini 3.5 Flash prompts mapping patient characteristics safely to peer-reviewed clinical knowledge.
* **Emergency Keyword Detection**: Real-time evaluation of critical symptoms (e.g., chest pain, difficulty breathing, stroke markers) displaying an active red warning alert.
* **Interactive History Tracker**: Save, delete, or load historical evaluations stored directly in your browser's private local sandbox.
* **Sophisticated Dark UI Theme**: A modern glassmorphic interface with soft cyan accents, smooth focus indicators, responsive bento layouts, and clear print media styles.
* **Report Print & PDF Exports**: Beautifully formatted stylesheet layouts optimized for system printing and PDF saving, ideal for sharing with healthcare providers.
* **Responsive Layouts**: Designed desktop-first for dense multi-pane interfaces, and gracefully adapted with collapsible drawers and mobile headers.
* **Complete Clinical Forms**: Character counts, active validation, conditional pregnancy selectors, and vital signs indicators.
* **Health Resource Sections**: Built-in FAQ cards, detailed privacy protocols, full medical disclaimers, about page, and contact helpline directories.

## 🛠️ Tech Stack

* **Frontend**: React (v19) with Vite (v6), Tailwind CSS (v4), and Lucide React icons.
* **Backend**: Node.js & Express (v4) with TypeScript type definitions.
* **AI Engine**: `@google/genai` SDK with custom clinical system instructions and strict JSON schema structures.
* **Local Storage**: Sandbox database persistence.

## 📁 Folder Structure

```
.
├── server.ts               # Secure Express application server with API proxying
├── package.json            # Runtime dependencies and esbuild bundle configurations
├── index.html              # Core application entrypoint
├── metadata.json           # AI Studio applet configurations
├── src/
│   ├── main.tsx            # React app renderer
│   ├── App.tsx             # Main layout, state machine, and overlay manager
│   ├── index.css           # Global Tailwind directives, scrollbars, and print stylesheets
│   ├── types.ts            # Type definitions for form inputs and analysis schemas
│   └── components/
│       ├── Header.tsx           # Brand header, tab manager, and theme controls
│       ├── SymptomForm.tsx      # Comprehensive questionnaire, real-time validators
│       ├── ResultView.tsx       # Beautiful cards, confidence matches, PDF actions
│       ├── EmergencyBanner.tsx  # Red-alert advisory component
│       ├── FAQ.tsx              # Interactive category cards
│       ├── About.tsx            # Mission statement and educational pillars
│       ├── Contact.tsx          # Contact form and emergency helpline lists
│       ├── HistoryList.tsx      # Local storage review list
│       ├── PrivacyPolicy.tsx    # Non-tracking safety protocols
│       └── DisclaimerPage.tsx   # Legal disclaimers & FDA compliance guidelines
```

## ⚙️ Environment Variables

Copy `.env.example` to `.env` to configure your API Credentials:

```env
# GEMINI_API_KEY: Required for secure, server-side Gemini content generation.
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
APP_URL="http://localhost:3000"
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up API Credentials
Configure your `GEMINI_API_KEY` in your workspace Secrets or local `.env` file.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build & Start Production Server
```bash
npm run build
npm start
```

## 📸 Screenshots & Aesthetics

The application implements a premium **Sophisticated Dark** visual scheme featuring:
* Immersive slate canvases with subtle grid alignments (`bg-slate-950`).
* High-contrast glass card elements (`bg-slate-900/40 border-slate-800`).
* Emerald/Cyan highlights representing clinical expertise (`text-cyan-400 border-cyan-500/30`).
* Elegant micro-animations and smooth sliding side panels for histories.

## 🛡️ License

This project is licensed under the Apache-2.0 License.

---

### 🚨 Educational Reminder
This application is for educational purposes only. It does not provide medical diagnosis or treatment. Always consult a qualified healthcare professional.
