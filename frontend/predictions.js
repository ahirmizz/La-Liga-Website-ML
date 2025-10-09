async function loadPredictions() {
    const winnerRes = await fetch("");
    const winner = await winnerRes.json();

    document.getElementById("winner").innerHTML =
    `<h2>${winner.team}</h2<p>Win Probability: ${winner.probability}%</p>`;

    const contendersRes = await fetch("");
    const contenders = await contendersRes.json();

    const list = document.getElementsById("contenders");
    contenders.forEach(c => {
        const li = document.createElement("li");
        li.textContent = `${c.squad}: ${c["combined_prob (%)"]}%`;
        list.appendChild(li);
    });
}

loadPredictions();