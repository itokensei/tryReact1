import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square"
              onClick ={props.onClick}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
      return (
          <Square
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
          />
      );
    }

    render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        /**
         * history: 記録
         * squares: historyの各盤面
         * addedSquare: historyの各着手
         * stepNumber: 表示する着手の序数
         * xIsNext: 表示中の盤面に対するplayer
         * @type {{xIsNext: boolean, history: [{squares: any[], addedSquare: number}], stepNumber: number}}
         */
        this.state = {
            history: [{
              squares: Array(9).fill(null),
              addedSquare: 0,
          }],
          stepNumber: 0,
          xIsNext: true,
        };
    }

    handleClick(i) {
        const
            history = this.state.history.slice(0,
                this.state.stepNumber + 1),//表示までの記録
            current = history[history.length - 1],//表示記録
            squares = current.squares.slice();//表示盤面
        //勝敗が決しているor埋まっているマスを選択した場合は実行しない
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';//マスを埋める
        this.setState({
            //表示までの記録にマスを埋めた次の記録を追加し、表示以降の記録は破棄
            history: history.concat([{
                squares: squares,
                addedSquare: i,//着手を記録
            }]),
            stepNumber: history.length,//最新の記録を表示させる
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];//表示している記録
      const winner =
          calculateWinner(current.squares);
      //記録した履歴
      const moves = history.map((step, move) => {
          const desc = move ?
              'Go to move #' + move :
              'Go to game start';
          const i = history[move].addedSquare;
          const action = move ?
              '(column, low) = (' + coordinates[i][0] + ', ' + coordinates[i][1] +')' :
              '';
          return (
              <li>
                  <button
                      onClick={() => this.jumpTo(move)}
                  >
                      {desc}
                  </button>
                  <div>{action}</div>
              </li>
          )
      })

      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' +
              (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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

var coordinates = [[1,1], [1, 2], [1, 3],
                   [2, 1], [2, 2], [2, 3],
                   [3, 1], [3, 2], [3, 3]];