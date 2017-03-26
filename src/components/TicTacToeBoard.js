import React, { Component } from 'react';

const DRAW_STATUS = 'DRAW';

class TicTacToeBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PLAYER_ONE_SYMBOL: 'X',
      PLAYER_TWO_SYMBOL: 'O',
      currentTurn: 'X',
      board: [
        '', '', '', '', '', '', '', '', '',
      ],
      winner: null,
      winningCombo: [],
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleResetGame = this.handleResetGame.bind(this);
    this.handleSelectPlayer = this.handleSelectPlayer.bind(this);
  }

  handleClick(index) {
    const {
      board,
      currentTurn,
      PLAYER_ONE_SYMBOL,
      PLAYER_TWO_SYMBOL,
      winner,
    } = this.state;

    if (winner) { return; }
    if (board[index] !== '') { return; }

    board[index] = currentTurn;
    this.setState({
      winner: this.checkForWinner(),
      board: this.state.board,
      currentTurn: currentTurn === PLAYER_ONE_SYMBOL
        ? PLAYER_TWO_SYMBOL
        : PLAYER_ONE_SYMBOL,
    });
  }

  checkForWinner() {
    const { board, currentTurn } = this.state;
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
      return currentTurn;
    }
    const isNotDraw = this.state.board.find(cell => cell === '');
    if (isNotDraw !== '') {
      return DRAW_STATUS;
    }

    return false;
  }

  winnerComboHighlight(index) {
    if (this.state.winner === null) { return ''; }
    const winningCell = this.state.winningCombo.find(position => position === index);
    if (winningCell !== undefined) {
      return 'winning-cell';
    }
    return '';
  }

  handleResetGame() {
    this.setState({
      board: [
        '', '', '', '', '', '', '', '', '',
      ],
      winner: null,
      winningCombo: [],
    });
  }

  handleSelectPlayer(player) {
    this.setState({
      currentTurn: player,
    });
  }

  gameResults() {
    const { winner, PLAYER_ONE_SYMBOL, PLAYER_TWO_SYMBOL } = this.state;
    switch (winner) {
      case PLAYER_ONE_SYMBOL:
      case PLAYER_TWO_SYMBOL:
        return <h1>The winner is: {winner}</h1>;
      case DRAW_STATUS:
        return <h1>{winner}!</h1>;
      default:
        return null;
    }
  }

  render() {
    const { board, winner, PLAYER_ONE_SYMBOL, PLAYER_TWO_SYMBOL } = this.state;
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
            <button onClick={() => this.handleSelectPlayer(PLAYER_ONE_SYMBOL)}>{PLAYER_ONE_SYMBOL}</button>
            <button onClick={() => this.handleSelectPlayer(PLAYER_TWO_SYMBOL)}>{PLAYER_TWO_SYMBOL}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default TicTacToeBoard;
