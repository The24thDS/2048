const cells = [].slice.call(document.querySelectorAll(".grid-cell"));
const table = document.querySelector(".grid-container");
const tableCoords = {top: table.offsetTop, left: table.offsetLeft}
const cellsRelCoords = cells.map( cell => {
    return {top: cell.offsetTop, left: cell.offsetLeft}
})
const tiles = document.querySelector(".tiles");
let occupiedPositions = [];
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}
const defaultFz = 3.5;
const makeTile = () => {
    if(occupiedPositions.length===16) {return false;}
    let tilePosition = getRandomInt(15);
    while(occupiedPositions.includes(tilePosition)) tilePosition = getRandomInt(15);
    occupiedPositions.push(tilePosition);
    const tileValue = Math.random()<0.1?4:2;
    let c=tilePosition, l=0;
    while(c-4>=0){c-=4;l++;}
    const tile = `<div class="tile" data-line="${l}" data-column="${c}" data-number="${tileValue}" style="transform: translate(${cellsRelCoords[tilePosition].left}px,${cellsRelCoords[tilePosition].top}px);font-size:${defaultFz}rem;">
                <div class="tile-number">
                    ${tileValue}
                </div>
            </div>`;
    tiles.innerHTML += tile;
}
const initGame = () => {
    occupiedPositions = [];
    makeTile(); makeTile();
}
const getColNumb = (el) =>{
    return Number(el.dataset.column);
}
const setColNumb = (el, val) => {
    el.dataset.column = val;
}
const getLineNumb = (el) =>{
    return Number(el.dataset.line);
}
const setLineNumb = (el, val) => {
    el.dataset.line = val;
}
const getNumbVal = (el) => {
    return Number(el.dataset.number);
}
const setNumbVal = (el, val) => {
    el.dataset.number = val;
    el.innerHTML = `<div class="tile-number">${val}</div>`;
    return 1;
}
const compareColumns = (a,b) =>{
    const c1 = getColNumb(a);
    const c2 = getColNumb(b);
    if(c1<c2) return -1;
    if(c1>c2) return 1;
    return 0;
}
const compareLines = (a,b) =>{
    const c1 = getLineNumb(a);
    const c2 = getLineNumb(b);
    if(c1<c2) return -1;
    if(c1>c2) return 1;
    return 0;
}
const deleteTile = (oldTile, mergedTile, value) => {
    window.setTimeout(() => { oldTile.remove(); setNumbVal(mergedTile, value);}, 125);
    return 0;
}
const sizeOf = (number) => {
    let c=0;
    while(Math.floor(number)) {number/=10; c++;}
    return c;
}
const moveX = (d) =>{
    const lines = [
        [].slice.call(tiles.querySelectorAll(`[data-line="0"]`)).sort(compareColumns),
        [].slice.call(tiles.querySelectorAll(`[data-line="1"]`)).sort(compareColumns),
        [].slice.call(tiles.querySelectorAll(`[data-line="2"]`)).sort(compareColumns),
        [].slice.call(tiles.querySelectorAll(`[data-line="3"]`)).sort(compareColumns)
    ];
    for(let i=0; i<lines.length;)
    {
        if(!(lines[i].length))
            lines.splice(i, 1);
        else i++;
    }
    let newTile = 0;
    const moveTile = (tile, column) => {
        newTile=1;
        const tileLine = getLineNumb(tile);
        let tilePosition = tileLine*4 + getColNumb(tile);
        occupiedPositions.splice(occupiedPositions.indexOf(tilePosition), 1);
        setColNumb(tile, column);
        tilePosition = tileLine*4 + column;
        if(!occupiedPositions.includes(tilePosition))
            occupiedPositions.push(tilePosition);
        tile.style.transform= `translate(${cellsRelCoords[tilePosition].left}px,${cellsRelCoords[tilePosition].top}px)`;
    }
    lines.forEach((line) => {
        let Tval = 0;
        const cond = (i) => d==1?(i>=0?true:false):(i<line.length?true:false);
        for (let i = (d==1?line.length - 1:0), c = (d==1?3:0); cond(i); i+=-d, c+=-d) {
            if (!Tval) {
                Tval = getNumbVal(line[i]);
                if(getColNumb(line[i])!==c) moveTile(line[i], c);
            }
            else if (Tval === getNumbVal(line[i])) {
                line[i].style.zIndex = "1";
                moveTile(line[i], c + d);
                c+=d;
                const fz = Tval>=50?defaultFz/sizeOf(Tval*2)+1:defaultFz;
                line[i+d].style.fontSize = `${fz}rem`;
                Tval = deleteTile(line[i], line[i+d], Tval*2);
            } else {
                Tval = getNumbVal(line[i]);
                if(getColNumb(line[i])!==c) moveTile(line[i], c);
            }
        }
    });
    window.setTimeout(()=>{if(newTile) makeTile();},150);
}
const moveY = (d) =>{
    const columns = [
        [].slice.call(tiles.querySelectorAll(`[data-column="0"]`)).sort(compareLines),
        [].slice.call(tiles.querySelectorAll(`[data-column="1"]`)).sort(compareLines),
        [].slice.call(tiles.querySelectorAll(`[data-column="2"]`)).sort(compareLines),
        [].slice.call(tiles.querySelectorAll(`[data-column="3"]`)).sort(compareLines)
    ];
    for(let i=0; i<columns.length;)
    {
        if(!(columns[i].length))
            columns.splice(i, 1);
        else i++;
    }
    let newTile = 0;
    const moveTile = (tile, line) => {
        newTile=1;
        const tileCol = getColNumb(tile);
        let tilePosition = getLineNumb(tile)*4 + tileCol;
        occupiedPositions.splice(occupiedPositions.indexOf(tilePosition), 1);
        setLineNumb(tile, line);
        tilePosition = line*4 + tileCol;
        if(!occupiedPositions.includes(tilePosition))
            occupiedPositions.push(tilePosition);
        tile.style.transform= `translate(${cellsRelCoords[tilePosition].left}px,${cellsRelCoords[tilePosition].top}px)`;
    }
    columns.forEach((column) => {
        let Tval = 0;
        const cond = (i) => d==1?(i>=0?true:false):(i<column.length?true:false);
        for (let i = (d==1?column.length - 1:0), l = (d==1?3:0); cond(i); i+=-d, l+=-d) {
            if (!Tval) {
                Tval = getNumbVal(column[i]);
                if(getLineNumb(column[i])!==l) moveTile(column[i], l);
            }
            else if (Tval === getNumbVal(column[i])) {
                column[i].style.zIndex = "1";
                moveTile(column[i], l + d);
                l+=d;
                const fz = Tval>=50?defaultFz/sizeOf(Tval*2)+1:defaultFz;
                column[i+d].style.fontSize = `${fz}rem`;
                Tval = deleteTile(column[i], column[i+d], Tval*2);
            } else {
                Tval = getNumbVal(column[i]);
                if(getLineNumb(column[i])!==l) moveTile(column[i], l);
            }
        }
    });
    window.setTimeout(()=>{if(newTile) makeTile();},150);
}

window.addEventListener("keydown", (event)=>{
    //event.keyCode: 37 = left, 38 = up, 39 = right, 40 = down
    switch(event.keyCode)
    {
        case 37: event.preventDefault();moveX(-1); break;
        case 38: event.preventDefault();moveY(-1); break;
        case 39: event.preventDefault();moveX(1); break;
        case 40: event.preventDefault();moveY(1); break;
    }
});
document.querySelector(".js-new").addEventListener("click", ()=>{tiles.innerHTML="";initGame();});
initGame();