//
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { JeoBoard } from './store/jeoboard.model.js';

import { Type } from './lib/Type.js';

const typer = new Type()

typer.define.interface('JeoTile', {
  answered: Boolean,
  activated: Boolean,
  answeredCorrectly: Boolean,
  value: Number,
  position: Number,
  categoryId: Number,
  dailyDouble: Number,
});


export class JsonMap extends Map {
  constructor(entries) {
    super(entries);

    if (Array.isArray(entries))
      entries.forEach(([key, value]) => {
        super.set(value, key)
      });
  }

  set(key, value) {
    super.set(key, value);
    super.set(value, key);

    return this;
  }

  toJSON() {
    return [...this.entries()]
  }
};

const jsonMap = new JsonMap([['suk', 'me']])

const { event } = ham;


const TileTypes = {
  value: 'value',
  name: 'categoryName'
}

const State = {
  activeTile: {
    dom: null,
    clicks: 0,
  }
}

const jeoboard = new JeoBoard();
let jeopardy = jeoboard.start()


const handleTileClick = (event) => {
  let updates = {}

  const tile = event.target.closest('.tile')

  // if (tile.dataset.answered === 'true') return;

  const currentActives = [...document.querySelectorAll('[data-activated="true"]')].filter(t => t !== tile)
  currentActives.forEach((t, i) => t.dataset.activated = false)

  const currentCatTiles = [...document.querySelectorAll('.highlight')].filter(t => t !== tile)
  currentCatTiles.forEach((t, i) => t.classList.remove('highlight'));

  const isAlreadyActive = tile.dataset.activated == 'false' ? false : true;
  const isAlreadyAnswered = tile.dataset.answered == 'true' ? true : false;
  const isAlreadyAnsweredCorrectly = tile.dataset.answeredCorrectly == 'true' ? true : false;
  const isAlreadyAnsweredIncorrectly = tile.dataset.answeredIncorrectly == 'true' ? true : false;

  if (isAlreadyAnswered && isAlreadyAnsweredCorrectly) {
    updates = {
      answered: true,
      activated: false,
      answeredIncorrectly: false,
      value: +tile.dataset.value,
      categoryId: +tile.dataset.categoryId,
      dailyDouble: +tile.dataset.dailyDouble || null,
      position: +tile.dataset.position,
    }
  }
  else if (isAlreadyAnswered && isAlreadyAnsweredCorrectly) {
    updates = {
      answered: false,
      activated: false,
      answeredCorrectly: false,
      answeredIncorrectly: true,
      value: +tile.dataset.value,
      categoryId: +tile.dataset.categoryId,
      dailyDouble: +tile.dataset.dailyDouble || null,
      position: +tile.dataset.position,
    }
  }

  else if (isAlreadyAnswered && !isAlreadyAnsweredCorrectly) {
    updates = {
      answered: false,
      activated: false,
      answeredCorrectly: false,
      value: +tile.dataset.value,
      categoryId: +tile.dataset.categoryId,
      dailyDouble: +tile.dataset.dailyDouble || null,
      position: +tile.dataset.position,
    }
  }
  // else if (!isAlreadyAnswered) {
  //   updates = {
  //     answered: false,
  //     activated: false,
  //     answeredCorrectly: false,
  //     value: +tile.dataset.value,
  //     categoryId: +tile.dataset.categoryId,
  //     dailyDouble: +tile.dataset.dailyDouble || null,
  //     position: +tile.dataset.position,
  //   }
  // }
  else if (isAlreadyActive) {
    updates = {
      answered: true,
      activated: false,
      answeredCorrectly: true,
      value: +tile.dataset.value,
      categoryId: +tile.dataset.categoryId,
      dailyDouble: +tile.dataset.dailyDouble || null,
      position: +tile.dataset.position,
    }
  } else {
    updates = {
      answered: false,
      activated: true,
      answeredCorrectly: false,
      value: +tile.dataset.value,
      categoryId: +tile.dataset.categoryId,
      position: +tile.dataset.position,
      dailyDouble: +tile.dataset.dailyDouble || null,
    }
  };

  jeopardy.update(updates);

  const catTiles = [...document.querySelectorAll(`[data-category-id="${tile.dataset.categoryId}"]`)].filter(t => t !== tile)

  catTiles.forEach((t, i) => t.classList.add('highlight'));
};

const handleTileLongPress = (event) => {
  let updates = {}
  const tile = event.target.closest('.tile')
  if (tile.dataset.answered === 'true') return;

  const currentActives = [...document.querySelectorAll('[data-activated="true"]')].filter(t => t !== tile)
  currentActives.forEach((t, i) => t.dataset.activated = false)

  const currentCatTiles = [...document.querySelectorAll('.highlight')].filter(t => t !== tile)
  currentCatTiles.forEach((t, i) => t.classList.remove('highlight'));

  const endDd = (e) => {
    e.preventDefault()
    e.stopPropagation()

    tile.contentEditable = false;

    const updatesDd = {
      answered: true,
      activated: false,
      value: +tile.textContent.trim() || 0,
      position: +tile.dataset.position,
      categoryId: +tile.dataset.categoryId,
      dailyDouble: +tile.textContent.trim() || 0,
    };

    jeopardy.update(updatesDd);
    tile.removeEventListener('click', endDd)
  };

  tile.classList.add('daily-double')
  tile.contentEditable = true;
  tile.focus();

  const catTiles = [...document.querySelectorAll(`[data-category-id="${tile.dataset.categoryId}"]`)].filter(t => t !== tile)

  catTiles.forEach((t, i) => t.classList.add('highlight'));
  tile.removeEventListener('click', handleTileClick)
  tile.addEventListener('click', endDd)
};

const createTile = (tile, tileType = 'value') => {
  const t = document.createElement('div');

  t.classList.add('tile');
  t.dataset.tileType = tileType;
  t.dataset.position = tile.position
  t.dataset.categoryId = tile.categoryId;
  t.dataset.answeredCorrectly = tile.answeredCorrectly;

  if (tileType === 'value' && !tile.dailyDouble) {
    t.dataset.value = tile.value;
    t.textContent = tile.answered && tile.answeredCorrectly === true ? '✓' : t.textContent;
    t.textContent = tile.answered && tile.answeredCorrectly === false ? 'X' : t.textContent;
    t.textContent = !tile.answered && !tile.answeredCorrectly === true ? tile.value : t.textContent;
    t.dataset.answered = tile.answered;
    t.dataset.activated = tile.activated;
    t.dataset.position = tile.position
  } else if (tileType === TileTypes.value && tile.dailyDouble) {
    t.dataset.value = tile.value;
    t.textContent = tile.answered ? (tile.dailyDouble || 0) : tile.value;
    t.dataset.answered = tile.answered;
    t.dataset.activated = tile.activated;
    t.classList.add('daily-double');
  } else if (tileType === TileTypes.name) {
    t.textContent = tile.categoryId;
  }

  return t;
};

const createBoard = (tiles = []) => {
  const frag = new DocumentFragment();
  const b = document.createElement('div');
  b.id = 'board';

  tiles.forEach((col, i) => {
    const nameTile = createTile({ value: `${i+1}`, categoryId: i + 1 }, TileTypes.name)
    b.append(nameTile)

    col.forEach((v, j) => {
      const t = createTile(v, TileTypes.value)
      b.append(t)
    });
  });

  event.longPress(b, 700, handleTileLongPress)

  b.addEventListener('click', handleTileClick)

  return b;
};

const createFinalJeopardyPanel = () => {
  const frag = new DocumentFragment();
  const b = document.createElement('div');
  b.id = '';
  const finalPanel = document.createElement('div');
  finalPanel.id = 'final-answer-panel';

  const input = document.createElement('input');
  input.type = 'text'
  input.id = 'final-answer-input';

  const submit = document.createElement('div');
  submit.id = 'final-answer-submit';
  submit.textContent = 'SUBMIT!'
  finalPanel.append(input)
  finalPanel.append(submit)
  b.append(finalPanel)

  submit.addEventListener('click', (e) => {
    const score = jeoboard.sumOfAnswered + +input.value
    window.localStorage.setItem('jeo' + Date.now(), JSON.stringify(jeoboard))

    console.log({ score });
  })

  return b;
};

const createPanel = (config) => {
  const p = document.createElement('div');

  if (config.id === 'bottom-panel') {
    const scoreContainer = document.createElement('div');
    const scoreEl = document.createElement('div');
    const label = document.createElement('div');

    label.textContent = 'SCORE:'

    const btnContainer = document.createElement('div');
    const nextRoundBtn = document.createElement('button');

    nextRoundBtn.textContent = 'Next Round!'
    nextRoundBtn.classList.add('button')

    nextRoundBtn.addEventListener('click', e => {
      jeopardy.nextRound()
    });

    scoreEl.textContent = config.score || 0

    btnContainer.append(nextRoundBtn)
    scoreContainer.append(label, scoreEl)
    p.append(scoreContainer, btnContainer)

    Object.assign(p, config)
    p.classList.add('panel');
  }

  else if (config.id === 'top-panel') {
    Object.assign(p, config)
  }

  return p;
};

const render = (appElement, tiles = [], score, final = false) => {
  let b;
  if (final) {
    b = createFinalJeopardyPanel(tiles);

  } else {
    b = createBoard(tiles);

  }

  const topConfig = { id: 'top-panel', textContent: jeoboard.rounds.current.name || '' }
  const top = createPanel(topConfig)
  top.id = 'top-panel'

  const bConfig = { id: 'bottom-panel', score }
  const bottom = createPanel(bConfig)

  appElement.innerHTML = '';
  appElement.append(top, b, bottom);
};


/**
 * START
 **/

const rerender = (tiles, score) => render(app, tiles, score)

jeoboard.addEventListener('change', ({ detail }) => {
  const tiles = detail.tiles;

  rerender(tiles, detail.score)
});


jeoboard.addEventListener('round-change', ({ detail }) => {
  const { tiles, score, currentRound } = detail;

  if (currentRound.next === null) {
    render(document.querySelector('#app'), tiles, score, true)
  } else {
    render(document.querySelector('#app'), tiles, score)
  }
});



const app = document.querySelector('#app');

render(app, jeoboard.matrix, jeoboard.score)