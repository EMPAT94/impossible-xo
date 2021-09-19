const x = "&cross;";
const o = "&#9711;";
const d = "don't care";
const e = "empty";

let state;

/*
 * Note:
 *
 * For every cell of b1
 *   if empty then return (is b2 cell also is empty?)
 *   else if not empty then
 *     if value doesnt matter then return true
 *     else return (is value of b1 cell equal to value of b2 cell?)
 *
 * TODO: Simplify maybe?
 */
const compareBoards = (b1, b2) => b1.every((c, i) => (c === e ? !b2[i] : c === d || c === b2[i]));

function checkIfWinning(s /* x | o */) {
  /**
   * Note:
   * d = don't care
   * e = empty
   * s = x | o
   *
   * s wins if e becomes s on next turn
   */

  const b = state.board;

  // Win first row
  if (compareBoards([e, s, s], b)) return "0";
  if (compareBoards([s, e, s], b)) return "1";
  if (compareBoards([s, s, e], b)) return "2";

  // Win second row
  if (compareBoards([d, d, d, e, s, s], b)) return "3";
  if (compareBoards([d, d, d, s, e, s], b)) return "4";
  if (compareBoards([d, d, d, s, s, e], b)) return "5";

  // Win third row
  if (compareBoards([d, d, d, d, d, d, e, s, s], b)) return "6";
  if (compareBoards([d, d, d, d, d, d, s, e, s], b)) return "7";
  if (compareBoards([d, d, d, d, d, d, s, s, e], b)) return "8";

  // Win first column
  if (compareBoards([e, d, d, s, d, d, s, d, d], b)) return "0";
  if (compareBoards([s, d, d, e, d, d, s, d, d], b)) return "3";
  if (compareBoards([s, d, d, s, d, d, e, d, d], b)) return "6";

  // Win second column
  if (compareBoards([d, e, d, d, s, d, d, s, d], b)) return "1";
  if (compareBoards([d, s, d, d, e, d, d, s, d], b)) return "4";
  if (compareBoards([d, s, d, d, s, d, d, e, d], b)) return "7";

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

// Similar to above, but only to ensure not getting trapped
function checkIfLosing() {
  const s = state.next;
  const b = state.board;

  if (compareBoards([e, e, d, e, o, d, x, e, e], b)) return "1";
  if (compareBoards([d, e, e, e, o, d, e, d, e], b)) return "8";
  if (compareBoards([s, e, e, e, x, e, e, e, x], b)) return "2";
}

// Main Logic of next play
function aiPlay() {
  const b = state.board;
  let cell;

  let aiWon = false;
  let draw = false;

  if (state.aiTurns === 1) cell = checkIfLosing();

  if (!cell) {
    // Check for self wins, snatch win if present
    let i = checkIfWinning(state.next);
    if (i) {
      cell = i;
      aiWon = true;
    } else {
      // If no self win, check for opponent win, block that win
      i = checkIfWinning(state.prev);
      if (i) cell = i;
      else {
        // If center if free, take it
        if (!b[4]) cell = "4";
        // Else take a corner on top
        else if (!b[0]) cell = "0";
        else {
          // Pick the first empty spot that can cause win
          i = b.findIndex(c => !c);
          if (i >= 0) {
            cell = i.toString(); // In case of 0
          } else {
            // If no empty spot then game is draw
            draw = true;
          }
        }
      }
    }
  }

  if (cell) state.board[Number(cell)] = state.next;

  state.aiTurns++;
  state.prev = state.next;
  state.next = state.next === x ? o : x;

  if (aiWon) state.aiWon = true;
  else if (draw) state.draw = true;

  setState();
}

function plPlay(e) {
  const cell = Number(e.target.id);
  if (state.board[cell] || state.aiWon || state.draw) return;
  state.plTurns++;
  state.board[cell] = state.next;
  state.prev = state.next;
  state.next = state.next === x ? o : x;

  // NOTE: This setState() and timeout is just for adding delay in ai turn,
  // for aesthetic purposes
  setState();
  closeBoard();
  setTimeout(aiPlay, Math.random() * 1000);
}

function setState() {
  setBoard(state.board);
  updateMsg();
}

function resetState() {
  state = {
    plTurns: 0,
    aiTurns: 0,
    next: x,
    prev: o,
    board: Array(9).fill(""),
    aiWon: false,
    draw: false,
  };

  setBoard(state.board);

  msgBox.innerHTML = "AI: Click on any tile to start, if you dare!";
  msgBox.className = "";
}

function setBoard(board) {
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      dom_cells[i].innerHTML = "";
      dom_cells[i].className = "cell";
    } else if (dom_cells[i].innerHTML != board[i]) {
      dom_cells[i].innerHTML = board[i];
      dom_cells[i].className = board[i] === x ? "cell-x" : "cell-o";
    }
  }
}

function updateMsg(msg) {
  if (state.aiWon) {
    msgBox.innerHTML = "AI: Booooo, you lose!";
    msgBox.className = "ai-won";
    closeBoard();
  } else if (state.draw) {
    msgBox.innerHTML = "AI: Great, you managed to draw atleast!";
    msgBox.className = "draw";
    closeBoard();
  } else {
    if (state.plTurns > state.aiTurns) {
      let r = Math.random();
      if (r < 0.5) msgBox.innerHTML = "AI: Crunching numbers, please wait...";
      else if (r < 0.8) msgBox.innerHTML = "AI: Checking conditions, please wait...";
      else msgBox.innerHTML = "AI: Admiring colors, please wait...";
      msgBox.className = "processing";
    } else {
      let r = Math.random();
      if (r < 0.5) msgBox.innerHTML = "AI: Your turn, human.";
      else if (r < 0.8) msgBox.innerHTML = "AI: Go ahead, make your play.";
      else msgBox.innerHTML = "AI: NEXT!!!";
      msgBox.className = "game-on";
    }
  }
}

function closeBoard() {
  dom_cells.forEach(cell => cell.innerHTML === "" && (cell.className = "cell-disabled"));
}

// Cache dom elements
const dom_cells = [];
let msgBox;

window.onload = () => {
  for (let cell of document.getElementsByClassName("cell")) {
    cell.addEventListener("click", plPlay);
    dom_cells.push(cell);
  }

  document.getElementById("resetBtn").addEventListener("click", resetState);

  msgBox = document.getElementById("msg-box");

  resetState();
};
