# Projeto_Jogo_Senac
## Motion Verse

Para usar o editor de fases com salvamento físico dos arquivos dentro de `jogo/`, inicie o projeto pelo servidor local:

```bash
npm start
```

Depois abra:

```text
http://localhost:3000/jogo/Marcacao/editor.html
```

O editor salva automaticamente:

- `jogo/Data/<fase>.js`
- `jogo/Marcacao/<fase>.html`
- `jogo/Script/<script-da-fase>.js`

e atualiza o `jogo/Data/faseRegistry.js`.
