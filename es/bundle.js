/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************!*\
  !*** ./src/es.js ***!
  \*******************/
const fileLoader = document.getElementById('file-loader');

fileLoader.addEventListener('change', (event) => {
    const fileList = event.target.files;
    var file = fileList[0];
    readFile(file);
    fileLoader.classList.add("hidden");
  });

function readFile(f) {
    const reader = new FileReader();
    var fileContent
    reader.addEventListener('load', (event) => {
        var fileContent = JSON.parse(event.target.result);
        Object.values(fileContent).forEach(val => {
            var album = new Album(val);
            library.addAlbum(album);
        })
        updateDisplay();
    });
    reader.readAsText(f);
}

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
            placeholder = 'p. ej. "sí", "no"';
            break;
        case "format":
            placeholder = 'p. ej. "Vinilo", "cd+casete", "vinilo/CD"';
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
//         title: `titulo-${parseInt(Math.random() * 100)}`,
//         artist: `artista-${parseInt(Math.random() * 100)}`,
//         release_year: 2020 - i,
//         owned: Boolean(parseInt(Math.random() * 1.99)),
//         format: ["Casette", "CD"],
//     });
//     library.addAlbum(testAlbum);
// }

// updateDisplay();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLHVFQUF1RTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsTUFBTTs7QUFFM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLFNBQVMsVUFBVSxTQUFTLFdBQVcsU0FBUztBQUMxRTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBLDRCQUE0Qiw4QkFBOEI7QUFDMUQsOEJBQThCLDhCQUE4QjtBQUM1RDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZmlsZUxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlLWxvYWRlcicpO1xuXG5maWxlTG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGVMaXN0ID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgIHZhciBmaWxlID0gZmlsZUxpc3RbMF07XG4gICAgcmVhZEZpbGUoZmlsZSk7XG4gICAgZmlsZUxvYWRlci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9KTtcblxuZnVuY3Rpb24gcmVhZEZpbGUoZikge1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgdmFyIGZpbGVDb250ZW50XG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdmFyIGZpbGVDb250ZW50ID0gSlNPTi5wYXJzZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgT2JqZWN0LnZhbHVlcyhmaWxlQ29udGVudCkuZm9yRWFjaCh2YWwgPT4ge1xuICAgICAgICAgICAgdmFyIGFsYnVtID0gbmV3IEFsYnVtKHZhbCk7XG4gICAgICAgICAgICBsaWJyYXJ5LmFkZEFsYnVtKGFsYnVtKTtcbiAgICAgICAgfSlcbiAgICAgICAgdXBkYXRlRGlzcGxheSgpO1xuICAgIH0pO1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGYpO1xufVxuXG4vKiBJTklUSUFMSVNFIEZJTFRFUiBBTkQgU09SVElORyBPQkpFQ1RTKi9cbmxldCBjdXJyRmlsdGVyID0geyB0eXBlOiBcIlwiLCB2YWx1ZTogXCJcIiB9O1xubGV0IGN1cnJTb3J0aW5nID0geyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCIgfTtcblxuLyogVUkgRUxFTUVOVFMgKi9cbmNvbnN0IHNvcnRhYmxlSGVhZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0YWJsZSB0aC5zb3J0YWJsZVwiKSxcbiAgICB0YWJsZUNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIiksXG4gICAgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLW92ZXJsYXlcIiksXG4gICAgb3Blbk1vZGFsQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW1vZGFsXCIpLFxuICAgIGNsb3NlTW9kYWxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsb3NlLW1vZGFsXCIpLFxuICAgIG5ld0FsYnVtRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLWFsYnVtXCIpLFxuICAgIGFydGlzdElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYXJ0aXN0XCIpLFxuICAgIGFydGlzdFN1Z2dlc3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKSxcbiAgICBhcnRpc3RTdWdnZXN0aW9uc0xpc3QgPSBhcnRpc3RTdWdnZXN0aW9ucy5maXJzdEVsZW1lbnRDaGlsZCxcbiAgICByZXNldEZvcm1CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInJlc2V0XCJdJyksXG4gICAgb3duc1RydWVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm93bnMtdHJ1ZVwiKSxcbiAgICBvd25zRmFsc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm93bnMtZmFsc2VcIiksXG4gICAgZm9ybWF0Q2hlY2tCb3hlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKFwiZm9ybWF0XCIpLFxuICAgIGZpbHRlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci1ieVwiKSxcbiAgICBmaWx0ZXJTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlclwiKSxcbiAgICBmaWx0ZXJWYWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLXZhbHVlXCIpLFxuICAgIGVudHJpZXNDb3VudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50cmllcy1jb3VudFwiKTtcblxuLyogT0JKRUNUUyAqL1xuXG5mdW5jdGlvbiBBbGJ1bSh7IHRpdGxlLCBhcnRpc3QsIHJlbGVhc2VfeWVhciwgb3duZWQsIGZvcm1hdCA9IFtdIH0pIHtcbiAgICAvKiBCYXNlIGxpYnJhcnkgb2JqZWN0LiBUaGUgaWQgaXMgdW5pcXVlIGZvciBlYWNoIGFsYnVtICovXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuYXJ0aXN0ID0gYXJ0aXN0O1xuICAgIHRoaXMucmVsZWFzZV95ZWFyID0gcmVsZWFzZV95ZWFyO1xuICAgIHRoaXMub3duZWQgPSBCb29sZWFuKG93bmVkKTtcbiAgICB0aGlzLmZvcm1hdCA9IGZvcm1hdDtcbiAgICB0aGlzLmlkID1cbiAgICAgICAgdGl0bGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlQWxsKC9cXFcvZywgXCJcIikgK1xuICAgICAgICBhcnRpc3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlQWxsKC9cXFcvZywgXCJcIik7XG59XG5cbmNsYXNzIE11c2ljTGlicmFyeSB7XG4gICAgLyogT2JqZWN0IHRvIHN0b3JlIHRoZSBhbGJ1bXMgb2YgdGhlIGNvbGxlY3Rpb24gKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5hbGJ1bUxpc3QgPSBbXTtcbiAgICB9XG5cbiAgICBhZGRBbGJ1bShuZXdBbGJ1bSkge1xuICAgICAgICAvKiBJZiB0aGUgYWxidW1zIGV4aXN0cyBsb2cgZXJyb3IgbWVzc2FnZS4gSWYgbm90IGFkZCBhdCB0aGUgc3RhcnQgKi9cbiAgICAgICAgaWYgKHRoaXMuYWxidW1MaXN0LmV2ZXJ5KChhbGJ1bSkgPT4gbmV3QWxidW0uaWQgIT09IGFsYnVtLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5hbGJ1bUxpc3QudW5zaGlmdChuZXdBbGJ1bSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIkVzdGUgw6FsYnVtIHlhIGVzdMOhIGVuIGxhIGNvbGVjY2nDs24uXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlQWxidW0oaWQpIHtcbiAgICAgICAgLyogRGVsZXRlIGFsYnVtIHdpdGggYSBnaXZlbiBJRCAqL1xuICAgICAgICB0aGlzLmFsYnVtTGlzdCA9IHRoaXMuYWxidW1MaXN0LmZpbHRlcigoYWxidW0pID0+IGFsYnVtLmlkICE9PSBpZCk7XG4gICAgfVxuXG4gICAgc29ydCh7IGJ5LCBvcmQgPSBcImFzY1wiIH0pIHtcbiAgICAgICAgLyogUmV2ZXJzZSBzb3J0aW5nIGFsZ29yaXRobSBpcyBvcmQgPSAnZGVzYyc7ICovXG4gICAgICAgIGxldCBzb3J0T3JkZXIgPSBvcmQgPT09IFwiYXNjXCIgPyAxIDogLTE7XG5cbiAgICAgICAgc3dpdGNoIChieSkge1xuICAgICAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gbG9jYWxlQ29tcGFyZSB1c2VkIHRvIGNvbXBhcmUgc3RyaW5nIHdpdGhvdXQgbWF0aCBvcGVyYXRvcnNcbiAgICAgICAgICAgICAgICB0aGlzLmFsYnVtTGlzdC5zb3J0KFxuICAgICAgICAgICAgICAgICAgICAoYSwgYikgPT4gYVtieV0ubG9jYWxlQ29tcGFyZShiW2J5XSkgKiBzb3J0T3JkZXJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSBcInJlbGVhc2VfeWVhclwiOlxuICAgICAgICAgICAgICAgIHRoaXMuYWxidW1MaXN0LnNvcnQoKGEsIGIpID0+IChhW2J5XSAtIGJbYnldKSAqIHNvcnRPcmRlcik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIElOSVRJQUxJU0UgTElCUkFSWVxubGV0IGxpYnJhcnkgPSBuZXcgTXVzaWNMaWJyYXJ5KCk7XG5cbi8qIFRBQkxFIENPTlRFTlRTICovXG5cbmZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgLyogRmlyc3QsIGNsZWFyIHRhYmxlLCB0aGVuIGRpc3BsYXkgYW5kIGZpbmFsbHkgdXBkYXRlIGVudHJpZXMgc2hvd24gKi9cbiAgICBjbGVhckRpc3BsYXkoKTtcbiAgICBkaXNwbGF5TGlicmFyeSgpO1xuICAgIGNvdW50RW50cmllcygpO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5TGlicmFyeSgpIHtcbiAgICAvLyBBcHBseSBjdXJyZW50IGZpbHRlciB0byBhbGJ1bSBsaXN0XG4gICAgY29uc3QgYWxidW1MaXN0ID0gbGlicmFyeS5hbGJ1bUxpc3QuZmlsdGVyKChhbGJ1bSkgPT4gZmlsdGVyQWxidW1zKGFsYnVtKSk7XG4gICAgLy8gRGlzcGxheSBlYWNoIGVudHJ5IG9mIHRoZSBhbGJ1bVxuICAgIGFsYnVtTGlzdC5mb3JFYWNoKChhbGJ1bSkgPT4ge1xuICAgICAgICBkaXNwbGF5QWxidW0oYWxidW0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhckRpc3BsYXkoKSB7XG4gICAgLyogUmVtb3ZlIGFsbCByb3dzIGluIHRoZSB0YWJsZSAqL1xuICAgIGNvbnN0IGxpYnJhcnlUYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpO1xuICAgIHdoaWxlIChsaWJyYXJ5VGFibGUubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICBsaWJyYXJ5VGFibGUubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlBbGJ1bShhbGJ1bSkge1xuICAgIC8vIENyZWF0ZSBhIG5ldyByb3cgZm9yIHRoZSBhbGJ1bVxuICAgIGNvbnN0IHRhYmxlUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuXG4gICAgLy8gU2V0IGFsYnVtIGF0dHJpYnV0ZSBhcyB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHJvd1xuICAgIHRhYmxlUm93LnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgYWxidW0uaWQpO1xuXG4gICAgLy8gQWRkIGFsYnVtIGluZm9cbiAgICBjb25zdCB0YWJsZUNvbHVtbnMgPSBbXCJ0aXRsZVwiLCBcImFydGlzdFwiLCBcInJlbGVhc2VfeWVhclwiLCBcIm93bmVkXCIsIFwiZm9ybWF0XCJdO1xuICAgIGZvciAoY29uc3QgcHJvcCBvZiB0YWJsZUNvbHVtbnMpIHtcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG5cbiAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICBjYXNlIFwib3duZWRcIjpcbiAgICAgICAgICAgICAgICBjb25zdCBvd25lZEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgICAgICAgICAgICAgIG93bmVkSWNvbi5jbGFzc0xpc3QuYWRkKCdvd25lZC1pY29uJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgaWNvblBhdGggPVxuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtwcm9wXVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBcImNoZWNrLnN2Z1wiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2xvc2UtcmVkLnN2Z1wiXG4gICAgICAgICAgICAgICAgb3duZWRJY29uLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4uL2ltYWdlcy9cIiArIGljb25QYXRoKTtcblxuICAgICAgICAgICAgICAgIGRhdGFDZWxsLmFwcGVuZENoaWxkKG93bmVkSWNvbilcbiAgICAgICAgICAgICAgICAvLyBkYXRhQ2VsbC50ZXh0Q29udGVudCA9IGFsYnVtW3Byb3BdID8gXCJTw61cIiA6IFwiTm9cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJmb3JtYXRcIjpcbiAgICAgICAgICAgICAgICBkYXRhQ2VsbC50ZXh0Q29udGVudCA9IGFsYnVtW3Byb3BdLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZGF0YUNlbGwudGV4dENvbnRlbnQgPSBhbGJ1bVtwcm9wXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRhYmxlUm93LmFwcGVuZENoaWxkKGRhdGFDZWxsKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgcmVtb3ZlLWFsYnVtIGJ1dHRvblxuICAgIGFkZFJlbW92ZUJ1dHRvbih0YWJsZVJvdyk7XG5cbiAgICAvLyBBcHBlbmQgbmV3IHJvd1xuICAgIHRhYmxlQ29udGVudHMuYXBwZW5kQ2hpbGQodGFibGVSb3cpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFbnRyeShlKSB7XG4gICAgLy8gQXNrIGNvbmZpcm1hdGlvbiBiZWZvcmUgcmVtb3ZpbmcgYWxidW1cbiAgICBpZiAoIWNvbmZpcm0oXCLCv0VzdMOhcyBzZWd1cm8gZGUgcXVlIGRlc2VhcyBlbGltaW5hciBlc3RlIMOhbGJ1bT9cIikpIHJldHVybjtcblxuICAgIC8vIFJlbW92ZSByb3cgYW5kIGFsYnVtIGZyb20gbGlicmFyeVxuICAgIGNvbnN0IGVudHJ5Um93ID0gZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIGNvbnN0IGlkID0gZW50cnlSb3cuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcblxuICAgIGxpYnJhcnkuZGVsZXRlQWxidW0oaWQpO1xuXG4gICAgLy8gVXBkYXRlIGRpc3BsYXkgdG8gcmVmbGVjdCBjaGFuZ2VzXG4gICAgdXBkYXRlRGlzcGxheSgpO1xufVxuXG4vKiBFTlRSSUVTIENPVU5UICovXG5cbmZ1bmN0aW9uIGNvdW50RW50cmllcygpIHtcbiAgICBjb25zdCB0b3RhbEVudHJpZXMgPSBsaWJyYXJ5LmFsYnVtTGlzdC5sZW5ndGgsIC8vIExlbmd0aCBvZiBsaWJyYXJ5IGxpc3RcbiAgICAgICAgc2hvd25FbnRyaWVzID0gdGFibGVDb250ZW50cy5jaGlsZEVsZW1lbnRDb3VudDsgLy8gTnVtYmVyIG9mIHJvd3MgaW4gdGFibGVcblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBhbGJ1bXMgaW4gdGhlIGxpYnJhcnkgcHJpbnQgd2VsY29tZSBtZXNzYWdlXG4gICAgZW50cmllc0NvdW50LnRleHRDb250ZW50ID1cbiAgICAgICAgdG90YWxFbnRyaWVzID09PSAwXG4gICAgICAgICAgICA/ICdObyBoYXkgbmluZ8O6biDDoWxidW0gZW4gbGEgY29sZWNjacOzbi4gQcOxYWRlIHVubyB1c2FuZG8gZWwgYm90w7NuJ1xuICAgICAgICAgICAgOiBgTW9zdHJhbmRvICR7c2hvd25FbnRyaWVzfSBkZSAke3RvdGFsRW50cmllc30gw6FsYnVtZXNgO1xufVxuXG4vKiBSRU1PVkUgQUxCVU0gQlVUVE9OICovXG5cbmZ1bmN0aW9uIGFkZFJlbW92ZUJ1dHRvbihyb3cpIHtcbiAgICAvLyBDcmVhdGUgdHJhc2hjYW4gYnV0dG9uIGFuZCBhcHBlbmQgaXQgdG8gcm93XG4gICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblxuICAgIHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlLWFsYnVtXCIsIFwiaW1nLWJ1dHRvblwiLCBcImhpZGRlblwiKTtcbiAgICByZW1vdmVCdXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgXCJEZWxldGUgQWxidW1cIik7XG5cbiAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xuICAgIHJvdy5hcHBlbmRDaGlsZChkYXRhQ2VsbCk7XG5cbiAgICAvLyBDb25uZWN0IG5ldyByb3cgc28gdGhhdCByZW1vdmUtaWNvbiBvbmx5IGFwcGVhcnMgb24gaG92ZXJcbiAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICB9KTtcblxuICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuXG4gICAgLy8gQ29ubmVjdCBidXR0b24gdG8gcmVtb3ZlQWxidW0gZnVuY3Rpb25cbiAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92ZUVudHJ5KTtcbn1cblxuLyogU09SVElORyBUQUJMRSAqL1xuXG5mdW5jdGlvbiBzb3J0VGFibGUoKSB7XG4gICAgY29uc3QgbmV3U29ydEJ5ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcbiAgICBjb25zdCB7IGJ5OiBzb3J0QnksIG9yZDogc29ydE9yZCB9ID0gY3VyclNvcnRpbmc7XG5cbiAgICAvLyBJZiBzb3J0aW5nIG5ldyByb3cgZmxpcCByb3cgb3JkZXIsIGVsc2Ugcm93IG9yZGVyIGFzIGFzYyBhcyBkZWZhdWx0XG4gICAgaWYgKG5ld1NvcnRCeSA9PT0gc29ydEJ5KSB7XG4gICAgICAgIGN1cnJTb3J0aW5nLm9yZCA9IHNvcnRPcmQgPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY3VyclNvcnRpbmcuYnkgPSBuZXdTb3J0Qnk7XG4gICAgICAgIGN1cnJTb3J0aW5nLm9yZCA9IFwiYXNjXCI7XG4gICAgfVxuXG4gICAgLy8gU29ydCBsaWJyYXJ5IGFsYnVtcyBhbmQgdXBkYXRlIGRpc3BsYXk7XG4gICAgbGlicmFyeS5zb3J0KGN1cnJTb3J0aW5nKTtcbiAgICB1cGRhdGVEaXNwbGF5KCk7XG5cbiAgICAvLyBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGFuZCBkaXNwbGF5IHRoZW0gYWdhaW5cbiAgICByZW1vdmVTb3J0aW5nQXJyb3dzKCk7XG4gICAgZGlzcGxheVNvcnRpbmdBcnJvdyh0aGlzKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVNvcnRpbmdBcnJvdyhjb2x1bW4pIHtcbiAgICAvKiBBZGQgc29ydGluZyBhcnJvd3Mgd2l0aCB0aGUgY29ycmVwc29uZGluZyBvcmRlciBpbiB0aGUgY2xpY2tlZCBoZWFkZXIgKi9cbiAgICBjb25zdCBzb3J0QXJyb3cgPSBjb2x1bW4uZmlyc3RFbGVtZW50Q2hpbGQubGFzdEVsZW1lbnRDaGlsZDtcblxuICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QuYWRkKGN1cnJTb3J0aW5nLm9yZCk7XG4gICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVNvcnRpbmdBcnJvd3MoKSB7XG4gICAgLyogUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBmb3JtIGFsbCBoZWFkZXJzICovXG4gICAgc29ydGFibGVIZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICBjb25zdCBzb3J0QXJyb3cgPSBoZWFkZXIuZmlyc3RFbGVtZW50Q2hpbGQubGFzdEVsZW1lbnRDaGlsZDtcblxuICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NcIik7XG4gICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QucmVtb3ZlKFwiZGVzY1wiKTtcbiAgICB9KTtcbn1cblxuLyogTU9EQUwgKi9cblxuZnVuY3Rpb24gb3Blbk1vZGFsKCkge1xuICAgIC8qIERpc3BsYXkgZm9ybSBtb2RhbCBvdmVyIG1haW4gd2luZG93IGFuZCBmb2N1cyBvbiBmaXJzdCBpbnB1dCAqL1xuICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdGl0bGVcIikuZm9jdXMoKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcbiAgICAvKiBIaWRlIG1vZGFsIGFuZCByZXNldCBmb3JtIChkaXNhYmxpbmcgdGhlIGNoZWNrYm94ZXMpICovXG4gICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBuZXdBbGJ1bUZvcm0ucmVzZXQoKTtcbiAgICBkaXNhYmxlQ2hlY2tCb3hlcygpO1xufVxuXG4vKiBORVcgQUxCVU0gRk9STSAqL1xuXG5mdW5jdGlvbiBkaXNhYmxlQ2hlY2tCb3hlcygpIHtcbiAgICAvKiBEaXNhYmxlIGZvcm1hdCBjaGVja2JveGVzICovXG4gICAgZm9ybWF0Q2hlY2tCb3hlcy5mb3JFYWNoKChjaGVja0JveCkgPT4ge1xuICAgICAgICBjaGVja0JveC5kaXNhYmxlZCA9IHRydWU7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGVuYWJsZUNoZWNrQm94ZXMoKSB7XG4gICAgLyogRW5hYmxlIGZvcm1hdCBjaGVja2JveGVzICovXG4gICAgZm9ybWF0Q2hlY2tCb3hlcy5mb3JFYWNoKChjaGVja0JveCkgPT4ge1xuICAgICAgICBjaGVja0JveC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzdWJtaXROZXdBbGJ1bShlKSB7XG4gICAgLy8gUHJldmVudCBkZWZhdWx0IHN1Ym1pdCBhY3Rpb25cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBDcmVhdGUgbmV3IGFsYnVtIG9iamVjdCBhbmQgYWRkIGl0IHRvIHRoZSBsaWJyYXJ5XG4gICAgY29uc3QgbmV3QWxidW0gPSBuZXcgQWxidW0ocHJvY2Vzc05ld0FsYnVtRm9ybSgpKTtcbiAgICBsaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcblxuICAgIC8vIFVwZGF0ZSB0YWJsZSBhbmQgY2xvc2UgZm9ybSBtb2RhbFxuICAgIHVwZGF0ZURpc3BsYXkoKTtcbiAgICBjbG9zZU1vZGFsKCk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NOZXdBbGJ1bUZvcm0oKSB7XG4gICAgLyogUHJvY2VzcyBuZXcgYWxidW0gZm9ybSB0byBwYXNzIGl0IHRvIG5ldyBhbGJ1bSAqL1xuICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShuZXdBbGJ1bUZvcm0pO1xuXG4gICAgbGV0IGZvcm1Db250ZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKGZvcm1EYXRhLmVudHJpZXMoKSk7XG4gICAgZm9ybUNvbnRlbnRbXCJvd25lZFwiXSA9IGZvcm1Db250ZW50W1wib3duZWRcIl0gPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xuICAgIGZvcm1Db250ZW50W1wiZm9ybWF0XCJdID0gZm9ybURhdGEuZ2V0QWxsKFwiZm9ybWF0XCIpO1xuXG4gICAgcmV0dXJuIGZvcm1Db250ZW50O1xufVxuXG4vKiBGSUxURVIgRk9STSAqL1xuXG5mdW5jdGlvbiBmaWx0ZXJBbGJ1bXMoYWxidW0pIHtcbiAgICBsZXQgeyB0eXBlOiBmaWx0ZXJUeXBlLCB2YWx1ZTogZmlsdGVyVmFsdWUgfSA9IGN1cnJGaWx0ZXI7XG5cbiAgICAvLyBSZXNldCBkaXNwbGF5IGlmIG5vIGZpbHRlciBhcHBseSAoaW5wdXQgZW1wdHkpIGRvIG5vdGhpbmdcbiAgICBpZiAoZmlsdGVyVmFsdWUgPT09IFwiXCIpIHJldHVybiB0cnVlO1xuXG4gICAgc3dpdGNoIChmaWx0ZXJUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1widGl0bGVcIl0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmaWx0ZXJWYWx1ZSk7XG4gICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgIC8vIE1hdGNoIGFueSBvZiB0aGUgY29tbWEgc2VwYXJhdGVkIG1hdGNoZXNcbiAgICAgICAgICAgIGNvbnN0IGFydGlzdExpc3QgPSBmaWx0ZXJWYWx1ZS5yZXBsYWNlQWxsKFwiIFwiLCBcIlwiKS5zcGxpdCgvWyw7XS8pO1xuICAgICAgICAgICAgcmV0dXJuIGFydGlzdExpc3Quc29tZSgoYXJ0aXN0KSA9PlxuICAgICAgICAgICAgICAgIGFsYnVtW1wiYXJ0aXN0XCJdLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoYXJ0aXN0KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgY2FzZSBcInJlbGVhc2VfeWVhclwiOlxuICAgICAgICAgICAgbGV0IG1hdGNoID0gKHJlZ2V4KSA9PiBmaWx0ZXJWYWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAvLyBSZWdleCBmb3IgeWVhciBmb3IgZGlmZmVyZW50IHJlbGVhc2UgeWVhciBmaWx0ZXJcbiAgICAgICAgICAgIGNvbnN0IHJlZ2V4RXEgPSAvXlxccyooXFxkKylcXHMqJC8sIC8vIFNpbmdsZSB5ZWFyIHZhbHVlXG4gICAgICAgICAgICAgICAgcmVnZXhHdCA9IC8oPzpePlxccz8oXFxkKykkKS8sIC8vIEdyZWF0ZXIgdGhhblxuICAgICAgICAgICAgICAgIHJlZ2V4THQgPSAvKD86XjxcXHM/KFxcZCspJCkvLCAvLyBMb3dlciB0aGFuXG4gICAgICAgICAgICAgICAgcmVnZXhCdHcgPSAvKD86XihcXGQrKVxccz9bLSwvO11cXHM/KFxcZCspJCkvOyAvL1R3byB2YWx1ZXMgaW50ZXJ2YWxcblxuICAgICAgICAgICAgaWYgKG1hdGNoKHJlZ2V4RXEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID09IG1hdGNoKHJlZ2V4RXEpWzFdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEd0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA+PSBtYXRjaChyZWdleEd0KVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2gocmVnZXhMdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhMdClbMV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKHJlZ2V4QnR3KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID49IG1hdGNoKHJlZ2V4QnR3KVsxXSAmJlxuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA8PSBtYXRjaChyZWdleEJ0dylbMl1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAvLyBBbGxvdyB0aGUgdXNlIG9mIGRpZmZlcmVudCB3b3JkcyBmb3IgdHJ1ZSBhbmQgZmFsc2VcbiAgICAgICAgICAgIHN3aXRjaCAoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJzaVwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJzw61cIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiMVwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJvd25lZFwiXTtcbiAgICAgICAgICAgICAgICBjYXNlIFwibm9cIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiMFwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJmb3JtYXRcIjpcbiAgICAgICAgICAgIC8vIEluIHRoaXMgZmlsdGVyIFwiK1wiID0gXCJhbmRcIiBhbmQgXCJbLDsvXVwiID0gXCJvclwiXG4gICAgICAgICAgICBsZXQgZm9ybWF0TGlzdCA9IFtdO1xuICAgICAgICAgICAgaWYgKGZpbHRlclZhbHVlLmluY2x1ZGVzKFwiK1wiKSkge1xuICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5yZXBsYWNlQWxsKFwiIFwiLCBcIlwiKS5zcGxpdChcIitcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdExpc3QuZXZlcnkoXG4gICAgICAgICAgICAgICAgICAgIChmb3JtYXQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImZvcm1hdFwiXS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCkgPT4gdmFsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0TGlzdCA9IGZpbHRlclZhbHVlLnJlcGxhY2VBbGwoXCIgXCIsIFwiXCIpLnNwbGl0KC9bLDsvXS8pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRMaXN0LnNvbWUoXG4gICAgICAgICAgICAgICAgICAgIChmb3JtYXQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImZvcm1hdFwiXS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCkgPT4gdmFsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIC8vIEVsc2UgZG8gbm90aGluZ1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhcHBseUZpbHRlcihlID0gbnVsbCkge1xuICAgIC8vIFByZXZlbnQgZGVmYXVsdCBzdWJtaXQgYmVoYXZpb3VyXG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIFVwZGF0ZSBjdXJyZW50IGZpbHRlciB3aXRoIHZhbHVlcyBmcm9tIHRoZSBmaWx0ZXIgZm9ybVxuICAgIGN1cnJGaWx0ZXJbXCJ0eXBlXCJdID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgIGN1cnJGaWx0ZXJbXCJ2YWx1ZVwiXSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLXZhbHVlXCIpLnZhbHVlO1xuXG4gICAgLy8gVXBkYXRlIHRhYmxlXG4gICAgdXBkYXRlRGlzcGxheSgpO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RGaWx0ZXIoKSB7XG4gICAgLyogVXBkYXRlIHBsYWNlaG9sZGVyIG1lc3NhZ2UgYWNjb3JkaW5nIHRvIHRoZSBzZWxlY3RlZCBvcHRpb24gKi9cbiAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJTZWxlY3QudmFsdWU7XG4gICAgbGV0IHBsYWNlaG9sZGVyID0gXCJcIjtcblxuICAgIHN3aXRjaCAoZmlsdGVyKSB7XG4gICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSAncC4gZWouIFwic3VibWFyaW5lXCInO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJ3AuIGVqLiBcInplcHBlbGluXCIsIFwiYmVhdGxlcywgcm9sbGluZ1wiJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9ICdwLiBlai4gXCIxOTkwXCIsIFwiMS0yMDAwXCIsIFwiPjE5MDBcIiwgXCI8MTk4MFwiJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwib3duZWRcIjpcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJ3AuIGVqLiBcInPDrVwiLCBcIm5vXCInO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb3JtYXRcIjpcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJ3AuIGVqLiBcIlZpbmlsb1wiLCBcImNkK2Nhc2V0ZVwiLCBcInZpbmlsby9DRFwiJztcbiAgICB9XG5cbiAgICBmaWx0ZXJWYWx1ZS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBwbGFjZWhvbGRlcik7XG59XG5cbmZ1bmN0aW9uIHJlc2V0RmlsdGVyKCkge1xuICAgIC8qIFJlc2V0IGZpbHRlciB3aGVuIHRoZSBpbnB1dCBib3ggaXMgZW1wdHkgYW5kIGFwcGx5IGVtcHR5IGZpbHRlciAqL1xuICAgIGNvbnN0IGlucHV0VGV4dCA9IHRoaXMudmFsdWU7XG5cbiAgICBpZiAoaW5wdXRUZXh0ID09PSBcIlwiKSB7XG4gICAgICAgIHNlbGVjdEZpbHRlcigpO1xuICAgICAgICBhcHBseUZpbHRlcigpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyogQVJUSVNUUyBTVUdHRVNUSU9OUyAqL1xuXG5mdW5jdGlvbiBzdWdnZXN0QXJ0aXN0cyhlKSB7XG4gICAgLyogQ29tcHV0ZSBzdWdnZXN0aW9ucyBiYXNlZCBvbiBjdXJyZW50IGlucHV0ICovXG4gICAgY29uc3QgZnVsbEFydGlzdExpc3QgPSBsaWJyYXJ5LmFsYnVtTGlzdC5tYXAoKGFsYnVtKSA9PiBhbGJ1bS5hcnRpc3QpO1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy52YWx1ZTtcblxuICAgIC8vIElmIHVzZXIgY2xlYXJzIGlucHV0LCBkaXNwbGF5IHBsYWNlaG9sZGVyIGFuZCBjbG9zZSBzdWdnZXN0aW9uc1xuICAgIGlmIChpbnB1dCA9PT0gXCJcIikge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIHRoaXMucGxhY2Vob2xkZXIpO1xuICAgICAgICBjbG9zZVN1Z2dlc3Rpb25zKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzdWdnZXN0ZWRBcnRpc3RzID0gZnVsbEFydGlzdExpc3QuZmlsdGVyKChhcnRpc3QpID0+XG4gICAgICAgIGFydGlzdC5pbmNsdWRlcyhpbnB1dClcbiAgICApO1xuXG4gICAgLy8gUmVmcmVzaCBkaXYgYW5kIGRpc3BsYXkgbmV3IHN1Z2dlc3Rpb25zXG4gICAgY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgIGRpc3BsYXlTdWdnZXN0aW9ucyhzdWdnZXN0ZWRBcnRpc3RzLCBpbnB1dCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyU3VnZ2VzdGlvbnMoKSB7XG4gICAgLyogRGVsZXRlIGFsbCBzdWdnZXN0aW9ucyAqL1xuICAgIHdoaWxlIChhcnRpc3RTdWdnZXN0aW9uc0xpc3QubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICBhcnRpc3RTdWdnZXN0aW9uc0xpc3QubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlTdWdnZXN0aW9ucyhzdWdnZXN0ZWRBcnRpc3RzLCBpbnB1dCkge1xuICAgIC8qIERpc3BsYXkgaW5wdXQgc3VnZ2VzdGlvbnMgKi9cbiAgICBpZiAoIXN1Z2dlc3RlZEFydGlzdHMubGVuZ3RoKSB7XG4gICAgICAgIGNsb3NlU3VnZ2VzdGlvbnMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFNob3cgc3VnZ2VzdGlvbnMgZGl2XG4gICAgYXJ0aXN0U3VnZ2VzdGlvbnMuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblxuICAgIC8vIFJlZ2V4IHRvIG1ha2UgbWF0Y2ggYm9sZFxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgKC4qKSgke2lucHV0fSkoLiopYCwgXCJpXCIpO1xuXG4gICAgc3VnZ2VzdGVkQXJ0aXN0cy5mb3JFYWNoKChhcnRpc3QpID0+IHtcbiAgICAgICAgLy8gRm9yIGVhY2ggc3VnZ2VzdGlvbiBhZGQgbGlzdCBlbGVtZW50IGhpZ2hsaWdodGluZyBtYXRjaFxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcblxuICAgICAgICBtYXRjaCA9IGFydGlzdC5tYXRjaChyZWdleCk7XG4gICAgICAgIGxpLmlubmVySFRNTCA9IGAke21hdGNoWzFdfTxzdHJvbmc+JHttYXRjaFsyXX08L3N0cm9uZz4ke21hdGNoWzNdfWA7XG4gICAgICAgIGFydGlzdFN1Z2dlc3Rpb25zTGlzdC5hcHBlbmRDaGlsZChsaSk7XG5cbiAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHNlbGVjdCBzdWdnZXN0aW9uXG4gICAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaG9vc2VTdWdnZXN0aW9uKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY2hvb3NlU3VnZ2VzdGlvbigpIHtcbiAgICAvKiBDaG9vc2Ugc2VsZWN0ZWQgaXRlbSBhbmQgYWRkIGl0IHRvIHRoZSBpbnB1dCAqL1xuICAgIGFydGlzdElucHV0LnZhbHVlID0gdGhpcy50ZXh0Q29udGVudDtcblxuICAgIGNsb3NlU3VnZ2VzdGlvbnMoKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VTdWdnZXN0aW9ucyhlID0gbnVsbCkge1xuICAgIC8qIEhpZGUgc3VnZ2VzdGlvbnMgYm94ICovXG4gICAgaWYgKGUpIHtcbiAgICAgICAgLy8gQXZvaWQgZXZlbiBhc3NvY2lhdGVkIHRvIGRvY3VtZW50IGNsaWNrcyB3aGVuIGNsaWNraW5nIGluIGlucHV0IGJveFxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGFydGlzdElucHV0KSByZXR1cm47XG4gICAgfVxuXG4gICAgY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgIGFydGlzdFN1Z2dlc3Rpb25zLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG59XG5cbi8qIENvbm5lY3QgVUkgRWxlbWVudHMgKi9cblxuLy8gU29ydCB0YWJsZSB3aGVuIGNsaWNraW5nIG9uIGhlYWRlcnNcbnNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNvcnRUYWJsZSk7XG59KTtcblxuLy8gT3BlbiBhbmQgbW9kYWwgd2hlbiBjbGljayBcIk5ldyBBbGJ1bVwiIGJ1dHRvbiBhbmQgXCJYXCIgcmVzcGVjdGl2ZWx5XG5vcGVuTW9kYWxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9wZW5Nb2RhbCk7XG5jbG9zZU1vZGFsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcblxuLy8gU3VibWl0IGFuZCByZXNldCBcIk5ldyBBbGJ1bVwiIGZvcm1cbm5ld0FsYnVtRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHN1Ym1pdE5ld0FsYnVtKTtcbnJlc2V0Rm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZGlzYWJsZUNoZWNrQm94ZXMpO1xuXG4vLyBTdWJtaXQsIHJlc2V0IGFuZCBtb2RpZnkgXCJGaWx0ZXJcIiBmb3JtXG5maWx0ZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXBwbHlGaWx0ZXIpO1xuZmlsdGVyU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgc2VsZWN0RmlsdGVyKTtcbmZpbHRlclZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCByZXNldEZpbHRlcik7XG5cbi8vIEVuYWJsZSBjaGVja2JveGVzIHdoZW4gdXNlciBjbGlja3MgYnV0dG9uIGFuZCBkaXNhYmxlIHdoZW4gbm90XG5vd25zVHJ1ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGVuYWJsZUNoZWNrQm94ZXMpO1xub3duc0ZhbHNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZGlzYWJsZUNoZWNrQm94ZXMpO1xuXG4vLyBTdWdnZXN0IGFydGlzdHMgd2hlbiBpbnB1dGluZyB2YWx1ZXMgb3Igd2hlbiBjbGlja2luZyBpbiBpbnB1dFxuYXJ0aXN0SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHN1Z2dlc3RBcnRpc3RzKTtcbmFydGlzdElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBzdWdnZXN0QXJ0aXN0cyk7XG5cbi8vIENsb3NlIHN1Z2dlc3Rpb25zIGRpdiB3aGVuIGNsaWNraW5nIG91dHNpZGUgc3VnZ2VzdGlvbiBib3hcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZVN1Z2dlc3Rpb25zLCB0cnVlKTtcblxuLy8gZm9yIChsZXQgaSA9IDA7IGkgPD0gODA7IGkgKz0gMikge1xuLy8gICAgIHRlc3RBbGJ1bSA9IG5ldyBBbGJ1bSh7XG4vLyAgICAgICAgIHRpdGxlOiBgdGl0dWxvLSR7cGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDEwMCl9YCxcbi8vICAgICAgICAgYXJ0aXN0OiBgYXJ0aXN0YS0ke3BhcnNlSW50KE1hdGgucmFuZG9tKCkgKiAxMDApfWAsXG4vLyAgICAgICAgIHJlbGVhc2VfeWVhcjogMjAyMCAtIGksXG4vLyAgICAgICAgIG93bmVkOiBCb29sZWFuKHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiAxLjk5KSksXG4vLyAgICAgICAgIGZvcm1hdDogW1wiQ2FzZXR0ZVwiLCBcIkNEXCJdLFxuLy8gICAgIH0pO1xuLy8gICAgIGxpYnJhcnkuYWRkQWxidW0odGVzdEFsYnVtKTtcbi8vIH1cblxuLy8gdXBkYXRlRGlzcGxheSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9