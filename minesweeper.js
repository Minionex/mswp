<!-- -------------- Editable properties --------------- -->
const hiddenLink = "https://minesweeper.online/img/skins/hd/closed.svg";
const openLink = "https://minesweeper.online/img/skins/hd/type0.svg";
const flagLink = "https://minesweeper.online/img/skins/hd/flag.svg";
const bombLink = "https://minesweeper.online/img/skins/hd/mine.svg";
const numLink = "https://minesweeper.online/img/skins/hd/type";

<!-- ---------- Making interactive minefield ---------- -->
function addClickFunctionality() {
    document.querySelectorAll('.tableBody > * > *').forEach(cell => {
        cell.addEventListener('click', () => handleClick(cell));
        cell.addEventListener('contextmenu', (event) => handleRightClick(event, cell));
    });
}

const handleClick = (cell) => {
    openCell(cell);
};

const handleRightClick = (event, cell) => {
    event.preventDefault();
    let currentLink = window.getComputedStyle(cell).getPropertyValue('background-image');
    if(currentLink.includes(hiddenLink)) {
        cell.style.backgroundImage = 'url(' + flagLink + ')';
    } else if (currentLink.includes(flagLink)) {
        cell.style.backgroundImage = 'url(' + hiddenLink + ')';
    }
}

<!-- -------------------- Game logic ------------------ -->
let rowCount = 16,
    colCount = 16,
    bombCount= 50,
    minefield = [];

function startGame() {
    minefield = placeBombs();
    calculateNeighbours();
    document.getElementById('minefield').appendChild(createField());
    addClickFunctionality();
}

function placeBombs() {
    let arr = initializeArray(rowCount, colCount);
    let i;
    for (i=0; i<bombCount; i++){
        placeOneBomb(arr);
    }
    return arr;
}

function placeOneBomb(minefield) {

    let nrow = Math.floor(Math.random() * rowCount);
    let ncol = Math.floor(Math.random() * colCount);

    if (!minefield[nrow]) {
        minefield[nrow] = [];
    }

    if (!minefield[nrow][ncol]) {
        minefield[nrow][ncol] = true;
    } else {
        placeOneBomb(minefield)
    }
}

function calculateNeighbours() {
    for (let row = 0; row < minefield.length; row++) {
        for (let col = 0; col < minefield[row].length; col++) if (minefield[row][col] === true) {

            for (let i = row-1; i <= row+1; i++) {
                for (let j = col-1; j <= col+1; j++) {
                    if (i >= 0 && j >= 0 && i < rowCount && j < colCount && minefield[i][j] !== true) {
                        console.log(i + ";" + j + " | " + row + ' ' + col);
                        minefield[i][j] = (minefield[i][j]===false) ? 1 : minefield[i][j] + 1;
                    }
                }
            }
            console.log(' ');

        }
    }
}

function createField() {
    let divMinefield,
        divBody,
        divRow,
        divCell;

    divMinefield = document.createElement('div');
    divMinefield.classList.add('minefield');

    divBody = document.createElement('div');
    divBody.classList.add('tableBody');
    divMinefield.appendChild(divBody);

    for (let i=0; i<rowCount; i++) {
        divRow = document.createElement('div');
        divRow.classList.add('tableRow');
        for (let j = 0; j < colCount; j++) {
            divCell = document.createElement('div');
            divCell.id = convertToID([i, j]);
            divCell.classList.add('cell');
            divCell.style.backgroundImage='url('+hiddenLink+')';
            divRow.appendChild(divCell);
        }
        divBody.appendChild(divRow);
    }
    return divMinefield;
}

function openCell(cell) {
    let bgLink = window.getComputedStyle(cell).getPropertyValue("background-image");

    if (bgLink.includes(hiddenLink)) {
        let [row, col] = convertToPos(cell.id);

        if (minefield[row][col] === true) {
            cell.style.backgroundImage = 'url(' + bombLink + ')';
        } else if (Number.isInteger(minefield[row][col])) {
            cell.style.backgroundImage = 'url(' + numLink + minefield[row][col] + '.svg)';
        } else if (minefield[row][col] === false) {
            cell.style.backgroundImage = 'url(' + openLink + ')';

            for (let i = row-1; i <= row+1; i++) {
                for (let j = col-1; j <= col+1; j++) {
                    if (i >= 0 && j >= 0 && i < rowCount && j < colCount) {
                        document.getElementById(convertToID([i, j])).click();
                    }
                }
            }
        }
    }
}

function reload() {
    window.history.go(0);
}

function uncover() {
    for ( let x of document.getElementsByClassName('cell')) x.click();
}

function convertToPos(id) {
    const match = id.match(/cell-(\d+)-(\d+)/);
    if (match) {
        const row = parseInt(match[1]);
        const col = parseInt(match[2]);
        return  [row,col];
    }
    return null;
}

function convertToID(pos) {
    return 'cell-' + pos[0] + '-' + pos[1]
}

function initializeArray(rows, columns) {
    const arr = [];

    for (let i = 0; i < rows; i++) {
        arr[i] = [];

        for (let j = 0; j < columns; j++) {
            arr[i][j] = false;
        }
    }

    return arr;
}

window.addEventListener('load', () => {
    startGame();
});
