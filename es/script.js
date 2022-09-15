/* INITIALISE FILTER AND SORTING OBJECTS*/
let currFilter = { type: "", value: "" };
let currSorting = { by: "title", ord: "asc" };

/* UI ELEMENTS */
const sortableHeaders = document.querySelectorAll("table th.sortable"),
    tableContents = document.querySelector("table > tbody"),
    modal = document.querySelector(".modal-overlay"),
    openModalButton = document.getElementById("open-modal"),
    closeModalButton = document.getElementById("close-modal"),
    newAlbumForm = document.getElementById("add-album"),
    artistInput = document.getElementById("new-artist"),
    artistSuggestions = document.querySelector(".suggestions"),
    artistSuggestionsList = artistSuggestions.firstElementChild,
    resetFormButton = document.querySelector('button[type="reset"]'),
    ownsTrueButton = document.getElementById("owns-true"),
    ownsFalseButton = document.getElementById("owns-false"),
    formatCheckBoxes = document.getElementsByName("format"),
    filterForm = document.getElementById("filter-by"),
    filterSelect = document.getElementById("filter"),
    filterValue = document.getElementById("filter-value"),
    entriesCount = document.getElementById("entries-count");

/* OBJECTS */

function Album({ title, artist, release_year, owned, format = [] }) {
    /* Base library object. The id is unique for each album */
    this.title = title;
    this.artist = artist;
    this.release_year = release_year;
    this.owned = Boolean(owned);
    this.format = format;
    this.id =
        title.toLowerCase().replaceAll(/\W/g, "") +
        artist.toLowerCase().replaceAll(/\W/g, "");
}

class MusicLibrary {
    /* Object to store the albums of the collection */
    constructor() {
        this.albumList = [];
    }

    addAlbum(newAlbum) {
        /* If the albums exists log error message. If not add at the start */
        if (this.albumList.every((album) => newAlbum.id !== album.id)) {
            this.albumList.unshift(newAlbum);
        } else {
            alert("Este álbum ya está en la colección.");
        }
    }

    deleteAlbum(id) {
        /* Delete album with a given ID */
        this.albumList = this.albumList.filter((album) => album.id !== id);
    }

    sort({ by, ord = "asc" }) {
        /* Reverse sorting algorithm is ord = 'desc'; */
        let sortOrder = ord === "asc" ? 1 : -1;

        switch (by) {
            case "title":
            case "artist":
                // localeCompare used to compare string without math operators
                this.albumList.sort(
                    (a, b) => a[by].localeCompare(b[by]) * sortOrder
                );
            case "release_year":
                this.albumList.sort((a, b) => (a[by] - b[by]) * sortOrder);
        }
    }
}

// INITIALISE LIBRARY
let library = new MusicLibrary();

/* TABLE CONTENTS */

function updateDisplay() {
    /* First, clear table, then display and finally update entries shown */
    clearDisplay();
    displayLibrary();
    countEntries();
}

function displayLibrary() {
    // Apply current filter to album list
    const albumList = library.albumList.filter((album) => filterAlbums(album));
    // Display each entry of the album
    albumList.forEach((album) => {
        displayAlbum(album);
    });
}

function clearDisplay() {
    /* Remove all rows in the table */
    const libraryTable = document.querySelector("table > tbody");
    while (libraryTable.lastElementChild) {
        libraryTable.lastElementChild.remove();
    }
}

function displayAlbum(album) {
    // Create a new row for the album
    const tableRow = document.createElement("tr");

    // Set album attribute as unique identifier for the row
    tableRow.setAttribute("data-id", album.id);

    // Add album info
    tableColumns = ["title", "artist", "release_year", "owned", "format"];
    for (const prop of tableColumns) {
        const dataCell = document.createElement("td");

        switch (prop) {
            case "owned":
                const ownedIcon = document.createElement('img')
                ownedIcon.classList.add('owned-icon');

                let iconPath =
                    album[prop]
                        ? "check-circle-outline.svg"
                        : "close-circle-outline.svg"
                ownedIcon.setAttribute("src", "../images/" + iconPath);

                dataCell.appendChild(ownedIcon)
                // dataCell.textContent = album[prop] ? "Sí" : "No";
                break;
            case "format":
                dataCell.textContent = album[prop].join(", ");
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
    // Ask confirmation before removing album
    if (!confirm("¿Estás seguro de que deseas eliminar este álbum?")) return;

    // Remove row and album from library
    const entryRow = e.target.parentElement.parentElement;
    const id = entryRow.getAttribute("data-id");

    library.deleteAlbum(id);

    // Update display to reflect changes
    updateDisplay();
}

/* ENTRIES COUNT */

function countEntries() {
    const totalEntries = library.albumList.length, // Length of library list
        shownEntries = tableContents.childElementCount; // Number of rows in table

    // If there are no albums in the library print welcome message
    entriesCount.textContent =
        totalEntries === 0
            ? 'No hay ningún álbum en la colección. Añade uno usando el botón'
            : `Mostrando ${shownEntries} de ${totalEntries} álbumes`;
}

/* REMOVE ALBUM BUTTON */

function addRemoveButton(row) {
    // Create trashcan button and append it to row
    const dataCell = document.createElement("td");
    const removeButton = document.createElement("button");

    removeButton.classList.add("remove-album", "img-button", "hidden");
    removeButton.setAttribute("title", "Delete Album");

    dataCell.appendChild(removeButton);
    row.appendChild(dataCell);

    // Connect new row so that remove-icon only appears on hover
    row.addEventListener("mouseenter", function () {
        removeButton.classList.remove("hidden");
    });

    row.addEventListener("mouseleave", function () {
        removeButton.classList.add("hidden");
    });

    // Connect button to removeAlbum function
    removeButton.addEventListener("click", removeEntry);
}

/* SORTING TABLE */

function sortTable() {
    const newSortBy = this.getAttribute("value");
    const { by: sortBy, ord: sortOrd } = currSorting;

    // If sorting new row flip row order, else row order as asc as default
    if (newSortBy === sortBy) {
        currSorting.ord = sortOrd === "asc" ? "desc" : "asc";
    } else {
        currSorting.by = newSortBy;
        currSorting.ord = "asc";
    }

    // Sort library albums and update display;
    library.sort(currSorting);
    updateDisplay();

    // Remove all sorting arrows and display them again
    removeSortingArrows();
    displaySortingArrow(this);
}

function displaySortingArrow(column) {
    /* Add sorting arrows with the correpsonding order in the clicked header */
    const sortArrow = column.firstElementChild.lastElementChild;

    sortArrow.classList.add(currSorting.ord);
    sortArrow.classList.remove("hidden");
}

function removeSortingArrows() {
    /* Remove all sorting arrows form all headers */
    sortableHeaders.forEach((header) => {
        const sortArrow = header.firstElementChild.lastElementChild;

        sortArrow.classList.add("hidden");
        sortArrow.classList.remove("asc");
        sortArrow.classList.remove("desc");
    });
}

/* MODAL */

function openModal() {
    /* Display form modal over main window and focus on first input */
    modal.classList.remove("hidden");
    document.getElementById("new-title").focus();
}

function closeModal() {
    /* Hide modal and reset form (disabling the checkboxes) */
    modal.classList.add("hidden");
    newAlbumForm.reset();
    disableCheckBoxes();
}

/* NEW ALBUM FORM */

function disableCheckBoxes() {
    /* Disable format checkboxes */
    formatCheckBoxes.forEach((checkBox) => {
        checkBox.disabled = true;
    });
}

function enableCheckBoxes() {
    /* Enable format checkboxes */
    formatCheckBoxes.forEach((checkBox) => {
        checkBox.disabled = false;
    });
}

function submitNewAlbum(e) {
    // Prevent default submit action
    e.preventDefault();

    // Create new album object and add it to the library
    const newAlbum = new Album(processNewAlbumForm());
    library.addAlbum(newAlbum);

    // Update table and close form modal
    updateDisplay();
    closeModal();
}

function processNewAlbumForm() {
    /* Process new album form to pass it to new album */
    let formData = new FormData(newAlbumForm);

    let formContent = Object.fromEntries(formData.entries());
    formContent["owned"] = formContent["owned"] === "true" ? true : false;
    formContent["format"] = formData.getAll("format");

    return formContent;
}

/* FILTER FORM */

function filterAlbums(album) {
    let { type: filterType, value: filterValue } = currFilter;

    // Reset display if no filter apply (input empty) do nothing
    if (filterValue === "") return true;

    switch (filterType) {
        case "title":
            return album["title"].toLowerCase().includes(filterValue);
        case "artist":
            // Match any of the comma separated matches
            const artistList = filterValue.replaceAll(" ", "").split(/[,;]/);
            return artistList.some((artist) =>
                album["artist"].toLowerCase().includes(artist)
            );
        case "release_year":
            let match = (regex) => filterValue.match(regex);
            // Regex for year for different release year filter
            const regexEq = /^\s*(\d+)\s*$/, // Single year value
                regexGt = /(?:^>\s?(\d+)$)/, // Greater than
                regexLt = /(?:^<\s?(\d+)$)/, // Lower than
                regexBtw = /(?:^(\d+)\s?[-,/;]\s?(\d+)$)/; //Two values interval

            if (match(regexEq)) {
                return album["release_year"] == match(regexEq)[1];
            } else if (match(regexGt)) {
                return album["release_year"] >= match(regexGt)[1];
            } else if (match(regexLt)) {
                return album["release_year"] <= match(regexLt)[1];
            } else if (match(regexBtw)) {
                return (
                    album["release_year"] >= match(regexBtw)[1] &&
                    album["release_year"] <= match(regexBtw)[2]
                );
            } else {
                return false;
            }

        case "owned":
            // Allow the use of different words for true and false
            switch (filterValue.toLowerCase()) {
                case "si":
                case "sí":
                case "1":
                    return album["owned"];
                case "no":
                case "0":
                    return !album["owned"];
                default:
                    return true;
            }
        case "format":
            // In this filter "+" = "and" and "[,;/]" = "or"
            let formatList = [];
            if (filterValue.includes("+")) {
                formatList = filterValue.replaceAll(" ", "").split("+");
                return formatList.every(
                    (format) =>
                        album["format"].findIndex(
                            (val) => val.toLowerCase() === format.toLowerCase()
                        ) != -1
                );
            } else {
                formatList = filterValue.replaceAll(" ", "").split(/[,;/]/);
                return formatList.some(
                    (format) =>
                        album["format"].findIndex(
                            (val) => val.toLowerCase() === format.toLowerCase()
                        ) != -1
                );
            }
        default:
            // Else do nothing
            return true;
    }
}

function applyFilter(e = null) {
    // Prevent default submit behaviour
    if (e) e.preventDefault();

    // Update current filter with values from the filter form
    currFilter["type"] = filterSelect.value;
    currFilter["value"] = document.getElementById("filter-value").value;

    // Update table
    updateDisplay();
}

function selectFilter() {
    /* Update placeholder message according to the selected option */
    const filter = filterSelect.value;
    let placeholder = "";

    switch (filter) {
        case "title":
            placeholder = 'p. ej. "submarine"';
            break;
        case "artist":
            placeholder = 'p. ej. "zeppelin", "beatles, rolling"';
            break;
        case "release_year":
            placeholder = 'p. ej. "1990", "1-2000", ">1900", "<1980"';
            break;
        case "owned":
            placeholder = 'p. ej. "true", "no", "not owned"';
            break;
        case "format":
            placeholder = 'p. ej. "Vynil", "cd+casette", "vynil/CD"';
    }

    filterValue.setAttribute("placeholder", placeholder);
}

function resetFilter() {
    /* Reset filter when the input box is empty and apply empty filter */
    inputText = this.value;

    if (inputText === "") {
        selectFilter();
        applyFilter();
    }

    return false;
}

/* ARTISTS SUGGESTIONS */

function suggestArtists(e) {
    /* Compute suggestions based on current input */
    const fullArtistList = library.albumList.map((album) => album.artist);
    const input = this.value;

    // If user clears input, display placeholder and close suggestions
    if (input === "") {
        this.setAttribute("placeholder", this.placeholder);
        closeSuggestions();

        return;
    }

    let suggestedArtists = fullArtistList.filter((artist) =>
        artist.includes(input)
    );

    // Refresh div and display new suggestions
    clearSuggestions();
    displaySuggestions(suggestedArtists, input);
}

function clearSuggestions() {
    /* Delete all suggestions */
    while (artistSuggestionsList.lastElementChild) {
        artistSuggestionsList.lastElementChild.remove();
    }
}

function displaySuggestions(suggestedArtists, input) {
    /* Display input suggestions */
    if (!suggestedArtists.length) {
        closeSuggestions();
        return;
    }

    // Show suggestions div
    artistSuggestions.classList.remove("hidden");

    // Regex to make match bold
    const regex = new RegExp(`(.*)(${input})(.*)`, "i");

    suggestedArtists.forEach((artist) => {
        // For each suggestion add list element highlighting match
        const li = document.createElement("li");

        match = artist.match(regex);
        li.innerHTML = `${match[1]}<strong>${match[2]}</strong>${match[3]}`;
        artistSuggestionsList.appendChild(li);

        // Add event listener to select suggestion
        li.addEventListener("click", chooseSuggestion);
    });
}

function chooseSuggestion() {
    /* Choose selected item and add it to the input */
    artistInput.value = this.textContent;

    closeSuggestions();
}

function closeSuggestions(e = null) {
    /* Hide suggestions box */
    if (e) {
        // Avoid even associated to document clicks when clicking in input box
        if (e.target === artistInput) return;
    }

    clearSuggestions();
    artistSuggestions.classList.add("hidden");
}

/* Connect UI Elements */

// Sort table when clicking on headers
sortableHeaders.forEach((header) => {
    header.addEventListener("click", sortTable);
});

// Open and modal when click "New Album" button and "X" respectively
openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);

// Submit and reset "New Album" form
newAlbumForm.addEventListener("submit", submitNewAlbum);
resetFormButton.addEventListener("click", disableCheckBoxes);

// Submit, reset and modify "Filter" form
filterForm.addEventListener("submit", applyFilter);
filterSelect.addEventListener("change", selectFilter);
filterValue.addEventListener("input", resetFilter);

// Enable checkboxes when user clicks button and disable when not
ownsTrueButton.addEventListener("change", enableCheckBoxes);
ownsFalseButton.addEventListener("change", disableCheckBoxes);

// Suggest artists when inputing values or when clicking in input
artistInput.addEventListener("input", suggestArtists);
artistInput.addEventListener("focus", suggestArtists);

// Close suggestions div when clicking outside suggestion box
document.addEventListener("click", closeSuggestions, true);

// for (let i = 0; i <= 80; i += 2) {
//     testAlbum = new Album({
//         title: `titulo-${parseInt(Math.random() * 100)}`,
//         artist: `artista-${parseInt(Math.random() * 100)}`,
//         release_year: 2020 - i,
//         owned: Boolean(parseInt(Math.random() * 1.99)),
//         format: ["Casette", "CD"],
//     });
//     library.addAlbum(testAlbum);
// }

// updateDisplay();
