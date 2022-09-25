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
    { title, artist, release_year, owned, format = [] }
) => {
    return {
        id: title.toLowerCase().replaceAll(/\W/g, "") +
            artist.toLowerCase().replaceAll(/\W/g, ""),
        title,
        artist,
        release_year,
        owned: Boolean(owned),
        format
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

    filterSelect.addEventListener("change", _renderPlaceholder);
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

    function _resetFilter() {
        /* Reset filter when the input box is empty and apply empty filter */
        if (filterValue.value === "") {
            _renderPlaceholder();
            _applyFilter();
        }
    
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
            console.log("Album ID: " + newAlbum.id)
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
        // Create a new row for the album
        const row = document.createElement("tr");
    
        // Set album attribute as unique identifier for the row
        row.setAttribute("data-id", album.id);
    
        // Add album info
        const columns = ["title", "artist", "release_year", "owned", "format"];
        for (const prop of columns) {
            const dataCell = document.createElement("td");

            switch (prop) {
                case "owned":
                    // Print green tick or red cross icon for yes or no resp.
                    // dataCell.textContent = album[prop] ? "Yes" : "No";
                    const ownedIcon = document.createElement('img')
                    ownedIcon.classList.add('owned-icon');
    
                    let iconPath =
                        album[prop]
                            ? "check.svg"
                            : "close-red.svg"
                    ownedIcon.src = "../images/" + iconPath;
    
                    dataCell.appendChild(ownedIcon)
                    break;
                case "format":
                    dataCell.textContent = album[prop].join(", ");
                    break;
                default:
                    dataCell.textContent = album[prop];
                    break;
            }
            row.appendChild(dataCell);
        }
    
        // Create remove-album button
        function createRemoveButton (row) {
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

        const removeButton = createRemoveButton(row);
        row.appendChild(removeButton);
    
        // Append new row
        contents.appendChild(row);
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
                const artistList = filterValue.replaceAll(" ", "").split(/[,;]/);
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

    return {
        filterAlbum
    }
})();


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
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _album_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./album.js */ "./src/album.js");
/* harmony import */ var _library_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./library.js */ "./src/library.js");
/* harmony import */ var _table_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./table.js */ "./src/table.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./filter.js */ "./src/filter.js");
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modal.js */ "./src/modal.js");







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
        var newAlbum = (0,_album_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
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

        _library_js__WEBPACK_IMPORTED_MODULE_2__["default"].addAlbum(newAlbum);
    })

    _library_js__WEBPACK_IMPORTED_MODULE_2__["default"].sort({ by: "title", ord: "asc"})
};


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMvYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZTs7Ozs7Ozs7Ozs7Ozs7QUNkZjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLDRCQUE0QixtQ0FBbUM7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMOztBQUVBLGlFQUFlOzs7Ozs7Ozs7Ozs7Ozs7O0FDekJrQjtBQUNPOztBQUV4QztBQUNBO0FBQ0E7O0FBRUEsSUFBSSxxREFBUztBQUNiLElBQUkscURBQVM7QUFDYixJQUFJLHFEQUFTOztBQUViO0FBQ0EsNkJBQTZCLGdFQUF5QjtBQUN0RCw0REFBNEQ7O0FBRTVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLGNBQWMsU0FBUyxjQUFjO0FBQ2xFO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdURBQVc7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0UrQjs7QUFFaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBLFFBQVEsdURBQVc7QUFDbkI7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFFBQVEsdURBQVc7QUFDbkI7O0FBRUEsb0JBQW9CLGlCQUFpQjtBQUNyQyxzREFBc0Q7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSx1REFBVztBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVELGlFQUFlLFlBQVk7Ozs7Ozs7Ozs7Ozs7O0FDdERNOztBQUVqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLElBQUkscURBQVM7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1REFBVztBQUNuQjtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxxREFBUzs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdURBQVc7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsV0FBVztBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBZ0MsU0FBUyxVQUFVLFNBQVMsV0FBVyxTQUFTO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdktnQztBQUNPO0FBQ087O0FBRS9DO0FBQ0E7O0FBRUEsSUFBSSxxREFBUztBQUNiLElBQUkscURBQVM7QUFDYixJQUFJLHFEQUFTOztBQUViO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLGdFQUF5QjtBQUNqQztBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiwrREFBd0I7QUFDeEMsYUFBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCOztBQUV4QjtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxJQUFJLHFEQUFTOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsR0FBRztBQUM1RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDJCQUEyQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx3REFBaUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXlCLHlFQUFpQztBQUMxRCxjQUFjLHVDQUF1QztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RUFBNkU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELGNBQWM7QUFDL0Q7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsMkVBQTJFO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7O1VDbFFEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05nQztBQUNGO0FBQ1M7QUFDcEI7QUFDQztBQUNEOztBQUVuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHFEQUFLO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQsUUFBUSw0REFBcUI7QUFDN0IsS0FBSzs7QUFFTCxJQUFJLHdEQUFpQixHQUFHLHdCQUF3QjtBQUNoRCIsInNvdXJjZXMiOlsid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvYWxidW0uanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9saWJyYXJ5LmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvbW9kYWwuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy90YWJsZS5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQWxidW0gPSAoXG4gICAgeyB0aXRsZSwgYXJ0aXN0LCByZWxlYXNlX3llYXIsIG93bmVkLCBmb3JtYXQgPSBbXSB9XG4pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpZDogdGl0bGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlQWxsKC9cXFcvZywgXCJcIikgK1xuICAgICAgICAgICAgYXJ0aXN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZUFsbCgvXFxXL2csIFwiXCIpLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgYXJ0aXN0LFxuICAgICAgICByZWxlYXNlX3llYXIsXG4gICAgICAgIG93bmVkOiBCb29sZWFuKG93bmVkKSxcbiAgICAgICAgZm9ybWF0XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxidW0iLCJ2YXIgZXZlbnRzID0ge1xuICAgIGV2ZW50czoge30sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmbihkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50cyIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxudmFyIHN1bW1hcnlWaWV3ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbnRyaWVzLWNvdW50XCIpLFxuICAgICAgICB0YWJsZUNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIik7XG5cbiAgICBldmVudHMub24oXCJmaWx0ZXJBcHBsaWVkXCIsIF9yZW5kZXIpO1xuICAgIGV2ZW50cy5vbihcImFsYnVtQWRkZWRcIiwgX3JlbmRlcik7XG4gICAgZXZlbnRzLm9uKFwiYWxidW1EZWxldGVkXCIsIF9yZW5kZXIpO1xuXG4gICAgZnVuY3Rpb24gX3JlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdG90YWxFbnRyaWVzID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLmxlbmd0aCwgLy8gTGVuZ3RoIG9mIGxpYnJhcnkgbGlzdFxuICAgICAgICAgICAgc2hvd25FbnRyaWVzID0gdGFibGVDb250ZW50cy5jaGlsZEVsZW1lbnRDb3VudDsgLy8gTnVtYmVyIG9mIHJvd3MgaW4gdGFibGVcblxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gYWxidW1zIGluIHRoZSBsaWJyYXJ5IHByaW50IHdlbGNvbWUgbWVzc2FnZVxuICAgICAgICBzdW1tYXJ5LnRleHRDb250ZW50ID1cbiAgICAgICAgICAgIHRvdGFsRW50cmllcyA9PT0gMFxuICAgICAgICAgICAgICAgID8gXCJObyBhbGJ1bXMgaW4gdGhlIGxpYnJhcnkuIEFkZCBvbmUgYnkgY2xpY2tpbmcgdGhlIGJ1dHRvblwiXG4gICAgICAgICAgICAgICAgOiBgU2hvd2luZyAke3Nob3duRW50cmllc30gb3V0IG9mICR7dG90YWxFbnRyaWVzfSBhbGJ1bXNgO1xuICAgIH1cbn0pKCk7XG5cbnZhciBmaWx0ZXJDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VyckZpbHRlciA9IHsgdHlwZTogXCJcIiwgdmFsdWU6IFwiXCIgfTtcbiAgICBjb25zdCBmaWx0ZXJGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItYnlcIiksXG4gICAgICAgIGZpbHRlclNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyXCIpLFxuICAgICAgICBmaWx0ZXJWYWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLXZhbHVlXCIpLFxuICAgICAgICBlbnRyaWVzQ291bnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVudHJpZXMtY291bnRcIik7XG5cbiAgICBmaWx0ZXJTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfcmVuZGVyUGxhY2Vob2xkZXIpO1xuICAgIGZpbHRlckZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBfYXBwbHlGaWx0ZXIpO1xuICAgIGZpbHRlclZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfcmVzZXRGaWx0ZXIpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudEZpbHRlcigpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJGaWx0ZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FwcGx5RmlsdGVyKGUgPSBudWxsKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBzdWJtaXQgYmVoYXZpb3VyXG4gICAgICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgXG4gICAgICAgIC8vIFVwZGF0ZSBjdXJyZW50IGZpbHRlciB3aXRoIHZhbHVlcyBmcm9tIHRoZSBmaWx0ZXIgZm9ybVxuICAgICAgICBjdXJyRmlsdGVyW1widHlwZVwiXSA9IGZpbHRlclNlbGVjdC52YWx1ZTtcbiAgICAgICAgY3VyckZpbHRlcltcInZhbHVlXCJdID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItdmFsdWVcIikudmFsdWU7XG4gICAgXG4gICAgICAgIC8vIFVwZGF0ZSB0YWJsZVxuICAgICAgICBldmVudHMuZW1pdChcImZpbHRlckFwcGxpZWRcIiwgY3VyckZpbHRlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJQbGFjZWhvbGRlcigpIHtcbiAgICAgICAgLyogVXBkYXRlIHBsYWNlaG9sZGVyIG1lc3NhZ2UgYWNjb3JkaW5nIHRvIHRoZSBzZWxlY3RlZCBvcHRpb24gKi9cbiAgICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnZS5nLiBcInN1Ym1hcmluZVwiJyxcbiAgICAgICAgICAgIGFydGlzdDogJ2UuZy4gXCJ6ZXBwZWxpblwiLCBcImJlYXRsZXMsIHJvbGxpbmdcIicsXG4gICAgICAgICAgICByZWxlYXNlX3llYXI6ICdlLmcuIFwiMTk5MFwiLCBcIjEtMjAwMFwiLCBcIj4xOTAwXCIsIFwiPDE5ODBcIicsXG4gICAgICAgICAgICBvd25lZDogJ2UuZy4gXCJ0cnVlXCIsIFwibm9cIiwgXCJub3Qgb3duZWRcIicsXG4gICAgICAgICAgICBmb3JtYXQ6ICdlLmcuIFwiVnluaWxcIiwgXCJjZCtjYXNldHRlXCIsIFwidnluaWwvQ0RcIidcbiAgICAgICAgfTtcblxuICAgICAgICBmaWx0ZXJWYWx1ZS5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyW2ZpbHRlcl07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3Jlc2V0RmlsdGVyKCkge1xuICAgICAgICAvKiBSZXNldCBmaWx0ZXIgd2hlbiB0aGUgaW5wdXQgYm94IGlzIGVtcHR5IGFuZCBhcHBseSBlbXB0eSBmaWx0ZXIgKi9cbiAgICAgICAgaWYgKGZpbHRlclZhbHVlLnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICBfcmVuZGVyUGxhY2Vob2xkZXIoKTtcbiAgICAgICAgICAgIF9hcHBseUZpbHRlcigpO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9ICAgIFxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Q3VycmVudEZpbHRlcixcbiAgICB9XG59KSgpO1xuXG5leHBvcnQgeyBmaWx0ZXJDb250cm9sbGVyIH0iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiXG5cbnZhciBtdXNpY0xpYnJhcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbGJ1bUxpc3QgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGdldEFsYnVtTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIGFsYnVtTGlzdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRBbGJ1bShuZXdBbGJ1bSkge1xuICAgICAgICAvKiBJZiB0aGUgYWxidW1zIGV4aXN0cyBsb2cgZXJyb3IgbWVzc2FnZS4gSWYgbm90IGFkZCBhdCB0aGUgc3RhcnQgKi9cbiAgICAgICAgaWYgKGFsYnVtTGlzdC5ldmVyeSgoYWxidW0pID0+IG5ld0FsYnVtLmlkICE9PSBhbGJ1bS5pZCkpIHtcbiAgICAgICAgICAgIGFsYnVtTGlzdC51bnNoaWZ0KG5ld0FsYnVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiVGhpcyBhbGJ1bSBhbHJlYWR5IGV4aXN0cy5cIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFsYnVtIElEOiBcIiArIG5ld0FsYnVtLmlkKVxuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bUFkZGVkXCIsIG5ld0FsYnVtKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZGVsZXRlQWxidW0oaWQpIHtcbiAgICAgICAgLyogRGVsZXRlIGFsYnVtIHdpdGggYSBnaXZlbiBJRCAqL1xuICAgICAgICBhbGJ1bUxpc3QgPSBhbGJ1bUxpc3QuZmlsdGVyKChhbGJ1bSkgPT4gYWxidW0uaWQgIT09IGlkKTtcblxuICAgICAgICBldmVudHMuZW1pdChcImFsYnVtRGVsZXRlZFwiLCBpZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc29ydCh7IGJ5LCBvcmQgPSBcImFzY1wiIH0pIHtcbiAgICAgICAgLyogUmV2ZXJzZSBzb3J0aW5nIGFsZ29yaXRobSBpcyBvcmQgPSAnZGVzYyc7ICovXG4gICAgICAgIGxldCBzb3J0T3JkZXIgPSBvcmQgPT09IFwiYXNjXCIgPyAxIDogLTE7XG5cbiAgICAgICAgc3dpdGNoIChieSkge1xuICAgICAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gbG9jYWxlQ29tcGFyZSB1c2VkIHRvIGNvbXBhcmUgc3RyaW5nIHdpdGhvdXQgbWF0aCBvcGVyYXRvcnNcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc29ydChcbiAgICAgICAgICAgICAgICAgICAgKGEsIGIpID0+IGFbYnldLmxvY2FsZUNvbXBhcmUoYltieV0pICogc29ydE9yZGVyXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWxlYXNlX3llYXJcIjpcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc29ydCgoYSwgYikgPT4gKGFbYnldIC0gYltieV0pICogc29ydE9yZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwibGlicmFyeVNvcnRlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRBbGJ1bUxpc3QsXG4gICAgICAgIGFkZEFsYnVtLFxuICAgICAgICBkZWxldGVBbGJ1bSxcbiAgICAgICAgc29ydFxuICAgIH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IG11c2ljTGlicmFyeVxuXG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuXG52YXIgbW9kYWwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLW92ZXJsYXlcIiksIFxuICAgICAgICBvcGVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW1vZGFsXCIpLFxuICAgICAgICBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xvc2UtbW9kYWxcIik7XG5cbiAgICBvcGVuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfb3Blbik7XG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9jbG9zZSk7XG5cbiAgICBldmVudHMub24oXCJuZXdBbGJ1bUZvcm1TdWJtaXR0ZWRcIiwgX2Nsb3NlKTtcblxuICAgIGZ1bmN0aW9uIF9vcGVuKCkge1xuICAgICAgICAvKiBEaXNwbGF5IGZvcm0gbW9kYWwgb3ZlciBtYWluIHdpbmRvdyBhbmQgZm9jdXMgb24gZmlyc3QgaW5wdXQgKi9cbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10aXRsZVwiKS5mb2N1cygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfY2xvc2UoKSB7XG4gICAgICAgIC8qIEhpZGUgbW9kYWwgKi9cbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICBldmVudHMuZW1pdChcIm1vZGFsQ2xvc2VkXCIpO1xuICAgIH1cbn0pKCk7XG5cbnZhciBuZXdBbGJ1bUZvcm0gPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC1hbGJ1bVwiKSxcbiAgICAgICAgcmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInJlc2V0XCJdJyksXG4gICAgICAgIG93bnNUcnVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvd25zLXRydWVcIiksXG4gICAgICAgIG93bnNGYWxzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ducy1mYWxzZVwiKSxcbiAgICAgICAgY2hlY2tCb3hlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKFwiZm9ybWF0XCIpO1xuXG4gICAgLy8gU3VibWl0IGFuZCByZXNldCBcIk5ldyBBbGJ1bVwiIGZvcm1cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgX3N1Ym1pdE5ld0FsYnVtKTtcbiAgICByZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2Rpc2FibGVDaGVja0JveGVzKTtcblxuICAgIC8vIEVuYWJsZSBjaGVja2JveGVzIHdoZW4gdXNlciBjbGlja3MgYnV0dG9uIGFuZCBkaXNhYmxlIHdoZW4gbm90XG4gICAgb3duc1RydWUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfZW5hYmxlQ2hlY2tCb3hlcyk7XG4gICAgb3duc0ZhbHNlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgX2Rpc2FibGVDaGVja0JveGVzKTtcblxuICAgIGV2ZW50cy5vbihcIm1vZGFsQ2xvc2VkXCIsIF9yZXNldCk7XG5cbiAgICBmdW5jdGlvbiBfcmVzZXQoKSB7XG4gICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgX2Rpc2FibGVDaGVja0JveGVzKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9kaXNhYmxlQ2hlY2tCb3hlcygpIHtcbiAgICAgICAgLyogRGlzYWJsZSBmb3JtYXQgY2hlY2tib3hlcyAqL1xuICAgICAgICBjaGVja0JveGVzLmZvckVhY2goKGNoZWNrQm94KSA9PiB7XG4gICAgICAgICAgICBjaGVja0JveC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjaGVja0JveC5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfZW5hYmxlQ2hlY2tCb3hlcygpIHtcbiAgICAgICAgLyogRW5hYmxlIGZvcm1hdCBjaGVja2JveGVzICovXG4gICAgICAgIGNoZWNrQm94ZXMuZm9yRWFjaCgoY2hlY2tCb3gpID0+IHtcbiAgICAgICAgICAgIGNoZWNrQm94LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfc3VibWl0TmV3QWxidW0oZSkge1xuICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgc3VibWl0IGFjdGlvblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgYWxidW0gb2JqZWN0IGFuZCBhZGQgaXQgdG8gdGhlIGxpYnJhcnlcbiAgICAgICAgY29uc3QgbmV3QWxidW0gPSBBbGJ1bShfcHJvY2Vzc05ld0FsYnVtRm9ybSgpKTtcbiAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICBcbiAgICAgICAgLy8gVXBkYXRlIHRhYmxlIGFuZCBjbG9zZSBmb3JtIG1vZGFsXG4gICAgICAgIGV2ZW50cy5lbWl0KFwibmV3QWxidW1Gb3JtU3VibWl0dGVkXCIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfcHJvY2Vzc05ld0FsYnVtRm9ybSgpIHtcbiAgICAgICAgLyogUHJvY2VzcyBuZXcgYWxidW0gZm9ybSB0byBwYXNzIGl0IHRvIG5ldyBhbGJ1bSAqL1xuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XG4gICAgXG4gICAgICAgIGxldCBmb3JtQ29udGVudCA9IE9iamVjdC5mcm9tRW50cmllcyhmb3JtRGF0YS5lbnRyaWVzKCkpO1xuICAgICAgICBmb3JtQ29udGVudFtcIm93bmVkXCJdID0gZm9ybUNvbnRlbnRbXCJvd25lZFwiXSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGZvcm1Db250ZW50W1wiZm9ybWF0XCJdID0gZm9ybURhdGEuZ2V0QWxsKFwiZm9ybWF0XCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gZm9ybUNvbnRlbnQ7XG4gICAgfVxufSkoKTtcblxudmFyIGFydGlzdFN1Z2dlc3Rpb25zID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWFydGlzdFwiKSxcbiAgICAgICAgZHJvcGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpLFxuICAgICAgICBsaXN0ID0gZHJvcGRvd24uZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAvLyBTdWdnZXN0IGFydGlzdHMgd2hlbiBpbnB1dGluZyB2YWx1ZXMgb3Igd2hlbiBjbGlja2luZyBpbiBpbnB1dFxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfcmVuZGVyKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgX3JlbmRlcik7XG5cbiAgICAvLyBDbG9zZSBzdWdnZXN0aW9ucyBkaXYgd2hlbiBjbGlja2luZyBvdXRzaWRlIHN1Z2dlc3Rpb24gYm94XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9jbG9zZSwgdHJ1ZSk7XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyKHN1Z2dlc3RlZEFydGlzdHMpIHtcbiAgICAgICAgY29uc3QgaW5wdXRWYWx1ZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAvLyBJZiB1c2VyIGNsZWFycyBpbnB1dCwgZGlzcGxheSBwbGFjZWhvbGRlciBhbmQgY2xvc2Ugc3VnZ2VzdGlvbnNcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGlucHV0LnBsYWNlaG9sZGVyID0gaW5wdXQucGxhY2Vob2xkZXI7XG4gICAgICAgICAgICBfY2xvc2UoKTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtdXNpY0xpYnJhcnkuZ2V0QWxidW1MaXN0KCkubWFwKFxuICAgICAgICAgICAgKGFsYnVtKSA9PiBhbGJ1bS5hcnRpc3RcbiAgICAgICAgKTtcbiAgICAgICAgLy8gQ29tcHV0ZSBhcnRpc3Qgc3VnZ2VzdGlvbnMgZ2l2ZW4gdGhlIGN1cnJlbnQgYWxidW1zIGluIHRoZSBsaWJyYXJ5XG4gICAgICAgIHZhciBzdWdnZXN0aW9ucyA9IG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5yZWR1Y2UoKHN1Z2csIGFsYnVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJ0aXN0ID0gYWxidW0uYXJ0aXN0O1xuICAgICAgICAgICAgICAgIGlmIChhcnRpc3QudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhpbnB1dFZhbHVlLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEF2b2lkIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Z2cuaW5kZXhPZihhcnRpc3QpID09PSAtMSApIHN1Z2cucHVzaChhcnRpc3QpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1Z2dcbiAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgaWYgKCFzdWdnZXN0aW9ucy5sZW5ndGgpIHsgLy8gSGlkZSBkcm9wZG93biBpZiBub3Qgc3VnZ2VzdGlvbnNcbiAgICAgICAgICAgIF9jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9ICAgIFxuICAgICAgICAvLyBSZWZyZXNoIGRpdiBhbmQgZGlzcGxheSBuZXcgc3VnZ2VzdGlvbnNcbiAgICAgICAgZHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgX2NsZWFyKCk7XG5cbiAgICAgICAgLy8gUmVnZXggdG8gaGlnaGxpZ2h0IG1hdGNoXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgKC4qKSgke2lucHV0VmFsdWV9KSguKilgLCBcImlcIik7XG4gICAgICAgIHN1Z2dlc3Rpb25zLmZvckVhY2goYXJ0aXN0ID0+IHtcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIHN1Z2dlc3Rpb24gYWRkIGxpc3QgZWxlbWVudCBoaWdobGlnaHRpbmcgbWF0Y2hcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBhcnRpc3QubWF0Y2gocmVnZXgpO1xuXG4gICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IGAke21hdGNoWzFdfTxzdHJvbmc+JHttYXRjaFsyXX08L3N0cm9uZz4ke21hdGNoWzNdfWA7XG4gICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgIFxuICAgICAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHNlbGVjdCBzdWdnZXN0aW9uXG4gICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfaW5wdXRTdWdnZXN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NsZWFyKCkge1xuICAgICAgICAvKiBEZWxldGUgYWxsIHN1Z2dlc3Rpb25zICovXG4gICAgICAgIHdoaWxlIChsaXN0Lmxhc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgICAgICAgIGxpc3QubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jbG9zZShlID0gbnVsbCkge1xuICAgICAgICAvKiBIaWRlIHN1Z2dlc3Rpb25zIGJveCAqL1xuICAgICAgICAvLyBEbyBub3QgcmVnaXN0ZXIgY2xpY2tzIGluIHRoZSBpbnB1dCBib3hcbiAgICAgICAgaWYgKGUgJiYgZS50YXJnZXQgPT09IGlucHV0KSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gSWYgdGhlIGRyb3Bkb3duIGlzIGFscmVhZHkgaGlkZGVuIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKCFkcm9wZG93bi5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcbiAgICAgICAgICAgIF9jbGVhcigpO1xuICAgICAgICAgICAgZHJvcGRvd24uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbnB1dFN1Z2dlc3Rpb24oKSB7XG4gICAgICAgIC8qIENob29zZSBzZWxlY3RlZCBpdGVtIGFuZCBhZGQgaXQgdG8gdGhlIGlucHV0ICovXG4gICAgICAgIGlucHV0LnZhbHVlID0gdGhpcy50ZXh0Q29udGVudDtcbiAgICBcbiAgICAgICAgX2Nsb3NlKCk7XG4gICAgfSAgICBcbn0pKCk7XG5cblxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHMuanNcIjtcbmltcG9ydCBtdXNpY0xpYnJhcnkgZnJvbSBcIi4vbGlicmFyeS5qc1wiO1xuaW1wb3J0IHsgZmlsdGVyQ29udHJvbGxlciB9IGZyb20gXCIuL2ZpbHRlci5qc1wiO1xuXG52YXIgdGFibGVWaWV3ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpO1xuXG4gICAgZXZlbnRzLm9uKFwiYWxidW1BZGRlZFwiLCBfcmVuZGVyQWxidW0pO1xuICAgIGV2ZW50cy5vbihcImxpYnJhcnlTb3J0ZWRcIiwgX3VwZGF0ZSk7XG4gICAgZXZlbnRzLm9uKFwiZmlsdGVyQXBwbGllZFwiLCBfdXBkYXRlKTtcblxuICAgIGZ1bmN0aW9uIF91cGRhdGUoKSB7XG4gICAgICAgIF9jbGVhcigpO1xuICAgICAgICBfcmVuZGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlcigpIHtcbiAgICAgICAgLy8gQXBwbHkgY3VycmVudCBmaWx0ZXIgdG8gYWxidW0gbGlzdFxuICAgICAgICBtdXNpY0xpYnJhcnkuZ2V0QWxidW1MaXN0KCkuZm9yRWFjaCgoYWxidW0pID0+IHtcbiAgICAgICAgICAgIF9yZW5kZXJBbGJ1bShhbGJ1bSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jbGVhcigpIHtcbiAgICAgICAgLyogUmVtb3ZlIGFsbCByb3dzIGluIHRoZSB0YWJsZSAqL1xuICAgICAgICB3aGlsZSAoY29udGVudHMubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICAgICAgY29udGVudHMubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJBbGJ1bShhbGJ1bSkge1xuICAgICAgICAvLyBBcHBseSBmaWx0ZXIuIElmIGZhbHNlIGRvIG5vdCByZW5kZXJcbiAgICAgICAgaWYgKCF0YWJsZUNvbnRyb2xsZXIuZmlsdGVyQWxidW0oYWxidW0pKSByZXR1cm47XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyByb3cgZm9yIHRoZSBhbGJ1bVxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgXG4gICAgICAgIC8vIFNldCBhbGJ1bSBhdHRyaWJ1dGUgYXMgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSByb3dcbiAgICAgICAgcm93LnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgYWxidW0uaWQpO1xuICAgIFxuICAgICAgICAvLyBBZGQgYWxidW0gaW5mb1xuICAgICAgICBjb25zdCBjb2x1bW5zID0gW1widGl0bGVcIiwgXCJhcnRpc3RcIiwgXCJyZWxlYXNlX3llYXJcIiwgXCJvd25lZFwiLCBcImZvcm1hdFwiXTtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wIG9mIGNvbHVtbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwib3duZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgLy8gUHJpbnQgZ3JlZW4gdGljayBvciByZWQgY3Jvc3MgaWNvbiBmb3IgeWVzIG9yIG5vIHJlc3AuXG4gICAgICAgICAgICAgICAgICAgIC8vIGRhdGFDZWxsLnRleHRDb250ZW50ID0gYWxidW1bcHJvcF0gPyBcIlllc1wiIDogXCJOb1wiO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvd25lZEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgICAgICAgICAgICAgICAgICBvd25lZEljb24uY2xhc3NMaXN0LmFkZCgnb3duZWQtaWNvbicpO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBsZXQgaWNvblBhdGggPVxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bcHJvcF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiY2hlY2suc3ZnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2xvc2UtcmVkLnN2Z1wiXG4gICAgICAgICAgICAgICAgICAgIG93bmVkSWNvbi5zcmMgPSBcIi4uL2ltYWdlcy9cIiArIGljb25QYXRoO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChvd25lZEljb24pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJmb3JtYXRcIjpcbiAgICAgICAgICAgICAgICAgICAgZGF0YUNlbGwudGV4dENvbnRlbnQgPSBhbGJ1bVtwcm9wXS5qb2luKFwiLCBcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGRhdGFDZWxsLnRleHRDb250ZW50ID0gYWxidW1bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGRhdGFDZWxsKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyBDcmVhdGUgcmVtb3ZlLWFsYnVtIGJ1dHRvblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVSZW1vdmVCdXR0b24gKHJvdykge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIHRyYXNoY2FuIGJ1dHRvbiBhbmQgYXBwZW5kIGl0IHRvIHJvd1xuICAgICAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG4gICAgICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NMaXN0LmFkZChcInJlbW92ZS1hbGJ1bVwiLCBcImltZy1idXR0b25cIiwgXCJoaWRkZW5cIik7XG4gICAgICAgICAgICByZW1vdmVCdXR0b24udGl0bGUgPSBcIkRlbGV0ZSBBbGJ1bVwiO1xuXG4gICAgICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xuXG4gICAgICAgICAgICAvLyBDb25uZWN0IG5ldyByb3cgc28gdGhhdCByZW1vdmUtaWNvbiBvbmx5IGFwcGVhcnMgb24gaG92ZXJcbiAgICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ29ubmVjdCBidXR0b24gdG8gcmVtb3ZlQWxidW0gZnVuY3Rpb25cbiAgICAgICAgICAgIHJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSByb3cuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcbiAgICAgICAgICAgICAgICBtdXNpY0xpYnJhcnkuZGVsZXRlQWxidW0oaWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhQ2VsbFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gY3JlYXRlUmVtb3ZlQnV0dG9uKHJvdyk7XG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xuICAgIFxuICAgICAgICAvLyBBcHBlbmQgbmV3IHJvd1xuICAgICAgICBjb250ZW50cy5hcHBlbmRDaGlsZChyb3cpO1xuICAgIH1cbn0pKCk7XG5cbnZhciB0YWJsZUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIiksXG4gICAgICAgICBzb3J0YWJsZUhlYWRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGFibGUgdGguc29ydGFibGVcIik7XG4gICAgdmFyIGN1cnJTb3J0aW5nID0geyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCIgfTtcblxuICAgIHNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfc29ydFRhYmxlKTtcbiAgICB9KTtcblxuICAgIGV2ZW50cy5vbihcImFsYnVtRGVsZXRlZFwiLCBfcmVtb3ZlUm93KTtcblxuICAgIGZ1bmN0aW9uIF9yZW1vdmVSb3coaWQpIHtcbiAgICAgICAgLy8gQXNrIGNvbmZpcm1hdGlvbiBiZWZvcmUgcmVtb3ZpbmcgYWxidW1cbiAgICAgICAgaWYgKCFjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGFsYnVtP1wiKSkgcmV0dXJuO1xuICAgIFxuICAgICAgICAvLyBSZW1vdmUgcm93IGFuZCBhbGJ1bSBmcm9tIGxpYnJhcnlcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdHJbZGF0YS1pZD0ke2lkfV1gKVxuICAgICAgICBcbiAgICAgICAgY29udGVudHMucmVtb3ZlQ2hpbGQocm93KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfc29ydFRhYmxlKGUpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBuZXdTb3J0QnkgPSBoZWFkZXIuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgICAgIGNvbnN0IHsgYnk6IHNvcnRCeSwgb3JkOiBzb3J0T3JkIH0gPSBjdXJyU29ydGluZztcbiAgICBcbiAgICAgICAgLy8gSWYgc29ydGluZyBuZXcgcm93IGZsaXAgcm93IG9yZGVyLCBlbHNlIHJvdyBvcmRlciBhcyBhc2MgYXMgZGVmYXVsdFxuICAgICAgICBpZiAobmV3U29ydEJ5ID09PSBzb3J0QnkpIHtcbiAgICAgICAgICAgIGN1cnJTb3J0aW5nLm9yZCA9IHNvcnRPcmQgPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5ieSA9IG5ld1NvcnRCeTtcbiAgICAgICAgICAgIGN1cnJTb3J0aW5nLm9yZCA9IFwiYXNjXCI7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gU29ydCBsaWJyYXJ5IGFsYnVtcztcbiAgICAgICAgbXVzaWNMaWJyYXJ5LnNvcnQoY3VyclNvcnRpbmcpO1xuICAgIFxuICAgICAgICAvLyBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGFuZCBkaXNwbGF5IHRoZSBjb3JyZXNwb25kaW5nIG9uZVxuICAgICAgICBfaGlkZVNvcnRpbmdBcnJvd3MoKTtcbiAgICAgICAgX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfcmVuZGVyU29ydGluZ0Fycm93KGhlYWRlcikge1xuICAgICAgICAvKiBBZGQgc29ydGluZyBhcnJvd3Mgd2l0aCB0aGUgY29ycmVwc29uZGluZyBvcmRlciBpbiB0aGUgY2xpY2tlZCBoZWFkZXIgKi9cbiAgICAgICAgY29uc3Qgc29ydEFycm93ID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCIuc29ydC1hcnJvd1wiKTtcblxuICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LmFkZChjdXJyU29ydGluZy5vcmQpO1xuICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX2hpZGVTb3J0aW5nQXJyb3dzKCkge1xuICAgICAgICAvKiBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGZvcm0gYWxsIGhlYWRlcnMgKi9cbiAgICAgICAgc29ydGFibGVIZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc29ydEFycm93ID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCIuc29ydC1hcnJvd1wiKTtcbiAgICBcbiAgICAgICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NcIik7XG4gICAgICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImRlc2NcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZXNldFNvcnRpbmcoKSB7XG4gICAgICAgIGN1cnJTb3J0aW5nID0geyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCIgfTtcblxuICAgICAgICBfaGlkZVNvcnRpbmdBcnJvd3MoKTtcbiAgICAgICAgX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckFsYnVtKGFsYnVtKSB7XG4gICAgICAgIHZhciBjdXJyRmlsdGVyID0gZmlsdGVyQ29udHJvbGxlci5nZXRDdXJyZW50RmlsdGVyKCk7XG4gICAgICAgIHZhciB7IHR5cGU6IGZpbHRlclR5cGUsIHZhbHVlOiBmaWx0ZXJWYWx1ZSB9ID0gY3VyckZpbHRlcjtcbiAgICBcbiAgICAgICAgLy8gUmVzZXQgZGlzcGxheSBpZiBubyBmaWx0ZXIgYXBwbHkgKGlucHV0IGVtcHR5KSBkbyBub3RoaW5nXG4gICAgICAgIGlmIChmaWx0ZXJWYWx1ZSA9PT0gXCJcIikgcmV0dXJuIHRydWU7XG4gICAgXG4gICAgICAgIHN3aXRjaCAoZmlsdGVyVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1widGl0bGVcIl0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgICAgICAvLyBNYXRjaCBhbnkgb2YgdGhlIGNvbW1hIHNlcGFyYXRlZCBtYXRjaGVzXG4gICAgICAgICAgICAgICAgY29uc3QgYXJ0aXN0TGlzdCA9IGZpbHRlclZhbHVlLnJlcGxhY2VBbGwoXCIgXCIsIFwiXCIpLnNwbGl0KC9bLDtdLyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFydGlzdExpc3Quc29tZSgoYXJ0aXN0KSA9PlxuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImFydGlzdFwiXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGFydGlzdC50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoID0gKHJlZ2V4KSA9PiBmaWx0ZXJWYWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgLy8gUmVnZXggZm9yIHllYXIgZm9yIGRpZmZlcmVudCByZWxlYXNlIHllYXIgZmlsdGVyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXhFcSA9IC9eXFxzKihcXGQrKVxccyokLywgLy8gU2luZ2xlIHllYXIgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhHdCA9IC8oPzpePlxccz8oXFxkKykkKS8sIC8vIEdyZWF0ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEx0ID0gLyg/Ol48XFxzPyhcXGQrKSQpLywgLy8gTG93ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEJ0dyA9IC8oPzpeKFxcZCspXFxzP1stLC87XVxccz8oXFxkKykkKS87IC8vVHdvIHZhbHVlcyBpbnRlcnZhbFxuICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXRjaChyZWdleEVxKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPT0gbWF0Y2gocmVnZXhFcSlbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEd0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPj0gbWF0Y2gocmVnZXhHdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEx0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhMdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEJ0dykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID49IG1hdGNoKHJlZ2V4QnR3KVsxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhCdHcpWzJdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIC8vIEFsbG93IHRoZSB1c2Ugb2YgZGlmZmVyZW50IHdvcmRzIGZvciB0cnVlIGFuZCBmYWxzZVxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwieWVzXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cnVlXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiMVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJub1wiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmFsc2VcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5vdCBvd25lZFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2FudFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiMFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcImZvcm1hdFwiOlxuICAgICAgICAgICAgICAgIC8vIEluIHRoaXMgZmlsdGVyIFwiK1wiID0gXCJhbmRcIiBhbmQgXCJbLDsvXVwiID0gXCJvclwiXG4gICAgICAgICAgICAgICAgbGV0IGZvcm1hdExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyVmFsdWUuaW5jbHVkZXMoXCIrXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5yZXBsYWNlQWxsKFwiIFwiLCBcIlwiKS5zcGxpdChcIitcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRMaXN0LmV2ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZvcm1hdCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImZvcm1hdFwiXS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWwpID0+IHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXRMaXN0ID0gZmlsdGVyVmFsdWUucmVwbGFjZUFsbChcIiBcIiwgXCJcIikuc3BsaXQoL1ssOy9dLyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRMaXN0LnNvbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAoZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiZm9ybWF0XCJdLmZpbmRJbmRleChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCkgPT4gdmFsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gRWxzZSBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBmaWx0ZXJBbGJ1bVxuICAgIH1cbn0pKCk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCJcbmltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiXG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIlxuaW1wb3J0IFwiLi90YWJsZS5qc1wiXG5pbXBvcnQgXCIuL2ZpbHRlci5qc1wiXG5pbXBvcnQgXCIuL21vZGFsLmpzXCJcblxuY29uc3QgZmlsZUxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlLWxvYWRlcicpO1xuXG5maWxlTG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGVMaXN0ID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgIHZhciBmaWxlID0gZmlsZUxpc3RbMF07XG4gICAgcmVhZEZpbGUoZmlsZSk7XG4gICAgZmlsZUxvYWRlci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9KTtcblxuZnVuY3Rpb24gcmVhZEZpbGUoZikge1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdmFyIG11c2ljQ29sbGVjdGlvbiA9IHBhcnNlQWxidW1MaWJyYXJ5KGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICBhZGRDb2xsZWN0aW9uKG11c2ljQ29sbGVjdGlvbilcbiAgICB9KTtcbiAgICByZWFkZXIucmVhZEFzVGV4dChmLCBcInV0Zi04XCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUNTViAoc3RyaW5nLCBkZWxpbWl0ZXI9XCIsXCIpIHtcbiAgICAvLyBDb21tZW50ZWQgY29kZSBpbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjkzMTQ3L2hvdy10by1wYXJzZS1jc3YtZGF0YVxuICAgIHZhciBvYmpQYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICAgICAgKFxuICAgICAgICAgICAgXCIoXFxcXFwiICsgZGVsaW1pdGVyICsgXCJ8XFxcXHI/XFxcXG58XFxcXHJ8XilcIiArICAvLyBEZWxpbWl0ZXJzXG4gICAgICAgICAgICBcIig/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInxcIiArIC8vIFF1b3RlZCBmaWVsZHNcbiAgICAgICAgICAgIFwiKFteXFxcIlxcXFxcIiArIGRlbGltaXRlciArIFwiXFxcXHJcXFxcbl0qKSlcIiAvLyBTdGFuZGFyZCBmaWVsZHNcbiAgICAgICAgKSwgXCJnaVwiKTtcblxuICAgIHZhciBhcnJEYXRhID0gW1tdXTtcbiAgICB2YXIgYXJyTWF0Y2hlcyA9IG51bGw7XG5cbiAgICB3aGlsZSAoYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyggc3RyaW5nICkpe1xuICAgICAgICB2YXIgc3RyTWF0Y2hlZERlbGltaXRlciA9IGFyck1hdGNoZXNbIDEgXTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJlxuICAgICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gZGVsaW1pdGVyXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgYXJyRGF0YS5wdXNoKCBbXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWRWYWx1ZTtcbiAgICAgICAgaWYgKGFyck1hdGNoZXNbIDIgXSl7XG4gICAgICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAyIF0ucmVwbGFjZShcbiAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKCBcIlxcXCJcXFwiXCIsIFwiZ1wiIClcbiAgICAgICAgICAgICAgICAsIFwiXFxcIlwiICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAzIF07XG4gICAgICAgIH1cblxuICAgICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKCBzdHJNYXRjaGVkVmFsdWUgKTtcbiAgICB9XG5cbiAgICByZXR1cm4oIGFyckRhdGEgKTtcbn1cblxuZnVuY3Rpb24gY3N2VG9PYmplY3QgKGNzdkNvbnRlbnQpIHtcbiAgICB2YXIgcHJvcHMgPSBjc3ZDb250ZW50WzBdO1xuICAgIHZhciBvYmplY3QgPSBbXTtcblxuICAgIGNzdkNvbnRlbnQuc2xpY2UoMSwgLTEpLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgdmFyIGl0ZW0gPSB7fTtcbiAgICAgICAgcm93LmZvckVhY2goKHZhbCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBpdGVtW3Byb3BzW2lkeF1dID0gdmFsO1xuICAgICAgICB9KVxuXG4gICAgICAgIG9iamVjdC5wdXNoKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICggb2JqZWN0IClcbn1cblxuZnVuY3Rpb24gcGFyc2VBbGJ1bUxpYnJhcnkoZmlsZUNvbnRlbnQpIHtcbiAgICB2YXIgcGFyc2VkQ1NWID0gcGFyc2VDU1YoZmlsZUNvbnRlbnQpO1xuICAgIHZhciBjb2xsZWN0aW9uID0gY3N2VG9PYmplY3QocGFyc2VkQ1NWKTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uXG59O1xuXG5mdW5jdGlvbiBhZGRDb2xsZWN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgY29sbGVjdGlvbi5mb3JFYWNoKChhbGJ1bSwgaWR4KSA9PiB7XG4gICAgICAgIHZhciBuZXdBbGJ1bSA9IEFsYnVtKHtcbiAgICAgICAgICAgIHRpdGxlOiBhbGJ1bVtcIk5vbWJyZVwiXSxcbiAgICAgICAgICAgIGFydGlzdDogYWxidW1bXCJBcnRpc3RhXCJdLFxuICAgICAgICAgICAgcmVsZWFzZV95ZWFyOiBhbGJ1bVtcIkFubyBsYW56YW1pZW50b1wiXSxcbiAgICAgICAgICAgIG93bmVkOiBhbGJ1bVtcIkFkcXVpcmlkb1wiXSA9PT0gXCIxXCIgP1xuICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgZm9ybWF0OiBhbGJ1bVtcIkZvcm1hdG9cIl0uaW5jbHVkZXMoXCIvXCIpID9cbiAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJGb3JtYXRvXCJdLnNwbGl0KFwiL1wiKSA6XG4gICAgICAgICAgICAgICAgICAgIFthbGJ1bVtcIkZvcm1hdG9cIl1dXG4gICAgICAgIH0pXG5cbiAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICB9KVxuXG4gICAgbXVzaWNMaWJyYXJ5LnNvcnQoeyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCJ9KVxufTtcblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9