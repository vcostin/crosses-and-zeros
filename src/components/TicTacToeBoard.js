import React, { Component } from 'react';

const DRAW_STATUS = 'DRAW';
const [SYMBOL_X, SYMBOL_O] = ['X', 'O'];

class TicTacToeBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxPlayer: SYMBOL_X,
      minPlayer: SYMBOL_O,
      board: [
        '', '', '',
        '', '', '',
        '', '', '',
      ],
      winner: null,
      winningCombo: [],
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleResetGame = this.handleResetGame.bind(this);
    this.handleSelectPlayer = this.handleSelectPlayer.bind(this);
    // this.findAiMove = this.findAiMove.bind(this);
  }

  componentWillMount() {
    this.setState({
      winner: this.checkForWinner([...this.state.board]),
    });
  }

  handleClick(index) {
    const {
      board,
      winner,
      maxPlayer,
      minPlayer,
    } = this.state;

    if (winner) {
      return;
    }
    const boardCopy = [...board];
    if (boardCopy[index] !== '') {
      return;
    }

    boardCopy[index] = maxPlayer;
    this.setState({
      winner: this.checkForWinner(boardCopy),
      board: [...boardCopy],
    });

    // AI MOVE
    boardCopy[this.findAiMove(boardCopy)] = minPlayer;
    this.setState({
      winner: this.checkForWinner(boardCopy),
      board: [...boardCopy],
    });
  }

  checkForWinner(board) {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const winningCombo = winningCombos.find(combo => (
      board[combo[0]] !== '' &&
      board[combo[1]] !== '' &&
      board[combo[2]] !== '' &&
      board[combo[0]] === board[combo[1]] &&
      board[combo[1]] === board[combo[2]]
    ));

    if (winningCombo) {
      this.setState({
        winningCombo,
      });
      return board[winningCombo[0]];
    }
    const searchEmptyCell = board.find(cell => cell === '');
    if (searchEmptyCell !== '') {
      this.setState({
        winningCombo: [],
      });
      return DRAW_STATUS;
    }

    return null;
  }

  winnerComboHighlight(index) {
    if (this.state.winner === null) {
      return '';
    }
    const winningCell = this.state.winningCombo.find(position => position === index);
    if (winningCell !== undefined) {
      return 'winning-cell';
    }
    return '';
  }

  handleResetGame() {
    this.setState({
      board: [
        '', '', '',
        '', '', '',
        '', '', '',
      ],
      winner: null,
      winningCombo: [],
      maxPlayer: SYMBOL_X,
      minPlayer: SYMBOL_O,
    });
  }

  handleSelectPlayer(player) {
    this.setState({
      currentTurn: player,
    });
  }

  gameResults() {
    const { winner } = this.state;
    switch (winner) {
      case SYMBOL_X:
      case SYMBOL_O:
        return <h1>The winner is: {winner}</h1>;
      case DRAW_STATUS:
        return <h1>{winner}!</h1>;
      default:
        return null;
    }
  }


  // Create a new version of the board to manipulate as a node on the tree
  copyBoard(board) {
    // This returns a new copy of the Board and ensures that you're only
    // manipulating the copies and not the primary board.
    return [...board];
  }

  // Determine if a move is valid and return the new board state
  validMove(move, player, board) {
    const newBoard = this.copyBoard(board);
    if (newBoard[move] === '') {
      newBoard[move] = player;
      return [...newBoard];
    }
    return null;
  }

  // This is the main AI function which selects the first position that
  // provides a winning result (or tie if no win possible)

  findAiMove(board) {
    let bestMoveScore = 100;
    let move = null;
    // Test Every Possible Move if the game is not already over.
    if (this.checkForWinner(board)) {
      return null;
    }
    for (let i = 0; i < board.length; i += 1) {
      const newBoard = this.validMove(i, this.state.minPlayer, board);
      // If validMove returned a valid game board
      if (newBoard) {
        const moveScore = this.maxScore(newBoard);
        if (moveScore < bestMoveScore) {
          bestMoveScore = moveScore;
          move = i;
        }
      }
    }
    return move;
  }

  maxScore(board) {
    const winnerCheck = this.checkForWinner(board);
    if (winnerCheck === this.state.maxPlayer) {
      return 10;
    } else if (winnerCheck === this.state.minPlayer) {
      return -10;
    } else if (winnerCheck === DRAW_STATUS) {
      return 0;
    }
    let bestMoveValue = -100;
    for (let i = 0; i < board.length; i += 1) {
      const newBoard = this.validMove(i, this.state.maxPlayer, board);
      if (newBoard) {
        const predictedMoveValue = this.minScore(newBoard);
        if (predictedMoveValue > bestMoveValue) {
          bestMoveValue = predictedMoveValue;
        }
      }
    }
    return bestMoveValue;
  }

  minScore(board) {
    const winnerCheck = this.checkForWinner(board);
    if (winnerCheck === this.state.maxPlayer) {
      return 10;
    } else if (winnerCheck === this.state.minPlayer) {
      return -10;
    } else if (winnerCheck === DRAW_STATUS) {
      return 0;
    }
    let bestMoveValue = 100;
    for (let i = 0; i < board.length; i += 1) {
      const newBoard = this.validMove(i, this.state.minPlayer, board);
      if (newBoard) {
        const predictedMoveValue = this.maxScore(newBoard);
        if (predictedMoveValue < bestMoveValue) {
          bestMoveValue = predictedMoveValue;
        }
      }
    }
    return bestMoveValue;
  }


  render() {
    const { board } = this.state;
    return (
      <div className="app-container">
        {this.gameResults()}
        <div className="board">
          {board.map((cell, index) => (
            <div
              key={index}
              onClick={() => this.handleClick(index)}
              className={`square ${this.winnerComboHighlight(index)}`}
            >{cell}</div>
          ))}
        </div>
        <div className="controls">
          <button onClick={this.handleResetGame}>Reset Game</button>
          <div className="select-player">
            <button onClick={() => this.handleSelectPlayer(SYMBOL_X)}>{SYMBOL_X}</button>
            <button onClick={() => this.handleSelectPlayer(SYMBOL_O)}>{SYMBOL_O}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default TicTacToeBoard;
