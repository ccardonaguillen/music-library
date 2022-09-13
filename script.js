function Album({ title, artist, release_year, owned, format = [] }) {
    this.title = title;
    this.artist = artist;
    this.release_year = release_year;
    this.owned = Boolean(owned)
    this.format = format;
    this.id = title.toLowerCase().replaceAll(/\W/g, '')
        + artist.toLowerCase().replaceAll(/\W/g, '');
}

class MusicLibrary {
    constructor() {
        this.albumList = []
    }

    addAlbum(newAlbum) {
        if (this.albumList.every(album => newAlbum.id !== album.id)) {
            this.albumList.unshift(newAlbum);
        } else {
            alert('This album already exists')
        }
    }

    deleteAlbum(id) {
        this.albumList = this.albumList.filter(album => album.id !== id);
    }

    sort({by, ord='asc'}) {
        //Reverse sorting algorithm is ord = 'desc';
        let sortOrder = (ord === 'asc') ? 1 : -1;

        switch (by) {
            case 'title':
            case 'artist':
                // localeCompare used to compare string without math operators
                this.albumList.sort((a, b) => a[by].localeCompare(b[by]) * sortOrder); 
            case 'release_year':
                this.albumList.sort((a, b) => (a[by] - b[by]) * sortOrder);
        }
    }
}

function filterAlbums(album) {
    let { type: filterType, value: filterValue } = currFilter;

    if (filterValue === "") return true; // No filter applied

    switch (filterType) {
        case 'title':
            return album['title'].toLowerCase().includes(filterValue);
        case 'artist':
            // Match any of the comma separated matches
            const artistList = filterValue.replaceAll(' ', '').split(/[,;]/);
            return artistList.some(artist => 
                album['artist'].toLowerCase().includes(artist));
        case 'release_year':
            let match = (regex) => filterValue.match(regex);
            const regexEq = /^\s*(\d+)\s*$/,
                regexGt = /(?:^>\s?(\d+)$)/,
                regexLt = /(?:^<\s?(\d+)$)/,
                regexBtw = /(?:^(\d+)\s?[-,/;]\s?(\d+)$)/;

            if (match(regexEq)) {
                return album['release_year'] == match(regexEq)[1];
            } else if (match(regexGt)) {
                return album['release_year'] >= match(regexGt)[1];
            } else if (match(regexLt)){
                return album['release_year'] <= match(regexLt)[1];
            } else if (match(regexBtw)) {
                return (album['release_year'] >= match(regexBtw)[1])
                    && (album['release_year'] <= match(regexBtw)[2]);
            } else {
                return false
            }
            
        case 'owned':
            // Allow the use of different words for true and false
            switch (filterValue.toLowerCase()) {
                case 'yes':
                case 'true':
                case 'owned':
                case '1':
                    return album['owned'];
                case 'no':
                case 'false':
                case 'not owned':
                case 'want':
                case '0':
                    return !album['owned'];
                default:
                    return true;
            }
        case 'format':
            // In this filter "+" = "and" and "[,;/]" = "or"
            let formatList = []
            if (filterValue.includes('+')) {
                formatList = filterValue.replaceAll(' ', '').split('+');
                return formatList.every(format =>
                    album['format'].findIndex(val =>
                        val.toLowerCase() === format.toLowerCase()) != -1);
            } else {
                formatList = filterValue.replaceAll(' ', '').split(/[,;/]/);
                return formatList.some(format =>
                    album['format'].findIndex(val =>
                        val.toLowerCase() === format.toLowerCase()) != -1);
            }
        default:
            return true;
    }

}

function updateDisplay() {
    clearDisplay();
    displayLibrary();
    countEntries();
}

function displayLibrary() {
    const albumList = library.albumList.filter(album => filterAlbums(album));
    albumList.forEach(album => { displayNewEntry(album) })
}

function clearDisplay() {
    const libraryTable = document.querySelector('table > tbody');
    while (libraryTable.lastElementChild) {
        libraryTable.lastElementChild.remove();
    }
}

function countEntries() {
    const totalEntries = library.albumList.length,
        shownEntries = tableContents.childElementCount;

    entriesCount.textContent = totalEntries === 0 ?
                               'No albums in the library. Add one by clicking the button' :
                               `Showing ${shownEntries} out of ${totalEntries} albums`;
}

function displayNewEntry(album) {
    const tableRow = document.createElement('tr');

    tableRow.setAttribute('data-id', album.id);

    // Add album info
    tableColumns = ['title', 'artist', 'release_year', 'owned', 'format'];
    for (const prop of tableColumns) {
        const dataCell = document.createElement('td');

        switch (prop) {
            case 'owned':
                dataCell.textContent = album[prop] ? 'Yes' : 'No';
                break;
            case 'format':
                dataCell.textContent = album[prop].join(', ');
                break;
            default:
                dataCell.textContent = album[prop];
                break;
        }

        tableRow.appendChild(dataCell);
    }

    // Create remove-album button
    addRemoveButton(tableRow);

    // Append new row
    tableContents.appendChild(tableRow);
}

function removeEntry(e) {
    if (!confirm('Are you sure you want to delete this album?')) return;

    const entryRow = e.target.parentElement.parentElement;
    const id = entryRow.getAttribute('data-id');

    library.deleteAlbum(id)

    updateDisplay()
}

function addRemoveButton(row) {
    const dataCell = document.createElement('td');
    const removeButton = document.createElement('button');

    removeButton.classList.add('remove-album', 'img-button', 'hidden');
    removeButton.setAttribute('title', 'Delete Album')

    dataCell.appendChild(removeButton);
    row.appendChild(dataCell);

    // Connect new row so that remove-icon only appears on hover
    row.addEventListener('mouseenter', function () {
        removeButton.classList.remove('hidden');
    })

    row.addEventListener('mouseleave', function () {
        removeButton.classList.add('hidden');
    })

    // Connect button to removeAlbum function
    removeButton.addEventListener('click', removeEntry)
}

function sortTable() {
    const newSortBy = this.getAttribute('value');
    const { by: sortBy, ord: sortOrd } = currSorting;

    if (newSortBy === sortBy) {
        currSorting.ord = (sortOrd === 'asc') ? 'desc' : 'asc';
    } else {
        currSorting.by = newSortBy;
        currSorting.ord = 'asc';
    }

    library.sort(currSorting);
    updateDisplay();
    removeSortingArrows();
    displaySortingArrow(this);
}

function displaySortingArrow(column) {
    const sortArrow = column.firstElementChild.lastElementChild;

    sortArrow.classList.add(currSorting.ord);
    sortArrow.classList.remove('hidden');
}

function removeSortingArrows() {
    sortableHeaders.forEach(header => {
        const sortArrow = header.firstElementChild.lastElementChild;

        sortArrow.classList.add('hidden');
        sortArrow.classList.remove('asc');
        sortArrow.classList.remove('desc');
    })
}


function openModal() {
    modal.classList.remove('hidden')
    document.getElementById('new-title').focus()
}

function closeModal() {
    modal.classList.add('hidden');
    newAlbumForm.reset();
    disableCheckBoxes();
}

function disableCheckBoxes() {
    formatCheckBoxes.forEach(checkBox => {
        checkBox.disabled = true;
    })
}

function enableCheckBoxes() {
    formatCheckBoxes.forEach(checkBox => {
        checkBox.disabled = false;
    })
}

function submitNewAlbum(e) {
    e.preventDefault();

    const newAlbum = new Album(processNewAlbumForm());
    library.addAlbum(newAlbum);

    updateDisplay();
    closeModal();
}

function processNewAlbumForm() {
    let formData = new FormData(newAlbumForm);

    let formContent = Object.fromEntries(formData.entries());
    formContent['owned'] = formContent['owned'] === 'true' ?
        true :
        false;
    formContent['format'] = formData.getAll('format');

    return formContent;
}

function applyFilter(e=null) {
    if (e) e.preventDefault();

    currFilter['type'] = filterSelect.value
    currFilter['value'] = document.getElementById('filter-value').value

    updateDisplay()
}

function selectFilter() {
    const filter = filterSelect.value;
    let placeholder = '';

    switch (filter) {
        case 'title':
            placeholder = 'e.g. "submarine"';
            break;
        case 'artist':
            placeholder = 'e.g. "zeppelin", "beatles, rolling"';
            break;
        case 'release_year':
            placeholder = 'e.g. "1990", "1-2000", ">1900", "<1980"';
            break;
        case 'owned':
            placeholder = 'e.g. "true", "no", "not owned"';
            break;
        case 'format':
            placeholder = 'e.g. "Vynil", "cd+casette", "vynil/CD"';
    }

    filterValue.setAttribute('placeholder', placeholder);
}

function resetFilter() {
    inputText = this.value;

    if (inputText === "") {
        selectFilter();
        applyFilter();
    }

    return false;
}

/* Initialise library and empty filter*/
let library = new MusicLibrary();
let currFilter = { type: '', value: '' };
let currSorting = { by: 'title', ord: 'asc' };

/* UI Elements */
const sortableHeaders = document.querySelectorAll('table th.sortable'),
    tableContents = document.querySelector('table > tbody'),
    modal = document.querySelector('.modal-overlay'),
    openModalButton = document.getElementById('open-modal'),
    closeModalButton = document.getElementById('close-modal'),
    newAlbumForm = document.getElementById('add-album'),
    resetFormButton = document.querySelector('button[type="reset"]'),
    ownsTrueButton = document.getElementById('owns-true'),
    ownsFalseButton = document.getElementById('owns-false'),
    formatCheckBoxes = document.getElementsByName('format'),
    filterForm = document.getElementById('filter-by'),
    filterSelect = document.getElementById('filter'),
    filterValue = document.getElementById('filter-value'),
    entriesCount = document.getElementById('entries-count');

/* Connect UI Elements */
sortableHeaders.forEach(header => {
    header.addEventListener('click', sortTable)})
openModalButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
newAlbumForm.addEventListener('submit', submitNewAlbum);
resetFormButton.addEventListener('click', disableCheckBoxes);
filterForm.addEventListener('submit', applyFilter);
filterSelect.addEventListener('change', selectFilter);
filterValue.addEventListener('input', resetFilter);
ownsTrueButton.addEventListener('change', enableCheckBoxes);
ownsFalseButton.addEventListener('change', disableCheckBoxes);

/* */
filterValue.setAttribute('placeholder', 'e.g. "zeppelin", "beatles, rolling"')


for (let i = 0; i <= 80; i += 2) {
    testAlbum = new Album({
        title: `title-${parseInt(Math.random() * 100)}`,
        artist: `artist-${parseInt(Math.random() * 100)}`,
        release_year: 2020 - i,
        owned: Boolean(parseInt(Math.random() * 1.99)),
        format: ["Casette", "CD"]
    })
    library.addAlbum(testAlbum)
}

updateDisplay()
