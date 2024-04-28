const gameBoard = (() => {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const getBoard = () => board;
    const write = (symbol, rowIndex, colIndex) => {
        if (board[rowIndex][colIndex] === '') {
            board[rowIndex][colIndex] = symbol
            return board;
        }  
    };
    const clearBoard = () => {
       board.forEach(row => row.fill(""));
       return board;
    }

    return {getBoard, write, clearBoard};
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
        "two": player("Hrvoje", "O")
    }


    
})();