import React, { Component } from 'react';

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
    };

    this.handleClick = this.handleClick.bind(this);
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
      return currentTurn;
    }
    return false;
  }

  render() {
    const { board, winner } = this.state;
    return (
      <div className="app-container">
        {winner ? <h1>The winner is: {winner}</h1> : null}
        <div className="board">
          {board.map((cell, index) => (
            <div
              key={index}
              onClick={() => this.handleClick(index)}
              className="square"
            >{cell}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default TicTacToeBoard;
