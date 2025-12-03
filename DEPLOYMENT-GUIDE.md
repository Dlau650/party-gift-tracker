# 🎁 Gift Tracker PWA - Deployment Guide

## 🚀 Quick Deploy to Netlify (Recommended - 5 minutes)

### Option 1: Drag & Drop (Easiest!)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up/login (free account)
3. Drag the entire `public` folder onto the deploy zone
4. Done! You'll get a URL like `https://your-app-name.netlify.app`

### Option 2: GitHub Integration
1. Create a new GitHub repository
2. Push your code:
   ```bash
   cd gift-tracker-pwa
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Go to [app.netlify.com](https://app.netlify.com)
4. Click "Add new site" → "Import an existing project"
5. Connect to GitHub and select your repo
6. Build settings:
   - Build command: (leave empty)
   - Publish directory: `public`
7. Click "Deploy site"

## 📱 Installing on Your Phone

### iPhone (iOS)
1. Open the app URL in Safari (must be Safari!)
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. The app icon will appear on your home screen!

### Android
1. Open the app URL in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"
5. The app icon will appear with your other apps!

## 🔄 How Updates Work

When you update the app:
1. Make your code changes
2. Re-deploy to Netlify (drag & drop the updated `public` folder)
3. Users will see an "Update Available" banner at the top
4. They tap "Update Now" and get the latest version instantly!

No app store approvals needed! 🎉

## 📥 Importing Contacts from Partiful

### Method 1: Copy & Paste
1. Open your Partiful guest list
2. Copy names and contact info
3. In the app, tap "Import" button
4. Paste the data
5. Format per line: `Name, Phone, Email, Address`

### Method 2: Export from Partiful (if available)
1. Export guest list as CSV from Partiful
2. Copy the CSV content
3. Paste into the Import field in the app

## 🎨 Customizing the App

### Change App Colors
Edit `/public/manifest.json`:
```json
"theme_color": "#9333ea",  // Change this hex color
"background_color": "#ffffff"  // And this one
```

### Change App Name
Edit `/public/manifest.json`:
```json
"name": "Your Custom Name",
"short_name": "CustomName"
```

### Replace Icons
Replace these files in `/public/`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

## 🔧 Testing Locally

Before deploying, test on your computer:

```bash
cd gift-tracker-pwa
npm install
npm run dev
```

Open http://localhost:3000 in your browser

## 🌐 Alternative Hosting Options

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Click "Add New Project"
4. Import your GitHub repo
5. Deploy!

### GitHub Pages
1. Push code to GitHub
2. Go to repo Settings → Pages
3. Select branch and `/public` folder
4. Save
5. Your app will be at `https://yourusername.github.io/repo-name`

## 📊 Features Ready to Use

✅ Voice recording with speech-to-text  
✅ AI-powered gift parsing  
✅ Contact management with addresses  
✅ Import contacts (paste text or CSV)  
✅ Edit any entry  
✅ Export to CSV (ready for thank you cards!)  
✅ Works offline after first load  
✅ Auto-updates when you push changes  
✅ Installable on home screen  

## 🎯 Phase 2 Ideas (Future)

- Direct integration with thank you card printing services
- Bulk SMS thank you messages
- Photo attachment for each gift
- Share gift list with co-hosts
- Gift registry integration

## 💡 Tips

1. **Add contacts BEFORE the party** - this helps the AI match names better
2. **Test voice recording** - make sure browser permissions are granted
3. **Keep it simple** - say things like "Sarah gave us a blanket"
4. **Edit as needed** - the AI is good but not perfect, that's why editing exists!

## 🆘 Troubleshooting

**Voice recording not working?**
- Make sure you're using HTTPS (Netlify provides this automatically)
- Check browser microphone permissions
- Works best on Chrome (Android) and Safari (iOS)

**Can't install on home screen?**
- iOS: Must use Safari browser
- Android: Must use Chrome browser
- Make sure you're on the actual URL (not incognito mode)

**Updates not showing?**
- Force refresh: Pull down on the page
- Clear browser cache if needed
- Close and reopen the app

## 📞 Need Help?

The app saves everything locally on your device, so your data is private and secure. If you need changes to the app functionality, just let me know what features you'd like added!

---

**Your App URL:** (will be provided after deployment)

Enjoy your stress-free gift tracking! 🎉
