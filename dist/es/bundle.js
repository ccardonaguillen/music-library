/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/album.js":
/*!**********************!*\
  !*** ./src/album.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Album = (
    { title,
      artist,
      release_year,
      owned,
      favorite,
      genre,
      topRS1,
      topRS3,
      discogs,
      wikipedia,
      record_format,
      album_format,
      catalog_num,
      edition_year,
      country,
      record_label,
      matrix,
      condition,
      notes,
      jacket
    }
) => {
    return {
        id: title.toLowerCase().replaceAll(/\W/g, "") +
            artist.toLowerCase().replaceAll(/\W/g, "") +
            release_year,
        title,
        artist,
        release_year,
        owned: Boolean(owned),
        favorite: Boolean(favorite),
        genre: genre || "",
        topRS1: topRS1 || "",
        topRS3: topRS3 || "",
        discogs: discogs || "",
        wikipedia: wikipedia || "",
        record_format: record_format || "",
        album_format: album_format || "",
        catalog_num: catalog_num || "",
        edition_year: edition_year || "",
        country: country || "",
        record_label: record_label || "",
        matrix: matrix || "",
        condition: condition || "",
        notes: notes || "None",
        jacket: jacket || ""
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Album);

/***/ }),

/***/ "./src/events.js":
/*!***********************!*\
  !*** ./src/events.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (fn) {
                fn(data);
            });
        }
    },
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (events);

/***/ }),

/***/ "./src/filter.js":
/*!***********************!*\
  !*** ./src/filter.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "filterController": () => (/* binding */ filterController)
/* harmony export */ });
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _library_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./library.js */ "./src/library.js");



var summaryView = (function () {
    const summary = document.getElementById("entries-count"),
        tableContents = document.querySelector("table > tbody");

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("filterApplied", _render);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("albumAdded", _render);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("albumDeleted", _render);

    function _render() {
        const totalEntries = _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].getAlbumList().length, // Length of library list
            shownEntries = tableContents.childElementCount; // Number of rows in table

        // If there are no albums in the library print welcome message
        summary.textContent =
            totalEntries === 0
                ? "No albums in the library. Add one by clicking the button"
                : `Showing ${shownEntries} out of ${totalEntries} albums`;
    }
})();

var filterController = (function () {
    var currFilter = { type: "", value: "" };
    const filterForm = document.getElementById("filter-by"),
        filterSelect = document.getElementById("filter"),
        filterValue = document.getElementById("filter-value"),
        entriesCount = document.getElementById("entries-count");

    filterSelect.addEventListener("change", _resetFilter);
    filterForm.addEventListener("submit", _applyFilter);
    filterValue.addEventListener("input", _resetFilter);

    function getCurrentFilter() {
        return currFilter;
    }

    function _applyFilter(e = null) {
        // Prevent default submit behaviour
        if (e) e.preventDefault();
    
        // Update current filter with values from the filter form
        currFilter["type"] = filterSelect.value;
        currFilter["value"] = document.getElementById("filter-value").value;
    
        // Update table
        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("filterApplied", currFilter);
    }
    
    function _renderPlaceholder() {
        /* Update placeholder message according to the selected option */
        const filter = filterSelect.value;
        const placeholder = {
            title: 'e.g. "submarine"',
            artist: 'e.g. "zeppelin", "beatles, rolling"',
            release_year: 'e.g. "1990", "1-2000", ">1900", "<1980"',
            owned: 'e.g. "true", "no", "not owned"',
            format: 'e.g. "Vynil", "cd+casette", "vynil/CD"'
        };

        filterValue.placeholder = placeholder[filter];
    }

    function _resetFilter(e) {
        if (e.type === "input" && filterValue.value !== "") return;
        /* Reset filter when the input box is empty and apply empty filter */
        
        filterValue.value = "";
        _renderPlaceholder();
        _applyFilter();
    
    
        return false;
    }    

    return {
        getCurrentFilter,
    }
})();



/***/ }),

/***/ "./src/library.js":
/*!************************!*\
  !*** ./src/library.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events.js */ "./src/events.js");


var musicLibrary = (function () {
    var albumList = [];

    function getAlbumList() {
        return albumList;
    }

    function addAlbum(newAlbum) {
        /* If the albums exists log error message. If not add at the start */
        if (albumList.every((album) => newAlbum.id !== album.id)) {
            albumList.unshift(newAlbum);
        } else {
            alert("This album already exists.");
            console.log("Repeated ID: " + newAlbum.id)
        }
        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumAdded", newAlbum);
    };

    function deleteAlbum(id) {
        /* Delete album with a given ID */
        albumList = albumList.filter((album) => album.id !== id);

        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumDeleted", id);
    }

    function sort({ by, ord = "asc" }) {
        /* Reverse sorting algorithm is ord = 'desc'; */
        let sortOrder = ord === "asc" ? 1 : -1;

        switch (by) {
            case "title":
            case "artist":
                // localeCompare used to compare string without math operators
                albumList.sort(
                    (a, b) => a[by].localeCompare(b[by]) * sortOrder
                );
            case "release_year":
                albumList.sort((a, b) => (a[by] - b[by]) * sortOrder);
        }

        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("librarySorted");
    }

    return {
        getAlbumList,
        addAlbum,
        deleteAlbum,
        sort
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (musicLibrary);



/***/ }),

/***/ "./src/loader.js":
/*!***********************!*\
  !*** ./src/loader.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _album_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./album.js */ "./src/album.js");
/* harmony import */ var _library_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./library.js */ "./src/library.js");



const fileLoader = document.getElementById('file-loader');

fileLoader.addEventListener('change', (event) => {
    const fileList = event.target.files;
    var file = fileList[0];
    readFile(file);
    fileLoader.classList.add("hidden");
  });

function readFile(f) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        var musicCollection = parseAlbumLibrary(event.target.result);
        addCollection(musicCollection)
    });
    reader.readAsText(f, "utf-8");
}

function parseCSV (string, delimiter=",") {
    // Commented code in https://stackoverflow.com/questions/1293147/how-to-parse-csv-data
    var objPattern = new RegExp(
        (
            "(\\" + delimiter + "|\\r?\\n|\\r|^)" +  // Delimiters
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + // Quoted fields
            "([^\"\\" + delimiter + "\\r\\n]*))" // Standard fields
        ), "gi");

    var arrData = [[]];
    var arrMatches = null;

    while (arrMatches = objPattern.exec( string )){
        var strMatchedDelimiter = arrMatches[ 1 ];

        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== delimiter
            ){
            arrData.push( [] );
        }

        var strMatchedValue;
        if (arrMatches[ 2 ]){
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" )
                , "\"" );
        } else {
            strMatchedValue = arrMatches[ 3 ];
        }

        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    return( arrData );
}

function csvToObject (csvContent) {
    var props = csvContent[0];
    var object = [];

    csvContent.slice(1, -1).forEach(row => {
        var item = {};
        row.forEach((val, idx) => {
            item[props[idx]] = val;
        })

        object.push(item);
    });

    return ( object )
}

function parseAlbumLibrary(fileContent) {
    var parsedCSV = parseCSV(fileContent);
    var collection = csvToObject(parsedCSV);

    return collection
};

function addCollection (collection) {
    collection.forEach((album, idx) => {
        var newAlbum = (0,_album_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
            title: album["Nombre"],
            artist: album["Artista"],
            release_year: album["Ano lanzamiento"],
            owned: album["Adquirido"] === "1" ?
                   true :
                   false,
            format: album["Formato"].includes("/") ?
                    album["Formato"].split("/") :
                    [album["Formato"]]
        })

        _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].addAlbum(newAlbum);
    })

    _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].sort({ by: "title", ord: "asc"})
};



/***/ }),

/***/ "./src/modal.js":
/*!**********************!*\
  !*** ./src/modal.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events.js */ "./src/events.js");


var modal = (function () {
    const overlay = document.querySelector(".modal-overlay"), 
        openButton = document.getElementById("open-modal"),
        closeButton = document.getElementById("close-modal");

    openButton.addEventListener("click", _open);
    closeButton.addEventListener("click", _close);

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("newAlbumFormSubmitted", _close);

    function _open() {
        /* Display form modal over main window and focus on first input */
        overlay.classList.remove("hidden");
        document.getElementById("new-title").focus();
    }
    
    function _close() {
        /* Hide modal */
        overlay.classList.add("hidden");
        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("modalClosed");
    }
})();

var newAlbumForm = (function () {
    const form = document.getElementById("add-album"),
        resetButton = document.querySelector('button[type="reset"]'),
        ownsTrue = document.getElementById("owns-true"),
        ownsFalse = document.getElementById("owns-false"),
        checkBoxes = document.getElementsByName("format");

    // Submit and reset "New Album" form
    form.addEventListener("submit", _submitNewAlbum);
    resetButton.addEventListener("click", _disableCheckBoxes);

    // Enable checkboxes when user clicks button and disable when not
    ownsTrue.addEventListener("change", _enableCheckBoxes);
    ownsFalse.addEventListener("change", _disableCheckBoxes);

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("modalClosed", _reset);

    function _reset() {
        form.reset();
        _disableCheckBoxes();
    }
    
    function _disableCheckBoxes() {
        /* Disable format checkboxes */
        checkBoxes.forEach((checkBox) => {
            checkBox.disabled = true;
            checkBox.checked = false;
        });
    }
    
    function _enableCheckBoxes() {
        /* Enable format checkboxes */
        checkBoxes.forEach((checkBox) => {
            checkBox.disabled = false;
        });
    }
    
    function _submitNewAlbum(e) {
        // Prevent default submit action
        e.preventDefault();
    
        // Create new album object and add it to the library
        const newAlbum = Album(_processNewAlbumForm());
        musicLibrary.addAlbum(newAlbum);
    
        // Update table and close form modal
        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("newAlbumFormSubmitted");
    }
    
    function _processNewAlbumForm() {
        /* Process new album form to pass it to new album */
        let formData = new FormData(form);
    
        let formContent = Object.fromEntries(formData.entries());
        formContent["owned"] = formContent["owned"] === "true" ? true : false;
        formContent["format"] = formData.getAll("format");
    
        return formContent;
    }
})();

var artistSuggestions = (function () {
    const input = document.getElementById("new-artist"),
        dropdown = document.querySelector(".suggestions"),
        list = dropdown.firstElementChild;

    // Suggest artists when inputing values or when clicking in input
    input.addEventListener("input", _render);
    input.addEventListener("focus", _render);

    // Close suggestions div when clicking outside suggestion box
    document.addEventListener("click", _close, true);

    function _render(suggestedArtists) {
        const inputValue = input.value;
        // If user clears input, display placeholder and close suggestions
        if (inputValue === "") {
            input.placeholder = input.placeholder;
            _close();
    
            return;
        }
        musicLibrary.getAlbumList().map(
            (album) => album.artist
        );
        // Compute artist suggestions given the current albums in the library
        var suggestions = musicLibrary.getAlbumList().reduce((sugg, album) => {
                const artist = album.artist;
                if (artist.toLowerCase().includes(inputValue.toLowerCase())) {
                    // Avoid duplicates
                    if (sugg.indexOf(artist) === -1 ) sugg.push(artist);
                } 
                return sugg
            }, []);
        if (!suggestions.length) { // Hide dropdown if not suggestions
            _close();
            return;
        }    
        // Refresh div and display new suggestions
        dropdown.classList.remove("hidden");
        _clear();

        // Regex to highlight match
        const regex = new RegExp(`(.*)(${inputValue})(.*)`, "i");
        suggestions.forEach(artist => {
            // For each suggestion add list element highlighting match
            const item = document.createElement("li");
            var match = artist.match(regex);

            item.innerHTML = `${match[1]}<strong>${match[2]}</strong>${match[3]}`;
            list.appendChild(item);
    
            // Add event listener to select suggestion
            item.addEventListener("click", _inputSuggestion);
        });
    }

    function _clear() {
        /* Delete all suggestions */
        while (list.lastElementChild) {
            list.lastElementChild.remove();
        }
    }

    function _close(e = null) {
        /* Hide suggestions box */
        // Do not register clicks in the input box
        if (e && e.target === input) return;
            
        // If the dropdown is already hidden do nothing
        if (!dropdown.classList.contains("hidden")) {
            _clear();
            dropdown.classList.add("hidden");
        }
    }

    function _inputSuggestion() {
        /* Choose selected item and add it to the input */
        input.value = this.textContent;
    
        _close();
    }    
})();




/***/ }),

/***/ "./src/table.js":
/*!**********************!*\
  !*** ./src/table.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _library_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./library.js */ "./src/library.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filter.js */ "./src/filter.js");




var tableView = (function () {
    const contents = document.querySelector("table > tbody");

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("albumAdded", _renderAlbum);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("librarySorted", _update);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("filterApplied", _update);

    function _update() {
        _clear();
        _render();
    }

    function _render() {
        // Apply current filter to album list
        _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].getAlbumList().forEach((album) => {
            _renderAlbum(album);
        });
    }

    function _clear() {
        /* Remove all rows in the table */
        while (contents.lastElementChild) {
            contents.lastElementChild.remove();
        }
    }

    function _renderAlbum(album) {
        // Apply filter. If false do not render
        if (!tableController.filterAlbum(album)) return;
        
        _renderRow(album);
        _renderExtraInfo(album);
    }

    function _renderRow(album) {
        // Create a new row for the album
        const row = document.createElement("tr");
        // Set album attribute as unique identifier for the row
        row.classList.add("album-row");
        row.setAttribute("data-id", album.id);

        // Add album info
        const columns = ["title", "artist", "release_year", "owned", "favorite"];
        for (const prop of columns) {
            const dataCell = document.createElement("td");

            let iconPath
            switch (prop) {
                case "owned":
                    // Print green tick or red cross icon for yes or no resp.
                    // dataCell.textContent = album[prop] ? "Yes" : "No";
                    const ownedIcon = document.createElement('img')
                    ownedIcon.classList.add('owned-icon');
    
                    iconPath =
                        album[prop]
                            ? "check.svg"
                            : "close-red.svg"
                    ownedIcon.src = "../images/" + iconPath;
    
                    dataCell.appendChild(ownedIcon)
                    break;
                case "favorite":
                    if (!album[prop]) break;
                    const favIcon = document.createElement('img')
                    favIcon.classList.add('owned-icon');
    
                    iconPath = "../images/heart.svg";
                    favIcon.src = iconPath;
    
                    dataCell.appendChild(favIcon)
                    break;
                default:
                    dataCell.textContent = album[prop];
                    break;
            }
            row.appendChild(dataCell);
        }
    
        // Create remove-album button
        // const removeButton = _renderRemoveButton(row);
        // row.appendChild(removeButton);
    
        // Append new row
        contents.appendChild(row);
    }

    function _renderExtraInfo(album) {
        const row = document.createElement("tr");
        row.classList.add("hidden", "extra-info");
        const dataCell = document.createElement("td");
        dataCell.setAttribute("colspan", 5);

        const container = document.createElement("div");
        container.classList.add("info-container");

        const albumJacket = document.createElement("img");
        albumJacket.setAttribute("src", album.jacket);
        albumJacket.classList.add("jacket");

        const generalInfo = document.createElement("div");
        generalInfo.classList.add("general-info");
        _renderGeneralInfo(generalInfo, album)
        

        const recordInfo = document.createElement("div");
        recordInfo.classList.add("record-info");
        _renderRecordInfo(recordInfo, album);

        
        container.append(albumJacket);
        container.append(generalInfo);
        container.append(recordInfo);

        dataCell.appendChild(container);
        row.appendChild(dataCell);
        contents.appendChild(row);

        row.previousSibling.addEventListener("click", function() {
            row.classList.toggle("hidden");
        })
    }

    function _renderGeneralInfo(container, album) {
        const fields = [
            {
                key: "genre",
                label: "Genre",
                icon: "",
            },
            {
                key: "topRS1",
                label: "Top500 (RS1)",
                icon: "",
            },
            {
                key: "topRS3",
                label: "Top500 (RS3)",
                icon: "",
            },
        ];

        const urls = [
            {
                key: "discogs",
                label: "Discogs",
                icon: "",
            },
            {
                key: "wikipedia",
                label: "Wikipedia",
                icon: "",
            },
        ];

        fields.forEach((field) => {
            let text = document.createElement("p");
            text.innerHTML = `<strong>${field.label}</strong>: ${
                album[field.key]
            }`;

            container.appendChild(text);
        });

        urls.forEach((url) => {
            let href = document.createElement("a");
            href.setAttribute("href", album[url.key]);
            href.innerHTML = `<strong>${url.label}</strong>`;

            container.appendChild(href);
        });
    }

    // record_format,
    //   album_format,
    //   serial_num,
    //   edition_year,
    //   country,
    //   record_label,
    //   matrix_num,
    //   condition,
    //   comments,
    //   jacket

    function _renderRecordInfo(container, album) {
        const fields = [
            {
                key: "catalog_num",
                label: "Catalog#",
                icon: "",
            },
            {
                key: "record_label",
                label: "Label",
                icon: "",
            },
            {
                key: "country",
                label: "Country",
                icon: "",
            },
            {
                key: "edition_year",
                label: "Edition",
                icon: "",
            },
            {
                key: "matrix",
                label: "Matrix",
                icon: "",
            },
            {
                key: "condition",
                label: "Condition",
                icon: "",
            },
            {
                key: "notes",
                label: "Notes",
                icon: "",
            }
        ];

        let format = document.createElement("p");
        format.innerHTML = `<strong>Format</strong>: ${album.record_format} (${album.album_format})`;
        container.appendChild(format);

        fields.forEach(field => {
            let text = document.createElement("p");
            text.innerHTML = `<strong>${field.label}</strong>: ${album[field.key]}`;

            container.appendChild(text);
        })
    }

    function _renderRemoveButton(row) {
        // Create trashcan button and append it to row
        const dataCell = document.createElement("td");
        const removeButton = document.createElement("button");

        removeButton.classList.add("remove-album", "img-button", "hidden");
        removeButton.title = "Delete Album";

        dataCell.appendChild(removeButton);

        // Connect new row so that remove-icon only appears on hover
        row.addEventListener("mouseenter", function () {
            removeButton.classList.remove("hidden");
        });
        row.addEventListener("mouseleave", function () {
            removeButton.classList.add("hidden");
        });

        // Connect button to removeAlbum function
        removeButton.addEventListener("click", function (){
            const id = row.getAttribute("data-id");
            _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].deleteAlbum(id);
        });

        return dataCell
    }
})();

var tableController = (function () {
    const contents = document.querySelector("table > tbody"),
         sortableHeaders = document.querySelectorAll("table th.sortable");
    var currSorting = { by: "title", ord: "asc" };

    sortableHeaders.forEach((header) => {
        header.addEventListener("click", _sortTable);
    });

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("albumDeleted", _removeRow);

    function _removeRow(id) {
        // Ask confirmation before removing album
        if (!confirm("Are you sure you want to delete this album?")) return;
    
        // Remove row and album from library
        const row = document.querySelector(`tr[data-id=${id}]`)
        
        contents.removeChild(row);
    }

    function _sortTable(e) {
        const header = e.currentTarget;
        const newSortBy = header.getAttribute("value");
        const { by: sortBy, ord: sortOrd } = currSorting;
    
        // If sorting new row flip row order, else row order as asc as default
        if (newSortBy === sortBy) {
            currSorting.ord = sortOrd === "asc" ? "desc" : "asc";
        } else {
            currSorting.by = newSortBy;
            currSorting.ord = "asc";
        }
    
        // Sort library albums;
        _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].sort(currSorting);
    
        // Remove all sorting arrows and display the corresponding one
        _hideSortingArrows();
        _renderSortingArrow(header);
    }
    
    function _renderSortingArrow(header) {
        /* Add sorting arrows with the correpsonding order in the clicked header */
        const sortArrow = header.querySelector(".sort-arrow");

        sortArrow.classList.add(currSorting.ord);
        sortArrow.classList.remove("hidden");
    }
    
    function _hideSortingArrows() {
        /* Remove all sorting arrows form all headers */
        sortableHeaders.forEach((header) => {
            const sortArrow = header.querySelector(".sort-arrow");
    
            sortArrow.classList.add("hidden");
            sortArrow.classList.remove("asc");
            sortArrow.classList.remove("desc");
        });
    }

    function _resetSorting() {
        currSorting = { by: "title", ord: "asc" };

        _hideSortingArrows();
        _renderSortingArrow(header);
    }

    function filterAlbum(album) {
        var currFilter = _filter_js__WEBPACK_IMPORTED_MODULE_2__.filterController.getCurrentFilter();
        var { type: filterType, value: filterValue } = currFilter;
    
        // Reset display if no filter apply (input empty) do nothing
        if (filterValue === "") return true;
    
        switch (filterType) {
            case "title":
                return album["title"].toLowerCase().includes(filterValue.toLowerCase());
            case "artist":
                // Match any of the comma separated matches
                const artistList = filterValue.split(/\s*[,;]\s*/);
                return artistList.some((artist) =>
                    album["artist"].toLowerCase().includes(artist.toLowerCase())
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
                    formatList = filterValue.split(/\s*\+\s*/);
                    return formatList.every(
                        (format) =>
                            album["format"].findIndex(
                                (val) => val.toLowerCase() === format.toLowerCase()
                            ) != -1
                    );
                } else {
                    formatList = filterValue.split(/\s*[,;/]\s*/);
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

    return {
        filterAlbum
    }
})();


/***/ }),

/***/ "./album_sample.json":
/*!***************************!*\
  !*** ./album_sample.json ***!
  \***************************/
/***/ ((module) => {

module.exports = JSON.parse('{"one":{"title":"Yellow Submarine","artist":"The Beatles","release_year":1969,"owned":true,"favorite":false,"genre":"Rock","topRS1":254,"topRS3":324,"discogs":"https://www.discogs.com/es/release/651180-The-Beatles-Yellow-Submarine","wikipedia":"https://en.wikipedia.org/wiki/Yellow_Submarine_(album)","record_format":"Vynil","album_format":"LP, Album","edition_year":1969,"catalog_num":"1C 062-04 002","record_label":"Apple Records","country":"Germany","matrix":"YEX 715-1","condition":8,"notes":"Small defect on the cover","jacket":"https://i.discogs.com/-txGlfuZqxJ9j8tFkntqpiBd_LI4CiRT7LS7yRV_Pqs/rs:fit/g:sm/q:90/h:594/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY1MTE4/MC0xNjA0MDgzNjQw/LTk2NTkuanBlZw.jpeg"},"two":{"title":"Sticky Fingers","artist":"Rolling Stongs","release_year":1971,"owned":false,"favorite":false,"genre":"Rock","topRS1":100,"topRS3":231,"discogs":"https://www.discogs.com/es/release/651180-The-Beatles-Yellow-Submarine","wikipedia":"https://en.wikipedia.org/wiki/Yellow_Submarine_(album)","record_format":"","album_format":"","edition_year":"","catalog_num":"","record_label":"","country":"","matrix":"","condition":"","notes":"","jacket":"https://i.discogs.com/-txGlfuZqxJ9j8tFkntqpiBd_LI4CiRT7LS7yRV_Pqs/rs:fit/g:sm/q:90/h:594/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY1MTE4/MC0xNjA0MDgzNjQw/LTk2NTkuanBlZw.jpeg"},"three":{"title":"Favourite Worst Nightmare","artist":"Arctic Monkeys","release_year":2007,"owned":true,"favorite":true,"genre":"Rock","discogs":"https://www.discogs.com/es/release/651180-The-Beatles-Yellow-Submarine","wikipedia":"https://en.wikipedia.org/wiki/Yellow_Submarine_(album)","record_format":"Vynil","album_format":"LP, Album","edition_year":1969,"catalog_num":"1C 062-04 002","record_label":"Apple Records","country":"Germany","matrix":"YEX 715-1","condition":8,"notes":"Small defect on the cover","jacket":"https://i.discogs.com/-txGlfuZqxJ9j8tFkntqpiBd_LI4CiRT7LS7yRV_Pqs/rs:fit/g:sm/q:90/h:594/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY1MTE4/MC0xNjA0MDgzNjQw/LTk2NTkuanBlZw.jpeg"},"four":{"title":"Boys Don\'t Cry","artist":"The Cure","release_year":1980,"owned":true,"favorite":true,"genre":"Rock","topRS1":254,"topRS3":324,"discogs":"https://www.discogs.com/es/release/651180-The-Beatles-Yellow-Submarine","wikipedia":"https://en.wikipedia.org/wiki/Yellow_Submarine_(album)","record_format":"Vynil","album_format":"LP, Album","edition_year":1969,"catalog_num":"1C 062-04 002","record_label":"Apple Records","country":"Germany","matrix":"YEX 715-1","condition":8,"notes":"Small defect on the cover","jacket":"https://i.discogs.com/-txGlfuZqxJ9j8tFkntqpiBd_LI4CiRT7LS7yRV_Pqs/rs:fit/g:sm/q:90/h:594/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY1MTE4/MC0xNjA0MDgzNjQw/LTk2NTkuanBlZw.jpeg"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _table_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table.js */ "./src/table.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter.js */ "./src/filter.js");
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal.js */ "./src/modal.js");
/* harmony import */ var _loader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loader.js */ "./src/loader.js");
/* harmony import */ var _library_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./library.js */ "./src/library.js");
/* harmony import */ var _album_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./album.js */ "./src/album.js");








var sample = __webpack_require__(/*! ../album_sample.json */ "./album_sample.json")

for (const key in sample) {
    if (Object.hasOwnProperty.call(sample, key)) {
        var newAlbum = (0,_album_js__WEBPACK_IMPORTED_MODULE_5__["default"])(sample[key]);
        _library_js__WEBPACK_IMPORTED_MODULE_4__["default"].addAlbum(newAlbum);
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1CO0FBQ0M7QUFDRDtBQUNDOztBQUVvQjtBQUNUOztBQUUvQixhQUFhLG1CQUFPLENBQUMsaURBQXNCOztBQUUzQztBQUNBO0FBQ0EsdUJBQXVCLHFEQUFLO0FBQzVCLFFBQVEsNERBQXFCO0FBQzdCO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2FsYnVtLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvZXZlbnRzLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvZmlsdGVyLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvbGlicmFyeS5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2xvYWRlci5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL21vZGFsLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvdGFibGUuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIEFsYnVtID0gKFxuICAgIHsgdGl0bGUsXG4gICAgICBhcnRpc3QsXG4gICAgICByZWxlYXNlX3llYXIsXG4gICAgICBvd25lZCxcbiAgICAgIGZhdm9yaXRlLFxuICAgICAgZ2VucmUsXG4gICAgICB0b3BSUzEsXG4gICAgICB0b3BSUzMsXG4gICAgICBkaXNjb2dzLFxuICAgICAgd2lraXBlZGlhLFxuICAgICAgcmVjb3JkX2Zvcm1hdCxcbiAgICAgIGFsYnVtX2Zvcm1hdCxcbiAgICAgIGNhdGFsb2dfbnVtLFxuICAgICAgZWRpdGlvbl95ZWFyLFxuICAgICAgY291bnRyeSxcbiAgICAgIHJlY29yZF9sYWJlbCxcbiAgICAgIG1hdHJpeCxcbiAgICAgIGNvbmRpdGlvbixcbiAgICAgIG5vdGVzLFxuICAgICAgamFja2V0XG4gICAgfVxuKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHRpdGxlLnRvTG93ZXJDYXNlKCkucmVwbGFjZUFsbCgvXFxXL2csIFwiXCIpICtcbiAgICAgICAgICAgIGFydGlzdC50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoL1xcVy9nLCBcIlwiKSArXG4gICAgICAgICAgICByZWxlYXNlX3llYXIsXG4gICAgICAgIHRpdGxlLFxuICAgICAgICBhcnRpc3QsXG4gICAgICAgIHJlbGVhc2VfeWVhcixcbiAgICAgICAgb3duZWQ6IEJvb2xlYW4ob3duZWQpLFxuICAgICAgICBmYXZvcml0ZTogQm9vbGVhbihmYXZvcml0ZSksXG4gICAgICAgIGdlbnJlOiBnZW5yZSB8fCBcIlwiLFxuICAgICAgICB0b3BSUzE6IHRvcFJTMSB8fCBcIlwiLFxuICAgICAgICB0b3BSUzM6IHRvcFJTMyB8fCBcIlwiLFxuICAgICAgICBkaXNjb2dzOiBkaXNjb2dzIHx8IFwiXCIsXG4gICAgICAgIHdpa2lwZWRpYTogd2lraXBlZGlhIHx8IFwiXCIsXG4gICAgICAgIHJlY29yZF9mb3JtYXQ6IHJlY29yZF9mb3JtYXQgfHwgXCJcIixcbiAgICAgICAgYWxidW1fZm9ybWF0OiBhbGJ1bV9mb3JtYXQgfHwgXCJcIixcbiAgICAgICAgY2F0YWxvZ19udW06IGNhdGFsb2dfbnVtIHx8IFwiXCIsXG4gICAgICAgIGVkaXRpb25feWVhcjogZWRpdGlvbl95ZWFyIHx8IFwiXCIsXG4gICAgICAgIGNvdW50cnk6IGNvdW50cnkgfHwgXCJcIixcbiAgICAgICAgcmVjb3JkX2xhYmVsOiByZWNvcmRfbGFiZWwgfHwgXCJcIixcbiAgICAgICAgbWF0cml4OiBtYXRyaXggfHwgXCJcIixcbiAgICAgICAgY29uZGl0aW9uOiBjb25kaXRpb24gfHwgXCJcIixcbiAgICAgICAgbm90ZXM6IG5vdGVzIHx8IFwiTm9uZVwiLFxuICAgICAgICBqYWNrZXQ6IGphY2tldCB8fCBcIlwiXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxidW0iLCJ2YXIgZXZlbnRzID0ge1xuICAgIGV2ZW50czoge30sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmbihkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50cyIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxudmFyIHN1bW1hcnlWaWV3ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbnRyaWVzLWNvdW50XCIpLFxuICAgICAgICB0YWJsZUNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIik7XG5cbiAgICBldmVudHMub24oXCJmaWx0ZXJBcHBsaWVkXCIsIF9yZW5kZXIpO1xuICAgIGV2ZW50cy5vbihcImFsYnVtQWRkZWRcIiwgX3JlbmRlcik7XG4gICAgZXZlbnRzLm9uKFwiYWxidW1EZWxldGVkXCIsIF9yZW5kZXIpO1xuXG4gICAgZnVuY3Rpb24gX3JlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdG90YWxFbnRyaWVzID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLmxlbmd0aCwgLy8gTGVuZ3RoIG9mIGxpYnJhcnkgbGlzdFxuICAgICAgICAgICAgc2hvd25FbnRyaWVzID0gdGFibGVDb250ZW50cy5jaGlsZEVsZW1lbnRDb3VudDsgLy8gTnVtYmVyIG9mIHJvd3MgaW4gdGFibGVcblxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gYWxidW1zIGluIHRoZSBsaWJyYXJ5IHByaW50IHdlbGNvbWUgbWVzc2FnZVxuICAgICAgICBzdW1tYXJ5LnRleHRDb250ZW50ID1cbiAgICAgICAgICAgIHRvdGFsRW50cmllcyA9PT0gMFxuICAgICAgICAgICAgICAgID8gXCJObyBhbGJ1bXMgaW4gdGhlIGxpYnJhcnkuIEFkZCBvbmUgYnkgY2xpY2tpbmcgdGhlIGJ1dHRvblwiXG4gICAgICAgICAgICAgICAgOiBgU2hvd2luZyAke3Nob3duRW50cmllc30gb3V0IG9mICR7dG90YWxFbnRyaWVzfSBhbGJ1bXNgO1xuICAgIH1cbn0pKCk7XG5cbnZhciBmaWx0ZXJDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VyckZpbHRlciA9IHsgdHlwZTogXCJcIiwgdmFsdWU6IFwiXCIgfTtcbiAgICBjb25zdCBmaWx0ZXJGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItYnlcIiksXG4gICAgICAgIGZpbHRlclNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyXCIpLFxuICAgICAgICBmaWx0ZXJWYWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLXZhbHVlXCIpLFxuICAgICAgICBlbnRyaWVzQ291bnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVudHJpZXMtY291bnRcIik7XG5cbiAgICBmaWx0ZXJTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfcmVzZXRGaWx0ZXIpO1xuICAgIGZpbHRlckZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBfYXBwbHlGaWx0ZXIpO1xuICAgIGZpbHRlclZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfcmVzZXRGaWx0ZXIpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudEZpbHRlcigpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJGaWx0ZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FwcGx5RmlsdGVyKGUgPSBudWxsKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBzdWJtaXQgYmVoYXZpb3VyXG4gICAgICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgXG4gICAgICAgIC8vIFVwZGF0ZSBjdXJyZW50IGZpbHRlciB3aXRoIHZhbHVlcyBmcm9tIHRoZSBmaWx0ZXIgZm9ybVxuICAgICAgICBjdXJyRmlsdGVyW1widHlwZVwiXSA9IGZpbHRlclNlbGVjdC52YWx1ZTtcbiAgICAgICAgY3VyckZpbHRlcltcInZhbHVlXCJdID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItdmFsdWVcIikudmFsdWU7XG4gICAgXG4gICAgICAgIC8vIFVwZGF0ZSB0YWJsZVxuICAgICAgICBldmVudHMuZW1pdChcImZpbHRlckFwcGxpZWRcIiwgY3VyckZpbHRlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJQbGFjZWhvbGRlcigpIHtcbiAgICAgICAgLyogVXBkYXRlIHBsYWNlaG9sZGVyIG1lc3NhZ2UgYWNjb3JkaW5nIHRvIHRoZSBzZWxlY3RlZCBvcHRpb24gKi9cbiAgICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnZS5nLiBcInN1Ym1hcmluZVwiJyxcbiAgICAgICAgICAgIGFydGlzdDogJ2UuZy4gXCJ6ZXBwZWxpblwiLCBcImJlYXRsZXMsIHJvbGxpbmdcIicsXG4gICAgICAgICAgICByZWxlYXNlX3llYXI6ICdlLmcuIFwiMTk5MFwiLCBcIjEtMjAwMFwiLCBcIj4xOTAwXCIsIFwiPDE5ODBcIicsXG4gICAgICAgICAgICBvd25lZDogJ2UuZy4gXCJ0cnVlXCIsIFwibm9cIiwgXCJub3Qgb3duZWRcIicsXG4gICAgICAgICAgICBmb3JtYXQ6ICdlLmcuIFwiVnluaWxcIiwgXCJjZCtjYXNldHRlXCIsIFwidnluaWwvQ0RcIidcbiAgICAgICAgfTtcblxuICAgICAgICBmaWx0ZXJWYWx1ZS5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyW2ZpbHRlcl07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3Jlc2V0RmlsdGVyKGUpIHtcbiAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJpbnB1dFwiICYmIGZpbHRlclZhbHVlLnZhbHVlICE9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIC8qIFJlc2V0IGZpbHRlciB3aGVuIHRoZSBpbnB1dCBib3ggaXMgZW1wdHkgYW5kIGFwcGx5IGVtcHR5IGZpbHRlciAqL1xuICAgICAgICBcbiAgICAgICAgZmlsdGVyVmFsdWUudmFsdWUgPSBcIlwiO1xuICAgICAgICBfcmVuZGVyUGxhY2Vob2xkZXIoKTtcbiAgICAgICAgX2FwcGx5RmlsdGVyKCk7XG4gICAgXG4gICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9ICAgIFxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Q3VycmVudEZpbHRlcixcbiAgICB9XG59KSgpO1xuXG5leHBvcnQgeyBmaWx0ZXJDb250cm9sbGVyIH0iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiXG5cbnZhciBtdXNpY0xpYnJhcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbGJ1bUxpc3QgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGdldEFsYnVtTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIGFsYnVtTGlzdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRBbGJ1bShuZXdBbGJ1bSkge1xuICAgICAgICAvKiBJZiB0aGUgYWxidW1zIGV4aXN0cyBsb2cgZXJyb3IgbWVzc2FnZS4gSWYgbm90IGFkZCBhdCB0aGUgc3RhcnQgKi9cbiAgICAgICAgaWYgKGFsYnVtTGlzdC5ldmVyeSgoYWxidW0pID0+IG5ld0FsYnVtLmlkICE9PSBhbGJ1bS5pZCkpIHtcbiAgICAgICAgICAgIGFsYnVtTGlzdC51bnNoaWZ0KG5ld0FsYnVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiVGhpcyBhbGJ1bSBhbHJlYWR5IGV4aXN0cy5cIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGVhdGVkIElEOiBcIiArIG5ld0FsYnVtLmlkKVxuICAgICAgICB9XG4gICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1BZGRlZFwiLCBuZXdBbGJ1bSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUFsYnVtKGlkKSB7XG4gICAgICAgIC8qIERlbGV0ZSBhbGJ1bSB3aXRoIGEgZ2l2ZW4gSUQgKi9cbiAgICAgICAgYWxidW1MaXN0ID0gYWxidW1MaXN0LmZpbHRlcigoYWxidW0pID0+IGFsYnVtLmlkICE9PSBpZCk7XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bURlbGV0ZWRcIiwgaWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNvcnQoeyBieSwgb3JkID0gXCJhc2NcIiB9KSB7XG4gICAgICAgIC8qIFJldmVyc2Ugc29ydGluZyBhbGdvcml0aG0gaXMgb3JkID0gJ2Rlc2MnOyAqL1xuICAgICAgICBsZXQgc29ydE9yZGVyID0gb3JkID09PSBcImFzY1wiID8gMSA6IC0xO1xuXG4gICAgICAgIHN3aXRjaCAoYnkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgY2FzZSBcImFydGlzdFwiOlxuICAgICAgICAgICAgICAgIC8vIGxvY2FsZUNvbXBhcmUgdXNlZCB0byBjb21wYXJlIHN0cmluZyB3aXRob3V0IG1hdGggb3BlcmF0b3JzXG4gICAgICAgICAgICAgICAgYWxidW1MaXN0LnNvcnQoXG4gICAgICAgICAgICAgICAgICAgIChhLCBiKSA9PiBhW2J5XS5sb2NhbGVDb21wYXJlKGJbYnldKSAqIHNvcnRPcmRlclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICAgICAgYWxidW1MaXN0LnNvcnQoKGEsIGIpID0+IChhW2J5XSAtIGJbYnldKSAqIHNvcnRPcmRlcik7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudHMuZW1pdChcImxpYnJhcnlTb3J0ZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0QWxidW1MaXN0LFxuICAgICAgICBhZGRBbGJ1bSxcbiAgICAgICAgZGVsZXRlQWxidW0sXG4gICAgICAgIHNvcnRcbiAgICB9XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBtdXNpY0xpYnJhcnlcblxuIiwiaW1wb3J0IEFsYnVtIGZyb20gXCIuL2FsYnVtLmpzXCJcbmltcG9ydCBtdXNpY0xpYnJhcnkgZnJvbSBcIi4vbGlicmFyeS5qc1wiXG5cbmNvbnN0IGZpbGVMb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1sb2FkZXInKTtcblxuZmlsZUxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlTGlzdCA9IGV2ZW50LnRhcmdldC5maWxlcztcbiAgICB2YXIgZmlsZSA9IGZpbGVMaXN0WzBdO1xuICAgIHJlYWRGaWxlKGZpbGUpO1xuICAgIGZpbGVMb2FkZXIuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgfSk7XG5cbmZ1bmN0aW9uIHJlYWRGaWxlKGYpIHtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHZhciBtdXNpY0NvbGxlY3Rpb24gPSBwYXJzZUFsYnVtTGlicmFyeShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgYWRkQ29sbGVjdGlvbihtdXNpY0NvbGxlY3Rpb24pXG4gICAgfSk7XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZiwgXCJ1dGYtOFwiKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDU1YgKHN0cmluZywgZGVsaW1pdGVyPVwiLFwiKSB7XG4gICAgLy8gQ29tbWVudGVkIGNvZGUgaW4gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI5MzE0Ny9ob3ctdG8tcGFyc2UtY3N2LWRhdGFcbiAgICB2YXIgb2JqUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAgIChcbiAgICAgICAgICAgIFwiKFxcXFxcIiArIGRlbGltaXRlciArIFwifFxcXFxyP1xcXFxufFxcXFxyfF4pXCIgKyAgLy8gRGVsaW1pdGVyc1xuICAgICAgICAgICAgXCIoPzpcXFwiKFteXFxcIl0qKD86XFxcIlxcXCJbXlxcXCJdKikqKVxcXCJ8XCIgKyAvLyBRdW90ZWQgZmllbGRzXG4gICAgICAgICAgICBcIihbXlxcXCJcXFxcXCIgKyBkZWxpbWl0ZXIgKyBcIlxcXFxyXFxcXG5dKikpXCIgLy8gU3RhbmRhcmQgZmllbGRzXG4gICAgICAgICksIFwiZ2lcIik7XG5cbiAgICB2YXIgYXJyRGF0YSA9IFtbXV07XG4gICAgdmFyIGFyck1hdGNoZXMgPSBudWxsO1xuXG4gICAgd2hpbGUgKGFyck1hdGNoZXMgPSBvYmpQYXR0ZXJuLmV4ZWMoIHN0cmluZyApKXtcbiAgICAgICAgdmFyIHN0ck1hdGNoZWREZWxpbWl0ZXIgPSBhcnJNYXRjaGVzWyAxIF07XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlci5sZW5ndGggJiZcbiAgICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIgIT09IGRlbGltaXRlclxuICAgICAgICAgICAgKXtcbiAgICAgICAgICAgIGFyckRhdGEucHVzaCggW10gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHJNYXRjaGVkVmFsdWU7XG4gICAgICAgIGlmIChhcnJNYXRjaGVzWyAyIF0pe1xuICAgICAgICAgICAgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMiBdLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgbmV3IFJlZ0V4cCggXCJcXFwiXFxcIlwiLCBcImdcIiApXG4gICAgICAgICAgICAgICAgLCBcIlxcXCJcIiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMyBdO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJyRGF0YVsgYXJyRGF0YS5sZW5ndGggLSAxIF0ucHVzaCggc3RyTWF0Y2hlZFZhbHVlICk7XG4gICAgfVxuXG4gICAgcmV0dXJuKCBhcnJEYXRhICk7XG59XG5cbmZ1bmN0aW9uIGNzdlRvT2JqZWN0IChjc3ZDb250ZW50KSB7XG4gICAgdmFyIHByb3BzID0gY3N2Q29udGVudFswXTtcbiAgICB2YXIgb2JqZWN0ID0gW107XG5cbiAgICBjc3ZDb250ZW50LnNsaWNlKDEsIC0xKS5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgIHZhciBpdGVtID0ge307XG4gICAgICAgIHJvdy5mb3JFYWNoKCh2YWwsIGlkeCkgPT4ge1xuICAgICAgICAgICAgaXRlbVtwcm9wc1tpZHhdXSA9IHZhbDtcbiAgICAgICAgfSlcblxuICAgICAgICBvYmplY3QucHVzaChpdGVtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoIG9iamVjdCApXG59XG5cbmZ1bmN0aW9uIHBhcnNlQWxidW1MaWJyYXJ5KGZpbGVDb250ZW50KSB7XG4gICAgdmFyIHBhcnNlZENTViA9IHBhcnNlQ1NWKGZpbGVDb250ZW50KTtcbiAgICB2YXIgY29sbGVjdGlvbiA9IGNzdlRvT2JqZWN0KHBhcnNlZENTVik7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvblxufTtcblxuZnVuY3Rpb24gYWRkQ29sbGVjdGlvbiAoY29sbGVjdGlvbikge1xuICAgIGNvbGxlY3Rpb24uZm9yRWFjaCgoYWxidW0sIGlkeCkgPT4ge1xuICAgICAgICB2YXIgbmV3QWxidW0gPSBBbGJ1bSh7XG4gICAgICAgICAgICB0aXRsZTogYWxidW1bXCJOb21icmVcIl0sXG4gICAgICAgICAgICBhcnRpc3Q6IGFsYnVtW1wiQXJ0aXN0YVwiXSxcbiAgICAgICAgICAgIHJlbGVhc2VfeWVhcjogYWxidW1bXCJBbm8gbGFuemFtaWVudG9cIl0sXG4gICAgICAgICAgICBvd25lZDogYWxidW1bXCJBZHF1aXJpZG9cIl0gPT09IFwiMVwiID9cbiAgICAgICAgICAgICAgICAgICB0cnVlIDpcbiAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIGZvcm1hdDogYWxidW1bXCJGb3JtYXRvXCJdLmluY2x1ZGVzKFwiL1wiKSA/XG4gICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiRm9ybWF0b1wiXS5zcGxpdChcIi9cIikgOlxuICAgICAgICAgICAgICAgICAgICBbYWxidW1bXCJGb3JtYXRvXCJdXVxuICAgICAgICB9KVxuXG4gICAgICAgIG11c2ljTGlicmFyeS5hZGRBbGJ1bShuZXdBbGJ1bSk7XG4gICAgfSlcblxuICAgIG11c2ljTGlicmFyeS5zb3J0KHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wifSlcbn07XG5cbiIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCI7XG5cbnZhciBtb2RhbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtb3ZlcmxheVwiKSwgXG4gICAgICAgIG9wZW5CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbW9kYWxcIiksXG4gICAgICAgIGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZS1tb2RhbFwiKTtcblxuICAgIG9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9vcGVuKTtcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2Nsb3NlKTtcblxuICAgIGV2ZW50cy5vbihcIm5ld0FsYnVtRm9ybVN1Ym1pdHRlZFwiLCBfY2xvc2UpO1xuXG4gICAgZnVuY3Rpb24gX29wZW4oKSB7XG4gICAgICAgIC8qIERpc3BsYXkgZm9ybSBtb2RhbCBvdmVyIG1haW4gd2luZG93IGFuZCBmb2N1cyBvbiBmaXJzdCBpbnB1dCAqL1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRpdGxlXCIpLmZvY3VzKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9jbG9zZSgpIHtcbiAgICAgICAgLyogSGlkZSBtb2RhbCAqL1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGV2ZW50cy5lbWl0KFwibW9kYWxDbG9zZWRcIik7XG4gICAgfVxufSkoKTtcblxudmFyIG5ld0FsYnVtRm9ybSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLWFsYnVtXCIpLFxuICAgICAgICByZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwicmVzZXRcIl0nKSxcbiAgICAgICAgb3duc1RydWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm93bnMtdHJ1ZVwiKSxcbiAgICAgICAgb3duc0ZhbHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvd25zLWZhbHNlXCIpLFxuICAgICAgICBjaGVja0JveGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJmb3JtYXRcIik7XG5cbiAgICAvLyBTdWJtaXQgYW5kIHJlc2V0IFwiTmV3IEFsYnVtXCIgZm9ybVxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBfc3VibWl0TmV3QWxidW0pO1xuICAgIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfZGlzYWJsZUNoZWNrQm94ZXMpO1xuXG4gICAgLy8gRW5hYmxlIGNoZWNrYm94ZXMgd2hlbiB1c2VyIGNsaWNrcyBidXR0b24gYW5kIGRpc2FibGUgd2hlbiBub3RcbiAgICBvd25zVHJ1ZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIF9lbmFibGVDaGVja0JveGVzKTtcbiAgICBvd25zRmFsc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfZGlzYWJsZUNoZWNrQm94ZXMpO1xuXG4gICAgZXZlbnRzLm9uKFwibW9kYWxDbG9zZWRcIiwgX3Jlc2V0KTtcblxuICAgIGZ1bmN0aW9uIF9yZXNldCgpIHtcbiAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICBfZGlzYWJsZUNoZWNrQm94ZXMoKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX2Rpc2FibGVDaGVja0JveGVzKCkge1xuICAgICAgICAvKiBEaXNhYmxlIGZvcm1hdCBjaGVja2JveGVzICovXG4gICAgICAgIGNoZWNrQm94ZXMuZm9yRWFjaCgoY2hlY2tCb3gpID0+IHtcbiAgICAgICAgICAgIGNoZWNrQm94LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNoZWNrQm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9lbmFibGVDaGVja0JveGVzKCkge1xuICAgICAgICAvKiBFbmFibGUgZm9ybWF0IGNoZWNrYm94ZXMgKi9cbiAgICAgICAgY2hlY2tCb3hlcy5mb3JFYWNoKChjaGVja0JveCkgPT4ge1xuICAgICAgICAgICAgY2hlY2tCb3guZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9zdWJtaXROZXdBbGJ1bShlKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBzdWJtaXQgYWN0aW9uXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBhbGJ1bSBvYmplY3QgYW5kIGFkZCBpdCB0byB0aGUgbGlicmFyeVxuICAgICAgICBjb25zdCBuZXdBbGJ1bSA9IEFsYnVtKF9wcm9jZXNzTmV3QWxidW1Gb3JtKCkpO1xuICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgIFxuICAgICAgICAvLyBVcGRhdGUgdGFibGUgYW5kIGNsb3NlIGZvcm0gbW9kYWxcbiAgICAgICAgZXZlbnRzLmVtaXQoXCJuZXdBbGJ1bUZvcm1TdWJtaXR0ZWRcIik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9wcm9jZXNzTmV3QWxidW1Gb3JtKCkge1xuICAgICAgICAvKiBQcm9jZXNzIG5ldyBhbGJ1bSBmb3JtIHRvIHBhc3MgaXQgdG8gbmV3IGFsYnVtICovXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcbiAgICBcbiAgICAgICAgbGV0IGZvcm1Db250ZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKGZvcm1EYXRhLmVudHJpZXMoKSk7XG4gICAgICAgIGZvcm1Db250ZW50W1wib3duZWRcIl0gPSBmb3JtQ29udGVudFtcIm93bmVkXCJdID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgZm9ybUNvbnRlbnRbXCJmb3JtYXRcIl0gPSBmb3JtRGF0YS5nZXRBbGwoXCJmb3JtYXRcIik7XG4gICAgXG4gICAgICAgIHJldHVybiBmb3JtQ29udGVudDtcbiAgICB9XG59KSgpO1xuXG52YXIgYXJ0aXN0U3VnZ2VzdGlvbnMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYXJ0aXN0XCIpLFxuICAgICAgICBkcm9wZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIiksXG4gICAgICAgIGxpc3QgPSBkcm9wZG93bi5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIC8vIFN1Z2dlc3QgYXJ0aXN0cyB3aGVuIGlucHV0aW5nIHZhbHVlcyBvciB3aGVuIGNsaWNraW5nIGluIGlucHV0XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9yZW5kZXIpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBfcmVuZGVyKTtcblxuICAgIC8vIENsb3NlIHN1Z2dlc3Rpb25zIGRpdiB3aGVuIGNsaWNraW5nIG91dHNpZGUgc3VnZ2VzdGlvbiBib3hcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2Nsb3NlLCB0cnVlKTtcblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoc3VnZ2VzdGVkQXJ0aXN0cykge1xuICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgICAgIC8vIElmIHVzZXIgY2xlYXJzIGlucHV0LCBkaXNwbGF5IHBsYWNlaG9sZGVyIGFuZCBjbG9zZSBzdWdnZXN0aW9uc1xuICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBpbnB1dC5wbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIF9jbG9zZSgpO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5tYXAoXG4gICAgICAgICAgICAoYWxidW0pID0+IGFsYnVtLmFydGlzdFxuICAgICAgICApO1xuICAgICAgICAvLyBDb21wdXRlIGFydGlzdCBzdWdnZXN0aW9ucyBnaXZlbiB0aGUgY3VycmVudCBhbGJ1bXMgaW4gdGhlIGxpYnJhcnlcbiAgICAgICAgdmFyIHN1Z2dlc3Rpb25zID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLnJlZHVjZSgoc3VnZywgYWxidW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnRpc3QgPSBhbGJ1bS5hcnRpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKGFydGlzdC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGlucHV0VmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3VnZy5pbmRleE9mKGFydGlzdCkgPT09IC0xICkgc3VnZy5wdXNoKGFydGlzdCk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VnZ1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICBpZiAoIXN1Z2dlc3Rpb25zLmxlbmd0aCkgeyAvLyBIaWRlIGRyb3Bkb3duIGlmIG5vdCBzdWdnZXN0aW9uc1xuICAgICAgICAgICAgX2Nsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gICAgXG4gICAgICAgIC8vIFJlZnJlc2ggZGl2IGFuZCBkaXNwbGF5IG5ldyBzdWdnZXN0aW9uc1xuICAgICAgICBkcm9wZG93bi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICBfY2xlYXIoKTtcblxuICAgICAgICAvLyBSZWdleCB0byBoaWdobGlnaHQgbWF0Y2hcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGAoLiopKCR7aW5wdXRWYWx1ZX0pKC4qKWAsIFwiaVwiKTtcbiAgICAgICAgc3VnZ2VzdGlvbnMuZm9yRWFjaChhcnRpc3QgPT4ge1xuICAgICAgICAgICAgLy8gRm9yIGVhY2ggc3VnZ2VzdGlvbiBhZGQgbGlzdCBlbGVtZW50IGhpZ2hsaWdodGluZyBtYXRjaFxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGFydGlzdC5tYXRjaChyZWdleCk7XG5cbiAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gYCR7bWF0Y2hbMV19PHN0cm9uZz4ke21hdGNoWzJdfTwvc3Ryb25nPiR7bWF0Y2hbM119YDtcbiAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgXG4gICAgICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gc2VsZWN0IHN1Z2dlc3Rpb25cbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9pbnB1dFN1Z2dlc3Rpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2xlYXIoKSB7XG4gICAgICAgIC8qIERlbGV0ZSBhbGwgc3VnZ2VzdGlvbnMgKi9cbiAgICAgICAgd2hpbGUgKGxpc3QubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICAgICAgbGlzdC5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2Nsb3NlKGUgPSBudWxsKSB7XG4gICAgICAgIC8qIEhpZGUgc3VnZ2VzdGlvbnMgYm94ICovXG4gICAgICAgIC8vIERvIG5vdCByZWdpc3RlciBjbGlja3MgaW4gdGhlIGlucHV0IGJveFxuICAgICAgICBpZiAoZSAmJiBlLnRhcmdldCA9PT0gaW5wdXQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBJZiB0aGUgZHJvcGRvd24gaXMgYWxyZWFkeSBoaWRkZW4gZG8gbm90aGluZ1xuICAgICAgICBpZiAoIWRyb3Bkb3duLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkge1xuICAgICAgICAgICAgX2NsZWFyKCk7XG4gICAgICAgICAgICBkcm9wZG93bi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2lucHV0U3VnZ2VzdGlvbigpIHtcbiAgICAgICAgLyogQ2hvb3NlIHNlbGVjdGVkIGl0ZW0gYW5kIGFkZCBpdCB0byB0aGUgaW5wdXQgKi9cbiAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLnRleHRDb250ZW50O1xuICAgIFxuICAgICAgICBfY2xvc2UoKTtcbiAgICB9ICAgIFxufSkoKTtcblxuXG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5pbXBvcnQgeyBmaWx0ZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5cbnZhciB0YWJsZVZpZXcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIik7XG5cbiAgICBldmVudHMub24oXCJhbGJ1bUFkZGVkXCIsIF9yZW5kZXJBbGJ1bSk7XG4gICAgZXZlbnRzLm9uKFwibGlicmFyeVNvcnRlZFwiLCBfdXBkYXRlKTtcbiAgICBldmVudHMub24oXCJmaWx0ZXJBcHBsaWVkXCIsIF91cGRhdGUpO1xuXG4gICAgZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgICAgICAgX2NsZWFyKCk7XG4gICAgICAgIF9yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyKCkge1xuICAgICAgICAvLyBBcHBseSBjdXJyZW50IGZpbHRlciB0byBhbGJ1bSBsaXN0XG4gICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5mb3JFYWNoKChhbGJ1bSkgPT4ge1xuICAgICAgICAgICAgX3JlbmRlckFsYnVtKGFsYnVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NsZWFyKCkge1xuICAgICAgICAvKiBSZW1vdmUgYWxsIHJvd3MgaW4gdGhlIHRhYmxlICovXG4gICAgICAgIHdoaWxlIChjb250ZW50cy5sYXN0RWxlbWVudENoaWxkKSB7XG4gICAgICAgICAgICBjb250ZW50cy5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlckFsYnVtKGFsYnVtKSB7XG4gICAgICAgIC8vIEFwcGx5IGZpbHRlci4gSWYgZmFsc2UgZG8gbm90IHJlbmRlclxuICAgICAgICBpZiAoIXRhYmxlQ29udHJvbGxlci5maWx0ZXJBbGJ1bShhbGJ1bSkpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIF9yZW5kZXJSb3coYWxidW0pO1xuICAgICAgICBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyUm93KGFsYnVtKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyByb3cgZm9yIHRoZSBhbGJ1bVxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgIC8vIFNldCBhbGJ1bSBhdHRyaWJ1dGUgYXMgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSByb3dcbiAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoXCJhbGJ1bS1yb3dcIik7XG4gICAgICAgIHJvdy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGFsYnVtLmlkKTtcblxuICAgICAgICAvLyBBZGQgYWxidW0gaW5mb1xuICAgICAgICBjb25zdCBjb2x1bW5zID0gW1widGl0bGVcIiwgXCJhcnRpc3RcIiwgXCJyZWxlYXNlX3llYXJcIiwgXCJvd25lZFwiLCBcImZhdm9yaXRlXCJdO1xuICAgICAgICBmb3IgKGNvbnN0IHByb3Agb2YgY29sdW1ucykge1xuICAgICAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG5cbiAgICAgICAgICAgIGxldCBpY29uUGF0aFxuICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgICAgIC8vIFByaW50IGdyZWVuIHRpY2sgb3IgcmVkIGNyb3NzIGljb24gZm9yIHllcyBvciBubyByZXNwLlxuICAgICAgICAgICAgICAgICAgICAvLyBkYXRhQ2VsbC50ZXh0Q29udGVudCA9IGFsYnVtW3Byb3BdID8gXCJZZXNcIiA6IFwiTm9cIjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZWRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcbiAgICAgICAgICAgICAgICAgICAgb3duZWRJY29uLmNsYXNzTGlzdC5hZGQoJ293bmVkLWljb24nKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgaWNvblBhdGggPVxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bcHJvcF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiY2hlY2suc3ZnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2xvc2UtcmVkLnN2Z1wiXG4gICAgICAgICAgICAgICAgICAgIG93bmVkSWNvbi5zcmMgPSBcIi4uL2ltYWdlcy9cIiArIGljb25QYXRoO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChvd25lZEljb24pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJmYXZvcml0ZVwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFsYnVtW3Byb3BdKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmF2SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gICAgICAgICAgICAgICAgICAgIGZhdkljb24uY2xhc3NMaXN0LmFkZCgnb3duZWQtaWNvbicpO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBpY29uUGF0aCA9IFwiLi4vaW1hZ2VzL2hlYXJ0LnN2Z1wiO1xuICAgICAgICAgICAgICAgICAgICBmYXZJY29uLnNyYyA9IGljb25QYXRoO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChmYXZJY29uKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC50ZXh0Q29udGVudCA9IGFsYnVtW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChkYXRhQ2VsbCk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gQ3JlYXRlIHJlbW92ZS1hbGJ1bSBidXR0b25cbiAgICAgICAgLy8gY29uc3QgcmVtb3ZlQnV0dG9uID0gX3JlbmRlclJlbW92ZUJ1dHRvbihyb3cpO1xuICAgICAgICAvLyByb3cuYXBwZW5kQ2hpbGQocmVtb3ZlQnV0dG9uKTtcbiAgICBcbiAgICAgICAgLy8gQXBwZW5kIG5ldyByb3dcbiAgICAgICAgY29udGVudHMuYXBwZW5kQ2hpbGQocm93KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIiwgXCJleHRyYS1pbmZvXCIpO1xuICAgICAgICBjb25zdCBkYXRhQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcbiAgICAgICAgZGF0YUNlbGwuc2V0QXR0cmlidXRlKFwiY29sc3BhblwiLCA1KTtcblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcImluZm8tY29udGFpbmVyXCIpO1xuXG4gICAgICAgIGNvbnN0IGFsYnVtSmFja2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgYWxidW1KYWNrZXQuc2V0QXR0cmlidXRlKFwic3JjXCIsIGFsYnVtLmphY2tldCk7XG4gICAgICAgIGFsYnVtSmFja2V0LmNsYXNzTGlzdC5hZGQoXCJqYWNrZXRcIik7XG5cbiAgICAgICAgY29uc3QgZ2VuZXJhbEluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBnZW5lcmFsSW5mby5jbGFzc0xpc3QuYWRkKFwiZ2VuZXJhbC1pbmZvXCIpO1xuICAgICAgICBfcmVuZGVyR2VuZXJhbEluZm8oZ2VuZXJhbEluZm8sIGFsYnVtKVxuICAgICAgICBcblxuICAgICAgICBjb25zdCByZWNvcmRJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgcmVjb3JkSW5mby5jbGFzc0xpc3QuYWRkKFwicmVjb3JkLWluZm9cIik7XG4gICAgICAgIF9yZW5kZXJSZWNvcmRJbmZvKHJlY29yZEluZm8sIGFsYnVtKTtcblxuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChhbGJ1bUphY2tldCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoZ2VuZXJhbEluZm8pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKHJlY29yZEluZm8pO1xuXG4gICAgICAgIGRhdGFDZWxsLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChkYXRhQ2VsbCk7XG4gICAgICAgIGNvbnRlbnRzLmFwcGVuZENoaWxkKHJvdyk7XG5cbiAgICAgICAgcm93LnByZXZpb3VzU2libGluZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByb3cuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyR2VuZXJhbEluZm8oY29udGFpbmVyLCBhbGJ1bSkge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImdlbnJlXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiR2VucmVcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwidG9wUlMxXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVG9wNTAwIChSUzEpXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcInRvcFJTM1wiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRvcDUwMCAoUlMzKVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IHVybHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImRpc2NvZ3NcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJEaXNjb2dzXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcIndpa2lwZWRpYVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIldpa2lwZWRpYVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHRleHQuaW5uZXJIVE1MID0gYDxzdHJvbmc+JHtmaWVsZC5sYWJlbH08L3N0cm9uZz46ICR7XG4gICAgICAgICAgICAgICAgYWxidW1bZmllbGQua2V5XVxuICAgICAgICAgICAgfWA7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdXJscy5mb3JFYWNoKCh1cmwpID0+IHtcbiAgICAgICAgICAgIGxldCBocmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICBocmVmLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgYWxidW1bdXJsLmtleV0pO1xuICAgICAgICAgICAgaHJlZi5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke3VybC5sYWJlbH08L3N0cm9uZz5gO1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaHJlZik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHJlY29yZF9mb3JtYXQsXG4gICAgLy8gICBhbGJ1bV9mb3JtYXQsXG4gICAgLy8gICBzZXJpYWxfbnVtLFxuICAgIC8vICAgZWRpdGlvbl95ZWFyLFxuICAgIC8vICAgY291bnRyeSxcbiAgICAvLyAgIHJlY29yZF9sYWJlbCxcbiAgICAvLyAgIG1hdHJpeF9udW0sXG4gICAgLy8gICBjb25kaXRpb24sXG4gICAgLy8gICBjb21tZW50cyxcbiAgICAvLyAgIGphY2tldFxuXG4gICAgZnVuY3Rpb24gX3JlbmRlclJlY29yZEluZm8oY29udGFpbmVyLCBhbGJ1bSkge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImNhdGFsb2dfbnVtXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiQ2F0YWxvZyNcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwicmVjb3JkX2xhYmVsXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiTGFiZWxcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiY291bnRyeVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNvdW50cnlcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiZWRpdGlvbl95ZWFyXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiRWRpdGlvblwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJtYXRyaXhcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJNYXRyaXhcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiY29uZGl0aW9uXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiQ29uZGl0aW9uXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcIm5vdGVzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiTm90ZXNcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIGxldCBmb3JtYXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgZm9ybWF0LmlubmVySFRNTCA9IGA8c3Ryb25nPkZvcm1hdDwvc3Ryb25nPjogJHthbGJ1bS5yZWNvcmRfZm9ybWF0fSAoJHthbGJ1bS5hbGJ1bV9mb3JtYXR9KWA7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmb3JtYXQpO1xuXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0ZXh0LmlubmVySFRNTCA9IGA8c3Ryb25nPiR7ZmllbGQubGFiZWx9PC9zdHJvbmc+OiAke2FsYnVtW2ZpZWxkLmtleV19YDtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJSZW1vdmVCdXR0b24ocm93KSB7XG4gICAgICAgIC8vIENyZWF0ZSB0cmFzaGNhbiBidXR0b24gYW5kIGFwcGVuZCBpdCB0byByb3dcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cbiAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmUtYWxidW1cIiwgXCJpbWctYnV0dG9uXCIsIFwiaGlkZGVuXCIpO1xuICAgICAgICByZW1vdmVCdXR0b24udGl0bGUgPSBcIkRlbGV0ZSBBbGJ1bVwiO1xuXG4gICAgICAgIGRhdGFDZWxsLmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgLy8gQ29ubmVjdCBuZXcgcm93IHNvIHRoYXQgcmVtb3ZlLWljb24gb25seSBhcHBlYXJzIG9uIGhvdmVyXG4gICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ29ubmVjdCBidXR0b24gdG8gcmVtb3ZlQWxidW0gZnVuY3Rpb25cbiAgICAgICAgcmVtb3ZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gcm93LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG4gICAgICAgICAgICBtdXNpY0xpYnJhcnkuZGVsZXRlQWxidW0oaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGF0YUNlbGxcbiAgICB9XG59KSgpO1xuXG52YXIgdGFibGVDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpLFxuICAgICAgICAgc29ydGFibGVIZWFkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRhYmxlIHRoLnNvcnRhYmxlXCIpO1xuICAgIHZhciBjdXJyU29ydGluZyA9IHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wiIH07XG5cbiAgICBzb3J0YWJsZUhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3NvcnRUYWJsZSk7XG4gICAgfSk7XG5cbiAgICBldmVudHMub24oXCJhbGJ1bURlbGV0ZWRcIiwgX3JlbW92ZVJvdyk7XG5cbiAgICBmdW5jdGlvbiBfcmVtb3ZlUm93KGlkKSB7XG4gICAgICAgIC8vIEFzayBjb25maXJtYXRpb24gYmVmb3JlIHJlbW92aW5nIGFsYnVtXG4gICAgICAgIGlmICghY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBhbGJ1bT9cIikpIHJldHVybjtcbiAgICBcbiAgICAgICAgLy8gUmVtb3ZlIHJvdyBhbmQgYWxidW0gZnJvbSBsaWJyYXJ5XG4gICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRyW2RhdGEtaWQ9JHtpZH1dYClcbiAgICAgICAgXG4gICAgICAgIGNvbnRlbnRzLnJlbW92ZUNoaWxkKHJvdyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3NvcnRUYWJsZShlKSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgbmV3U29ydEJ5ID0gaGVhZGVyLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpO1xuICAgICAgICBjb25zdCB7IGJ5OiBzb3J0QnksIG9yZDogc29ydE9yZCB9ID0gY3VyclNvcnRpbmc7XG4gICAgXG4gICAgICAgIC8vIElmIHNvcnRpbmcgbmV3IHJvdyBmbGlwIHJvdyBvcmRlciwgZWxzZSByb3cgb3JkZXIgYXMgYXNjIGFzIGRlZmF1bHRcbiAgICAgICAgaWYgKG5ld1NvcnRCeSA9PT0gc29ydEJ5KSB7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5vcmQgPSBzb3J0T3JkID09PSBcImFzY1wiID8gXCJkZXNjXCIgOiBcImFzY1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyclNvcnRpbmcuYnkgPSBuZXdTb3J0Qnk7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5vcmQgPSBcImFzY1wiO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIFNvcnQgbGlicmFyeSBhbGJ1bXM7XG4gICAgICAgIG11c2ljTGlicmFyeS5zb3J0KGN1cnJTb3J0aW5nKTtcbiAgICBcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBhbmQgZGlzcGxheSB0aGUgY29ycmVzcG9uZGluZyBvbmVcbiAgICAgICAgX2hpZGVTb3J0aW5nQXJyb3dzKCk7XG4gICAgICAgIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpIHtcbiAgICAgICAgLyogQWRkIHNvcnRpbmcgYXJyb3dzIHdpdGggdGhlIGNvcnJlcHNvbmRpbmcgb3JkZXIgaW4gdGhlIGNsaWNrZWQgaGVhZGVyICovXG4gICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG5cbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5hZGQoY3VyclNvcnRpbmcub3JkKTtcbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9oaWRlU29ydGluZ0Fycm93cygpIHtcbiAgICAgICAgLyogUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBmb3JtIGFsbCBoZWFkZXJzICovXG4gICAgICAgIHNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG4gICAgXG4gICAgICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QucmVtb3ZlKFwiYXNjXCIpO1xuICAgICAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNjXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVzZXRTb3J0aW5nKCkge1xuICAgICAgICBjdXJyU29ydGluZyA9IHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wiIH07XG5cbiAgICAgICAgX2hpZGVTb3J0aW5nQXJyb3dzKCk7XG4gICAgICAgIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJBbGJ1bShhbGJ1bSkge1xuICAgICAgICB2YXIgY3VyckZpbHRlciA9IGZpbHRlckNvbnRyb2xsZXIuZ2V0Q3VycmVudEZpbHRlcigpO1xuICAgICAgICB2YXIgeyB0eXBlOiBmaWx0ZXJUeXBlLCB2YWx1ZTogZmlsdGVyVmFsdWUgfSA9IGN1cnJGaWx0ZXI7XG4gICAgXG4gICAgICAgIC8vIFJlc2V0IGRpc3BsYXkgaWYgbm8gZmlsdGVyIGFwcGx5IChpbnB1dCBlbXB0eSkgZG8gbm90aGluZ1xuICAgICAgICBpZiAoZmlsdGVyVmFsdWUgPT09IFwiXCIpIHJldHVybiB0cnVlO1xuICAgIFxuICAgICAgICBzd2l0Y2ggKGZpbHRlclR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInRpdGxlXCJdLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gTWF0Y2ggYW55IG9mIHRoZSBjb21tYSBzZXBhcmF0ZWQgbWF0Y2hlc1xuICAgICAgICAgICAgICAgIGNvbnN0IGFydGlzdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlssO11cXHMqLyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFydGlzdExpc3Quc29tZSgoYXJ0aXN0KSA9PlxuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImFydGlzdFwiXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGFydGlzdC50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoID0gKHJlZ2V4KSA9PiBmaWx0ZXJWYWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgLy8gUmVnZXggZm9yIHllYXIgZm9yIGRpZmZlcmVudCByZWxlYXNlIHllYXIgZmlsdGVyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXhFcSA9IC9eXFxzKihcXGQrKVxccyokLywgLy8gU2luZ2xlIHllYXIgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhHdCA9IC8oPzpePlxccz8oXFxkKykkKS8sIC8vIEdyZWF0ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEx0ID0gLyg/Ol48XFxzPyhcXGQrKSQpLywgLy8gTG93ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEJ0dyA9IC8oPzpeKFxcZCspXFxzP1stLC87XVxccz8oXFxkKykkKS87IC8vVHdvIHZhbHVlcyBpbnRlcnZhbFxuICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXRjaChyZWdleEVxKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPT0gbWF0Y2gocmVnZXhFcSlbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEd0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPj0gbWF0Y2gocmVnZXhHdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEx0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhMdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEJ0dykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID49IG1hdGNoKHJlZ2V4QnR3KVsxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhCdHcpWzJdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIC8vIEFsbG93IHRoZSB1c2Ugb2YgZGlmZmVyZW50IHdvcmRzIGZvciB0cnVlIGFuZCBmYWxzZVxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwieWVzXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cnVlXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiMVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJub1wiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmFsc2VcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5vdCBvd25lZFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2FudFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiMFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcImZvcm1hdFwiOlxuICAgICAgICAgICAgICAgIC8vIEluIHRoaXMgZmlsdGVyIFwiK1wiID0gXCJhbmRcIiBhbmQgXCJbLDsvXVwiID0gXCJvclwiXG4gICAgICAgICAgICAgICAgbGV0IGZvcm1hdExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyVmFsdWUuaW5jbHVkZXMoXCIrXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlxcK1xccyovKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdExpc3QuZXZlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAoZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiZm9ybWF0XCJdLmZpbmRJbmRleChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCkgPT4gdmFsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlssOy9dXFxzKi8pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TGlzdC5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZvcm1hdCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImZvcm1hdFwiXS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWwpID0+IHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vIEVsc2UgZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmlsdGVyQWxidW1cbiAgICB9XG59KSgpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3RhYmxlLmpzXCJcbmltcG9ydCBcIi4vZmlsdGVyLmpzXCJcbmltcG9ydCBcIi4vbW9kYWwuanNcIlxuaW1wb3J0IFwiLi9sb2FkZXIuanNcIlxuXG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcbmltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiO1xuXG52YXIgc2FtcGxlID0gcmVxdWlyZShcIi4uL2FsYnVtX3NhbXBsZS5qc29uXCIpXG5cbmZvciAoY29uc3Qga2V5IGluIHNhbXBsZSkge1xuICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChzYW1wbGUsIGtleSkpIHtcbiAgICAgICAgdmFyIG5ld0FsYnVtID0gQWxidW0oc2FtcGxlW2tleV0pO1xuICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==