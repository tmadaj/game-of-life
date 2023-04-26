interface GameOfLifeCell {
  x: number;
  y: number;
}

interface GameOfLifeState {
  cells: GameOfLifeCell[]; // a thought: may have been easier with a Set and stringified coordinates
  generation: number;
}

interface GameOfLifeConfig {
  initialCells?: GameOfLifeCell[];
}

class GameOfLife {
  private state: GameOfLifeState;

  constructor({ initialCells = [] }: GameOfLifeConfig) {
    this.state = { generation: 0, cells: this.uniqueCells(initialCells) };
  }

  private uniqueCells(cells: GameOfLifeCell[]): GameOfLifeCell[] {
    return cells.filter((cell, index) => cells.findIndex(({ x, y }) => cell.x === x && cell.y === y) === index);
    // return [...new Set(cells.map((cell) => JSON.stringify(cell)))].map((str) => JSON.parse(str)); // seems to be tiny bit slower
  }

  private getNeighbors(cell: GameOfLifeCell): { neighborsCells: GameOfLifeCell[]; neighborsEmpty: GameOfLifeCell[] } {
    let neighborsCells: GameOfLifeCell[] = [];
    let neighborsEmpty: GameOfLifeCell[] = [];

    // check all 8 coordinates +-1 from the cell
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue; // skip itself

        const neighbor: GameOfLifeCell = { x: cell.x + dx, y: cell.y + dy };

        // check if neighbor is a current state cell or empty
        if (this.state.cells.some((cell) => cell.x === neighbor.x && cell.y === neighbor.y)) {
          neighborsCells = [...neighborsCells, neighbor];
        } else {
          neighborsEmpty = [...neighborsEmpty, neighbor];
        }
      }
    }

    return { neighborsCells, neighborsEmpty };
  }

  public nextGeneration(): GameOfLifeState {
    let nextGenCells: GameOfLifeCell[] = [];
    let emptyNeighborsToCheck: GameOfLifeCell[] = [];

    // for each cell, check if it survives
    for (const cell of this.state.cells) {
      const { neighborsCells, neighborsEmpty } = this.getNeighbors(cell);

      if (neighborsCells.length === 2 || neighborsCells.length === 3) {
        nextGenCells = [...nextGenCells, cell];
      }
      emptyNeighborsToCheck = [...emptyNeighborsToCheck, ...neighborsEmpty];
    }

    emptyNeighborsToCheck = this.uniqueCells(emptyNeighborsToCheck);

    // for each coordinate adjecent to a cell, check if a cell is born there
    for (const cell of emptyNeighborsToCheck) {
      if (this.getNeighbors(cell).neighborsCells.length === 3) {
        nextGenCells = [...nextGenCells, cell];
      }
    }

    nextGenCells = this.uniqueCells(nextGenCells);

    this.state = { generation: this.state.generation + 1, cells: nextGenCells };

    return this.state;
  }

  public getState(): GameOfLifeState {
    return this.state;
  }
}

export default GameOfLife;
export { GameOfLifeCell, GameOfLifeState, GameOfLifeConfig };
