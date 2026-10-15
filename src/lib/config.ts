import { site } from '../content/site';

const env = import.meta.env;

/** Mostrar conteúdos por confirmar (com etiqueta). Nunca ativar em produção. */
export const PREVIEW = env.PUBLIC_PREVIEW === 'true';
/** Permitir indexação pelos motores de busca. */
export const INDEXAR = env.PUBLIC_INDEXAR === 'true';

export type FormProvider = 'netlify' | 'endpoint' | '';
const provider = (env.PUBLIC_FORM_PROVIDER ?? '').trim();
export const FORM_PROVIDER: FormProvider = provider === 'netlify' || provider === 'endpoint' ? provider : '';
export const FORM_ENDPOINT = (env.PUBLIC_FORM_ENDPOINT ?? '').trim();
export const GA4_ID = (env.PUBLIC_GA4_ID ?? '').trim();

export const ABERTO = site.fase === 'aberto';

/** Um item com `confirmado: false` só aparece em modo de pré-visualização. */
export function visivel<T extends { confirmado?: boolean }>(item: T): boolean {
  return item.confirmado !== false || PREVIEW;
}

/** Junta o caminho base (ex. /fortis no GitHub Pages) a um caminho interno. */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.replace(/^\//, '');
  return p ? `${base}/${p}` : `${base}/`;
}
