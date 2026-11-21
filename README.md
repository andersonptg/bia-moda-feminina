# BIA MODA FEMININA — V1.0

Primeira etapa do site oficial da loja de Beatriz. Responsivo para Android, desktop e tablet; pronto para ser publicado por repositório GitHub em hospedagem estática HTTPS. **Sem usuários de teste fictícios e sem senha no código.**

## O que foi implementado

- Splash **preta**, logo BIA com vestido rosa e salto de cristal, progresso percentual guiado pelas etapas reais de abertura.
- Interface preto/carvão + rosa/champagne, com a logo no splash, menu, apresentação, boas-vindas, documentos e ícone do app.
- Instalação como **PWA** (menu "Baixar app", com suporte ao prompt de instalação quando o navegador permitir).
- Login e cadastro em **quatro etapas**: nome, e-mail, senha, confirmar senha; validação de senha forte.
- Após cadastro: aviso discreto, encerramento da sessão, reinício da página e retorno ao login com **apenas o e-mail** preenchido (nunca armazenamos senha para preencher automaticamente).
- **Esqueceu a senha?** → link de redefinição por Firebase Authentication.
- Entrar com Google via Firebase Auth.
- Boas-vindas assinadas pela **Beatriz**, declaração prudente de segurança e aceite de privacidade e termos.
- Aceites registrados por **uid** no Firestore com horário do servidor e regras de acesso restritas.
- Página seguinte intencionalmente reservada à próxima fase: catálogo e loja ainda não foram incluídos.

## Importante — autenticação real

Este pacote contém o *frontend* completo e a integração Firebase, mas **cadastro/login/Google/redefinição só funcionam após configurar um projeto Firebase próprio**. O código desabilita esses botões enquanto não houver configuração; ele não simula autenticação.

1. Abra https://console.firebase.google.com e crie um projeto para Bia Moda Feminina.
2. Adicione um aplicativo **Web** no projeto; copie os valores públicos de `firebaseConfig` para `firebase-config.js` (apiKey, authDomain, projectId, appId, messagingSenderId). **Nunca coloque credenciais administrativas nem chave de conta de serviço** nesse arquivo.
3. Em **Authentication → Sign-in method**, habilite **E-mail/senha** e **Google**. Configure um e-mail de suporte apropriado da loja no provedor Google.
4. Em **Authentication → Settings → Authorized domains**, inclua o domínio público final (por exemplo `bia-moda-feminina.pages.dev` **somente se realmente estiver atribuído** ao projeto; o subdomínio não é garantido). Se também publicar em GitHub Pages, autorize também o domínio correspondente. Para Google Sign-in em domínio diferente do `authDomain` do Firebase, revise as orientações oficiais de autenticação/redirect e teste a experiência em Android.
5. Crie o banco **Cloud Firestore** em modo de produção e publique as regras **completas** de `firestore.rules` no editor do Firestore. Nunca use `allow read, write: if true`.
6. Teste cadastro → retorno ao login → login → recuperação → Google → aceite → próxima tela, com duas contas diferentes, antes de compartilhar o endereço ao público.
7. **Antes de ativar cadastros públicos**, preencha o canal de atendimento da responsável e revise as páginas `privacidade.html`, `termos.html`, `seguranca.html`, políticas de retenção/exclusão e LGPD. Os textos fornecidos são **rascunhos**, não parecer jurídico.

## Publicação: GitHub (código) + Cloudflare Pages (link de marca)

1. Entre no https://github.com e crie um repositório **novo** chamado `bia-moda-feminina` na conta autorizada. Envie os **arquivos da pasta** diretamente para a raiz do repositório, não a pasta inteira como subdiretório. Não inclua dados pessoais ou tokens.
2. Abra https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → conectar **GitHub** → selecionar `bia-moda-feminina`.
3. Para site HTML estático: framework **None**; build command em branco; diretório de saída **`/`** ou **`.`**, conforme o assistente solicitar para publicar a raiz do repositório (se exigir um caminho de saída e não aceitar raiz, use `.`). Se desejar, publique via GitHub Actions em vez de integração direta, mas não as duas rotas ao mesmo tempo.
4. Nome sugerido para o projeto de Pages: `bia-moda-feminina`. **Atenção:** `https://bia-moda-feminina.pages.dev` é uma sugestão, não endereço registrado ou verificado. Caso o nome esteja ocupado, escolha variação da marca disponível.
5. Acesse o endereço fornecido **pelo painel do Cloudflare** e cadastre-o em Authorized domains do Firebase.
6. O Cloudflare Pages fornece HTTPS e instalação PWA sem precisar mostrar o usuário ou e-mail do GitHub no endereço para clientes. GitHub Pages sem domínio próprio usa o formato público `usuario.github.io/repositorio`.
7. Para um domínio próprio como `www.biamodafeminina.com.br`, é necessário registrar o domínio e configurar DNS/SSL. **Este pacote não registra domínio**, não garante a disponibilidade de nomes e não publica automaticamente sem autorização do provedor.

### Arquivos-chave

| Arquivo | Função |
|---|---|
| `index.html` | Splash, login, cadastro, recepção, aceite e próximo passo |
| `styles.css` | Design responsivo da marca |
| `app.js` | Fluxos e validações de interface |
| `auth-service.js` | Integração Firebase para contas e aceites |
| `firebase-config.js` | Valores públicos do projeto Firebase: preencher |
| `firestore.rules` | Regras do Firestore: publicar no console |
| `_headers` | Cabeçalhos de proteção para **Cloudflare Pages** |
| `manifest.webmanifest`, `service-worker.js` | PWA e cache de interface |
| `assets/bia-moda-feminina-logo.png` | Logomarca PNG transparente, resolução original |
| `assets/logo-otimizada.webp` | Logomarca leve para o site |
| `assets/icon-*.png` | Ícones instaláveis |
| `privacidade.html`, `termos.html`, `seguranca.html` | Páginas informativas preliminares |

## Testar a interface antes de publicar

Na pasta do projeto, execute `python -m http.server 8080` ou equivalente; no Android com Termux: `pkg install python` (se ainda não estiver instalado), `cd ~/storage/downloads/BIA_MODA_FEMININA_V1` e `python -m http.server 8080`, depois abra `http://127.0.0.1:8080`. Na prévia sem Firebase, é possível ver splash e telas de formulário; não é possível criar contas reais.

## Segurança

- Firebase API key **da aplicação web** é uma identificação pública do app, não credencial administrativa. Restrinja provedores e configure regras de dados; proteja a conta Firebase com autenticação multifator.
- Nunca coloque senhas, tokens de serviço, credenciais de pagamento ou conteúdo de contas privadas no repositório GitHub.
- Não se deve afirmar que o site é 100% seguro: a revisão de segurança, políticas e testes devem ocorrer antes do lançamento.
- As regras Firestore criam somente coleção `user_consents`; a loja/e-commerce virá na próxima etapa, com regras próprias.

## Material da marca

O PNG em `assets/bia-moda-feminina-logo.png` possui transparência fora da composição e pode ser usado no site e em peças de divulgação; o **interior artístico da letra não é transparente**, por decisão visual da logo. Não exige fontes privadas no pacote.

## Publicação pelo Termux (um comando, depois de autorizar o GitHub)

Este pacote também inclui `PUBLICAR_GITHUB_TERMUX.sh`, que usa o GitHub CLI oficial e **cria o repositório `andersonptg/bia-moda-feminina`, se ainda não existir**, ou envia atualizações para ele. Ele só funciona após um login GitHub válido, cancela se estiver usando outra conta e define o endereço `noreply` do GitHub para novos commits, evitando divulgar seu e-mail pessoal de autoria.

```bash
pkg install git gh
# Só uma vez, entre com sua conta no GitHub via navegador:
gh auth login
# Dentro da pasta extraída:
bash PUBLICAR_GITHUB_TERMUX.sh
```

**Atenção:** o script ainda **não foi executado na sua conta** e o repositório não foi criado remotamente nesta entrega. Ele não cria o projeto Cloudflare nem o Firebase. Configure no GitHub a opção **Keep my email addresses private** e ative o bloqueio de pushes que revelem seu e-mail. O nome de usuário do GitHub continuará público na página do repositório, mas não precisará aparecer no endereço do site acessado pelas clientes.
