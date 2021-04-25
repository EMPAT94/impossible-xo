const NEW_BOARD = ["", "", "", "", "", "", "", "", ""];
const x = "x";
const o = "o";
const d = "don't care";
const e = "empty";

const state = {
  plTurns: 0,
  aiTurns: 0,
  next: x,
  prev: o,
  board: NEW_BOARD,
};

const compareBoards = (b1, b2) => b1.every((c, i) => (c === e ? !b2[i] : c === d || c === b2[i]));

function checkIfWinningOnNextTurn(b, s) {
  if (compareBoards([e, s, s], b)) return "0";
  if (compareBoards([s, e, s], b)) return "1";
  if (compareBoards([s, s, e], b)) return "2";
}

// Main Logic of next play
function aiPlay() {
  const board = state.board;
  switch (state.plTurns) {
    case 1:
      // If center if free, take it
      if (!board[4]) board[4] = state.next;
      // Else take a corner on top
      else if (!board[0]) board[0] = state.next;
      else if (!board[2]) board[2] = state.next;
      break;
    case 2:
      // Check for opponent win, block that win
      let i = checkIfWinningOnNextTurn(board, state.prev);
      if (i) board[+i] = state.next;
      // Take some other cell
      else {
        if (!board[1]) board[1] = state.next;
        else if (!board[7]) board[7] = state.next;
        else if (!board[3]) board[3] = state.next;
      }
      break;
    case 3:
    // Check for self wins, snatch win if present
    // If no self win, check for opponent win, block that win
    // If no opponent win, try for self win
   case 4:
    default:
      break;
  }

  state.aiTurns++;
  state.prev = state.next;
  state.next = state.next === x ? o : x;
  setState(state);
}

function plPlay(e) {
  const cell = Number(e.target.id);
  if (state.board[cell]) return;
  state.plTurns++;
  state.board[cell] = state.next;
  state.prev = state.next;
  state.next = state.next === x ? o : x;
  aiPlay(state);
}

function setState(state) {
  setBoard(state.board);
}

function setBoard(board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i]) dom_cells[i].innerHTML = board[i];
  }
}

const dom_cells = [];

window.onload = () => {
  setState(state);

  for (let cell of document.getElementsByClassName("cell")) {
    cell.addEventListener("click", plPlay);
    dom_cells.push(cell); // cache
  }
};
