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

    const play = (rowIndex, colIndex) => {
        //Fetch current player
        let currentPlayer = players.one.getSymbol() !== lastPlayer.getSymbol() ? players.one : players.two;
        //Write players symbol inside gameboard
        //If he tried to write to the j
        if (gameBoard.write(currentPlayer.getSymbol(), rowIndex, colIndex)) {
            //Check if current user has won
            checkIfUserWon(currentPlayer);
            lastPlayer = currentPlayer;
        };
    }

    const checkIfUserWon = (player) => {
        const board = gameBoard.getBoard();
        console.table(board);
        console.log("Player: " + player.getName());
        
        const playerSymbol = player.getSymbol();

        for (let i = 0; i < winCombs.length; i++) {

            if (board[winCombs[i][0][0]][winCombs[i][0][1]] === playerSymbol && board[winCombs[i][1][0]][winCombs[i][1][1]] === playerSymbol && board[winCombs[i][2][0]][winCombs[i][2][1]] === playerSymbol) {
                console.log(player.getName() + " has won");
                player.increaseScore();
                gameBoard.toggleLock();
                break;
            } else if (i == winCombs.length - 1 && !board.flat().includes("")) {
                console.log("Its a draw");
                gameBoard.toggleLock();
            }
        }
    }

    const startNextRound = () => {
        gameBoard.clearBoard();
        if (gameBoard.isLocked()) {
            gameBoard.toggleLock();
        }
    }

    return {play, startNextRound};
})();

const userInteractions = (() => {

})();