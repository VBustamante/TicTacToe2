
function startGame(){
  const board = document.getElementById("board");

  // Create Board
  for(let external_row = 0; external_row < 3; external_row++){
    let e_ext_row = document.createElement('div');
    e_ext_row.className = "row";

    for (let game = 0; game < 3; game++){
      let e_game = document.createElement('div');
      e_game.className = "game active";
      for(let row = 0; row < 3; row++){
        let e_row = document.createElement('div');
        e_row.className = "row";
        for(let square = 0; square < 3; square++) {
          let e_square = document.createElement('div');
          e_square.className = "square";
          e_row.appendChild(e_square);
        }

        e_game.appendChild(e_row);
      }
      let e_game_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      e_game.appendChild(e_game_svg);
      e_ext_row.appendChild(e_game);
    }

    board.appendChild(e_ext_row);
  }

  // Append game logic to squares
  let e_squares = document.getElementsByClassName("square");
  let processingClick = false;
  for(let i = 0; i < e_squares.length; i++){
    let e = e_squares[i];
    e.addEventListener('click', _=> {
      let e_row = e.parentElement;
      let e_game = e_row.parentElement;
      if (e_game.className.indexOf('active') === -1) return;
      if (e.classList[1]) return;
      if(processingClick) return;
      processingClick = true;

      let active_player = board.className;
      e.className += ' ' + active_player;

      let e_games = document.getElementsByClassName('game');
      for(let j = 0; j < e_games.length; j++) {
        let e_game_instance = e_games[j];
        e_game_instance.className = e_game_instance.className.replace(" active", '');
      }

      let square_col = [...e_row.children].indexOf(e);
      let square_row = [...e_game.children].indexOf(e_row);


      if(!e_game.getAttribute('finished')){
        let game_data = [];

        for(let j = 0; j < 3; j++) {
          game_data[j] = [];
          for(let k = 0; k < 3; k++) {
            game_data[j][k] = e_game.children[j].children[k].classList[1];
          }
        }

        let win_state = check_winner(game_data, square_row, square_col);
        console.log(win_state);
        console.log("row: "+square_row);
        console.log("col: "+square_col);
        if(win_state){
          e_game.setAttribute('finished', 'true');
          e_game.className += " " + active_player;
          drawLine(e_game, win_state, square_row, square_col);
        }
      }

      board.children[square_row].children[square_col].className += ' active';
      board.className = active_player === 'x'? 'o' : 'x';
      processingClick = false;
    });
  }
}

function check_winner(board, row, col){
  if(board[row][0] === board[row][1] && board[row][1] === board [row][2]) return 'row';
  if(board[0][col] === board[1][col] && board[1][col] === board [2][col]) return 'col';

  if(row === col && board[0][0] === board[1][1] && board[1][1] === board [2][2]) return 'd1';
  if(row + col === 2 && board[0][2] === board[1][1] && board[1][1] === board [2][0]) return 'd2';

  return null;
}

function drawLine(game, type, col, row) {
  const e_svg = game.getElementsByTagName("svg")[0];

  let x1, x2, y1, y2;
  switch (type) {
    case "d1":
      x1 = "5%";
      x2 = "95%";
      y1 = "5%";
      y2 = "95%";
      break;
    case "d2":
      x1 = "5%";
      x2 = "95%";
      y1 = "95%";
      y2 = "5%";
      break;
    case "row":
      x1 = "5%";
      x2 = "95%";
      y1 = y2 = (34*col + 16) + "%";
      break;
    case "col":
      x1 = x2 = (34*row + 16) + "%";
      y1 = "5%";
      y2 = "95%";

      break;
  }

  const e_line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  e_line.setAttribute("x1", x1);
  e_line.setAttribute("x2", x2);
  e_line.setAttribute("y1", y1);
  e_line.setAttribute("y2", y2);

  e_svg.appendChild(e_line);

}

window.onload = _ => {
  startGame();

  document.getElementById("reset").addEventListener("click", _ => {
    const board = document.getElementById("board");
    while(board.lastChild){
      board.removeChild(board.lastChild);
    }

    startGame();
  })
};
