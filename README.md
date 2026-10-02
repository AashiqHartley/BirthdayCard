# 19th Birthday Card

An interactive birthday card: open the card → music → balloons → confetti → photos → your message.

## Personalise it

Everything she reads lives in **`src/content.ts`**:

- `letter.paragraphs` — **your message** (one string per paragraph)
- `letter.greeting`, `letter.signOff`, `letter.signature` — greeting and your name
- `name` — her name (optional; shows as "Happy 19th Birthday, Name")
- photo captions and alt text

Photos are in `src/assets/photos/`. To swap one, replace the file (keep the name) or add a new import in `content.ts`.

## Music

By default the card plays a built-in music-box version of "Happy Birthday" (the melody is public domain), so it works with no audio file.

To use your own recording, save it as `public/audio/happy-birthday.mp3` and rebuild. It's picked up automatically. Only use audio you have the rights to share.

## Run locally

```bash
npm install
```

```bash
npm run dev
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes `dist/`.

Asset paths are relative, so it works at `https://<user>.github.io/<repo-name>/` whatever the repo is called.
