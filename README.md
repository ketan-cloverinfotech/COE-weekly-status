# CoE MoM Generator

A web app to automate weekly CoE Innovation Team Minutes of Meeting emails. Fill a form, click generate, copy-paste into Outlook.

## Features
- Pre-loaded with team data and all pending/hold items
- Auto-calculates next Friday for next meeting date
- One-click attendance toggle
- Move items between Pending ↔ Hold/Completed
- Generates rich HTML email (paste directly into Outlook with tables)
- Auto-saves to browser localStorage

## Quick Deploy to GitHub Pages

### Step 1: Create GitHub Repository
```bash
# Go to https://github.com/new and create a repo named: coe-mom-generator
# Keep it Public (required for free GitHub Pages)
```

### Step 2: Push Code
```bash
cd mom-app
git init
git add .
git commit -m "Initial commit - CoE MoM Generator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/coe-mom-generator.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will auto-trigger on push

### Step 4: Access Your App
After ~2 minutes, your app will be live at:
```
https://YOUR_USERNAME.github.io/coe-mom-generator/
```

## Local Development
```bash
npm install
npm run dev
```

## Customization
- Edit `vite.config.js` → change `base` if your repo name is different
- Edit `src/App.jsx` → modify team members, default items, etc.
