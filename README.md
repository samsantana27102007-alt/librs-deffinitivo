# Aprendizado de Libras - MVP

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

Uma aplicação web acessível e moderna projetada para auxiliar no aprendizado prático da Língua Brasileira de Sinais (Libras). Este MVP (Produto Mínimo Viável) foca na validação de movimentos via câmera utilizando uma interface limpa, humana e sem distrações.

## 🎯 Objetivo

O objetivo deste projeto é validar a hipótese de que é possível utilizar a câmera de um dispositivo comum (celular ou computador) para reconhecer sinais básicos de Libras e fornecer feedback imediato ("Correto" ou "Incorreto") ao estudante, promovendo a prática autônoma.

## ✨ Funcionalidades

*   **Interface de Página Única**: Design minimalista focado na tarefa atual.
*   **Reconhecimento de Gestos (Simulado)**: Fluxo de captura de vídeo e feedback simulando uma IA de visão computacional.
*   **Vocabulário Inicial**: Suporte para sinais básicos como "Oi" e "Obrigado".
*   **Feedback Visual Claro**: Indicadores de cor e texto grandes e acessíveis para acertos e erros.
*   **Acessibilidade**: Alto contraste, fontes legíveis e navegação simples.

## 🛠️ Tecnologias Utilizadas

*   **Frontend**: [React](https://react.dev/) (v19)
*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/) (Configurado via CDN para prototipagem rápida/MVP)
*   **Ícones**: [Lucide React](https://lucide.dev/)
*   **API de Câmera**: HTML5 MediaDevices API (`navigator.mediaDevices.getUserMedia`)

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para baixar, configurar e rodar a aplicação em sua máquina local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (Versão 16 ou superior recomendada)
*   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Passo 1: Clonar o Repositório

Abra seu terminal e execute o comando abaixo para clonar os arquivos do projeto:

```bash
git clone https://github.com/seu-usuario/aprendizado-libras-mvp.git
cd aprendizado-libras-mvp
```

### Passo 2: Instalar Dependências

Instale as bibliotecas necessárias para rodar o React:

```bash
npm install
# ou
yarn install
```

### Passo 3: Executar a Aplicação

Inicie o servidor de desenvolvimento local:

```bash
npm start
# ou
npm run dev
```

O terminal indicará o endereço local (geralmente `http://localhost:3000` ou `http://localhost:5173`). Abra este endereço no seu navegador.

> **Nota sobre a Câmera**: Para que a aplicação acesse sua câmera, o navegador pode solicitar permissão. Certifique-se de permitir o acesso. Se estiver testando no celular via rede local, pode ser necessário usar HTTPS ou tunelamento (como ngrok), pois navegadores modernos bloqueiam acesso à câmera em HTTP (exceto localhost).

## 📱 Guia de Uso

1.  **Tela Inicial**: Ao abrir o app, você verá a ilustração e a descrição de um sinal (ex: "Oi").
2.  **Iniciar Prática**: Clique no botão roxo **"Iniciar Prática"**.
3.  **Contagem Regressiva**: A câmera será ativada e um contador de 3 segundos aparecerá na tela. Prepare-se!
4.  **Gravação**: Quando o indicador **"GRAVANDO"** aparecer, realize o gesto do sinal e mantenha-o por cerca de 3 segundos.
5.  **Feedback**: O sistema processará o vídeo e dirá se o movimento está **Correto** (Verde) ou **Incorreto** (Vermelho).
    *   Se acertar, avance para o próximo sinal.
    *   Se errar, tente novamente seguindo as instruções da ilustração.

## 🔮 Roadmap (Futuro)

Conforme definido no planejamento do produto, as próximas fases incluem:

*   **Fase 1 (Pós-MVP)**: Expansão para 15-20 palavras e vídeos reais de correção.
*   **Fase 2**: Modo "Adivinhar" (Quiz), cadastro de usuários e histórico de progresso.
*   **Fase 3**: Gamificação (pontos e medalhas) e estrutura de módulos de ensino.
*   **Fase 4**: App nativo (iOS/Android) e reconhecimento de frases curtas.

## 🎨 Design System

O projeto segue um guia de estilo rigoroso para garantir uma aparência amigável e não-robótica:

*   **Cores Primárias**: Roxo Profundo (`#461E52`) e Rosa Vibrante (`#DD517F`).
*   **Tipografia**: Fonte *Inter*, focada em legibilidade.
*   **Estilo**: Flat Design, ilustrações vetoriais geométricas e componentes arredondados.

---

Desenvolvido como parte do Projeto Integrador para incentivo ao aprendizado de Libras.
