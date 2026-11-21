#!/data/data/com.termux/files/usr/bin/bash
set -Eeuo pipefail
cd "$(dirname "$0")"
REPO="andersonptg/bia-moda-feminina"
URL="https://github.com/${REPO}.git"

printf '\n=== BIA MODA FEMININA | PUBLICAR NO GITHUB ===\n'
if ! command -v git >/dev/null 2>&1; then
  printf 'Git nao encontrado. No Termux: pkg install git\n'; exit 1
fi
if ! command -v gh >/dev/null 2>&1; then
  printf 'GitHub CLI nao encontrado. No Termux: pkg install gh\n'
  printf 'Depois execute: gh auth login\n'; exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  printf 'Primeiro autorize sua conta oficial com: gh auth login\n'
  printf 'Depois execute este script novamente. Nenhum token fica salvo no projeto.\n'; exit 1
fi
ACCOUNT="$(gh api user --jq '.login' 2>/dev/null || true)"
if [[ "$ACCOUNT" != 'andersonptg' ]]; then
  printf 'Conta atual: %s. Este pacote esta preparado para andersonptg; nao sera publicado em outra conta.\n' "$ACCOUNT"; exit 1
fi
if [[ ! -d .git ]]; then git init -b main; fi
git config --local user.name "Bia Moda Feminina"
git config --local user.email "261303304+andersonptg@users.noreply.github.com"
# Email noreply evita expor o endereco pessoal nos novos commits.
git add -A
if ! git diff --cached --quiet; then
  git commit -m "Bia Moda Feminina V1 - splash, autenticacao e boas-vindas"
fi
if ! gh repo view "$REPO" >/dev/null 2>&1; then
  printf 'Criando repositorio publico na conta oficial...\n'
  gh repo create "$REPO" --public --source=. --remote=origin --push
else
  if git remote get-url origin >/dev/null 2>&1; then
    CURRENT="$(git remote get-url origin)"
    if [[ "$CURRENT" != "$URL" && "$CURRENT" != "git@github.com:${REPO}.git" ]]; then
      printf 'Remote origin aponta para outro projeto: %s\nPublicacao cancelada para evitar erros.\n' "$CURRENT"; exit 1
    fi
  else
    git remote add origin "$URL"
  fi
  git push -u origin main
fi
printf '\nOK: codigo enviado a https://github.com/%s\n' "$REPO"
printf 'PROXIMO: conectar este repositorio ao Cloudflare Pages e configurar o Firebase.\n'
