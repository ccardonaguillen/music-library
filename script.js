function Album({title, artist, release_year, owned, format=[]}) {
    this.title = title;
    this.artist = artist;
    this.release_year = release_year;
    this.owned = Boolean(owned)
    this.format = format.join(", ");
    this.id = title.toLowerCase().replaceAll(/\W/g, "")
            + artist.toLowerCase().replaceAll(/\W/g, "");
}

class MusicLibrary {
    constructor() {
        this.albumList = []
    }

    addAlbum(newAlbum) {
        if (this.albumList.every(album =>
                                 newAlbum.id !== album.id)) {
            this.albumList.push(newAlbum);
        } else {
            alert('This album already exists')
        }
    }

    deleteAlbum(id) {
        this.albumList = this.albumList.filter(album => album.id !== id);
    }
}


function displayLibrary() {
    library.albumList.forEach(album => {displayNewEntry(album)})
}

function clearDisplay() {
    const libraryTable = document.querySelector('table > tbody');
    while (libraryTable.lastElementChild) {
        libraryTable.lastElementChild.remove();
    }
}

function updateDisplay() {
    clearDisplay();
    displayLibrary();
}

function displayNewEntry(album) {
    const tableRow = document.createElement('tr');

    tableRow.setAttribute('data-id', album.id);

    // Add album info
    tableColumns = ['title', 'artist', 'release_year', 'owned', 'format'];
    for (const prop of tableColumns) {
        const dataCell = document.createElement('td');
        
        if (prop === 'owned') {
            dataCell.textContent = album[prop] ?
                                   'Yes' :
                                   'No';
        } else {
            dataCell.textContent = album[prop];
        }

        tableRow.appendChild(dataCell);
    }

    // Create remove-album button
    addRemoveButton(tableRow);

    // Append new row
    tableContents.appendChild(tableRow);
}

function removeEntry(e) {
    if (!confirm("Are you sure you want to delete this album?")) return;

    const entryRow = e.target.parentElement.parentElement;
    const id = entryRow.getAttribute("data-id");

    library.deleteAlbum(id)

    updateDisplay()
}

function addRemoveButton(row) {
    const dataCell = document.createElement('td');
    const removeButton = document.createElement('button');

    removeButton.classList.add('remove-album', 'img-button', 'hidden');
    

    dataCell.appendChild(removeButton);
    row.appendChild(dataCell);

    // Connect new row so that remove-icon only appears on hover
    row.addEventListener('mouseenter', function() {
        removeButton.classList.remove('hidden');
    })

    row.addEventListener('mouseleave', function() {
        removeButton.classList.add('hidden');
    })

    // Connect button to removeAlbum function
    removeButton.addEventListener('click', removeEntry)
}

function openModal() {
    modal.classList.remove('hidden')
    document.getElementById('new-title').focus()
}

function closeModal() {
    modal.classList.add('hidden');
    newAlbumForm.reset();
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

    formContent = Object.fromEntries(formData.entries());
    formContent['owned'] = formContent['owned'] === 'true' ?
                           true :
                           false;
    formContent['format'] = formData.getAll('format');

    return formContent;
}

let library = new MusicLibrary();

const tableContents = document.querySelector('table > tbody');
const modal = document.querySelector('.modal-overlay');
const openModalButton = document.getElementById('open-modal');
const closeModalButton = document.getElementById('close-modal');
const newAlbumForm = document.getElementById('add-album');
const ownsTrueButton = document.getElementById('owns-true');
const ownsFalseButton = document.getElementById('owns-false');
const formatCheckBoxes = document.getElementsByName('format');


openModalButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal)
newAlbumForm.addEventListener('submit', submitNewAlbum);
ownsTrueButton.addEventListener('click', enableCheckBoxes);
ownsFalseButton.addEventListener('click', disableCheckBoxes);

album1 = new Album({title: "Lonerism",
                    artist: "Tame Impala",
                    release_year: 2012,
                    owned: false
                })

album2 = new Album({title: "Favourite Worst Nightmare",
                    artist: "Arctic Monkeys",
                    release_year: 2007,
                    owned: true,
                    format: ['CD']
                })
                    
album3 = new Album({title: "Revolver",
                    artist: "The Beatles",
                    release_year: 1966,
                    owned: true,
                    format: ["Vynil", "CD"]})
               
library.addAlbum(album1);
library.addAlbum(album2);
library.addAlbum(album3);


updateDisplay()
