let musicLibrary = [];
let albumID = 0;

function Album({title, artist, release_year, owned, format=[]}) {
    this.title = title;
    this.artist = artist;
    this.release_year = release_year;
    this.owned = owned;
    this.format = format.join(", ");
}

class MusicLibrary {
    constructor() {
        this.albumList = []
    }

    addAlbum(album) {
        this.albumList.push(album);
    }

    displayLibrary() {
        clearLibrary()
        this.albumList.forEach(album => {displayAlbum(album)})
    }
}

function clearLibrary() {
    const libraryTable = document.querySelector('table > tbody');
    while (libraryTable.lastElementChild) {
        libraryTable.lastElementChild.remove();
    }
}

function displayAlbum(album) {
    const libraryTable = document.querySelector('table > tbody');

    const tableRow = document.createElement('tr')
    tableRow.setAttribute("data_id", albumID);
    albumID ++

    for (let prop in album) {
        const dataCell = document.createElement('td');
        dataCell.textContent = album[prop];

        tableRow.appendChild(dataCell);
    }

    libraryTable.appendChild(tableRow);
}

function openModal() {
    modal.classList.remove('hidden')
    document.getElementById('new-title').focus()
}

function closeModal() {modal.classList.add('hidden')}


function submitNewAlbum(e) {
    e.preventDefault();

    const form = e.target;
    const newAlbum = new Album(processForm(form));

    library.addAlbum(newAlbum);
    library.displayLibrary();

    closeModal();
    form.reset();
}

function processForm(form) {
    let formData = new FormData(form);

    formContent = Object.fromEntries(formData.entries());
    formContent['format'] = formData.getAll("format");

    return formContent;
}


const modal = document.querySelector('.modal-overlay');
const openModalButton = document.getElementById('open-modal');
const newAlbumForm = document.getElementById('add-album');

openModalButton.addEventListener('click', openModal);
newAlbumForm.addEventListener('submit', submitNewAlbum);

library = new MusicLibrary();

album1 = new Album({title: "Lonerism",
                    artist: "Tame Impala",
                    release_year: 2012,
                    owned: false
                })

album2 = new Album({title: "Favourite Worse Nightmare",
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


library.displayLibrary()
