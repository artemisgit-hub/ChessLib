document.addEventListener("DOMContentLoaded", function () {
    const openings = [
        {
            name: "Ruy Lopez",
            description: "The Ruy Lopez, also known as the Spanish Opening, is one of the most classic and respected openings in chess. It is named after the Spanish priest Ruy López de Segura, who studied the game in the 16th century. This system focuses on efficient development of the pieces and control of the center, creating strategic opportunities for White while challenging Black’s structure.",
            overview: "The Ruy Lopez begins with the following moves: 1. e4, e5 2. Nf3, Nc6 3. Bb5. Here, White immediately attacks Black's c6 knight, which is defending the central pawn on e5. This can lead to several responses from Black, the most popular of which are: 3...a6 (Morphy Defense) and 3...Nf6 (Berlin Defense). This opening is widely used by elite players and has been employed by world champions such as Bobby Fischer, Garry Kasparov, and Magnus Carlsen.",
            lines: "3...a6 (Morphy Defense): Black forces the white bishop to decide whether to capture the knight or retreat. If 4. Ba4, play continues as normal; if 4. Bxc6, Black is left with a bishop pair and a slightly weakened pawn structure. 3...Nf6 (Berlin Defense): A solid, defensive line that has become extremely popular, especially after Vladimir Kramnik used it to defeat Garry Kasparov in the 2000 World Championship. 3...d6 (Classical Steinitz Defense): A more passive move that protects the e5 pawn but restricts the mobility of Black's pieces.",
            plans: "White usually seeks a strong central presence with c3 and d4, developing their pieces harmoniously and preparing an attack on the kingside. Black may try a more active game with ...d5 or ...f5 in some lines. Depending on Black's response, the fight may follow a positional or tactical path.",
            image: "images/ruy_lopez.png"            
        },
        {
            name: "King's Indian Attack",
            description: "The King's Indian Attack (KIA) is not exactly a traditional opening, but rather a flexible system that can be used against various responses from Black. It is characterized by a calm and solid development, preparing an attack on the king's flank. It was one of Bobby Fischer's favorites.",
            overview: "The KIA often begins with: 1. Nf3, d5 2. g3. The main idea is to develop the pieces solidly and adopt a structure similar to the King's Indian Defense, but playing as White. The fianchettoed bishop on g2 becomes a powerful piece, targeting the center and supporting future aggressive moves.",
            lines: "Standard Attack: White plays d3, Nbd2, e4, h3, and in many cases, tries to start an attack with f4. Strategy against the French: The KIA can be used as a response to the French Defense (1.e4 e6), avoiding some undesirable lines for Black. Transposition to the Colle System: In some situations, the KIA can resemble the Colle System, with natural development and a central attack.",
            plans: "White's main plan is to expand on the king's flank with h3, g4, and f5, creating a dangerous attack. If Black doesn't respond quickly, they may be crushed by an irresistible attack on their king.",
            image: "images/kings_indian_attack.png"            
        },
        {
            name: "Queen's Gambit",
            description: "The Queen's Gambit is one of the most played and respected openings in chess. It is based on the idea of temporarily offering a pawn to gain positional advantage. Its name comes from the apparent sacrifice of the queen's pawn to control the center and gain space.",
            overview: "The Queen's Gambit starts with the moves: 1. d4, d5 2. c4. White offers a pawn to destabilize Black's position. If Black accepts the gambit (2...dxc4), White can quickly recover the pawn while dominating the center with e4. If Black declines (2...e6 or 2...c6), the game usually enters the Orthodox Defense or the Slav Defense, respectively.",
            lines: "Queen’s Gambit Accepted (QGA) - 2...dxc4: Black takes the pawn and tries to hold it, but White often recovers the material and maintains a strong position. Queen’s Gambit Declined (QGD) - 2...e6: Black adopts a more solid stance, defending the center and planning a later counterattack. Slav Defense - 2...c6: A very popular alternative, where Black tries to maintain a solid structure without weakening their center immediately.",
            plans: "If Black accepts the gambit, White will aim for rapid development and center control. If Black declines, the game becomes more strategic, with both sides competing for control of the central squares. The Queen’s Gambit is an opening rich in possibilities and often relies on a minority pawn attack on the queen's flank.",
            image: "images/queens_gambit.png"            
        },
    ];

    const openingList = document.getElementById("openings");
    const openingTitle = document.getElementById("opening-title");
    const openingDescription = document.getElementById("opening-description");
    const openingBoard = document.getElementById("opening-board");

    const overviewSection = document.getElementById("overview");
    const linesSection = document.getElementById("lines");
    const plansSection = document.getElementById("plans");
    function hideAllSections() {
        overviewSection.style.display = "none";
        linesSection.style.display = "none";
        plansSection.style.display = "none";
    }

    openings.forEach((opening) => {
        const li = document.createElement("li");
        li.textContent = opening.name;
        li.addEventListener("click", () => {
            openingTitle.textContent = opening.name;
            openingDescription.textContent = opening.description;
            openingBoard.innerHTML = `<img src="${opening.image}" alt="${opening.name}">`;

            document.getElementById("overview-content").textContent = opening.overview;
            document.getElementById("lines-content").textContent = opening.lines;
            document.getElementById("plans-content").textContent = opening.plans;

            overviewSection.style.display = "block";
            plansSection.style.display = "block";
            linesSection.style.display = "block";
        });
        openingList.appendChild(li);
    });
});
