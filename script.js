const DOM = (() => {  
    const writeSymbol = (symbol, x, y) => {
        const cell = document.querySelector(`#r${x}_c${y}`);
        cell.textContent = symbol;
    }

    const cells = document.querySelectorAll(".cell");
    const clearBoard = () => {
        cells.forEach((cell) => {
            cell.textContent = '';
        })
    }

    const lockBoard = () => {
        cells.forEach((cell) => {
            cell.classList.remove("cell-enabled");
        })
    }

    const unlockBoard = () => {
        cells.forEach((cell) => {
            cell.classList.add("cell-enabled");
        })
    }

    const lockCell = (rowIndex, colIndex) => {
        document.querySelector(`#r${rowIndex}_c${colIndex}`).classList.remove("cell-enabled");
    }

    const message = document.querySelector(".result__message");
    const writeMessage = (text) => {
        message.textContent = text;
    }

    const clearMessage = () => {
        message.textContent = '';
    }

    const btnNextRound = document.querySelector(".result__next-round");
    const toggleButtonVisability = () => {
        btnNextRound.classList.toggle("hidden");
    }

    const playerOneScoreEl = document.querySelector(".score-player1");
    const playerTwoScoreEl = document.querySelector(".score-player2");
    const writeScore = (playerOneScore, playerTwoScore) => {
        playerOneScoreEl.textContent = playerOneScore;
        playerTwoScoreEl.textContent = playerTwoScore;
    }

    return {writeSymbol, clearBoard, writeMessage, clearMessage, toggleButtonVisability, writeScore, lockBoard, lockCell, unlockBoard};
})();

const gameBoard = (() => {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
    let locked = false;

    const getBoard = () => board.map(row => [...row]);
    const isLocked = () => locked;

    const toggleLock = () => locked = locked ? false : true;

    const write = (symbol, rowIndex, colIndex) => {
        if (board[rowIndex][colIndex] === '' && !locked) {
            board[rowIndex][colIndex] = symbol
            if (board) return board;
        }  
    };

    const clearBoard = () => {
       board.forEach(row => row.fill(""));
       DOM.clearBoard();
    }

    return {getBoard, write, clearBoard, isLocked, toggleLock};
})();

const player = (name, symbol) => {
    let score = 0;

    const increaseScore = () => ++score;
    const getScore = () => score;
    const getName = () => name;
    const getSymbol = () => symbol;

    return {increaseScore, getScore, getName, getSymbol};
}

const game = (() => {
    let players = {
        "one": player("Dario", "X"),
        "two": player("Hrvoje", "O"),
    }
    
    //will foreach through them and check if last player have any combination equal.
    const winCombs = [
        [[0, 0], [0, 1], [0, 2]], 
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ]

    let lastPlayer = players.two;
    DOM.writeMessage(`${players.one.getName()}'s turn.`)

    const play = (rowIndex, colIndex) => {
        //Fetch current player
        let currentPlayer = players.one.getSymbol() !== lastPlayer.getSymbol() ? players.one : players.two;
        
        //Write players symbol inside gameboard
        if (gameBoard.write(currentPlayer.getSymbol(), rowIndex, colIndex)) {
            DOM.writeSymbol(currentPlayer.getSymbol(), rowIndex, colIndex);
            DOM.writeMessage(`${lastPlayer.getName()}'s turn.`)
            DOM.lockCell(rowIndex, colIndex);

            //Check if current user has won
            checkIfUserWon(currentPlayer);
            lastPlayer = currentPlayer;
        };
    }

    const checkIfUserWon = (player) => {
        const board = gameBoard.getBoard();
        const playerSymbol = player.getSymbol();

        for (let i = 0; i < winCombs.length; i++) {

            if (board[winCombs[i][0][0]][winCombs[i][0][1]] === playerSymbol && board[winCombs[i][1][0]][winCombs[i][1][1]] === playerSymbol && board[winCombs[i][2][0]][winCombs[i][2][1]] === playerSymbol) {
                DOM.writeMessage(player.getName() +" has won!!!");
                DOM.toggleButtonVisability();

                player.increaseScore();
                DOM.writeScore(players.one.getScore(), players.two.getScore());
                gameBoard.toggleLock();
                DOM.lockBoard();
                break;
            } else if (i == winCombs.length - 1 && !board.flat().includes("")) {
                DOM.writeMessage("It's a draw :(");
                DOM.toggleButtonVisability();
                gameBoard.toggleLock();
            }
        }
    }

    const startNextRound = () => {
        gameBoard.clearBoard();
        if (gameBoard.isLocked()) {
            gameBoard.toggleLock();
        }
        DOM.unlockBoard();

        const current_playerName = players.one.getSymbol() !== lastPlayer.getSymbol() ? players.one.getName() : players.two.getName();
        DOM.writeMessage(`${current_playerName}'s turn.`);
        DOM.toggleButtonVisability();
    }

    return {play, startNextRound};
})();

document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", (e) => {
        game.play(e.target.id[1], e.target.id[4]);
    })
})

document.querySelector(".result__next-round").addEventListener("click", (e) => {
    game.startNextRound();
})