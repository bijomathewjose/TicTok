import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick} style={{
      width: 100,
      height: 100
    }}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, onWin }) {
  const style = { display: 'flex', height: 100, width: 300 }
  function handleClick(i) {

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    onWin(winner)
    status = 'Winner: ' + winner;
  } else {
    status = 'Current player: ' + (!xIsNext ? 'X' : 'O');
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row" style={style}>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row" style={style}>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row" style={style}>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}

export default function Game() {
  const emptySquares = [Array(9).fill(null)]
  const [history, setHistory] = useState(emptySquares);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isOpen, setIsOpen] = useState(false)
  const [winnerPlayer, setWinner] = useState(null)

  function handlePlay(nextSquares) {
    console.log(currentMove)
    if (currentMove === 8) {

      setIsOpen(true)
      setWinner('Tie')
    }
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const Reset = () => {
    setCurrentMove(0)
    setHistory(emptySquares)
  }
  const Undo = () => {
    if (currentMove > 1) {
      setCurrentMove(currentMove => {
        return currentMove - 1
      })
      setHistory(history => {
        return history.slice(0, currentMove)
      })
    } else {
      Reset()
    }
  }


  return (
    <div className="game">
      <button onClick={Reset}>Reset</button>
      <button onClick={Undo}>Undo</button>
      <div className="game-board">
        <Board onWin={(winner) => {
          setWinner(`Winner is Player ${winner} `)
          setIsOpen(true)
        }} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      {isOpen && <div style={{
        position: 'absolute',
        zIndex: 1000,
        fontSize: 100,
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '80%',
            height: '80%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >    {winnerPlayer ?? ''}
          <button style={{ fontSize: '16px' }} onClick={() => {
            Reset()
            setIsOpen(false)
          }}>Restart</button>

        </div>
      </div>}
    </div >
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
