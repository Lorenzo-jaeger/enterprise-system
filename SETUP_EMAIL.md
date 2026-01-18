# Como Gerar uma Senha de App (Gmail)

Para que o sistema possa enviar emails usando sua conta do Gmail, você precisa criar uma "Senha de App". Isso é mais seguro do que usar sua senha real.

1.  Acesse sua **Conta do Google**: [https://myaccount.google.com/](https://myaccount.google.com/)
2.  No menu esquerdo, clique em **Segurança**.
3.  Em "Como você faz login no Google", certifique-se de que a **Verificação em duas etapas** esteja **ATIVADA**. (Se não estiver, ative-a).
4.  Após ativar, procure por **Senhas de app** (Pode usar a barra de busca no topo se não achar).
    *   *Nota: Se não aparecer, pesquise por "Senhas de app" na lupa.*
5.  Clique em **Senhas de app**.
6.  Dê um nome, por exemplo: `Enterprise System`.
7.  Clique em **Criar**.
8.  O Google vai te mostrar uma senha de 16 caracteres (ex: `abcd efgh ijkl mnop`).
9.  **Copie essa senha**.

## Onde colocar?
Você vai colar essa senha no arquivo `.env` do servidor, na variável `MAIL_PASS`.

Exemplo no `.env`:
```env
MAIL_USER=seuemail@gmail.com
MAIL_PASS=abcd efgh ijkl mnop
```
