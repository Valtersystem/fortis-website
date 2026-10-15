/**
 * Google Analytics 4 só é carregado depois de o visitante aceitar cookies de medição.
 * Sem PUBLIC_GA4_ID não há analytics, nem cookies, nem banner.
 */
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA4_ID = (import.meta.env.PUBLIC_GA4_ID ?? '').trim();
const CHAVE = 'fortis-consentimento';
type Escolha = 'aceite' | 'recusado';

function lerEscolha(): Escolha | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === 'aceite' || v === 'recusado' ? v : null;
  } catch {
    return null;
  }
}
function guardarEscolha(v: Escolha) {
  try { localStorage.setItem(CHAVE, v); } catch { /* ignora */ }
}

let carregado = false;
function carregarGA() {
  if (carregado || !GA4_ID) return;
  carregado = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(s);
}

function apagarCookiesGA() {
  document.cookie.split(';').forEach((c) => {
    const nome = c.split('=')[0].trim();
    if (nome.startsWith('_ga')) {
      const dominio = location.hostname.split('.').slice(-2).join('.');
      document.cookie = `${nome}=; Max-Age=0; path=/`;
      document.cookie = `${nome}=; Max-Age=0; path=/; domain=.${dominio}`;
    }
  });
}

/** Regista um evento no GA4 (só se houver consentimento e GA4 carregado). */
export function track(evento: string, params: Record<string, string> = {}) {
  window.gtag?.('event', evento, params);
}

export function iniciarAnalytics() {
  // Cliques medidos: elementos com data-track="nome_do_evento"
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (el) track(el.dataset.track!, el.dataset.trackLabel ? { label: el.dataset.trackLabel } : {});
  });

  if (!GA4_ID) return;
  const banner = document.querySelector<HTMLElement>('[data-cookies]');
  const abrir = () => { if (banner) { banner.hidden = false; banner.querySelector<HTMLElement>('button')?.focus(); } };
  const fechar = () => { if (banner) banner.hidden = true; };

  const escolha = lerEscolha();
  if (escolha === 'aceite') carregarGA();
  else if (!escolha) abrir();

  banner?.querySelector('[data-cookies-aceitar]')?.addEventListener('click', () => {
    guardarEscolha('aceite');
    fechar();
    carregarGA();
  });
  banner?.querySelector('[data-cookies-recusar]')?.addEventListener('click', () => {
    const tinhaAceite = lerEscolha() === 'aceite';
    guardarEscolha('recusado');
    fechar();
    if (tinhaAceite) {
      apagarCookiesGA();
      location.reload();
    }
  });
  document.querySelectorAll('[data-cookies-prefs]').forEach((b) => b.addEventListener('click', abrir));
}
