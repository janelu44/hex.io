// call function to generate board
generateBoardTables(11);


// function to generate board rows
function generateBoardTables(number) {
    for (let i = 0; i < number; i++) {
        const table = document.createElement('table');
        table.id = 'table' + i;
        document.querySelector('.board-container').appendChild(table);
    }
}

// each row of hexes must be further to the right than the previous
const offsetStep = 28;

// select all tables
const tables = document.querySelectorAll('table');

// fill each table with hexes
for (let t of tables) {
    let id = parseInt(t.id.substr(5));
    generateRow(id, offsetStep * id);
}

// function to fill table with hexes
function generateRow(tableId, offset) {
    const id = 'table' + tableId;
    const table = document.getElementById(id);
    table.style.marginLeft = offset + 'px';
    if (tableId > 0) {
        table.style.marginTop = '-3px';
    }

    // create a table row
    const row = document.createElement('tr');


    for (let i = 0; i < 11; i++) {

        let tempId = String.fromCharCode(97 + tableId) + i;

        const inner = document.createElement('div');
        const hex = document.createElement('div');

        hex.id = tempId;
        hex.name = "hex";

        // determine type of hex
        if (tableId == 0 || tableId == 10) {
            if (i == 0 || i == 10) {
                inner.className = 'cornerHex inner';
                hex.className = 'cornerHex';
            }
            else {
                inner.className = 'redHex inner';
                hex.className = 'redHex';
            }
        }
        else {
            if (i == 0 || i == 10) {
                inner.className = 'blueHex inner';
                hex.className = 'blueHex';
            }
            else {
                inner.className = 'plainHex inner';
                hex.className = 'plainHex';
            }
        }

        // append hex to parent
        hex.appendChild(inner);
        hex.title = tempId;
        const slot = document.createElement('td');
        slot.id = tempId;
        slot.appendChild(hex);

        row.appendChild(slot);

    }
    table.appendChild(row);

}


