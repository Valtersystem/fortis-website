import { defineConfig } from 'astro/config';

// SITE_URL e BASE_PATH vêm do ambiente (ver .env.example).
// GitHub Pages de projeto: SITE_URL=https://<utilizador>.github.io  BASE_PATH=/<repositorio>
// Domínio próprio / Netlify: SITE_URL=https://www.exemplo.pt        BASE_PATH=/
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
});
