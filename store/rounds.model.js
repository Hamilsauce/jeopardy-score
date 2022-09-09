class Rounds {
  #current = null;
  #list = new Map([
    ['JEOPARDY', {
        index: 0,
        id: 1,
        name: 'JEOPARDY',
        values: [200, 400, 600, 800, 1000],
        previous: null,
        next: 'DOUBLE JEOPARDY',
      }
    ],
    ['DOUBLE JEOPARDY', {
        index: 1,
        id: 2,
        name: 'DOUBLE JEOPARDY',
        values: [200, 400, 600, 800, 1000].map(_ => _ * 2),
        previous: 'JEOPARDY',
        next: 'FINAL JEOPARDY',
      }
    ],
    ['FINAL JEOPARDY', {
        index: 2,
        id: 3,
        name: 'FINAL JEOPARDY',
        values: [],
        previous: 'DOUBLE JEOPARDY',
        next: null
      }
    ],
  ]);

  constructor() {}

  get current() { return this.#current }

  next() {
    if (this.current === null) {
      this.#current = [...this.#list.values()].find(round => round.previous === null);

      return this.#current;
    }
    
    else if (this.current.next === null) {
      // Loop back to first round if no next round
      this.#current = [...this.#list.values()].find(round => round.previous === null);

      return this.current;
    }

    this.#current = this.#list.get(this.current.next)

    return this.current;
  }
}

export const rounds = new Rounds()
