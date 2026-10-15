import type { APIRoute } from 'astro';
import { INDEXAR, url } from '../lib/config';

// Enquanto PUBLIC_INDEXAR não for "true", o site pede para não ser indexado.
export const GET: APIRoute = ({ site }) => {
  const corpo = INDEXAR
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL(url('sitemap.xml'), site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
