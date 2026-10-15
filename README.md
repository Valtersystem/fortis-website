# FORTIS Training Center — website

Site de página única da FORTIS Training Center (Celorico de Basto). É estático, feito em [Astro](https://astro.build), e o formulário de contacto liga-se a um serviço externo configurável. Não há servidor nem base de dados para manter.

- **Testes:** GitHub Pages (workflow incluído).
- **Produção (recomendado):** Netlify, com Netlify Forms. Os pedidos ficam guardados, a equipa recebe um email por cada pedido, pode exportar em CSV e o spam é filtrado. A configuração está pronta em `netlify.toml`.

---

## 1. Instalar e correr localmente

Requisitos: Node.js 22.22 ou mais recente.

```bash
npm install
cp .env.example .env     # ajustar valores
npm run dev              # http://localhost:4321
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor local com recarregamento automático |
| `npm run build` | Gera o site final em `dist/` |
| `npm run preview` | Serve localmente o conteúdo de `dist/` |
| `npm run check` | Verificação de tipos e erros |

## 2. Variáveis de ambiente

Ver `.env.example`. **Nenhuma é secreta**: todas acabam no HTML público. As credenciais de email (SMTP) e as chaves de API ficam no serviço de formulários, nunca no código.

| Variável | Exemplo | Para quê |
| --- | --- | --- |
| `SITE_URL` | `https://www.fortis.pt` | URL público (canonical, Open Graph, sitemap) |
| `BASE_PATH` | `/` ou `/nome-do-repo` | Subpasta (GitHub Pages de projeto) |
| `PUBLIC_FORM_PROVIDER` | `netlify` / `endpoint` | Serviço que recebe o formulário |
| `PUBLIC_FORM_ENDPOINT` | `https://formspree.io/f/abcd1234` | Só para `endpoint` |
| `PUBLIC_GA4_ID` | `G-XXXXXXXXXX` | Google Analytics 4. Vazio = sem analytics e sem banner de cookies |
| `PUBLIC_PREVIEW` | `true` | Mostra conteúdos por confirmar com etiqueta. **Só em testes** |
| `PUBLIC_INDEXAR` | `true` | Permite indexação no Google. **Só depois de aprovado** |

## 3. Formulário de contacto

O formulário envia: nome, email, telemóvel, modalidade, mensagem, `consentimento_privacidade` (com o texto exato e a versão da política), `consentimento_marketing` (`sim`/`não`, desmarcado por defeito), `data_envio` e `origem` (página, UTM e referrer). Estes campos ficam como **evidência do consentimento**.

O que corre no navegador:
- validação com mensagens de erro acessíveis, e foco no primeiro campo com erro;
- anti-spam: campo honeypot `_gotcha`, rejeição de envios em menos de 3 s e limite de um envio por minuto;
- estados de carregamento, sucesso e erro. Se o envio falhar, os dados ficam no formulário. O envio nunca é simulado: sem serviço configurado, o visitante vê uma mensagem de erro e a consola regista o motivo.

### Opção A — Netlify Forms (produção, recomendado)
1. Ligar o repositório ao Netlify. O `netlify.toml` já define `PUBLIC_FORM_PROVIDER=netlify`.
2. Fazer o primeiro deploy e abrir **Forms**. Aparece o formulário `contacto`.
3. Em **Forms › Form notifications**, adicionar uma notificação por email para o endereço da FORTIS.
4. Para exportar: **Forms › contacto › Download as CSV**.
5. A validação no servidor, o filtro de spam (Akismet + honeypot) e o armazenamento ficam a cargo do Netlify.

### Opção B — serviço externo (para testar no GitHub Pages)
O GitHub Pages só serve ficheiros estáticos e não recebe formulários. Para testar envios reais:
1. Criar um formulário num serviço como o [Formspree](https://formspree.io) e configurar o email de notificação no painel do serviço.
2. Definir `PUBLIC_FORM_PROVIDER=endpoint` e `PUBLIC_FORM_ENDPOINT=<URL do formulário>`.
3. O serviço tem de aceitar `POST` com `FormData` e responder 2xx em caso de sucesso.
4. Confirmar no plano escolhido se inclui armazenamento e exportação CSV.

## 4. Editar conteúdos

**Todo o conteúdo está em [`src/content/site.ts`](src/content/site.ts).** Não é preciso mexer nos componentes.

- `fase: 'aberto'` passa o site para o modo pós-abertura: mostra os planos, se existirem.
- `null` esconde o bloco (contactos, Instagram, WhatsApp, morada, mapa).
- `confirmado: false` esconde o item no site público. Com `PUBLIC_PREVIEW=true` aparece com a etiqueta "Por confirmar".
- **Modalidades:** estão como `confirmado: false`, por isso a secção fica oculta em produção até a FORTIS as validar.
- **Morada e mapa:** preencher `morada` e pôr `confirmada: true`. O mapa é o `src` do código "Incorporar mapa" do Google Maps.
- **Planos:** adicionar à `planos.lista` e mudar `fase` para `'aberto'`. Não publicar valores provisórios.
- **Equipa:** adicionar à `experiencia.equipa`. Enquanto a lista estiver vazia, a secção fica oculta.
- **FAQ:** editar `faq`.

### Imagens
Colocar em `public/images/`, de preferência em WebP ou AVIF com cerca de 1600 px de largura, e indicar no conteúdo:

```ts
imagem: { src: 'images/funcional.webp', alt: 'Atleta a empurrar trenó', largura: 1600, altura: 1200 }
```

Para imagens ilustrativas, acrescentar `conceptual: true`: aparece a etiqueta "Imagem conceptual". Sem imagem, o site mostra um marcador neutro.

### Logótipo
Os ficheiros em `public/brand/` foram gerados a partir dos JPG enviados: versão branca e escura com transparência, favicon e imagem de partilha. **Quando chegar o SVG oficial**, substituir `logo-horizontal-white.png` e `icon-*.png`, mantendo os nomes, ou trocar as referências para `.svg`.

## 5. Deploy

### GitHub Pages (testes)
1. Criar o repositório e fazer push para `main`.
2. Em **Settings › Pages › Source**, escolher **GitHub Actions**.
3. Opcional: em **Settings › Secrets and variables › Actions › Variables**, definir `PUBLIC_FORM_PROVIDER`, `PUBLIC_FORM_ENDPOINT` e `PUBLIC_GA4_ID`.
4. Cada push para `main` publica em `https://<utilizador>.github.io/<repo>/`. Neste ambiente a pré-visualização está ligada e a indexação desligada.

### Netlify (produção)
1. **Add new site › Import from Git** e escolher o repositório. O build já está em `netlify.toml`.
2. Variáveis: `SITE_URL` (domínio final), `PUBLIC_GA4_ID` e, quando aprovado, `PUBLIC_INDEXAR=true`.
3. Ligar o domínio próprio em **Domain management**. O HTTPS é automático.
4. **Backups:** o código está no Git. Exportar os pedidos em CSV com regularidade, ou ligar uma integração Netlify → Google Sheets/Zapier.

## 6. Analytics e cookies
- O GA4 só é carregado depois de o visitante carregar em **Aceitar** no banner. Antes disso, não há cookies de medição.
- Sem `PUBLIC_GA4_ID`, não há banner nem cookies.
- Eventos: `form_submit_success`, `form_submit_error`, `click_whatsapp`, `click_directions`, `click_instagram`, `click_cta`, `click_phone` e `click_email`. Para medir um link novo, basta acrescentar `data-track="nome_evento"`.
- No GA4, marcar `form_submit_success` como **evento-chave** (conversão).

## 7. Estrutura

```
src/
  content/site.ts        ← conteúdos editáveis
  lib/config.ts          ← leitura das variáveis de ambiente
  components/            ← uma secção por ficheiro
  layouts/               ← <head>, SEO, schema, páginas legais
  pages/                 ← página principal, políticas, 404, robots, sitemap
  scripts/form.ts        ← validação e envio do formulário
  scripts/analytics.ts   ← consentimento e GA4
public/brand/            ← logótipos, favicon, imagem Open Graph
```

---

## ✅ Checklist antes de publicar em produção

**Informação a confirmar com a FORTIS (não inventar):**
- [ ] Entidade responsável pelo tratamento de dados, NIF e email de privacidade (`legal`)
- [ ] Morada completa, coordenadas e mapa (`morada`)
- [ ] Contactos oficiais: email, telefone, WhatsApp (`contactos`)
- [ ] Instagram e outras redes (`contactos.instagram`)
- [ ] Modalidades e descrições finais (mudar para `confirmado: true`)
- [ ] Tempos de deslocação a Celorico e a Mondim (`espaco.indicadores`)
- [ ] Data de abertura (ajustar o texto da FAQ quando houver data)
- [ ] Horários, planos e preços (só depois da abertura)
- [ ] Equipa / treinadores
- [ ] Fotografias e vídeo reais do espaço
- [ ] Logótipo oficial em SVG e manual de identidade

**Integrações:**
- [ ] Serviço de formulários configurado e email de notificação testado com um pedido real
- [ ] Nome do prestador de formulários na Política de Privacidade (secção 5)
- [ ] Política de Privacidade e Política de Cookies revistas juridicamente
- [ ] Propriedade GA4 criada, `PUBLIC_GA4_ID` definido e `form_submit_success` marcado como evento-chave
- [ ] Domínio próprio ligado e `SITE_URL` atualizado
- [ ] `PUBLIC_PREVIEW` desligado em produção
- [ ] `PUBLIC_INDEXAR=true` só depois da aprovação final; depois, submeter o sitemap no Google Search Console
- [ ] Perfil Google Business criado com os mesmos dados (SEO local)
