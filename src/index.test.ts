import GameOfLife from './index';

describe('GameOfLife', () => {
  it('should return the current state of the simulation', () => {
    const initialCells = [
      { x: 0, y: 0 },
      { x: 9, y: 9 },
    ];
    const game = new GameOfLife({ initialCells });

    const currentState = game.getState();

    expect(currentState.generation).toBe(0);
    expect(currentState.cells).toEqual(initialCells);
  });

  it('should handle empty board correctly', () => {
    const game = new GameOfLife({});

    game.nextGeneration();

    expect(game.getState().generation).toBe(1);
    expect(game.getState().cells).toEqual([]);
  });

  it('should handle 1 cell correctly (dies)', () => {
    const initialCells = [{ x: 0, y: 0 }];
    const game = new GameOfLife({ initialCells });

    game.nextGeneration();

    expect(game.getState().generation).toBe(1);
    expect(game.getState().cells).toEqual([]);
  });

  it('should handle 3 random cells correctly (all die)', () => {
    const initialCells = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 4, y: 0 },
    ];
    const game = new GameOfLife({ initialCells });

    game.nextGeneration();

    expect(game.getState().generation).toBe(1);
    expect(game.getState().cells).toEqual([]);
  });

  it('should handle 3 cells correctly (4th is born)', () => {
    const initialCells = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ];
    const game = new GameOfLife({ initialCells });

    game.nextGeneration();

    expect(game.getState().generation).toBe(1);
    expect(game.getState().cells).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('should update the current state to the next generation', () => {
    const initialCells = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    const game = new GameOfLife({ initialCells });

    game.nextGeneration();

    expect(game.getState().generation).toBe(1);
    expect(game.getState().cells).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
    ]);
  });

  it('should handle a stable pattern 1', () => {
    const initialCells = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    const game = new GameOfLife({ initialCells });

    game.nextGeneration();
    game.nextGeneration();
    game.nextGeneration();
    game.nextGeneration();

    expect(game.getState().generation).toBe(4);
    expect(game.getState().cells).toEqual(initialCells);
  });

  it('should handle a stable pattern 2', () => {
    const initialCells = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
    ];
    const game = new GameOfLife({ initialCells });

    game.nextGeneration();
    game.nextGeneration();
    game.nextGeneration();
    game.nextGeneration();

    expect(game.getState().generation).toBe(4);
    expect(game.getState().cells).toEqual(initialCells);
  });

  it('should handle an infinite loop pattern', () => {
    const initialCells = [
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ];
    const otherStateCells = [
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
    ];

    const game = new GameOfLife({ initialCells });

    game.nextGeneration();

    expect(game.getState().generation).toBe(1);
    expect(game.getState().cells).toEqual(otherStateCells);

    game.nextGeneration();

    expect(game.getState().generation).toBe(2);
    expect(game.getState().cells).toEqual(initialCells);

    game.nextGeneration();

    expect(game.getState().generation).toBe(3);
    expect(game.getState().cells).toEqual(otherStateCells);
  });
});
