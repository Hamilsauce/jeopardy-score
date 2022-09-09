//
import { template } from './renderer.js';
export class AppView {
  constructor(selector) {
    this.self = document.querySelector(selector);

  }

  createTile(tile, tileType = 'value') {
    const t = document.createElement('div');

    t.classList.add('tile');
    t.dataset.tileType = tileType;
    t.dataset.categoryId = tile.categoryId;

    if (tileType === 'value') {
      t.dataset.value = tile.value;
      t.textContent = tile.answered ? '✓' : tile.value;
      t.dataset.answered = tile.answered;
      t.dataset.activated = tile.activated;
    } else {
      t.textContent = tile.categoryId;
    }

    return t;
  };

  createBoard(tiles = []) {
    const frag = new DocumentFragment();
    const b = document.createElement('div');
    b.id = 'board';

    tiles.forEach((col, i) => {
      const nameTile = createTile({ value: `${i+1}`, categoryId: i + 1 }, tileTypes.name)
      b.append(nameTile)
      col.forEach((v, j) => {
        const t = createTile(v, tileTypes.value)

        b.append(t)
      });
    });

    b.addEventListener('click', handleTileClick)
    return b
  };

  createPanel(config) {
    const frag = new DocumentFragment();
    const p = document.createElement('div');
    const scoreEl = document.createElement('div');
    const label = document.createElement('div');
    label.textContent = 'SCORE:'
    console.log('config', config)
    if (config.id = 'bottom-panel') {
      const nextRoundBtn = document.createElement('button');
      nextRoundBtn.textContent = 'Do Double Jeopardy!'

      nextRoundBtn.addEventListener('click', e => {
        jeoround = jeoboard.start(null, 2);
        render(document.querySelector('#app'), jeoboard.matrix, state)
      });

      scoreEl.textContent = config.state.currentScore
      p.append(label, scoreEl, nextRoundBtn)

      Object.assign(p, config)
      p.classList.add('panel');
    }

    return p
  };


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
