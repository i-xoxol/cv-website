# Interactive CV & Portfolio

A professional portfolio website featuring a modern UI, interactive elements, and a developer-centric "terminal mode" for exploring skills and history.

![Project Status](https://img.shields.io/badge/status-live-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📸 Overview

*(Place screenshots here)*

## ✨ Features

- **Dual Mode Interface**: Standard graphical interface and a functional CLI/Terminal mode for geeks.
- **Interactive Timeline**: Visual history of professional experience.
- **Project Showcase**: Gallery of projects with tech stack details.
- **Contact Form**: Integrated with Google Gmail API for direct messaging.
- **Responsive Design**: Optimized for all devices.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS
- **Animations**: CSS / Framer Motion
- **Backend**: Node.js API Routes (Gmail integration)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Google Cloud Project with Gmail API enabled (for contact form)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/i-xoxol/cv-website.git
   cd cv-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Set up Google OAuth credentials:
     1. Create a `credentials.json` from Google Cloud Console.
     2. Generate a `token.json` (requires initial local auth flow).
     3. Place these in an `auth/` directory and set `GOOGLE_AUTH_PATH` in `.env`.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
