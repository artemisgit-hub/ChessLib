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
    let lastMove = null;
    const files = "abcdefgh";

    engine.onmessage = function (e) {
        if (typeof e.data === "string" && e.data.startsWith("bestmove")) {
            const move = e.data.split(" ")[1];
            lastMove = {
                from: move.slice(0, 2),
                to: move.slice(2, 4)
            };
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
                
                if (lastMove && position === lastMove.to) {
                    const fromSquare = document.querySelector(`[data-position="${lastMove.from}"]`);
                    if (fromSquare) {
                        const fromRect = fromSquare.getBoundingClientRect();
                        const toRect = square.getBoundingClientRect();
                        
                        pieceElement.style.setProperty('--dx', `${fromRect.left - toRect.left}px`);
                        pieceElement.style.setProperty('--dy', `${fromRect.top - toRect.top}px`);
                        pieceElement.classList.add("moving-piece");
                    }
                }
                
                square.appendChild(pieceElement);
            }
        });

        updateMoveList();
        updateControls();
    }

    function getPieceUnicode(piece) {
        const pieceMap = {
            p: { white: 'PeaoBranco.svg', black: 'PeaoPreto.svg' },
            r: { white: 'TorreBranca.svg', black: 'TorrePreta.svg' },
            n: { white: 'CavaloBranco.svg', black: 'CavaloPreto.svg' },
            b: { white: 'BispoBranco.svg', black: 'BispoPreto.svg' },
            q: { white: 'DamaBranca.svg', black: 'DamaPreta.svg' },
            k: { white: 'ReiBranco.svg', black: 'ReiPreto.svg' }
        };
        
        const type = piece.type.toLowerCase();
        const color = piece.color === 'w' ? 'white' : 'black';
        
        return `<img src="pecas/${pieceMap[type][color]}" alt="${type}" class="piece-svg">`;
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
                lastMove = { from: move.from, to: move.to };
                renderBoard();
                checkGameOver();

                if (gameMode === "engine" && !game.game_over()) {
                    engine.postMessage("position fen " + game.fen());
                    engine.postMessage("go depth 15");
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
            const lances = game.history();
            salvarPartida("Jogador Brancas", "Jogador Pretas", lances);
        }
    }

    function salvarPartida(jogadorBrancas, jogadorPretas, lances) {
    const partida = {
        jogadorBrancas,
        jogadorPretas,
        lances: lances.join(' ')
    };

    fetch("http://localhost:8080/api/partidas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(partida)
    })
    .then(res => res.json())
    .then(data => console.log("Partida salva com sucesso:", data))
    .catch(err => console.error("Erro ao salvar partida:", err));
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
            lastMove = { from: move.from, to: move.to };
            game.move(move);
            renderBoard();
        }
    });

    resetButton.addEventListener("click", () => {
        game.reset();
        undoneMoves = [];
        lastMove = null;
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
        lastMove = null;
        renderBoard();
        modal.style.display = "none";
    });

    modeEngineBtn.addEventListener("click", () => {
        gameMode = "engine";
        game.reset();
        undoneMoves = [];
        lastMove = null;
        renderBoard();
        modal.style.display = "none";

        if (game.turn() === "b") {
            engine.postMessage("position fen " + game.fen());
            engine.postMessage("go depth 15");
        }
    });

    let partidaId = null;

function salvarPartida(jogadorBrancas, jogadorPretas, lances) {
    const partida = {
        jogadorBrancas,
        jogadorPretas,
        lances: lances.join(' ')
    };

    fetch("http://localhost:8080/api/partidas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(partida)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Partida salva com sucesso:", data);
        partidaId = data.id;
    })
    .catch(err => console.error("Erro ao salvar partida:", err));
}

document.getElementById("export-pdf-button").addEventListener("click", () => {
    if (!partidaId) {
        alert("Salve a partida primeiro antes de exportar o PDF.");
        return;
    }

    fetch(`http://localhost:8080/api/partidas/exportar-pdf?id=${partidaId}`, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao gerar o PDF");
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "partida.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    .catch(error => {
        console.error("Erro ao exportar PDF:", error);
        alert("Erro ao exportar PDF.");
    });
});

    modal.style.display = "none";
    renderBoard();
});