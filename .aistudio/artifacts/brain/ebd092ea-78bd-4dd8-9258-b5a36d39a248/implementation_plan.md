# Preparação Comercial e Publicação do AgroTech

Plano de implantação para transformar o AgroTech em uma solução comercial pronta para publicação, com Landing Page institucional como rota de entrada, PWA instalável offline-first e persistência híbrida.

### Decisões Confirmadas na Fase 1

> [!IMPORTANT]
> - **Rota Inicial Comercial**: A Landing Page institucional (`Landing.tsx`) com apresentação das funcionalidades, planos de assinatura, depoimentos e acesso rápido ao login será a página inicial (`/`). A plataforma operacional fica acessível em `/dashboard` (e atalhos de autenticação).
> - **Progressive Web App (PWA)**: Implementação de PWA completa via `vite-plugin-pwa`, gerando manifesto oficial, service worker com cache local de assets e telas, e botão in-app de instalação (`PWAInstallButton`) com suporte a Android, Desktop e iOS Safari.
> - **Armazenamento Híbrido**: Operação offline-first nativa com armazenamento local (`localStorage`/`IndexedDB`) e fila de sincronização automática com Firebase/Supabase quando houver conectividade.

---

## 1. Visão Geral & Proposta de Valor

- **Objetivo**: Disponibilizar o AgroTech como um SaaS comercial white-label pronto para distribuição global, acessível tanto no navegador desktop quanto instalado no celular/tablet de gestores rurais e pecuaristas em campo.
- **Público-Alvo**: Produtores rurais, pecuaristas, veterinários de campo e administradores de propriedades agrícolas (grãos e pecuária).
- **Diferencial Competitivo**: Funciona 100% offline em áreas sem sinal de internet (talhões e pastagens remotas), sincronizando automaticamente as movimentações de estoque (QR code), registros sanitários e pesagens quando houver conexão.

---

## 2. Experiência do Usuário & Design Visual

- **Fluxo de Navegação**:
  1. **Visitante Novo**: Acessa `/` e visualiza a Landing Page de conversão com proposta de valor, módulos operacionais, calculadora de planos e botão "Iniciar Teste Grátis / Entrar".
  2. **Autenticação**: O usuário clica em "Entrar" ou "Acessar Plataforma", indo para `/login` (com opção de acesso demonstrativo instantâneo).
  3. **Plataforma Operacional**: Após autenticação, é direcionado ao `/dashboard`, tendo acesso à barra lateral completa (Mercado, Sanidade, Lavouras, Estoque QR, Pecuária, Equipe e Configurações).
  4. **Instalação PWA**: Botão destacado no topo da aplicação permitindo instalar o app como aplicativo nativo no smartphone ou desktop com um clique.

- **Identidade Visual & Idiomas**:
  - Tema escuro e claro preservados com paleta agrícola refinada (verde esmeralda, âmbar e ardósia neutra).
  - Suporte completo aos 3 idiomas (Português, Inglês e Espanhol) unificado em todas as páginas, inclusive na Landing Page.
  - Conformidade rigorosa com a Top Bar Contract e anti-slop rules (sem tags de compilação ou badges redundantes).

---

## 3. Principais Decisões de Arquitetura

- **Vite PWA (`vite-plugin-pwa`)**:
  - Manifesto com `id: '/'`, `name: 'AgroTech - Gestão de Fazendas'`, `short_name: 'AgroTech'`, ícones de alta resolução (192x192, 512x512 e maskable).
  - Service worker configurado com estratégia `CacheFirst` para fontes e assets estáticos, garantindo carregamento instantâneo offline.
- **Hook & Botão de Instalação (`usePWAInstall` & `PWAInstallButton`)**:
  - Captura o evento nativo `beforeinstallprompt` no Chromium/Android e exibe modal com passo a passo no iOS Safari ("Adicionar à Tela de Início").
- **Landing Page Multilíngue e Rotas Atualizadas**:
  - `/` -> Landing Page de conversão comercial.
  - `/login` -> Tela de acesso com modo demo e credenciais.
  - `/dashboard` -> Painel central com gráficos de sanidade e estoque (Recharts).
  - `/market`, `/sanitary`, `/crops`, `/stock`, `/animals`, `/team`, `/profile` -> Módulos operacionais protegidos.

---

## 4. Arquitetura Técnica & Diagrama de Componentes

```
┌────────────────────────────────────────────────────────┐
│                   Navegador / Dispositivo              │
└───────────────────────────┬────────────────────────────┘
                            │
               ┌────────────▼────────────┐
               │    Service Worker       │ ◄── Precaching Offline
               │   (vite-plugin-pwa)     │     (Assets, CSS, Bundles)
               └────────────┬────────────┘
                            │
     ┌──────────────────────┴──────────────────────┐
     │                                             │
┌────▼────────────────┐                  ┌─────────▼──────────────┐
│  Landing Comercial  │                  │  Plataforma Operacional│
│  Rota: '/'          │                  │  Rotas: '/dashboard'.. │
│  - Apresentação     │                  │  - Manejo Sanitário    │
│  - Planos & Preços  │                  │  - Pecuária & Lotes    │
│  - Depoimentos      │                  │  - Estoque com QR Code │
│  - Botão PWA Install│                  │  - Gráficos Recharts   │
└───────────┬─────────┘                  └─────────┬──────────────┘
            │                                      │
            └──────────────► ┌─────────────────────▼──────────────┐
                             │    Camada Híbrida de Persistência   │
                             │  - OfflineContext & localStorage    │
                             │  - Fila de Sincronização Local      │
                             │  - BaaS (Firebase / Supabase Opc.) │
                             └────────────────────────────────────┘
```

---

## 5. Etapas de Execução

1. **Configuração PWA**:
   - Instalação e configuração de `vite-plugin-pwa`.
   - Criação dos metadados e ícones PWA no `public/` e tags correspondentes no `index.html`.
   - Criação do hook `src/hooks/usePWAInstall.ts` e do componente `src/components/PWAInstallButton.tsx`.
2. **Reestruturação das Rotas e Integração da Landing Page**:
   - Ajustar `App.tsx` para definir `/` como Landing comercial e `/dashboard` como painel principal.
   - Conectar a barra de navegação da Landing Page para alternar idiomas (`pt`, `en`, `es`) usando `LanguageContext`.
   - Incluir o botão de instalação PWA tanto na Landing Page quanto no cabeçalho do Dashboard operacional.
3. **Auditoria e Otimização para Produção**:
   - Testar o build de produção (`npm run build`).
   - Validar integridade com `compile_applet` e `lint_applet`.
   - Verificar conformidade com as diretrizes de design e acessibilidade.
