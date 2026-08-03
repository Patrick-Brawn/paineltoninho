# ☕ Painel do Toninho

App mobile para controlar encomendas de feijão preto, feijão vermelho, café e o
que mais você vender por kg. Tudo funciona **offline**, guardando os dados no
armazenamento local do próprio navegador/celular (`localStorage`) — nada é
enviado para nenhum servidor.

## O que o app faz

- **Vendas** — lista todas as encomendas, com cliente, itens, valor total,
  data de pagamento e dois selos que você toca para marcar **"Entregue"** e
  **"Pago"**.
- **Nova Venda** (botão + no centro do menu) — cadastra uma encomenda com
  cliente, um ou mais alimentos (com kg de cada), calcula o valor
  automaticamente pelo preço de venda cadastrado, e a data de pagamento.
- **Produtos** — cadastra o que você vende (nome, custo por kg e preço de
  venda por kg). Já vem com Feijão Preto, Feijão Vermelho e Café cadastrados
  como exemplo.
- **Custos** — mostra, por produto e no total, quanto você gastou (custo),
  quanto vendeu (receita) e o lucro final. Tem filtro pra considerar só as
  vendas já pagas.
  - **Períodos de custo** — toda vez que o estoque acabar e você comprar de
    novo por um preço diferente, toque em "Abrir novo período" e informe a
    data e o novo custo/kg de cada alimento. O sistema passa a usar
    automaticamente o custo certo pra cada venda, de acordo com a data em
    que ela foi lançada — sem precisar mexer no cadastro do produto toda
    hora.

## ⚠️ Sobre o erro de build no Vercel

Se você já tentou publicar antes e recebeu o erro
`Rollup failed to resolve import "/src/main.jsx"`, foi porque, ao montar a
pasta manualmente arquivo por arquivo, a estrutura do `src/` não ficou
idêntica à original no repositório (algum arquivo caiu fora do lugar).
Nesta versão o `index.html` usa um caminho relativo (`./src/main.jsx` em vez
de `/src/main.jsx`), o que ajuda — mas o mais importante é **respeitar
exatamente a estrutura de pastas abaixo** ao subir pro GitHub.

## Rodando localmente

Pré-requisito: [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (algo como `http://localhost:5173`).

## Publicando no GitHub

```bash
git init
git add .
git commit -m "Painel do Toninho"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/painel-do-toninho.git
git push -u origin main
```

Usar `git` pela linha de comando (em vez de arrastar arquivo por arquivo no
site do GitHub) é a forma mais segura, porque ele sobe a pasta exatamente
como está no seu computador — evita esse tipo de erro de estrutura.

## Publicando no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. **Add New → Project** → selecione o repositório `painel-do-toninho`.
3. O Vercel detecta que é um projeto Vite (o `vercel.json` já está
   configurado). Clique em **Deploy**.
4. Você recebe um link (tipo `painel-do-toninho.vercel.app`) pra abrir no
   celular.

### Adicionar à tela inicial (fica com carinha de app)

- **Android (Chrome):** abra o link → menu (⋮) → "Adicionar à tela inicial".
- **iPhone (Safari):** abra o link → ícone de compartilhar → "Adicionar à
  Tela de Início".

## Importante sobre os dados

Como o armazenamento é local (`localStorage`), os dados ficam salvos **no
navegador daquele celular específico**. Trocar de celular, limpar os dados do
navegador ou usar outro navegador faz o histórico não aparecer lá — cada
aparelho/navegador tem seu próprio.

## Estrutura de pastas (siga exatamente esta)

```
painel-do-toninho/
├── .gitignore
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── BottomNav.jsx
    │   ├── Header.jsx
    │   ├── Logo.jsx
    │   └── StatusPill.jsx
    ├── data/
    │   └── storage.js
    └── pages/
        ├── Custos.jsx
        ├── NovaVenda.jsx
        ├── Produtos.jsx
        └── Vendas.jsx
```
