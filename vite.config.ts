import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Drop an MP3 at public/audio/happy-birthday.mp3 and it is picked up automatically.
// Without it, the card plays a built-in music-box version of the (public domain) melody.
const hasAudioFile = existsSync(
  fileURLToPath(new URL('./public/audio/happy-birthday.mp3', import.meta.url)),
)

export default defineConfig({
  // Relative base: works at https://<user>.github.io/<any-repo-name>/ and at a custom domain root.
  base: './',
  plugins: [react()],
  define: {
    __HAS_AUDIO_FILE__: JSON.stringify(hasAudioFile),
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
})
