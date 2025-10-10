document.addEventListener("DOMContentLoaded", () => {
    const playerContainer = document.getElementById("player-container");
    const searchInput = document.getElementById("search");

    const dropdownBtn = document.querySelector(".dropbtn");
    const dropdown = document.querySelector(".dropdown");

    if (dropdownBtn && dropdown) {
        dropdownBtn.addEventListener("click", (event) => {
            event.preventDefault(); // prevent page jump
            dropdown.classList.toggle("active");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove("active");
            }
        });
    } else {
        console.warn("Dropdown button or container not found.");
    }

    const toggleDropdown = (dropdown, menu, isOpen) => {
    dropdown.classList.toggle("open", isOpen);
    menu.style.height = isOpen ? `${menu.scrollHeight}px` : 0;
}

// Closes all open dropdowns when side bar is collapsed
const closeAllDropdowns = () => {
    document.querySelectorAll(".dropdown-container.open").forEach(openDropdown => {
        toggleDropdown(openDropdown, openDropdown.querySelector(".dropdown-menu"), false);
    })
}

document.querySelectorAll(".dropdown-toggle").forEach(dropdownToggle => {
    dropdownToggle.addEventListener("click", e => {
        e.preventDefault();

        const dropdown = e.target.closest(".dropdown-container");
        const menu = dropdown.querySelector(".dropdown-menu");
        const isOpen = dropdown.classList.contains("open");

        toggleDropdown(dropdown, menu, !isOpen);
    });
});


document.querySelector(".sidebar-toggle").addEventListener("click", () => {
    closeAllDropdowns();
    
    // Toggle collpased class on sidebar
    document.querySelector(".sidebar").classList.toggle("collapsed");
});



    if (!playerContainer) {
        console.error("Error - playerContainer not found.");
        return;
    }


    // Fetch both JSON files
    Promise.all([
        fetch('data/players.json').then(res => res.json()),
        fetch('data/player_stats.json').then(res => res.json())
    ])
    .then(([playersData, playerStats]) => {
        // Create a map for fast stats lookup
        const statsMap = new Map(playerStats.map(stat => [stat.ID.toLowerCase(), stat]));

        // Determine team based on URL
        const teamName = window.location.pathname.toLowerCase().includes("barcelona") ? "Barcelona" : "Real Madrid";

        // Find the team object
        const teamObj = playersData.teams.find(t => t.team === teamName);
        if (!teamObj) {
            console.error(`Team ${teamName} not found in players.json`);
            return;
        }

        const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

        // Loop through positions and create sections
        positions.forEach(position => {
            const section = document.createElement("div");
            section.classList.add("player-position"); // match CSS

            const positionHeader = document.createElement("h3");
            positionHeader.textContent = position;
            positionHeader.classList.add("position-header");
            section.appendChild(positionHeader);

            // Filter players by position and sort by number
            const playersInPosition = teamObj.players
                .filter(player => player.position === position)
                .sort((a, b) => a.number - b.number);

            // Create cards for each player
            playersInPosition.forEach(player => {
                const playerCard = document.createElement("div");
                playerCard.classList.add("player-card");

                const cardInner = document.createElement("div");
                cardInner.classList.add("card-inner");

                // Generate ID for stats lookup
                const playerID = (player.id || player.name)
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase().replace(/\s+/g, "_");

                const stat = statsMap.get(playerID) || {
                    Goals: '/',
                    Assists: '/',
                    "Matches": '/',
                    "Minutes Played": '/',
                    "Clean Sheets": '/',
                    "Penalties Saved": '/'
                };

                // Conditional Statement based on player's position
                let playerStatsHTML = `<h3 class="player-name">${player.name}</h3>`;

                if (player.position === "Goalkeeper") {
                    playerStatsHTML += `<p class="stat clean-sheets"><strong>Clean Sheets:<strong> ${stat["Clean Sheets"] ?? '/'}</p>`;
                    playerStatsHTML += `<p class="stat penalties-saved"><strong>Penalties Saved:</strong> ${stat["Penalties Saved"] ?? '/'}</p>`;
                }

                else {
                    playerStatsHTML += `<p class="stat goals"><strong>Goals:<strong> ${stat.Goals}</p>`;
                    playerStatsHTML += `<p class="stat assists"><strong>Assists:</strong> ${stat.Assists}</p>`;
                }

                playerStatsHTML += `<p class="stat matches-played"><strong>Matches Played:</strong> ${stat.Matches}</p>`;
                playerStatsHTML += `<p class="stat minutes-played"><strong>Minutes Played:</strong> ${stat["Minutes Played"]}</p>`;



                // Match class names to CSS
                cardInner.innerHTML = `
                    <div class="front">
                        <h2 class="player-number">${player.number}</h2>
                        <img src="${player.nation}" alt="${player.name} nationality" class="nation-flag" />
                        <img src="${player.img}" alt="${player.name}" class="player-image" />
                        <h2 class="player-name">${player.name}</h2>
                    </div>

                    
                    <div class="back">
                        <img src="${player.backImg}" alt="${player.name} back image" class="player-back-image" />
                        <div class="player-stats-placement">
                            
                            ${playerStatsHTML}
                            
                        </div>
                    </div>
                `;

                playerCard.appendChild(cardInner);
                section.appendChild(playerCard);
            });

            playerContainer.appendChild(section);
        });

        // Optional: Search filtering
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const searchTerm = searchInput.value.toLowerCase();
                const allPlayerCards = playerContainer.querySelectorAll(".player-card");
                allPlayerCards.forEach(card => {
                    const playerName = card.querySelector(".player-name").textContent.toLowerCase();
                    card.style.display = playerName.includes(searchTerm) ? "" : "none";
                });
            });
        }
    })
    .catch(error => console.error("Error loading data:", error));
});
