import { track } from './analytics';

const TEMPO_MINIMO_MS = 3000; // envio mais rápido do que isto = provável bot
const INTERVALO_ENTRE_ENVIOS_MS = 60_000; // limite simples de envios repetidos
const TIMEOUT_MS = 15_000;
const CHAVE_ULTIMO_ENVIO = 'fortis-ultimo-envio';

const MSG = {
  nome: 'Indica o teu nome.',
  email: 'Indica um email válido, por exemplo nome@exemplo.pt.',
  telemovel: 'Indica um número de telemóvel válido (9 dígitos, com ou sem indicativo).',
  consentimento_privacidade: 'Para podermos responder, precisamos da tua autorização.',
  resumo: 'Verifica os campos assinalados.',
  envio: 'Não foi possível enviar o teu pedido. Os dados que preencheste continuam aqui — tenta novamente dentro de instantes.',
  config: 'De momento não é possível enviar pedidos por este formulário. Tenta novamente mais tarde.',
  repetido: 'Já recebemos um pedido teu há instantes. Aguarda um minuto antes de enviar outro.',
};

type Campo = 'nome' | 'email' | 'telemovel' | 'consentimento_privacidade';

function validar(form: HTMLFormElement): Partial<Record<Campo, string>> {
  const v = (n: string) => ((form.elements.namedItem(n) as HTMLInputElement | null)?.value ?? '').trim();
  const erros: Partial<Record<Campo, string>> = {};
  if (v('nome').length < 2) erros.nome = MSG.nome;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'))) erros.email = MSG.email;
  const tel = v('telemovel').replace(/[\s().-]/g, '');
  if (!/^(\+|00)?\d{9,15}$/.test(tel)) erros.telemovel = MSG.telemovel;
  const priv = form.elements.namedItem('consentimento_privacidade') as HTMLInputElement | null;
  if (!priv?.checked) erros.consentimento_privacidade = MSG.consentimento_privacidade;
  return erros;
}

function mostrarErros(form: HTMLFormElement, erros: Partial<Record<Campo, string>>) {
  form.querySelectorAll<HTMLElement>('[data-erro-para]').forEach((el) => {
    const nome = el.dataset.erroPara as Campo;
    const campo = form.elements.namedItem(nome) as HTMLInputElement | null;
    const msg = erros[nome] ?? '';
    el.textContent = msg;
    campo?.setAttribute('aria-invalid', msg ? 'true' : 'false');
  });
}

function origem(): string {
  const u = new URL(location.href);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign']
    .map((k) => (u.searchParams.get(k) ? `${k}=${u.searchParams.get(k)}` : ''))
    .filter(Boolean)
    .join('&');
  const ref = document.referrer ? ` | referrer: ${document.referrer}` : '';
  return `${u.origin}${u.pathname}${utm ? `?${utm}` : ''}${ref}`;
}

async function enviar(form: HTMLFormElement, provider: string): Promise<void> {
  const dados = new FormData(form);
  if (!dados.has('consentimento_marketing')) dados.set('consentimento_marketing', 'não');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    let res: Response;
    if (provider === 'netlify') {
      const body = new URLSearchParams(dados as unknown as Record<string, string>).toString();
      res = await fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: ctrl.signal,
      });
    } else {
      res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: dados,
        signal: ctrl.signal,
      });
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } finally {
    clearTimeout(t);
  }
}

export function iniciarFormulario() {
  const form = document.querySelector<HTMLFormElement>('[data-form]');
  if (!form) return;
  const painelSucesso = document.querySelector<HTMLElement>('[data-form-sucesso]')!;
  const caixaErro = form.querySelector<HTMLElement>('[data-form-erro]')!;
  const textoErro = form.querySelector<HTMLElement>('[data-form-erro-texto]')!;
  const btn = form.querySelector<HTMLButtonElement>('[data-form-btn]')!;
  const btnTexto = form.querySelector<HTMLElement>('[data-form-btn-texto]')!;
  const provider = form.dataset.provider ?? '';
  const carregadoEm = Date.now();
  let tentou = false;
  let aEnviar = false;

  const erroGeral = (msg: string) => {
    textoErro.textContent = msg;
    caixaErro.hidden = !msg;
  };
  const estadoLoading = (on: boolean) => {
    aEnviar = on;
    btn.disabled = on;
    btn.setAttribute('aria-busy', String(on));
    btnTexto.textContent = on ? 'A enviar…' : 'Enviar pedido';
  };
  const sucesso = () => {
    form.hidden = true;
    painelSucesso.hidden = false;
    painelSucesso.focus();
  };

  // "Tenho interesse" nos cartões de modalidade → pré-seleciona a opção
  document.querySelectorAll<HTMLElement>('[data-modalidade]').forEach((a) =>
    a.addEventListener('click', () => {
      const sel = form.elements.namedItem('modalidade') as HTMLSelectElement | null;
      if (sel && [...sel.options].some((o) => o.value === a.dataset.modalidade)) sel.value = a.dataset.modalidade!;
    }),
  );

  // Revalida em tempo real depois da primeira tentativa
  form.addEventListener('input', () => tentou && mostrarErros(form, validar(form)));
  form.addEventListener('change', () => tentou && mostrarErros(form, validar(form)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (aEnviar) return;
    tentou = true;
    erroGeral('');

    const erros = validar(form);
    mostrarErros(form, erros);
    const primeiro = Object.keys(erros)[0];
    if (primeiro) {
      (form.elements.namedItem(primeiro) as HTMLElement | null)?.focus();
      return;
    }

    // Anti-spam: honeypot preenchido ou envio instantâneo → ignora em silêncio
    const hp = (form.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value;
    if (hp || Date.now() - carregadoEm < TEMPO_MINIMO_MS) {
      sucesso();
      return;
    }

    try {
      const ultimo = Number(sessionStorage.getItem(CHAVE_ULTIMO_ENVIO) || 0);
      if (Date.now() - ultimo < INTERVALO_ENTRE_ENVIOS_MS) {
        erroGeral(MSG.repetido);
        return;
      }
    } catch {
      /* sessionStorage indisponível: segue */
    }

    if (!provider || (provider === 'endpoint' && !form.getAttribute('action'))) {
      console.error('[FORTIS] Formulário sem serviço configurado: definir PUBLIC_FORM_PROVIDER e PUBLIC_FORM_ENDPOINT (ver README).');
      erroGeral(MSG.config);
      track('form_submit_error', { motivo: 'sem_configuracao' });
      return;
    }

    (form.querySelector('[data-campo-data]') as HTMLInputElement).value = new Date().toISOString();
    (form.querySelector('[data-campo-origem]') as HTMLInputElement).value = origem();

    estadoLoading(true);
    try {
      await enviar(form, provider);
      try { sessionStorage.setItem(CHAVE_ULTIMO_ENVIO, String(Date.now())); } catch { /* ignora */ }
      const modalidade = (form.elements.namedItem('modalidade') as HTMLSelectElement | null)?.value || 'nao_indicada';
      track('form_submit_success', { modalidade });
      sucesso();
      form.reset();
      tentou = false;
    } catch (err) {
      console.error('[FORTIS] Falha no envio do formulário:', err);
      erroGeral(MSG.envio);
      track('form_submit_error', { motivo: 'envio' });
      caixaErro.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } finally {
      estadoLoading(false);
    }
  });

  document.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    painelSucesso.hidden = true;
    form.hidden = false;
    mostrarErros(form, {});
    (form.elements.namedItem('nome') as HTMLElement | null)?.focus();
  });
}
