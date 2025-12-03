# 🎁 Gift Tracker PWA

A voice-powered Progressive Web App for recording gifts at baby showers, birthday parties, and other celebrations.

## ✨ Features

- 🎤 **Voice Recording**: Tap and speak - "Sarah gave us a blanket"
- 🤖 **AI Parsing**: Automatically extracts gifter name and gift description
- 👥 **Contact Matching**: Matches speakers to your contact list
- 📝 **Easy Editing**: Fix any mistakes with simple tap-to-edit
- 📤 **CSV Export**: Export ready for thank you card services
- 📱 **Installable**: Add to home screen like a native app
- 🔄 **Auto-Updates**: Get new features automatically
- ☁️ **Offline Ready**: Works without internet after first load

## 🚀 Quick Start

### Deploy in 2 Minutes
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the `public` folder onto the deploy zone
3. Copy your app URL
4. Open on your phone and add to home screen!

Full deployment guide: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

## 📱 How to Use

1. **Before the party**: Add your guest list contacts
2. **During the party**: Tap the mic button and say who gave what
3. **After the party**: Export the CSV for thank you cards

### Example Voice Commands
- "Sarah and Tom gave us a diaper bag"
- "From Aunt Lisa, a fifty dollar gift card"
- "John gave a baby blanket"

## 📂 Project Structure

```
gift-tracker-pwa/
├── public/
│   ├── index.html          # Main HTML file
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Offline functionality
│   ├── icon-192.png        # App icon (small)
│   ├── icon-512.png        # App icon (large)
│   └── src/
│       └── App.jsx         # React app code
├── package.json
├── DEPLOYMENT-GUIDE.md     # Detailed deployment instructions
└── README.md               # This file
```

## 🔄 Making Updates

1. Edit files in the `public` folder
2. Re-deploy to Netlify (drag & drop again)
3. Users automatically get notified of updates!

## 🎨 Customization

**Change colors**: Edit `manifest.json`  
**Change icons**: Replace `icon-192.png` and `icon-512.png`  
**Add features**: Edit `src/App.jsx`

## 🌟 Coming in Phase 2

- Direct integration with printing services
- Photo attachments
- Multi-device sync
- Bulk SMS thank yous

## 📋 Requirements

- Modern browser (Chrome, Safari, Firefox, Edge)
- HTTPS hosting (provided automatically by Netlify/Vercel)
- Microphone access for voice recording

## 💾 Data Privacy

All data is stored locally on your device. Nothing is sent to external servers except:
- Voice transcription (browser's native API)
- AI parsing (Claude API for gift extraction)

No personal data is stored on any server.

## 🆘 Support

See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for troubleshooting and detailed instructions.

---

Built with ❤️ using React, Tailwind CSS, and Claude AI
