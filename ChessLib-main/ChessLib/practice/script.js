document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("chessboard");
    const moveList = document.getElementById("move-list");
    const resetButton = document.getElementById("reset-button");
    const modal = document.getElementById("victory-modal");
    const victoryMessage = document.getElementById("victory-message");
    const closeModal = document.getElementById("close-modal");
    const modeLocalBtn = document.getElementById("mode-local");
    const modeEngineBtn = document.getElementById("mode-engine");

    let gameMode = "local";
    const game = new Chess();
    const engine = new Worker("stockfish/stockfish.js");
    let selectedSquare = null;
    let undoneMoves = [];
    const files = "abcdefgh";

    engine.onmessage = function (e) {
        if (typeof e.data === "string" && e.data.startsWith("bestmove")) {
            const move = e.data.split(" ")[1];
            game.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: "q" });
            renderBoard();
            checkGameOver();
        }
    };

    const controlContainer = document.createElement("div");
    controlContainer.id = "controls";

    const backArrow = document.createElement("button");
    backArrow.id = "back-arrow";
    backArrow.innerHTML = "&lt;";
    backArrow.disabled = true;

    const forwardArrow = document.createElement("button");
    forwardArrow.id = "forward-arrow";
    forwardArrow.innerHTML = "&gt;";
    forwardArrow.disabled = true;

    controlContainer.appendChild(backArrow);
    controlContainer.appendChild(forwardArrow);
    moveList.insertAdjacentElement("beforebegin", controlContainer);

    for (let row = 8; row >= 1; row--) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`;
            square.dataset.position = `${files[col]}${row}`;
            board.appendChild(square);
        }
    }

    function renderBoard() {
        document.querySelectorAll(".square").forEach(square => {
            square.innerHTML = "";
            const position = square.dataset.position;
            const piece = game.get(position);
            if (piece) {
                const pieceElement = document.createElement("span");
                pieceElement.innerHTML = getPieceUnicode(piece);
                pieceElement.classList.add(piece.color === "w" ? "white-piece" : "black-piece");
                square.appendChild(pieceElement);
            }
        });

        updateMoveList();
        updateControls();
    }

    function getPieceUnicode(piece) {
        const pieces = {
            p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
            P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
        };
        return pieces[piece.type] || "";
    }

    document.querySelectorAll(".square").forEach(square => {
        square.addEventListener("click", () => {
            if (!selectedSquare) {
                const piece = game.get(square.dataset.position);
                if (piece && piece.color === game.turn()) {
                    selectedSquare = square;
                }
                return;
            }

            const move = game.move({
                from: selectedSquare.dataset.position,
                to: square.dataset.position,
                promotion: "q"
            });

            if (move) {
                undoneMoves = [];
                renderBoard();
                checkGameOver();

                if (gameMode === "engine" && !game.game_over()) {
                    // Envia o FEN para o motor calcular
                    engine.postMessage("position fen " + game.fen());
                    engine.postMessage("go depth 15"); // Profundidade da análise
                }
            }

            selectedSquare = null;
        });
    });

    function updateMoveList() {
        moveList.innerHTML = "";
        const moveHistory = game.history({ verbose: true });

        moveHistory.forEach((move, index) => {
            const moveNumber = Math.ceil((index + 1) / 2);
            if (index % 2 === 0) {
                const moveItem = document.createElement("li");
                moveItem.innerHTML = `<strong>${moveNumber}.</strong> ${move.san}`;
                moveList.appendChild(moveItem);
            } else {
                moveList.lastElementChild.innerHTML += `, ${move.san}`;
            }
        });

        moveList.scrollTop = moveList.scrollHeight;
    }

    function checkGameOver() {
        if (game.in_checkmate()) {
            const winner = game.turn() === "w" ? "Black" : "White";
            victoryMessage.textContent = `${winner} wins by Checkmate!`;
            modal.style.display = "flex";
        }
    }

    function updateControls() {
        backArrow.disabled = game.history().length === 0;
        forwardArrow.disabled = undoneMoves.length === 0;
    }

    backArrow.addEventListener("click", () => {
        const undoneMove = game.undo();
        if (undoneMove) {
            undoneMoves.push(undoneMove);
            renderBoard();
        }
    });

    forwardArrow.addEventListener("click", () => {
        if (undoneMoves.length > 0) {
            const move = undoneMoves.pop();
            game.move(move);
            renderBoard();
        }
    });

    resetButton.addEventListener("click", () => {
        game.reset();
        undoneMoves = [];
        renderBoard();
        moveList.innerHTML = "";
        modal.style.display = "none";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modeLocalBtn.addEventListener("click", () => {
        gameMode = "local";
        game.reset();
        undoneMoves = [];
        renderBoard();
        modal.style.display = "none";
    });

    modeEngineBtn.addEventListener("click", () => {
        gameMode = "engine";
        game.reset();
        undoneMoves = [];
        renderBoard();
        modal.style.display = "none";

        if (game.turn() === "b") {
            engine.postMessage("position fen " + game.fen());
            engine.postMessage("go depth 15");
        }
    });

    modal.style.display = "none";
    renderBoard();
});
