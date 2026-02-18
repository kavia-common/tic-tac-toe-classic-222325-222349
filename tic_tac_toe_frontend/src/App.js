import React, { useMemo, useState } from 'react';
import './App.css';

const BOARD_SIZE = 9;

/**
 * Returns the winner ("X" or "O") if there is one, otherwise null.
 * Also returns the winning line indices (for highlighting).
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }

  return { winner: null, line: [] };
}

function getEmptyBoard() {
  return Array(BOARD_SIZE).fill(null);
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Game state:
   * - squares: board cells (null | "X" | "O")
   * - xIsNext: turn indicator
   * - gameId: increments for "New Game" (used to reset focus/key hints if needed)
   */
  const [squares, setSquares] = useState(() => getEmptyBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [gameId, setGameId] = useState(1);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = !winner && squares.every(Boolean);
  const isGameOver = Boolean(winner) || isDraw;

  const currentPlayer = xIsNext ? 'X' : 'O';

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    if (isGameOver) return;
    if (squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    // Same game id; just reset the board and turn.
    setSquares(getEmptyBoard());
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const newGame = () => {
    // Reset everything and bump game id (useful semantic distinction for users).
    setSquares(getEmptyBoard());
    setXIsNext(true);
    setGameId((id) => id + 1);
  };

  const statusText = winner
    ? `Player ${winner} wins!`
    : isDraw
      ? "It's a draw!"
      : `Player ${currentPlayer}'s turn`;

  const statusSubtext = winner
    ? 'Press Restart to play again, or New Game to reset.'
    : isDraw
      ? 'No more moves left. Try again!'
      : 'Click a square to place your mark.';

  return (
    <div className="App" data-gameid={gameId}>
      <main className="page">
        <header className="header">
          <div className="brand">
            <div className="brand__badge" aria-hidden="true">
              TTT
            </div>
            <div className="brand__text">
              <h1 className="title">Tic Tac Toe</h1>
              <p className="subtitle">Retro Arcade Edition</p>
            </div>
          </div>
        </header>

        <section className="panel" aria-live="polite" aria-atomic="true">
          <div className="statusRow">
            <div className="status">
              <span className="status__label">Status</span>
              <span className="status__value">{statusText}</span>
            </div>

            <div className="legend" aria-label="Player legend">
              <span className="chip chip--x" aria-label="Player X">
                X
              </span>
              <span className="chip chip--o" aria-label="Player O">
                O
              </span>
            </div>
          </div>

          <p className="statusHint">{statusSubtext}</p>

          <div className="boardWrap">
            <div
              className="board"
              role="grid"
              aria-label="Tic Tac Toe board"
              aria-disabled={isGameOver ? 'true' : 'false'}
            >
              {squares.map((value, idx) => {
                const isWinningCell = line.includes(idx);
                const cellLabel = value
                  ? `Square ${idx + 1}, occupied by ${value}`
                  : `Square ${idx + 1}, empty`;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={[
                      'cell',
                      value ? `cell--${value.toLowerCase()}` : '',
                      isWinningCell ? 'cell--win' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleSquareClick(idx)}
                    disabled={Boolean(value) || isGameOver}
                    role="gridcell"
                    aria-label={cellLabel}
                  >
                    <span className="cell__value" aria-hidden="true">
                      {value || ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="controls" role="group" aria-label="Game controls">
            <button type="button" className="btn" onClick={restartGame}>
              Restart
            </button>
            <button type="button" className="btn btn--primary" onClick={newGame}>
              New Game
            </button>
          </div>

          <footer className="footer">
            <span className="footer__note">
              Tip: Winning line highlights with a neon pulse.
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
