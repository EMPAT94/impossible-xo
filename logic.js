const NEW_BOARD = ["", "", "", "", "", "", "", "", ""];
const x = "X";
const o = "O";
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
  /**
   * Note:
   * d = don't care
   * e = empty
   * s = x | o
   *
   * s wins if e becomes s on next turn
   */

  const d_r = [d, d, d];
  const r_1 = [e, s, s];
  const r_2 = [s, e, s];
  const r_3 = [s, s, e];

  // Win first row
  if (compareBoards(r_1, b)) return "0";
  if (compareBoards(r_2, b)) return "1";
  if (compareBoards(r_3, b)) return "2";

  // Win second row
  if (compareBoards([...d_r, ...r_1], b)) return "3";
  if (compareBoards([...d_r, ...r_2], b)) return "4";
  if (compareBoards([...d_r, ...r_3], b)) return "5";

  // Win third row
  if (compareBoards([...d_r, ...d_r, ...r_1], b)) return "6";
  if (compareBoards([...d_r, ...d_r, ...r_2], b)) return "7";
  if (compareBoards([...d_r, ...d_r, ...r_3], b)) return "8";

  // Win first column
  if (compareBoards([e, d, d, s, d, d, s, d, d], b)) return "0";
  if (compareBoards([s, d, d, e, d, d, s, d, d], b)) return "3";
  if (compareBoards([s, d, d, s, d, d, e, d, d], b)) return "6";

  // Win second column
  if (compareBoards([d, e, d, d, s, d, d, s, d], b)) return "1";
  if (compareBoards([d, s, d, d, e, d, d, s, d], b)) return "4";
  if (compareBoards([d, s, d, d, s, d, e, e, d], b)) return "7";

  // Win third column
  if (compareBoards([d, d, e, d, d, s, d, d, s], b)) return "2";
  if (compareBoards([d, d, s, d, d, e, d, d, s], b)) return "5";
  if (compareBoards([d, d, s, d, d, s, d, d, e], b)) return "8";

  // Win diagonal left up to right down
  if (compareBoards([e, d, d, d, s, d, d, d, s], b)) return "0";
  if (compareBoards([s, d, d, d, e, d, d, d, s], b)) return "4";
  if (compareBoards([s, d, d, d, s, d, d, d, e], b)) return "8";

  // Win diagonal left down to right up
  if (compareBoards([d, d, e, d, s, d, s, d, d], b)) return "2";
  if (compareBoards([d, d, s, d, e, d, s, d, d], b)) return "4";
  if (compareBoards([d, d, s, d, s, d, e, d, d], b)) return "6";
}

// Main Logic of next play
function aiPlay() {
  const board = state.board;
  // Check for self wins, snatch win if present
  let i = checkIfWinningOnNextTurn(board, state.next);
  if (i) board[+i] = state.next;
  else {
    // If no self win, check for opponent win, block that win
    i = checkIfWinningOnNextTurn(board, state.prev);
    if (i) board[+i] = state.next;
    else {
      // If center if free, take it
      if (!board[4]) board[4] = state.next;
      // Else take a corner on top
      else if (!board[0]) board[0] = state.next;
      else {
        // Pick the first empty spot
        i = board.findIndex((c) => !c);
        board[+i] = state.next;
      }
    }
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
    if (board[i] && dom_cells[i].innerHTML != board[i]) {
      dom_cells[i].innerHTML = board[i];
      dom_cells[i].className = board[i] === x ? "cell-x" : "cell-o";
    }
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
