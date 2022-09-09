//
import { range } from '../lib/collection.helpers.js'
import { rounds } from './rounds.model.js'
import { Tile } from './tile.model.js'

export class JeoBoard extends EventTarget {
  #activatedTile = null;

  constructor() {
    super();

    this.rounds = rounds;
    this.categories = [1, 2, 3, 4, 5, 6];
    this.previousRoundScore = 0;
    this.listeners = [];
    this.start = this.#start.bind(this);
    this.matrix = [];
  }

  get valueIndex() { return this.rounds.current ? this.rounds.current.values : [] }

  get sumOfAnswered() {
    return this.previousRoundScore +
      (this.flatten()
        .reduce((sum, curr, i) => curr.answered ? sum + +curr.value : sum, 0) || 0
      );
  }

  get activatedTile() { return this.#activatedTile }

  set activatedTile(t) { this.#activatedTile = t }

  createTileModel({ categoryId, position, value }) {
    const t = new Tile({
      categoryId,
      value,
      answered: false,
      activated: false,
      position,
      dailyDouble: 0,
    });

    return t;
  }

  setMatrix() {
    this.matrix = this.createMatrix()

    return this.matrix;
  }

  createMatrix() {
    return this.categories
      .map((cat, catIndex) => this.valueIndex
        .reduce((column, value, rowIndex) => [
          ...column,
          this.createTileModel({ categoryId: cat, value, position: rowIndex, dailyDouble: 0 })
        ], [])
      );
  }

  flatten() { return this.matrix.reduce((acc, curr, i) => [...acc, ...curr], []) || [] }

  updateActiveTile(t) {
    this.flatten()
      .filter(t => t.activated)
      .forEach((a, i) => a.activated = false);

    if (t.dailyDouble) { this.value = t.dailyDouble }

    t.activated = true;

    this.activatedTile = t;

    return t;
  }

  #start(cb, round = 1) {
    this.nextRound();

    this.setMatrix(this.rounds.current)

    const updateFn =
      ({ categoryId, value, answered, activated, position, dailyDouble }) =>
      this.update.bind(this)
      ({ categoryId, value, answered, activated, position, dailyDouble })

    return {
      nextRound: this.nextRound.bind(this),
      update({ categoryId, value, answered, activated, position, dailyDouble }) {
        updateFn({ categoryId, value, answered, activated, position, dailyDouble })
      }
    }
  }

  nextRound = () => {
    if (this.rounds.current && this.rounds.current.next === null) {
      this.previousRoundScore = 0
    }

    else this.previousRoundScore = this.sumOfAnswered

    const r = this.rounds.next();

    this.setMatrix(this.rounds.current)
    if (this.rounds.current.next === null) {
      this.emitRoundChange(false);
    } else {
      this.emitRoundChange(true);
    }
  }

  update({
    categoryId,
    value,
    answered,
    activated,
    position,
    dailyDouble
  }) {

    const tile = this.getTile(categoryId, position)

    Object.assign(tile, { answered, activated, value, position, dailyDouble })

    if (activated) this.updateActiveTile(tile)

    this.emitChange.bind(this)();
  }

  getTile(categoryId, valueIndex) {
    return this.matrix[categoryId - 1][valueIndex]
  }

  emitChange() {
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { tiles: this.matrix, currentRound: this.rounds.current, score: this.sumOfAnswered } }))
  }

  emitRoundChange(isFinal = false) {
    this.dispatchEvent(new CustomEvent('round-change', { bubbles: true, detail: { tiles: this.matrix, currentRound: this.rounds.current, score: this.sumOfAnswered } }))
  }
}