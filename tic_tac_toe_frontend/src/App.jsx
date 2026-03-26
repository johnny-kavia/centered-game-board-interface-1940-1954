import React, { useMemo, useState } from "react";

const PLAYER_X = "X";
const PLAYER_O = "O";

const WINNING_LINES = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(squares) {
  for (const [a, b, c] of WINNING_LINES) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isDraw(squares) {
  return squares.every((s) => s !== null);
}

function getStatusText({ winner, draw, nextPlayer }) {
  if (winner) return `Winner: ${winner}`;
  if (draw) return "Draw game";
  return `Current player: ${nextPlayer}`;
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root component for the Tic Tac Toe game (UI + game state). */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState(PLAYER_X);

  const { winner, line } = useMemo(() => getWinner(squares), [squares]);
  const draw = useMemo(() => !winner && isDraw(squares), [squares, winner]);
  const gameOver = Boolean(winner) || draw;

  const statusText = useMemo(
    () => getStatusText({ winner, draw, nextPlayer }),
    [winner, draw, nextPlayer],
  );

  function handleSquareClick(index) {
    if (gameOver) return;
    if (squares[index] !== null) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = nextPlayer;
      return next;
    });

    setNextPlayer((p) => (p === PLAYER_X ? PLAYER_O : PLAYER_X));
  }

  function restart() {
    setSquares(Array(9).fill(null));
    setNextPlayer(PLAYER_X);
  }

  return (
    <div className="app">
      <div className="shell">
        <header className="header">
          <div className="titleRow">
            <h1 className="title">Tic Tac Toe</h1>
            <span className="pill">3×3</span>
          </div>

          <div
            className={[
              "status",
              winner ? "status--winner" : "",
              draw ? "status--draw" : "",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <span className="statusLabel">{statusText}</span>
            {!gameOver && (
              <span
                className={[
                  "turnBadge",
                  nextPlayer === PLAYER_X ? "turnBadge--x" : "turnBadge--o",
                ].join(" ")}
                aria-label={`Next player ${nextPlayer}`}
              >
                {nextPlayer}
              </span>
            )}
          </div>
        </header>

        <main className="main">
          <div
            className="board"
            role="grid"
            aria-label="Tic Tac Toe board"
            aria-disabled={gameOver}
          >
            {squares.map((value, idx) => {
              const isWinning = line ? line.includes(idx) : false;
              const disabled = gameOver || value !== null;

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "cell",
                    value ? `cell--${value.toLowerCase()}` : "",
                    isWinning ? "cell--winning" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  disabled={disabled}
                  role="gridcell"
                  aria-label={`Cell ${idx + 1}${value ? `: ${value}` : ""}`}
                >
                  <span className="cellValue" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>
        </main>

        <footer className="footer">
          <button type="button" className="button" onClick={restart}>
            Restart
          </button>

          <p className="help">
            {gameOver
              ? "Press Restart to play again."
              : "Click an empty square to place your mark."}
          </p>
        </footer>
      </div>
    </div>
  );
}
