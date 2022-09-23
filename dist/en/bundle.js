/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************!*\
  !*** ./src/en.js ***!
  \*******************/
const fileLoader = document.getElementById("load-album")

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
            alert("This album already exists.");
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
    const tableColumns = ["title", "artist", "release_year", "owned", "format"];
    for (const prop of tableColumns) {
        const dataCell = document.createElement("td");

        switch (prop) {
            case "owned":
                const ownedIcon = document.createElement('img')
                ownedIcon.classList.add('owned-icon');

                let iconPath =
                    album[prop]
                        ? "check.svg"
                        : "close-red.svg"
                ownedIcon.setAttribute("src", "../images/" + iconPath);

                dataCell.appendChild(ownedIcon)

                // dataCell.textContent = album[prop] ? "Yes" : "No";
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
    if (!confirm("Are you sure you want to delete this album?")) return;

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
            ? "No albums in the library. Add one by clicking the button"
            : `Showing ${shownEntries} out of ${totalEntries} albums`;
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
                case "yes":
                case "true":
                case "owned":
                case "1":
                    return album["owned"];
                case "no":
                case "false":
                case "not owned":
                case "want":
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
            placeholder = 'e.g. "submarine"';
            break;
        case "artist":
            placeholder = 'e.g. "zeppelin", "beatles, rolling"';
            break;
        case "release_year":
            placeholder = 'e.g. "1990", "1-2000", ">1900", "<1980"';
            break;
        case "owned":
            placeholder = 'e.g. "true", "no", "not owned"';
            break;
        case "format":
            placeholder = 'e.g. "Vynil", "cd+casette", "vynil/CD"';
    }

    filterValue.setAttribute("placeholder", placeholder);
}

function resetFilter() {
    /* Reset filter when the input box is empty and apply empty filter */
    const inputText = this.value;

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
//         title: `title-${parseInt(Math.random() * 100)}`,
//         artist: `artist-${parseInt(Math.random() * 100)}`,
//         release_year: 2020 - i,
//         owned: Boolean(parseInt(Math.random() * 1.99)),
//         format: ["Casette", "CD"],
//     });
//     library.addAlbum(testAlbum);
// }

// updateDisplay();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW4vYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0FBRUE7QUFDQSxtQkFBbUI7QUFDbkIsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsaUJBQWlCLGlEQUFpRDtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLGlCQUFpQjtBQUM1QixzREFBc0Q7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSx3REFBd0Q7O0FBRXhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGNBQWMsU0FBUyxjQUFjO0FBQzlEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSwyQkFBMkI7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsVUFBVSx1Q0FBdUM7O0FBRWpEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RTtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsY0FBYzs7QUFFM0Q7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsdUVBQXVFO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxNQUFNOztBQUUzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsU0FBUyxVQUFVLFNBQVMsV0FBVyxTQUFTO0FBQzFFOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0EsMkJBQTJCLDhCQUE4QjtBQUN6RCw2QkFBNkIsOEJBQThCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9lbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmaWxlTG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLWFsYnVtXCIpXG5cbi8qIElOSVRJQUxJU0UgRklMVEVSIEFORCBTT1JUSU5HIE9CSkVDVFMqL1xubGV0IGN1cnJGaWx0ZXIgPSB7IHR5cGU6IFwiXCIsIHZhbHVlOiBcIlwiIH07XG5sZXQgY3VyclNvcnRpbmcgPSB7IGJ5OiBcInRpdGxlXCIsIG9yZDogXCJhc2NcIiB9O1xuXG4vKiBVSSBFTEVNRU5UUyAqL1xuY29uc3Qgc29ydGFibGVIZWFkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRhYmxlIHRoLnNvcnRhYmxlXCIpLFxuICAgIHRhYmxlQ29udGVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUgPiB0Ym9keVwiKSxcbiAgICBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtb3ZlcmxheVwiKSxcbiAgICBvcGVuTW9kYWxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbW9kYWxcIiksXG4gICAgY2xvc2VNb2RhbEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xvc2UtbW9kYWxcIiksXG4gICAgbmV3QWxidW1Gb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGQtYWxidW1cIiksXG4gICAgYXJ0aXN0SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1hcnRpc3RcIiksXG4gICAgYXJ0aXN0U3VnZ2VzdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpLFxuICAgIGFydGlzdFN1Z2dlc3Rpb25zTGlzdCA9IGFydGlzdFN1Z2dlc3Rpb25zLmZpcnN0RWxlbWVudENoaWxkLFxuICAgIHJlc2V0Rm9ybUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwicmVzZXRcIl0nKSxcbiAgICBvd25zVHJ1ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ducy10cnVlXCIpLFxuICAgIG93bnNGYWxzZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ducy1mYWxzZVwiKSxcbiAgICBmb3JtYXRDaGVja0JveGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJmb3JtYXRcIiksXG4gICAgZmlsdGVyRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLWJ5XCIpLFxuICAgIGZpbHRlclNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyXCIpLFxuICAgIGZpbHRlclZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItdmFsdWVcIiksXG4gICAgZW50cmllc0NvdW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbnRyaWVzLWNvdW50XCIpO1xuXG4vKiBPQkpFQ1RTICovXG5cbmZ1bmN0aW9uIEFsYnVtKHsgdGl0bGUsIGFydGlzdCwgcmVsZWFzZV95ZWFyLCBvd25lZCwgZm9ybWF0ID0gW10gfSkge1xuICAgIC8qIEJhc2UgbGlicmFyeSBvYmplY3QuIFRoZSBpZCBpcyB1bmlxdWUgZm9yIGVhY2ggYWxidW0gKi9cbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5hcnRpc3QgPSBhcnRpc3Q7XG4gICAgdGhpcy5yZWxlYXNlX3llYXIgPSByZWxlYXNlX3llYXI7XG4gICAgdGhpcy5vd25lZCA9IEJvb2xlYW4ob3duZWQpO1xuICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xuICAgIHRoaXMuaWQgPVxuICAgICAgICB0aXRsZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoL1xcVy9nLCBcIlwiKSArXG4gICAgICAgIGFydGlzdC50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoL1xcVy9nLCBcIlwiKTtcbn1cblxuY2xhc3MgTXVzaWNMaWJyYXJ5IHtcbiAgICAvKiBPYmplY3QgdG8gc3RvcmUgdGhlIGFsYnVtcyBvZiB0aGUgY29sbGVjdGlvbiAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmFsYnVtTGlzdCA9IFtdO1xuICAgIH1cblxuICAgIGFkZEFsYnVtKG5ld0FsYnVtKSB7XG4gICAgICAgIC8qIElmIHRoZSBhbGJ1bXMgZXhpc3RzIGxvZyBlcnJvciBtZXNzYWdlLiBJZiBub3QgYWRkIGF0IHRoZSBzdGFydCAqL1xuICAgICAgICBpZiAodGhpcy5hbGJ1bUxpc3QuZXZlcnkoKGFsYnVtKSA9PiBuZXdBbGJ1bS5pZCAhPT0gYWxidW0uaWQpKSB7XG4gICAgICAgICAgICB0aGlzLmFsYnVtTGlzdC51bnNoaWZ0KG5ld0FsYnVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiVGhpcyBhbGJ1bSBhbHJlYWR5IGV4aXN0cy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGVBbGJ1bShpZCkge1xuICAgICAgICAvKiBEZWxldGUgYWxidW0gd2l0aCBhIGdpdmVuIElEICovXG4gICAgICAgIHRoaXMuYWxidW1MaXN0ID0gdGhpcy5hbGJ1bUxpc3QuZmlsdGVyKChhbGJ1bSkgPT4gYWxidW0uaWQgIT09IGlkKTtcbiAgICB9XG5cbiAgICBzb3J0KHsgYnksIG9yZCA9IFwiYXNjXCIgfSkge1xuICAgICAgICAvKiBSZXZlcnNlIHNvcnRpbmcgYWxnb3JpdGhtIGlzIG9yZCA9ICdkZXNjJzsgKi9cbiAgICAgICAgbGV0IHNvcnRPcmRlciA9IG9yZCA9PT0gXCJhc2NcIiA/IDEgOiAtMTtcblxuICAgICAgICBzd2l0Y2ggKGJ5KSB7XG4gICAgICAgICAgICBjYXNlIFwidGl0bGVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgICAgICAvLyBsb2NhbGVDb21wYXJlIHVzZWQgdG8gY29tcGFyZSBzdHJpbmcgd2l0aG91dCBtYXRoIG9wZXJhdG9yc1xuICAgICAgICAgICAgICAgIHRoaXMuYWxidW1MaXN0LnNvcnQoXG4gICAgICAgICAgICAgICAgICAgIChhLCBiKSA9PiBhW2J5XS5sb2NhbGVDb21wYXJlKGJbYnldKSAqIHNvcnRPcmRlclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5hbGJ1bUxpc3Quc29ydCgoYSwgYikgPT4gKGFbYnldIC0gYltieV0pICogc29ydE9yZGVyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gSU5JVElBTElTRSBMSUJSQVJZXG5sZXQgbGlicmFyeSA9IG5ldyBNdXNpY0xpYnJhcnkoKTtcblxuLyogVEFCTEUgQ09OVEVOVFMgKi9cblxuZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcbiAgICAvKiBGaXJzdCwgY2xlYXIgdGFibGUsIHRoZW4gZGlzcGxheSBhbmQgZmluYWxseSB1cGRhdGUgZW50cmllcyBzaG93biAqL1xuICAgIGNsZWFyRGlzcGxheSgpO1xuICAgIGRpc3BsYXlMaWJyYXJ5KCk7XG4gICAgY291bnRFbnRyaWVzKCk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlMaWJyYXJ5KCkge1xuICAgIC8vIEFwcGx5IGN1cnJlbnQgZmlsdGVyIHRvIGFsYnVtIGxpc3RcbiAgICBjb25zdCBhbGJ1bUxpc3QgPSBsaWJyYXJ5LmFsYnVtTGlzdC5maWx0ZXIoKGFsYnVtKSA9PiBmaWx0ZXJBbGJ1bXMoYWxidW0pKTtcbiAgICAvLyBEaXNwbGF5IGVhY2ggZW50cnkgb2YgdGhlIGFsYnVtXG4gICAgYWxidW1MaXN0LmZvckVhY2goKGFsYnVtKSA9PiB7XG4gICAgICAgIGRpc3BsYXlBbGJ1bShhbGJ1bSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyRGlzcGxheSgpIHtcbiAgICAvKiBSZW1vdmUgYWxsIHJvd3MgaW4gdGhlIHRhYmxlICovXG4gICAgY29uc3QgbGlicmFyeVRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIik7XG4gICAgd2hpbGUgKGxpYnJhcnlUYWJsZS5sYXN0RWxlbWVudENoaWxkKSB7XG4gICAgICAgIGxpYnJhcnlUYWJsZS5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheUFsYnVtKGFsYnVtKSB7XG4gICAgLy8gQ3JlYXRlIGEgbmV3IHJvdyBmb3IgdGhlIGFsYnVtXG4gICAgY29uc3QgdGFibGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG5cbiAgICAvLyBTZXQgYWxidW0gYXR0cmlidXRlIGFzIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgcm93XG4gICAgdGFibGVSb3cuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBhbGJ1bS5pZCk7XG5cbiAgICAvLyBBZGQgYWxidW0gaW5mb1xuICAgIGNvbnN0IHRhYmxlQ29sdW1ucyA9IFtcInRpdGxlXCIsIFwiYXJ0aXN0XCIsIFwicmVsZWFzZV95ZWFyXCIsIFwib3duZWRcIiwgXCJmb3JtYXRcIl07XG4gICAgZm9yIChjb25zdCBwcm9wIG9mIHRhYmxlQ29sdW1ucykge1xuICAgICAgICBjb25zdCBkYXRhQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcblxuICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIGNvbnN0IG93bmVkSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gICAgICAgICAgICAgICAgb3duZWRJY29uLmNsYXNzTGlzdC5hZGQoJ293bmVkLWljb24nKTtcblxuICAgICAgICAgICAgICAgIGxldCBpY29uUGF0aCA9XG4gICAgICAgICAgICAgICAgICAgIGFsYnVtW3Byb3BdXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFwiY2hlY2suc3ZnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJjbG9zZS1yZWQuc3ZnXCJcbiAgICAgICAgICAgICAgICBvd25lZEljb24uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi4vaW1hZ2VzL1wiICsgaWNvblBhdGgpO1xuXG4gICAgICAgICAgICAgICAgZGF0YUNlbGwuYXBwZW5kQ2hpbGQob3duZWRJY29uKVxuXG4gICAgICAgICAgICAgICAgLy8gZGF0YUNlbGwudGV4dENvbnRlbnQgPSBhbGJ1bVtwcm9wXSA/IFwiWWVzXCIgOiBcIk5vXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZm9ybWF0XCI6XG4gICAgICAgICAgICAgICAgZGF0YUNlbGwudGV4dENvbnRlbnQgPSBhbGJ1bVtwcm9wXS5qb2luKFwiLCBcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGRhdGFDZWxsLnRleHRDb250ZW50ID0gYWxidW1bcHJvcF07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0YWJsZVJvdy5hcHBlbmRDaGlsZChkYXRhQ2VsbCk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIHJlbW92ZS1hbGJ1bSBidXR0b25cbiAgICBhZGRSZW1vdmVCdXR0b24odGFibGVSb3cpO1xuXG4gICAgLy8gQXBwZW5kIG5ldyByb3dcbiAgICB0YWJsZUNvbnRlbnRzLmFwcGVuZENoaWxkKHRhYmxlUm93KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRW50cnkoZSkge1xuICAgIC8vIEFzayBjb25maXJtYXRpb24gYmVmb3JlIHJlbW92aW5nIGFsYnVtXG4gICAgaWYgKCFjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGFsYnVtP1wiKSkgcmV0dXJuO1xuXG4gICAgLy8gUmVtb3ZlIHJvdyBhbmQgYWxidW0gZnJvbSBsaWJyYXJ5XG4gICAgY29uc3QgZW50cnlSb3cgPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgY29uc3QgaWQgPSBlbnRyeVJvdy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuXG4gICAgbGlicmFyeS5kZWxldGVBbGJ1bShpZCk7XG5cbiAgICAvLyBVcGRhdGUgZGlzcGxheSB0byByZWZsZWN0IGNoYW5nZXNcbiAgICB1cGRhdGVEaXNwbGF5KCk7XG59XG5cbi8qIEVOVFJJRVMgQ09VTlQgKi9cblxuZnVuY3Rpb24gY291bnRFbnRyaWVzKCkge1xuICAgIGNvbnN0IHRvdGFsRW50cmllcyA9IGxpYnJhcnkuYWxidW1MaXN0Lmxlbmd0aCwgLy8gTGVuZ3RoIG9mIGxpYnJhcnkgbGlzdFxuICAgICAgICBzaG93bkVudHJpZXMgPSB0YWJsZUNvbnRlbnRzLmNoaWxkRWxlbWVudENvdW50OyAvLyBOdW1iZXIgb2Ygcm93cyBpbiB0YWJsZVxuXG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIGFsYnVtcyBpbiB0aGUgbGlicmFyeSBwcmludCB3ZWxjb21lIG1lc3NhZ2VcbiAgICBlbnRyaWVzQ291bnQudGV4dENvbnRlbnQgPVxuICAgICAgICB0b3RhbEVudHJpZXMgPT09IDBcbiAgICAgICAgICAgID8gXCJObyBhbGJ1bXMgaW4gdGhlIGxpYnJhcnkuIEFkZCBvbmUgYnkgY2xpY2tpbmcgdGhlIGJ1dHRvblwiXG4gICAgICAgICAgICA6IGBTaG93aW5nICR7c2hvd25FbnRyaWVzfSBvdXQgb2YgJHt0b3RhbEVudHJpZXN9IGFsYnVtc2A7XG59XG5cbi8qIFJFTU9WRSBBTEJVTSBCVVRUT04gKi9cblxuZnVuY3Rpb24gYWRkUmVtb3ZlQnV0dG9uKHJvdykge1xuICAgIC8vIENyZWF0ZSB0cmFzaGNhbiBidXR0b24gYW5kIGFwcGVuZCBpdCB0byByb3dcbiAgICBjb25zdCBkYXRhQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcbiAgICBjb25zdCByZW1vdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG4gICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmUtYWxidW1cIiwgXCJpbWctYnV0dG9uXCIsIFwiaGlkZGVuXCIpO1xuICAgIHJlbW92ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIkRlbGV0ZSBBbGJ1bVwiKTtcblxuICAgIGRhdGFDZWxsLmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbik7XG4gICAgcm93LmFwcGVuZENoaWxkKGRhdGFDZWxsKTtcblxuICAgIC8vIENvbm5lY3QgbmV3IHJvdyBzbyB0aGF0IHJlbW92ZS1pY29uIG9ubHkgYXBwZWFycyBvbiBob3ZlclxuICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuXG4gICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfSk7XG5cbiAgICAvLyBDb25uZWN0IGJ1dHRvbiB0byByZW1vdmVBbGJ1bSBmdW5jdGlvblxuICAgIHJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVtb3ZlRW50cnkpO1xufVxuXG4vKiBTT1JUSU5HIFRBQkxFICovXG5cbmZ1bmN0aW9uIHNvcnRUYWJsZSgpIHtcbiAgICBjb25zdCBuZXdTb3J0QnkgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpO1xuICAgIGNvbnN0IHsgYnk6IHNvcnRCeSwgb3JkOiBzb3J0T3JkIH0gPSBjdXJyU29ydGluZztcblxuICAgIC8vIElmIHNvcnRpbmcgbmV3IHJvdyBmbGlwIHJvdyBvcmRlciwgZWxzZSByb3cgb3JkZXIgYXMgYXNjIGFzIGRlZmF1bHRcbiAgICBpZiAobmV3U29ydEJ5ID09PSBzb3J0QnkpIHtcbiAgICAgICAgY3VyclNvcnRpbmcub3JkID0gc29ydE9yZCA9PT0gXCJhc2NcIiA/IFwiZGVzY1wiIDogXCJhc2NcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyU29ydGluZy5ieSA9IG5ld1NvcnRCeTtcbiAgICAgICAgY3VyclNvcnRpbmcub3JkID0gXCJhc2NcIjtcbiAgICB9XG5cbiAgICAvLyBTb3J0IGxpYnJhcnkgYWxidW1zIGFuZCB1cGRhdGUgZGlzcGxheTtcbiAgICBsaWJyYXJ5LnNvcnQoY3VyclNvcnRpbmcpO1xuICAgIHVwZGF0ZURpc3BsYXkoKTtcblxuICAgIC8vIFJlbW92ZSBhbGwgc29ydGluZyBhcnJvd3MgYW5kIGRpc3BsYXkgdGhlbSBhZ2FpblxuICAgIHJlbW92ZVNvcnRpbmdBcnJvd3MoKTtcbiAgICBkaXNwbGF5U29ydGluZ0Fycm93KHRoaXMpO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5U29ydGluZ0Fycm93KGNvbHVtbikge1xuICAgIC8qIEFkZCBzb3J0aW5nIGFycm93cyB3aXRoIHRoZSBjb3JyZXBzb25kaW5nIG9yZGVyIGluIHRoZSBjbGlja2VkIGhlYWRlciAqL1xuICAgIGNvbnN0IHNvcnRBcnJvdyA9IGNvbHVtbi5maXJzdEVsZW1lbnRDaGlsZC5sYXN0RWxlbWVudENoaWxkO1xuXG4gICAgc29ydEFycm93LmNsYXNzTGlzdC5hZGQoY3VyclNvcnRpbmcub3JkKTtcbiAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU29ydGluZ0Fycm93cygpIHtcbiAgICAvKiBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGZvcm0gYWxsIGhlYWRlcnMgKi9cbiAgICBzb3J0YWJsZUhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5maXJzdEVsZW1lbnRDaGlsZC5sYXN0RWxlbWVudENoaWxkO1xuXG4gICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImFzY1wiKTtcbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNjXCIpO1xuICAgIH0pO1xufVxuXG4vKiBNT0RBTCAqL1xuXG5mdW5jdGlvbiBvcGVuTW9kYWwoKSB7XG4gICAgLyogRGlzcGxheSBmb3JtIG1vZGFsIG92ZXIgbWFpbiB3aW5kb3cgYW5kIGZvY3VzIG9uIGZpcnN0IGlucHV0ICovXG4gICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10aXRsZVwiKS5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgIC8qIEhpZGUgbW9kYWwgYW5kIHJlc2V0IGZvcm0gKGRpc2FibGluZyB0aGUgY2hlY2tib3hlcykgKi9cbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIG5ld0FsYnVtRm9ybS5yZXNldCgpO1xuICAgIGRpc2FibGVDaGVja0JveGVzKCk7XG59XG5cbi8qIE5FVyBBTEJVTSBGT1JNICovXG5cbmZ1bmN0aW9uIGRpc2FibGVDaGVja0JveGVzKCkge1xuICAgIC8qIERpc2FibGUgZm9ybWF0IGNoZWNrYm94ZXMgKi9cbiAgICBmb3JtYXRDaGVja0JveGVzLmZvckVhY2goKGNoZWNrQm94KSA9PiB7XG4gICAgICAgIGNoZWNrQm94LmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZW5hYmxlQ2hlY2tCb3hlcygpIHtcbiAgICAvKiBFbmFibGUgZm9ybWF0IGNoZWNrYm94ZXMgKi9cbiAgICBmb3JtYXRDaGVja0JveGVzLmZvckVhY2goKGNoZWNrQm94KSA9PiB7XG4gICAgICAgIGNoZWNrQm94LmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHN1Ym1pdE5ld0FsYnVtKGUpIHtcbiAgICAvLyBQcmV2ZW50IGRlZmF1bHQgc3VibWl0IGFjdGlvblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIENyZWF0ZSBuZXcgYWxidW0gb2JqZWN0IGFuZCBhZGQgaXQgdG8gdGhlIGxpYnJhcnlcbiAgICBjb25zdCBuZXdBbGJ1bSA9IG5ldyBBbGJ1bShwcm9jZXNzTmV3QWxidW1Gb3JtKCkpO1xuICAgIGxpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuXG4gICAgLy8gVXBkYXRlIHRhYmxlIGFuZCBjbG9zZSBmb3JtIG1vZGFsXG4gICAgdXBkYXRlRGlzcGxheSgpO1xuICAgIGNsb3NlTW9kYWwoKTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc05ld0FsYnVtRm9ybSgpIHtcbiAgICAvKiBQcm9jZXNzIG5ldyBhbGJ1bSBmb3JtIHRvIHBhc3MgaXQgdG8gbmV3IGFsYnVtICovXG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKG5ld0FsYnVtRm9ybSk7XG5cbiAgICBsZXQgZm9ybUNvbnRlbnQgPSBPYmplY3QuZnJvbUVudHJpZXMoZm9ybURhdGEuZW50cmllcygpKTtcbiAgICBmb3JtQ29udGVudFtcIm93bmVkXCJdID0gZm9ybUNvbnRlbnRbXCJvd25lZFwiXSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgZm9ybUNvbnRlbnRbXCJmb3JtYXRcIl0gPSBmb3JtRGF0YS5nZXRBbGwoXCJmb3JtYXRcIik7XG5cbiAgICByZXR1cm4gZm9ybUNvbnRlbnQ7XG59XG5cbi8qIEZJTFRFUiBGT1JNICovXG5cbmZ1bmN0aW9uIGZpbHRlckFsYnVtcyhhbGJ1bSkge1xuICAgIGxldCB7IHR5cGU6IGZpbHRlclR5cGUsIHZhbHVlOiBmaWx0ZXJWYWx1ZSB9ID0gY3VyckZpbHRlcjtcblxuICAgIC8vIFJlc2V0IGRpc3BsYXkgaWYgbm8gZmlsdGVyIGFwcGx5IChpbnB1dCBlbXB0eSkgZG8gbm90aGluZ1xuICAgIGlmIChmaWx0ZXJWYWx1ZSA9PT0gXCJcIikgcmV0dXJuIHRydWU7XG5cbiAgICBzd2l0Y2ggKGZpbHRlclR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICByZXR1cm4gYWxidW1bXCJ0aXRsZVwiXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGZpbHRlclZhbHVlKTtcbiAgICAgICAgY2FzZSBcImFydGlzdFwiOlxuICAgICAgICAgICAgLy8gTWF0Y2ggYW55IG9mIHRoZSBjb21tYSBzZXBhcmF0ZWQgbWF0Y2hlc1xuICAgICAgICAgICAgY29uc3QgYXJ0aXN0TGlzdCA9IGZpbHRlclZhbHVlLnJlcGxhY2VBbGwoXCIgXCIsIFwiXCIpLnNwbGl0KC9bLDtdLyk7XG4gICAgICAgICAgICByZXR1cm4gYXJ0aXN0TGlzdC5zb21lKChhcnRpc3QpID0+XG4gICAgICAgICAgICAgICAgYWxidW1bXCJhcnRpc3RcIl0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhhcnRpc3QpXG4gICAgICAgICAgICApO1xuICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSAocmVnZXgpID0+IGZpbHRlclZhbHVlLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIC8vIFJlZ2V4IGZvciB5ZWFyIGZvciBkaWZmZXJlbnQgcmVsZWFzZSB5ZWFyIGZpbHRlclxuICAgICAgICAgICAgY29uc3QgcmVnZXhFcSA9IC9eXFxzKihcXGQrKVxccyokLywgLy8gU2luZ2xlIHllYXIgdmFsdWVcbiAgICAgICAgICAgICAgICByZWdleEd0ID0gLyg/Ol4+XFxzPyhcXGQrKSQpLywgLy8gR3JlYXRlciB0aGFuXG4gICAgICAgICAgICAgICAgcmVnZXhMdCA9IC8oPzpePFxccz8oXFxkKykkKS8sIC8vIExvd2VyIHRoYW5cbiAgICAgICAgICAgICAgICByZWdleEJ0dyA9IC8oPzpeKFxcZCspXFxzP1stLC87XVxccz8oXFxkKykkKS87IC8vVHdvIHZhbHVlcyBpbnRlcnZhbFxuXG4gICAgICAgICAgICBpZiAobWF0Y2gocmVnZXhFcSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPT0gbWF0Y2gocmVnZXhFcSlbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKHJlZ2V4R3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID49IG1hdGNoKHJlZ2V4R3QpWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEx0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA8PSBtYXRjaChyZWdleEx0KVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2gocmVnZXhCdHcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPj0gbWF0Y2gocmVnZXhCdHcpWzFdICYmXG4gICAgICAgICAgICAgICAgICAgIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdIDw9IG1hdGNoKHJlZ2V4QnR3KVsyXVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIFwib3duZWRcIjpcbiAgICAgICAgICAgIC8vIEFsbG93IHRoZSB1c2Ugb2YgZGlmZmVyZW50IHdvcmRzIGZvciB0cnVlIGFuZCBmYWxzZVxuICAgICAgICAgICAgc3dpdGNoIChmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInllc1wiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0cnVlXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIjFcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5vXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImZhbHNlXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5vdCBvd25lZFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJ3YW50XCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIjBcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICBjYXNlIFwiZm9ybWF0XCI6XG4gICAgICAgICAgICAvLyBJbiB0aGlzIGZpbHRlciBcIitcIiA9IFwiYW5kXCIgYW5kIFwiWyw7L11cIiA9IFwib3JcIlxuICAgICAgICAgICAgbGV0IGZvcm1hdExpc3QgPSBbXTtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJWYWx1ZS5pbmNsdWRlcyhcIitcIikpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXRMaXN0ID0gZmlsdGVyVmFsdWUucmVwbGFjZUFsbChcIiBcIiwgXCJcIikuc3BsaXQoXCIrXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRMaXN0LmV2ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAoZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJmb3JtYXRcIl0uZmluZEluZGV4KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWwpID0+IHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSAhPSAtMVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5yZXBsYWNlQWxsKFwiIFwiLCBcIlwiKS5zcGxpdCgvWyw7L10vKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TGlzdC5zb21lKFxuICAgICAgICAgICAgICAgICAgICAoZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJmb3JtYXRcIl0uZmluZEluZGV4KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWwpID0+IHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSAhPSAtMVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvLyBFbHNlIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlGaWx0ZXIoZSA9IG51bGwpIHtcbiAgICAvLyBQcmV2ZW50IGRlZmF1bHQgc3VibWl0IGJlaGF2aW91clxuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBVcGRhdGUgY3VycmVudCBmaWx0ZXIgd2l0aCB2YWx1ZXMgZnJvbSB0aGUgZmlsdGVyIGZvcm1cbiAgICBjdXJyRmlsdGVyW1widHlwZVwiXSA9IGZpbHRlclNlbGVjdC52YWx1ZTtcbiAgICBjdXJyRmlsdGVyW1widmFsdWVcIl0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci12YWx1ZVwiKS52YWx1ZTtcblxuICAgIC8vIFVwZGF0ZSB0YWJsZVxuICAgIHVwZGF0ZURpc3BsYXkoKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0RmlsdGVyKCkge1xuICAgIC8qIFVwZGF0ZSBwbGFjZWhvbGRlciBtZXNzYWdlIGFjY29yZGluZyB0byB0aGUgc2VsZWN0ZWQgb3B0aW9uICovXG4gICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgIGxldCBwbGFjZWhvbGRlciA9IFwiXCI7XG5cbiAgICBzd2l0Y2ggKGZpbHRlcikge1xuICAgICAgICBjYXNlIFwidGl0bGVcIjpcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJ2UuZy4gXCJzdWJtYXJpbmVcIic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImFydGlzdFwiOlxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSAnZS5nLiBcInplcHBlbGluXCIsIFwiYmVhdGxlcywgcm9sbGluZ1wiJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9ICdlLmcuIFwiMTk5MFwiLCBcIjEtMjAwMFwiLCBcIj4xOTAwXCIsIFwiPDE5ODBcIic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9ICdlLmcuIFwidHJ1ZVwiLCBcIm5vXCIsIFwibm90IG93bmVkXCInO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb3JtYXRcIjpcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJ2UuZy4gXCJWeW5pbFwiLCBcImNkK2Nhc2V0dGVcIiwgXCJ2eW5pbC9DRFwiJztcbiAgICB9XG5cbiAgICBmaWx0ZXJWYWx1ZS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBwbGFjZWhvbGRlcik7XG59XG5cbmZ1bmN0aW9uIHJlc2V0RmlsdGVyKCkge1xuICAgIC8qIFJlc2V0IGZpbHRlciB3aGVuIHRoZSBpbnB1dCBib3ggaXMgZW1wdHkgYW5kIGFwcGx5IGVtcHR5IGZpbHRlciAqL1xuICAgIGNvbnN0IGlucHV0VGV4dCA9IHRoaXMudmFsdWU7XG5cbiAgICBpZiAoaW5wdXRUZXh0ID09PSBcIlwiKSB7XG4gICAgICAgIHNlbGVjdEZpbHRlcigpO1xuICAgICAgICBhcHBseUZpbHRlcigpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyogQVJUSVNUUyBTVUdHRVNUSU9OUyAqL1xuXG5mdW5jdGlvbiBzdWdnZXN0QXJ0aXN0cyhlKSB7XG4gICAgLyogQ29tcHV0ZSBzdWdnZXN0aW9ucyBiYXNlZCBvbiBjdXJyZW50IGlucHV0ICovXG4gICAgY29uc3QgZnVsbEFydGlzdExpc3QgPSBsaWJyYXJ5LmFsYnVtTGlzdC5tYXAoKGFsYnVtKSA9PiBhbGJ1bS5hcnRpc3QpO1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy52YWx1ZTtcblxuICAgIC8vIElmIHVzZXIgY2xlYXJzIGlucHV0LCBkaXNwbGF5IHBsYWNlaG9sZGVyIGFuZCBjbG9zZSBzdWdnZXN0aW9uc1xuICAgIGlmIChpbnB1dCA9PT0gXCJcIikge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIHRoaXMucGxhY2Vob2xkZXIpO1xuICAgICAgICBjbG9zZVN1Z2dlc3Rpb25zKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzdWdnZXN0ZWRBcnRpc3RzID0gZnVsbEFydGlzdExpc3QuZmlsdGVyKChhcnRpc3QpID0+XG4gICAgICAgIGFydGlzdC5pbmNsdWRlcyhpbnB1dClcbiAgICApO1xuXG4gICAgLy8gUmVmcmVzaCBkaXYgYW5kIGRpc3BsYXkgbmV3IHN1Z2dlc3Rpb25zXG4gICAgY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgIGRpc3BsYXlTdWdnZXN0aW9ucyhzdWdnZXN0ZWRBcnRpc3RzLCBpbnB1dCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyU3VnZ2VzdGlvbnMoKSB7XG4gICAgLyogRGVsZXRlIGFsbCBzdWdnZXN0aW9ucyAqL1xuICAgIHdoaWxlIChhcnRpc3RTdWdnZXN0aW9uc0xpc3QubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICBhcnRpc3RTdWdnZXN0aW9uc0xpc3QubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlTdWdnZXN0aW9ucyhzdWdnZXN0ZWRBcnRpc3RzLCBpbnB1dCkge1xuICAgIC8qIERpc3BsYXkgaW5wdXQgc3VnZ2VzdGlvbnMgKi9cbiAgICBpZiAoIXN1Z2dlc3RlZEFydGlzdHMubGVuZ3RoKSB7XG4gICAgICAgIGNsb3NlU3VnZ2VzdGlvbnMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFNob3cgc3VnZ2VzdGlvbnMgZGl2XG4gICAgYXJ0aXN0U3VnZ2VzdGlvbnMuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblxuICAgIC8vIFJlZ2V4IHRvIG1ha2UgbWF0Y2ggYm9sZFxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgKC4qKSgke2lucHV0fSkoLiopYCwgXCJpXCIpO1xuXG4gICAgc3VnZ2VzdGVkQXJ0aXN0cy5mb3JFYWNoKChhcnRpc3QpID0+IHtcbiAgICAgICAgLy8gRm9yIGVhY2ggc3VnZ2VzdGlvbiBhZGQgbGlzdCBlbGVtZW50IGhpZ2hsaWdodGluZyBtYXRjaFxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcblxuICAgICAgICBtYXRjaCA9IGFydGlzdC5tYXRjaChyZWdleCk7XG4gICAgICAgIGxpLmlubmVySFRNTCA9IGAke21hdGNoWzFdfTxzdHJvbmc+JHttYXRjaFsyXX08L3N0cm9uZz4ke21hdGNoWzNdfWA7XG4gICAgICAgIGFydGlzdFN1Z2dlc3Rpb25zTGlzdC5hcHBlbmRDaGlsZChsaSk7XG5cbiAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHNlbGVjdCBzdWdnZXN0aW9uXG4gICAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaG9vc2VTdWdnZXN0aW9uKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY2hvb3NlU3VnZ2VzdGlvbigpIHtcbiAgICAvKiBDaG9vc2Ugc2VsZWN0ZWQgaXRlbSBhbmQgYWRkIGl0IHRvIHRoZSBpbnB1dCAqL1xuICAgIGFydGlzdElucHV0LnZhbHVlID0gdGhpcy50ZXh0Q29udGVudDtcblxuICAgIGNsb3NlU3VnZ2VzdGlvbnMoKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VTdWdnZXN0aW9ucyhlID0gbnVsbCkge1xuICAgIC8qIEhpZGUgc3VnZ2VzdGlvbnMgYm94ICovXG4gICAgaWYgKGUpIHtcbiAgICAgICAgLy8gQXZvaWQgZXZlbiBhc3NvY2lhdGVkIHRvIGRvY3VtZW50IGNsaWNrcyB3aGVuIGNsaWNraW5nIGluIGlucHV0IGJveFxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGFydGlzdElucHV0KSByZXR1cm47XG4gICAgfVxuXG4gICAgY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgIGFydGlzdFN1Z2dlc3Rpb25zLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG59XG5cbi8qIENvbm5lY3QgVUkgRWxlbWVudHMgKi9cblxuLy8gU29ydCB0YWJsZSB3aGVuIGNsaWNraW5nIG9uIGhlYWRlcnNcbnNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNvcnRUYWJsZSk7XG59KTtcblxuLy8gT3BlbiBhbmQgbW9kYWwgd2hlbiBjbGljayBcIk5ldyBBbGJ1bVwiIGJ1dHRvbiBhbmQgXCJYXCIgcmVzcGVjdGl2ZWx5XG5vcGVuTW9kYWxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9wZW5Nb2RhbCk7XG5jbG9zZU1vZGFsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcblxuLy8gU3VibWl0IGFuZCByZXNldCBcIk5ldyBBbGJ1bVwiIGZvcm1cbm5ld0FsYnVtRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHN1Ym1pdE5ld0FsYnVtKTtcbnJlc2V0Rm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZGlzYWJsZUNoZWNrQm94ZXMpO1xuXG4vLyBTdWJtaXQsIHJlc2V0IGFuZCBtb2RpZnkgXCJGaWx0ZXJcIiBmb3JtXG5maWx0ZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXBwbHlGaWx0ZXIpO1xuZmlsdGVyU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgc2VsZWN0RmlsdGVyKTtcbmZpbHRlclZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCByZXNldEZpbHRlcik7XG5cbi8vIEVuYWJsZSBjaGVja2JveGVzIHdoZW4gdXNlciBjbGlja3MgYnV0dG9uIGFuZCBkaXNhYmxlIHdoZW4gbm90XG5vd25zVHJ1ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGVuYWJsZUNoZWNrQm94ZXMpO1xub3duc0ZhbHNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZGlzYWJsZUNoZWNrQm94ZXMpO1xuXG4vLyBTdWdnZXN0IGFydGlzdHMgd2hlbiBpbnB1dGluZyB2YWx1ZXMgb3Igd2hlbiBjbGlja2luZyBpbiBpbnB1dFxuYXJ0aXN0SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHN1Z2dlc3RBcnRpc3RzKTtcbmFydGlzdElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBzdWdnZXN0QXJ0aXN0cyk7XG5cbi8vIENsb3NlIHN1Z2dlc3Rpb25zIGRpdiB3aGVuIGNsaWNraW5nIG91dHNpZGUgc3VnZ2VzdGlvbiBib3hcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZVN1Z2dlc3Rpb25zLCB0cnVlKTtcblxuLy8gZm9yIChsZXQgaSA9IDA7IGkgPD0gODA7IGkgKz0gMikge1xuLy8gICAgIHRlc3RBbGJ1bSA9IG5ldyBBbGJ1bSh7XG4vLyAgICAgICAgIHRpdGxlOiBgdGl0bGUtJHtwYXJzZUludChNYXRoLnJhbmRvbSgpICogMTAwKX1gLFxuLy8gICAgICAgICBhcnRpc3Q6IGBhcnRpc3QtJHtwYXJzZUludChNYXRoLnJhbmRvbSgpICogMTAwKX1gLFxuLy8gICAgICAgICByZWxlYXNlX3llYXI6IDIwMjAgLSBpLFxuLy8gICAgICAgICBvd25lZDogQm9vbGVhbihwYXJzZUludChNYXRoLnJhbmRvbSgpICogMS45OSkpLFxuLy8gICAgICAgICBmb3JtYXQ6IFtcIkNhc2V0dGVcIiwgXCJDRFwiXSxcbi8vICAgICB9KTtcbi8vICAgICBsaWJyYXJ5LmFkZEFsYnVtKHRlc3RBbGJ1bSk7XG4vLyB9XG5cbi8vIHVwZGF0ZURpc3BsYXkoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==