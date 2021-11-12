const init = (size,empt = ' ') => {
    return Array.from(Array(size), _ => Array(size).fill(empt));
}
const printBoard = board => {
    var res = "";
    board.forEach(row => {
        row.forEach(e => {
            res += e + '|';
        });
        res += '\n';
    });
    console.log(res);
}

const isFinish = (b, empt = ' ') => {
    // Check if any player wins
    for (var i=2;i<b.length-2;i++){
        for (var j=2;j<b[i].length-2;j++){
            if (b[i][j] != empt &&
                // check \
                ((b[i-2][j-2] == b[i][j] && b[i-1][j-1] == b[i][j] && 
                b[i][j] == b[i+1][j+1] && b[i][j] == b[i+2][j+2]) ||
                // check /
                (b[i-2][j+2] == b[i][j] && b[i-1][j+1] == b[i][j] &&
                b[i][j] == b[i+1][j-1] && b[i][j] == b[i+2][j-2]) ||
                // check -
                (b[i][j-2] == b[i][j] && b[i][j-1] == b[i][j] &&
                b[i][j] == b[i][j+1] && b[i][j] == b[i][j+2]) ||
                // check |
                (b[i-2][j] == b[i][j] && b[i-1][j] == b[i][j] &&
                b[i][j] == b[i+1][j] && b[i][j] == b[i+2][j])))
                return b[i][j];
        }
    }
    // Check if empty squares still exist
    b.forEach(row => {
        if (row.some(e => e == empt)) return -1;
    });

    // return 0 if no square left to play
    return 0;
}

const go = (b, bot, player, depth) => {

}

const run = (depth = 4) => {
    // init board
    var size = 20;
    var board = init(size);
    printBoard(board);

    // setting
    var signs = ['X', 'O']; // might scale up later
    var player = signs[Math.floor(Math.random() * signs.length)];
    var bot;
    do {
        bot = signs[Math.floor(Math.random() * signs.length)];
    } while (bot == player);

    var players = [player, bot];
    var now = players[Math.floor(Math.random() * players.length)];


}

run();