const CONSTS = {
  rounds: { j: 'Jeopardy!', dj: 'Double Jeopardy!' },

}

const DEFAULT_STATE = {
  tiles: null,
  round: CONSTS.rounds[0],
  activeTile: null,
  score: 0,
}

export class Store {
  constructor(initialState) {
    this.state = initialState || {
      tiles: null,
      round: CONSTS.rounds.j,
      activeTile: null,
      score: 0,
    }
  }
}
