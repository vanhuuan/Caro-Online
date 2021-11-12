// Debug tool

const genRandNode = (max, size = 20, empt = " ") => {
  var board = Array.from(Array(size), (_) => Array(size).fill(empt));
  var signs = ["X", "O"];
  var count = 0;
  while (count < max) {
    var i = Math.floor(Math.random() * size);
    var j = Math.floor(Math.random() * size);
    if (board[i][j] == empt) {
      board[i][j] = signs[Math.floor(Math.random() * signs.length)];
      count++;
    }
  }
  return board;
};

// Program
const init = (size = 20, empt = " ") => {
  return Array.from(Array(size), (_) => Array(size).fill(empt));
};
const printBoard = (board) => {
  var res = " ".padStart(3);
  for (var i = 0; i < board.length; i++) {
    res += "|" + String(i).padStart(3);
  }
  res += "\n";
  for (var i = 0; i < board.length; i++) {
    res += String(i).padStart(3);
    for (var j = 0; j < board[i].length; j++) {
      res += "|" + String(board[i][j]).padStart(3);
    }
    res += "\n";
  }
  //   board.forEach((row) => {
  //     row.forEach((e) => {
  //       res += e + "|";
  //     });
  //     res += "\n";
  //   });
  console.log(res);
};

const isFinish = (b, empt = " ") => {
  // Check if any player wins
  for (var i = 2; i < b.length - 2; i++) {
    for (var j = 2; j < b[i].length - 2; j++) {
      if (
        b[i][j] != empt &&
        // check \
        ((b[i - 2][j - 2] == b[i][j] &&
          b[i - 1][j - 1] == b[i][j] &&
          b[i][j] == b[i + 1][j + 1] &&
          b[i][j] == b[i + 2][j + 2]) ||
          // check /
          (b[i - 2][j + 2] == b[i][j] &&
            b[i - 1][j + 1] == b[i][j] &&
            b[i][j] == b[i + 1][j - 1] &&
            b[i][j] == b[i + 2][j - 2]) ||
          // check -
          (b[i][j - 2] == b[i][j] &&
            b[i][j - 1] == b[i][j] &&
            b[i][j] == b[i][j + 1] &&
            b[i][j] == b[i][j + 2]) ||
          // check |
          (b[i - 2][j] == b[i][j] &&
            b[i - 1][j] == b[i][j] &&
            b[i][j] == b[i + 1][j] &&
            b[i][j] == b[i + 2][j]))
      )
        return b[i][j];
    }
  }
  // check - at borders
  for (var i = 0; i < 2; i++) {
    for (var j = 2; j < b[i].length - 2; j++) {
      if (
        b[i][j] != empt &&
        b[i][j - 2] == b[i][j] &&
        b[i][j - 1] == b[i][j] &&
        b[i][j] == b[i][j + 1] &&
        b[i][j] == b[i][j + 2]
      )
        return b[i][j];
    }
  }
  for (var i = b.length - 2; i < b.length; i++) {
    for (var j = 2; j < b[i].length - 2; j++) {
      if (
        b[i][j] != empt &&
        b[i][j - 2] == b[i][j] &&
        b[i][j - 1] == b[i][j] &&
        b[i][j] == b[i][j + 1] &&
        b[i][j] == b[i][j + 2]
      )
        return b[i][j];
    }
  }
  // check | at borders
  for (var j = 0; j < 2; j++) {
    for (var i = 2; i < b.length - 2; i++) {
      if (
        b[i][j] != empt &&
        b[i - 2][j] == b[i][j] &&
        b[i - 1][j] == b[i][j] &&
        b[i][j] == b[i + 1][j] &&
        b[i][j] == b[i + 2][j]
      )
        return b[i][j];
    }
  }
  for (var j = b.length - 2; j < b.length; j++) {
    for (var i = 2; i < b.length - 2; i++) {
      if (
        b[i][j] != empt &&
        b[i - 2][j] == b[i][j] &&
        b[i - 1][j] == b[i][j] &&
        b[i][j] == b[i + 1][j] &&
        b[i][j] == b[i + 2][j]
      )
        return b[i][j];
    }
  }

  // Check if empty squares still exist (return -1)
  for (var i = 0; i < b.length; i++) {
    for (var j = 0; j < b[i].length; j++) {
      if (b[i][j] == empt) return -1;
    }
  }

  // return 0 if no square left to play
  return 0;
};

const value = (node, bot, player) => {
  // value for minimax calculation
  var fin = isFinish(node);
  if (fin == bot) return 1;
  // return positive value (bot wins, maximizing bot)
  else if (fin == player) return -1;
  // return negative value (player wins, minimizing player)
  else return 0; // return neutral value (no one wins, state unchanged)
};

const predictMoves = (node, empt = " ") => {
  var moves = [];
  // left and right of all existed moves
  for (var i = 0; i < node.length; i++) {
    var flag = false;
    var spaces = 0;
    var rowMoves = [];
    for (var j = 0; j < node[i].length; j++) {
      if (node[i][j] != empt && flag == false) {
        flag = true;
        if (j - 1 >= 0 && spaces != 1) rowMoves.push([i, j - 1]);
        continue;
      }
      if (node[i][j] == empt && flag == true) {
        flag = false;
        spaces = 1;
        rowMoves.push([i, j]);
        continue;
      }
      if (node[i][j] == empt && flag == false && rowMoves.length > 0) spaces++;
    }
    moves = moves.concat(rowMoves);
  }
  // top and bottom of all existed moves (square matrix only)
  for (var j = 0; j < node.length; j++) {
    var flag = false;
    var spaces = 0;
    var colMoves = [];
    for (var i = 0; i < node.length; i++) {
      if (node[i][j] != empt && flag == false) {
        flag = true;
        if (i - 1 >= 0 && spaces != 1) colMoves.push([i - 1, j]);
        continue;
      }
      if (node[i][j] == empt && flag == true) {
        flag = false;
        spaces = 1;
        colMoves.push([i, j]);
        continue;
      }
      if (node[i][j] == empt && flag == false && colMoves.length > 0) spaces++;
    }
    moves = moves.concat(colMoves);
  }

  // check for duplicates
  var uniqueMoves = [];
  for (var i = 0; i < moves.length; i++) {
    var unique = true;
    for (var j = 0; j < uniqueMoves.length; j++) {
      if (
        moves[i][0] == uniqueMoves[j][0] &&
        moves[i][1] == uniqueMoves[j][1]
      ) {
        unique = false;
        break;
      }
    }
    if (unique) uniqueMoves.push(moves[i]);
    unique = true;
  }
  moves = uniqueMoves;

  // find corners
  var corners = [];
  for (var i = 0; i < moves.length; i++) {
    for (var j = i + 1; j < moves.length; j++) {
      // top left
      if (
        moves[i][0] - 1 == moves[j][0] &&
        moves[i][1] == moves[j][1] - 1 &&
        node[moves[j][0]][moves[i][1]] == empt
      ) {
        // i bottom, j top
        corners.push([moves[j][0], moves[i][1]]);
        continue;
      }
      if (
        moves[j][0] - 1 == moves[i][0] &&
        moves[j][1] == moves[i][1] - 1 &&
        node[moves[i][0]][moves[j][1]] == empt
      ) {
        // j bottom, i top
        corners.push([moves[i][0], moves[j][1]]);
        continue;
      }
      // top right
      if (
        moves[i][0] - 1 == moves[j][0] &&
        moves[i][1] == moves[j][1] + 1 &&
        node[moves[j][0]][moves[i][1]] == empt
      ) {
        // i bottom, j top
        corners.push([moves[j][0], moves[i][1]]);
        continue;
      }
      if (
        moves[j][0] - 1 == moves[i][0] &&
        moves[j][1] == moves[i][1] + 1 &&
        node[moves[i][0]][moves[j][1]] == empt
      ) {
        // j bottom, i top
        corners.push([moves[i][0], moves[j][1]]);
        continue;
      }
      // bottom left
      if (
        moves[i][0] - 1 == moves[j][0] &&
        moves[i][1] == moves[j][1] + 1 &&
        node[moves[i][0]][moves[j][1]] == empt
      ) {
        // i bottom, j top
        corners.push([moves[i][0], moves[j][1]]);
        continue;
      }
      if (
        moves[j][0] - 1 == moves[i][0] &&
        moves[j][1] == moves[i][1] + 1 &&
        node[moves[j][0]][moves[i][1]] == empt
      ) {
        // j bottom, i top
        corners.push([moves[j][0], moves[i][1]]);
        continue;
      }
      // bottom right
      if (
        moves[i][0] - 1 == moves[j][0] &&
        moves[i][1] == moves[j][1] - 1 &&
        node[moves[i][0]][moves[j][1]] == empt
      ) {
        // i bottom, j top
        corners.push([moves[i][0], moves[j][1]]);
        continue;
      }
      if (
        moves[j][0] - 1 == moves[i][0] &&
        moves[j][1] == moves[i][1] - 1 &&
        node[moves[j][0]][moves[i][1]] == empt
      ) {
        // j bottom, i top
        corners.push([moves[j][0], moves[i][1]]);
        continue;
      }
    }
  }

  // check for duplicates
  var uniqueCorners = [];
  for (var i = 0; i < corners.length; i++) {
    var unique = true;
    for (var j = 0; j < uniqueCorners.length; j++) {
      if (
        corners[i][0] == uniqueCorners[j][0] &&
        corners[i][1] == uniqueCorners[j][1]
      ) {
        unique = false;
        break;
      }
    }
    if (unique) uniqueCorners.push(corners[i]);
    unique = true;
  }
  corners = uniqueCorners;

  moves = moves.concat(corners);

  return moves;
};

const alphabeta = (node, depth, isBot, bot, player, a, b, empt = " ") => {
  // if match is still in progress
  if (String(isFinish(node)) != "-1" || depth == 0) {
    return value(node, bot, player);
  }

  var predicts = predictMoves(node);

  // maximizing player is bot
  if (isBot) {
    // choose bot's best possible move (highest value)
    // for (var i = 0; i < node.length; i++) {
    //   for (var j = 0; j < node[i].length; j++) {
    //     if (node[i][j] == empt) {
    //       // if square is empty (possible move)
    //       var child = node.map((row) => row.slice()); // copy old board
    //       child[i][j] = bot; // bot moves in this position
    //       a = Math.max(a, alphabeta(child, depth - 1, !isBot, bot, player));
    //       // prun if value in branch alpha is already better than value in branch beta (maximizing value is higher than minimizing value)
    //       if (a >= b) break;
    //     }
    //   }
    // }
    for (var i = 0; i < predicts.length; i++) {
      // if square is empty (possible move)
      var child = node.map((row) => row.slice()); // copy old board
      child[predicts[i][0]][predicts[i][1]] = bot; // bot moves in this position
      a = Math.max(a, alphabeta(child, depth - 1, !isBot, bot, player, a, b));
      // prun if value in branch alpha is already better than value in branch beta (maximizing value is higher than minimizing value)
      if (a >= b) break;
    }
    return a;
  } else {
    // choose player's best possible move (lowest value)
    // for (var i = 0; i < node.length; i++) {
    //   for (var j = 0; j < node[i].length; j++) {
    //     if (node[i][j] == empt) {
    //       // if square is empty (possible move)
    //       var child = node.map((row) => row.slice()); // copy old board
    //       child[i][j] = player; // in case player moves in this position
    //       b = Math.min(b, alphabeta(child, depth - 1, !isBot, bot, player));
    //       // prun if value in branch alpha is already better than value in branch beta (maximizing value is higher than minimizing value)
    //       if (a >= b) break;
    //     }
    //   }
    // }
    for (var i = 0; i < predicts.length; i++) {
      // if square is empty (possible move)
      var child = node.map((row) => row.slice()); // copy old board
      child[predicts[i][0]][predicts[i][1]] = player; // in case player moves in this position
      b = Math.min(b, alphabeta(child, depth - 1, !isBot, bot, player, a, b));
      // prun if value in branch alpha is already better than value in branch beta (maximizing value is higher than minimizing value)
      if (a >= b) break;
    }
    return b;
  }
};

const minimax = (node, depth, isBot, bot, player, empt = " ") => {
  // maximizing value is -10 (bot)
  // minimizing value is 10 (player)
  // minimax using alpha-beta prunning
  return alphabeta(node, depth, isBot, bot, player, -10, 10, empt);
};

const go = (b, bot, player, depth, empt = " ") => {
  var ways = [];
  var move = [];
  // find empty squares (possible moves) (linear search)
  //   for (var i = 0; i < b.length; i++) {
  //     for (var j = 0; j < b[i].length; j++) {
  //       if (b[i][j] == empt) ways.push([i, j]);
  //     }
  //   }

  // if player goes first, use prediction
  ways = predictMoves(b);
  if (ways.length == 0) {
    // if bot goes first, find empty squares (possible moves) (from inside out, top half first)
    for (var i = Math.floor(b.length / 2) - 1; i >= 0; i--) {
      for (var j = Math.floor(b[i].length / 2) - 1; j >= 0; j--) {
        if (b[i][j] == empt) ways.push([i, j]);
      }
      for (var j = Math.floor(b[i].length / 2); j < b[i].length; j++) {
        if (b[i][j] == empt) ways.push([i, j]);
      }
    }
    for (var i = Math.floor(b.length / 2); i < b.length; i++) {
      for (var j = Math.floor(b[i].length / 2) - 1; j >= 0; j--) {
        if (b[i][j] == empt) ways.push([i, j]);
      }
      for (var j = Math.floor(b[i].length / 2); j < b[i].length; j++) {
        if (b[i][j] == empt) ways.push([i, j]);
      }
    }
  }
  // run minimax algorithm for each move and choose the move which minimax returns max value (best for player)
  var max = -10;
  for (var i = 0; i < ways.length; i++) {
    var child = b.map((row) => row.slice()); // copy old board
    child[ways[i][0]][ways[i][1]] = bot;
    var mm = minimax(child, depth, false, bot, player);
    if (max < mm) {
      max = mm;
      move = [ways[i][0], ways[i][1]];
    }
  }
  return move;
};

const run = (depth = 3, size = 20) => {
  // init board
  var empt = " ";
  var board = init(size, empt);
  printBoard(board);

  // setting
  var signs = ["X", "O"]; // might scale up later
  var player = signs[Math.floor(Math.random() * signs.length)];
  var bot;
  do {
    bot = signs[Math.floor(Math.random() * signs.length)];
  } while (bot == player);

  var players = [player, bot];
  var now = players[Math.floor(Math.random() * players.length)];

  // Start game
  console.log("Start");
  var state = isFinish(board, empt);
  while (state == -1) {
    // while game is still in progress
    if (now == bot) {
      console.log("Bot turn");
      // bot moves
      var move = go(board, bot, player, depth, empt);
      board[move[0]][move[1]] = bot;
      now = player;
    } else {
      console.log("Player turn");
      while (true) {
        var move = prompt("Your move (" + player + ")")
          .split(" ")
          .map(Number); // get input "x y" then convert to int array [x,y]
        // if player's move is possible (empty square)
        if (board[move[0]][move[1]] == empt) {
          board[move[0]][move[1]] = player;
          break;
        }
      }
      now = bot;
    }
    // print board and check board's state (finish or not, who wins)
    printBoard(board);
    state = isFinish(board);
  }

  // End game, print result
  console.log("End");
  if (state == 0) console.log("Draw");
  else console.log(state + " wins");
};

run();
