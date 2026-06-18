# 🧸 Ted's Active Week with Lana

An interactive, illustrated storybook for **Lana** (age 5) and her best friend **Ted** the teddy bear — built from Lana's real school scrapbook.

Lana and Ted chat back and forth across the week: jujitsu class, a yummy chicken pizza, a bedtime story, the coziest sleep, and a wobbly gymnastics headstand. Every page is hand-drawn art, the characters **talk out loud with their own voices**, and a 5-year-old can read the whole thing by tapping one big button.

## ✨ What's inside
- **Hand-crafted SVG illustrations** — the same Lana (afro puffs!) and Ted (striped pjs) appear consistently on every page, in different outfits and scenes.
- **Two character voices** (no API key, works offline) using the browser's built-in speech engine:
  - **Lana** → bright, high-pitched, a little fast (a kid).
  - **Ted** → deep, slow, rumbly (a cuddly teddy bear).
  - A gentle **Storyteller** voice reads the narration.
- **Made for a 5-year-old's hands & eyes:**
  - One giant **▶ Read to me!** button to start.
  - The page reads itself aloud automatically; speech bubbles glow and bob as each character speaks.
  - **Tap the picture** to hear the page again.
  - The **Next ▶** button gently glows once the page finishes reading, so a non-reader knows what to tap.
  - Big candy buttons, page-turn animations, floating stars & hearts, and confetti at the end.
- **📷 Real photos** — a button reveals Lana's actual scrapbook pages.

## ▶ How to run
No installation, no build step. Either:

1. **Just open it:** double-click `index.html`.
   *(If the browser blocks the photos/voices on `file://`, use option 2.)*
2. **Serve it locally** (recommended):
   ```bash
   cd lana-and-ted-storybook
   python -m http.server 8753
   ```
   Then open **http://localhost:8753** in Chrome or Edge.

> 💡 Voices work best in **Chrome** or **Microsoft Edge** on a laptop/desktop, which include the "Zira" (Lana) and "David" (Ted) voices. The first tap of **Read to me!** turns the sound on.

## 🎙️ Upgrading to ElevenLabs later
The voices live in `js/voices.js`, isolated behind one function, `speakLine()`. When you're ready, replace its body with an ElevenLabs API call (one voice id for Lana, one for Ted) — nothing else in the app needs to change.

## 📁 Project structure
```
lana-and-ted-storybook/
├── index.html          # page shell: cover, book frame, controls, photo modal
├── css/style.css       # the whole design system + animations
├── js/
│   ├── characters.js   # reusable SVG art for Lana & Ted
│   ├── story.js        # the 8 pages: scenes + dialogue
│   ├── voices.js       # character voices (Web Speech API)
│   └── app.js          # the storybook engine (navigation, narration)
└── assets/             # the original scrapbook photos
```

Made with 💖 for Lana.
