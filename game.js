const cells = [].slice.call(document.querySelectorAll(".grid-cell"));
const table = document.querySelector(".grid-container");
const tableCoords = {top: table.offsetTop, left: table.offsetLeft}
const cellsRelCoords = cells.map( cell => {
    return {top: cell.offsetTop, left: cell.offsetLeft}
})

const tiles = document.querySelector(".tiles");
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}
const makeTile = (i) => {
    const tileValue = Math.random()<0.2?4:2;
    const tile = `<div class="tile" style="transform: translate(${cellsRelCoords[i].left}px,${cellsRelCoords[i].top}px)">
                <div class="tile-number">
                    ${tileValue}
                </div>
            </div>`;
    tiles.innerHTML += tile;
}
const initGame = () => {
    const firstTile = getRandomInt(15);
    let secondTile = getRandomInt(15);
    while(firstTile===secondTile) secondTile = getRandomInt(15);
    makeTile(firstTile);
    makeTile(secondTile);
}

initGame();