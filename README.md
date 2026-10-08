# Dota 2 Randomizer

Site de página única, sem backend, que sorteia um herói aleatório de Dota 2 e uma build aleatória de 6 itens para ele.

## Funcionalidades

- Sorteia um herói e uma build de 6 itens ao abrir a página
- **Randomize**: sorteia herói e build novamente
- **Reroll hero**: troca apenas o herói (nunca repete o herói atual)
- **Reroll build**: troca apenas os itens
- **Hand of Midas**: quando sorteada, o ícone é clicável e troca a Midas por outro item aleatório; o item que entra fica com uma borda dourada

## Regras do sorteio

- A build tem sempre 6 itens, sem repetição
- Todo herói recebe uma Boots of Travel, exceto o Centaur Warrunner, que não recebe nenhuma
- Guardian Greaves e Boots of Bearing contam como itens comuns: qualquer herói, inclusive o Centaur, pode recebê-las
- Ao trocar apenas o herói, a build é sorteada de novo se deixar de respeitar a regra das botas

## Como executar

O site carrega os dados com `fetch()`, e os navegadores bloqueiam isso em páginas abertas direto do disco (`file://`). Por isso é preciso servir a pasta com um servidor web local:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

Qualquer servidor de arquivos estáticos funciona (por exemplo `npx serve`), assim como hospedagens estáticas como GitHub Pages ou Netlify. Não há dependências nem etapa de build.

## Estrutura

```
index.html        Página
favicon.svg       Ícone da aba
style.css         Estilos
app.js            Lógica do sorteio e renderização
data/heroes.json  Lista de heróis
data/items.json   Lista de itens
```

## Dados

Os heróis e itens ficam em dois arquivos JSON, que podem ser editados livremente para adicionar, remover ou corrigir entradas.

`data/heroes.json`:

```json
{ "id": "abaddon", "name": "Abaddon", "icon": "https://.../heroes/abaddon.png" }
```

`data/items.json`:

```json
{ "id": "travel_boots", "name": "Boots of Travel", "boots": true, "icon": "https://.../items/travel_boots.png" }
```

| Campo   | Descrição                                                    |
| ------- | ------------------------------------------------------------ |
| `id`    | Nome interno do herói ou item no Dota 2                      |
| `name`  | Nome exibido na página                                       |
| `icon`  | URL (ou caminho local) da imagem                             |
| `boots` | Apenas em itens: `true` se o item entra na regra das botas   |

A lista de itens contém somente itens completos: componentes, consumíveis e itens neutros ficam de fora.

Os ícones são carregados diretamente da CDN da Steam. Para hospedá-los localmente, basta trocar os valores de `icon` por caminhos relativos.

## Aviso

Dota 2 é uma marca registrada da Valve Corporation. Este projeto é feito por fãs e não tem vínculo com a Valve.
