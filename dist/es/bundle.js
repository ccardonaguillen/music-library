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
        record_format: typeof(record_format) === "string" ?
                       Array(record_format) :
                       record_format,
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
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("rowAdded", _render);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("rowDeleted", _render);

    function _render() {
        const totalEntries = _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].getAlbumList().length, // Length of library list
            shownEntries = tableContents.querySelectorAll("tr:not(.extra-info)").length; // Number of rows in table

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

    function addAlbum(newAlbum, pos) {
        // If position is provided then removes entry at pos and inserts new one
        if (albumList.every((album) => newAlbum.id !== album.id) ||
            newAlbum.id === albumList[pos].id) {
            if (typeof(pos) === "number") {
                albumList.splice(pos, 1, newAlbum);
                _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumEdited");
            } else {
                albumList.unshift(newAlbum);
                _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumAdded", newAlbum);
            }
        } else {
            // If the album exist log error message
            alert("This album already exists.");
            console.log("Repeated ID: " + newAlbum.id)
        }
    };

    function deleteAlbum(id) {
        /* Delete album with a given ID */
        albumList = albumList.filter((album) => album.id !== id);

        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumDeleted", id);
    }

    function editAlbum(id, newAlbum) {
        // newAlbum is the album object containing the updated info
        const albumIdx = albumList.findIndex(
            (album) => id === album.id
        );

        addAlbum(newAlbum, albumIdx);
    }

    function editAlbumDetails(id, newInfo) {
        const albumIdx = albumList.findIndex(
            (album) => id === album.id
        );

        for (const prop in newInfo) {
            albumList[albumIdx][prop] = newInfo[prop];
        }

        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumEdited");
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
        editAlbum,
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
/* harmony import */ var _album_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./album.js */ "./src/album.js");
/* harmony import */ var _library_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./library.js */ "./src/library.js");




var modalController = (function () {
    const overlay = document.querySelector(".modal-overlay"), 
        openButton = document.getElementById("open-modal"),
        closeButton = document.getElementById("close-modal"),
        modal = document.querySelector(".modal"),
        header = modal.querySelector("h2"),
        resetButton = document.querySelector('button[type="reset"]');

    openButton.addEventListener("click", () => _open("new"));
    closeButton.addEventListener("click", close);

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("editButtonClicked", album => _open("edit", album));

    function _open(mode, album) {
        /* Display form modal over main window and focus on first input */
        overlay.classList.remove("hidden");
        document.getElementById("new-title").focus();

        if (mode==="new") {
            modal.setAttribute("data-mode", "new"); 
            modal.setAttribute("data-album-id", ""); 
            header.textContent = "New Album";
            resetButton.textContent = "Reset";
        }  else if (mode==="edit") {
            modal.setAttribute("data-mode", "edit"); 
            modal.setAttribute("data-album-id", album.id); 
            header.textContent = "Edit Album";
            resetButton.textContent = "Cancel";
            _populateForm(album);
        }
    }
    
    function close() {
        /* Hide modal */
        overlay.classList.add("hidden");
        albumFormController.reset();
    }

    function _populateForm(album) {
        for (let prop in album) {
            switch (prop) {
                case "owned":
                case "favorite":
                case "album_format":
                    const radioButtons = document.querySelectorAll(
                        `input[type=radio][name=${prop}]`
                    );

                    for (let button of radioButtons) {
                        if (String(album[prop]) === button.value) {
                            button.click();
                            break;
                        }
                    }
                    break;

                case "record_format":
                    const checkBoxes = document.querySelectorAll(
                        `input[type=checkbox][name=${prop}]`
                    );

                    for (let box of checkBoxes) {
                        if (album[prop].some(format => format === box.value)) {
                            box.click();
                        }
                    }
                    break;
            
                default:
                    const input = document.querySelector(`input[name="${prop}"]`);

                    if (input && album[prop] !== "") {
                        input.value = album[prop];
                    }
                    break;
            }
        }
    }

    return {
        close
    }
})();

var albumFormController = (function () {
    const modal = document.querySelector(".modal"),
        form = document.getElementById("add-album"),
        resetButton = document.querySelector('button[type="reset"]'),
        ownsTrue = document.getElementById("owns-true"),
        ownsFalse = document.getElementById("owns-false"),
        recordFieldSet = document.getElementById("record-info-fs");

    // Submit and reset "New Album" form
    form.addEventListener("submit", _submitNewAlbum);
    resetButton.addEventListener("click", () => {
        reset();
        if (modal.getAttribute("data-mode") === "edit") modalController.close();
    });

    // Enable checkboxes when user clicks button and disable when not
    ownsTrue.addEventListener("change", _enableRecordFieldset);
    ownsFalse.addEventListener("change", _disableRecordFieldset);

    function reset() {
        form.reset();
        _disableRecordFieldset();
    }
    
    function _disableRecordFieldset() {
        /* Disable second fieldset  (Record info) */
        recordFieldSet.classList.add("hidden");
        recordFieldSet.disabled = true;
    }
    
    function _enableRecordFieldset() {
        /* Enable second fieldset  (Record info) */
        recordFieldSet.classList.remove("hidden");
        recordFieldSet.disabled = false;
    }
    
    function _submitNewAlbum(e) {
        // Prevent default submit action
        e.preventDefault();
    
        // Create new album object and add it to the library
        const newAlbum = (0,_album_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_processNewAlbumForm());

        const mode = modal.getAttribute("data-mode");
        const id = modal.getAttribute("data-album-id");

        if (mode === "new") {
            _library_js__WEBPACK_IMPORTED_MODULE_2__["default"].addAlbum(newAlbum);
        } else {
            _library_js__WEBPACK_IMPORTED_MODULE_2__["default"].editAlbum(id, newAlbum);
        }
        // Close form modal
        modalController.close();
    }
    
    function _processNewAlbumForm() {
        /* Process new album form to pass it to new album */
        let formData = new FormData(form);
    
        let formContent = Object.fromEntries(formData.entries());

        formContent["owned"] = formContent["owned"] === "true" ? true : false;
        formContent["favorite"] = formContent["favorite"] === "true" ? true : false;
        formContent["format"] = formData.getAll("format");
    
        return formContent;
    }

    return {
        reset
    }
})();

// var artistSuggestions = (function () {
//     const input = document.getElementById("new-artist"),
//         dropdown = document.querySelector(".suggestions"),
//         list = dropdown.firstElementChild;

//     // Suggest artists when inputing values or when clicking in input
//     input.addEventListener("input", _render);
//     input.addEventListener("focus", _render);

//     // Close suggestions div when clicking outside suggestion box
//     document.addEventListener("click", _close, true);

//     function _render(suggestedArtists) {
//         const inputValue = input.value;
//         // If user clears input, display placeholder and close suggestions
//         if (inputValue === "") {
//             input.placeholder = input.placeholder;
//             _close();
    
//             return;
//         }
//         musicLibrary.getAlbumList().map(
//             (album) => album.artist
//         );
//         // Compute artist suggestions given the current albums in the library
//         var suggestions = musicLibrary.getAlbumList().reduce((sugg, album) => {
//                 const artist = album.artist;
//                 if (artist.toLowerCase().includes(inputValue.toLowerCase())) {
//                     // Avoid duplicates
//                     if (sugg.indexOf(artist) === -1 ) sugg.push(artist);
//                 } 
//                 return sugg
//             }, []);
//         if (!suggestions.length) { // Hide dropdown if not suggestions
//             _close();
//             return;
//         }    
//         // Refresh div and display new suggestions
//         dropdown.classList.remove("hidden");
//         _clear();

//         // Regex to highlight match
//         const regex = new RegExp(`(.*)(${inputValue})(.*)`, "i");
//         suggestions.forEach(artist => {
//             // For each suggestion add list element highlighting match
//             const item = document.createElement("li");
//             var match = artist.match(regex);

//             item.innerHTML = `${match[1]}<strong>${match[2]}</strong>${match[3]}`;
//             list.appendChild(item);
    
//             // Add event listener to select suggestion
//             item.addEventListener("click", _inputSuggestion);
//         });
//     }

//     function _clear() {
//         /* Delete all suggestions */
//         while (list.lastElementChild) {
//             list.lastElementChild.remove();
//         }
//     }

//     function _close(e = null) {
//         /* Hide suggestions box */
//         // Do not register clicks in the input box
//         if (e && e.target === input) return;
            
//         // If the dropdown is already hidden do nothing
//         if (!dropdown.classList.contains("hidden")) {
//             _clear();
//             dropdown.classList.add("hidden");
//         }
//     }

//     function _inputSuggestion() {
//         /* Choose selected item and add it to the input */
//         input.value = this.textContent;
    
//         _close();
//     }    
// })();




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

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("albumAdded", _update);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("albumEdited", _update);
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
        row.classList.add("album-row");
        row.setAttribute("data-id", album.id);

        // Add album info
        const columns = ["title", "artist", "release_year", "owned", "favorite"];
        for (const prop of columns) {
            const dataCell = document.createElement("td");

            let iconPath = {
                owned: { true: "check.svg", false: "close-red.svg" },
                favorite: { true: "heart.svg", false: "blank.svg" },
            };

            let path
            switch (prop) {
                case "owned":
                case "favorite":
                    // Translate "true" or "false" to icon repr. accordingly
                    const propIcon = document.createElement('img')
                    propIcon.classList.add('cell-icon');
    
                    path = iconPath[prop][album[prop]];
                    propIcon.src = "../images/" + path;
    
                    dataCell.appendChild(propIcon)
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

        row.addEventListener("click", () => {
            const nextRow = row.nextSibling;

            _collapseExtraInfo(); // Close any opened extra-info panels
            // If the row had an extra-info panel then
            // do nothing (effectively closing it)
            if (nextRow && nextRow.classList.contains("extra-info")) return;
            _renderExtraInfo(album, row);
        });


        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("rowAdded");
    }

    function _collapseExtraInfo() {
        const extraRows = document.querySelectorAll(".extra-info");

        extraRows.forEach(row => {
            row.parentElement.removeChild(row);
        });
    }

    function _renderExtraInfo(album, row) {
        const extraInfo = document.createElement("tr");
        extraInfo.classList.add("extra-info");
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
        if (album.owned) _renderRecordInfo(recordInfo, album);

        
        container.append(albumJacket);
        container.append(generalInfo);
        container.append(recordInfo);

        dataCell.appendChild(container);
        extraInfo.appendChild(dataCell);

        // Insert after
        row.parentElement.insertBefore(extraInfo, row.nextSibling);

        dataCell.addEventListener("click", () => {
            _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("editButtonClicked", album);
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

            _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("rowDeleted");
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

module.exports = JSON.parse('{"one":{"title":"Yellow Submarine","artist":"The Beatles","release_year":1969,"owned":true,"favorite":false,"genre":"Rock","topRS1":254,"topRS3":324,"discogs":"https://www.discogs.com/es/release/651180-The-Beatles-Yellow-Submarine","wikipedia":"https://en.wikipedia.org/wiki/Yellow_Submarine_(album)","record_format":"Vinyl","album_format":"LP","edition_year":1969,"catalog_num":"1C 062-04 002","record_label":"Apple Records","country":"Germany","matrix":"YEX 715-1","condition":8,"notes":"Small defect on the cover","jacket":"https://i.discogs.com/-txGlfuZqxJ9j8tFkntqpiBd_LI4CiRT7LS7yRV_Pqs/rs:fit/g:sm/q:90/h:594/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY1MTE4/MC0xNjA0MDgzNjQw/LTk2NTkuanBlZw.jpeg"},"two":{"title":"Sticky Fingers","artist":"The Rolling Stones","release_year":1971,"owned":false,"favorite":false,"genre":"Rock","topRS1":100,"topRS3":231,"discogs":"https://www.discogs.com/release/11272687-The-Rolling-Stones-Sticky-Fingers-","wikipedia":"https://en.wikipedia.org/wiki/Sticky_Fingers","record_format":"","album_format":"","edition_year":"","catalog_num":"","record_label":"","country":"","matrix":"","condition":"","notes":"","jacket":"https://i.discogs.com/gP9LHUY5PNmzlMohCO3giDBZ32JqRQgQ6_TE5DwVFME/rs:fit/g:sm/q:90/h:600/w:589/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExMjcy/Njg3LTE2Mjk1Nzc1/NzQtNDYyNS5qcGVn.jpeg"},"three":{"title":"Boys Don\'t Cry","artist":"The Cure","release_year":1980,"owned":true,"favorite":true,"genre":"Rock","topRS1":254,"topRS3":324,"discogs":"https://www.discogs.com/es/release/651180-The-Beatles-Yellow-Submarine","wikipedia":"https://en.wikipedia.org/wiki/Boys_Don%27t_Cry_(The_Cure_album)","record_format":"Vinyl","album_format":"LP, Album","edition_year":1980,"catalog_num":"PB 2015","record_label":"Passport Records","country":"Canada","matrix":"YEX 715-1","condition":8,"notes":"","jacket":"https://upload.wikimedia.org/wikipedia/en/f/fa/Boys_Don%27t_Cry.jpg"},"four":{"title":"Favourite Worst Nightmare","artist":"Arctic Monkeys","release_year":2007,"owned":true,"favorite":true,"genre":"Rock","discogs":"https://www.discogs.com/es/release/651180-The-Beatles-Yellow-Submarine","wikipedia":"https://en.wikipedia.org/wiki/Favourite_Worst_Nightmare","record_format":["Vinyl","CD"],"album_format":"LP, Album","edition_year":2007,"catalog_num":"WIGLP188","record_label":"Domino","country":"UK","matrix":"WIGLP188 A-1","condition":8,"notes":"","jacket":"https://i.discogs.com/IJ9xP9SqH6qRnhyrli-g4vEG14Jxfa1NR-IshLANLaA/rs:fit/g:sm/q:90/h:579/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk1ODQ2/MC0xNjE2OTI1NDgx/LTkzODkuanBlZw.jpeg"}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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REFBaUQsY0FBYztBQUMvRDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQiwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDdGFEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05tQjtBQUNDO0FBQ0Q7QUFDQzs7QUFFb0I7QUFDVDs7QUFFL0IsYUFBYSxtQkFBTyxDQUFDLGlEQUFzQjs7QUFFM0M7QUFDQTtBQUNBLHVCQUF1QixxREFBSztBQUM1QixRQUFRLDREQUFxQjtBQUM3QjtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9hbGJ1bS5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2xpYnJhcnkuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9tb2RhbC5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL3RhYmxlLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBBbGJ1bSA9IChcbiAgICB7IHRpdGxlLFxuICAgICAgYXJ0aXN0LFxuICAgICAgcmVsZWFzZV95ZWFyLFxuICAgICAgb3duZWQsXG4gICAgICBmYXZvcml0ZSxcbiAgICAgIGdlbnJlLFxuICAgICAgdG9wUlMxLFxuICAgICAgdG9wUlMzLFxuICAgICAgZGlzY29ncyxcbiAgICAgIHdpa2lwZWRpYSxcbiAgICAgIHJlY29yZF9mb3JtYXQsXG4gICAgICBhbGJ1bV9mb3JtYXQsXG4gICAgICBjYXRhbG9nX251bSxcbiAgICAgIGVkaXRpb25feWVhcixcbiAgICAgIGNvdW50cnksXG4gICAgICByZWNvcmRfbGFiZWwsXG4gICAgICBtYXRyaXgsXG4gICAgICBjb25kaXRpb24sXG4gICAgICBub3RlcyxcbiAgICAgIGphY2tldFxuICAgIH1cbikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlkOiB0aXRsZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoL1xcVy9nLCBcIlwiKSArXG4gICAgICAgICAgICBhcnRpc3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlQWxsKC9cXFcvZywgXCJcIikgK1xuICAgICAgICAgICAgcmVsZWFzZV95ZWFyLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgYXJ0aXN0LFxuICAgICAgICByZWxlYXNlX3llYXIsXG4gICAgICAgIG93bmVkOiBCb29sZWFuKG93bmVkKSxcbiAgICAgICAgZmF2b3JpdGU6IEJvb2xlYW4oZmF2b3JpdGUpLFxuICAgICAgICBnZW5yZTogZ2VucmUgfHwgXCJcIixcbiAgICAgICAgdG9wUlMxOiB0b3BSUzEgfHwgXCJcIixcbiAgICAgICAgdG9wUlMzOiB0b3BSUzMgfHwgXCJcIixcbiAgICAgICAgZGlzY29nczogZGlzY29ncyB8fCBcIlwiLFxuICAgICAgICB3aWtpcGVkaWE6IHdpa2lwZWRpYSB8fCBcIlwiLFxuICAgICAgICByZWNvcmRfZm9ybWF0OiB0eXBlb2YocmVjb3JkX2Zvcm1hdCkgPT09IFwic3RyaW5nXCIgP1xuICAgICAgICAgICAgICAgICAgICAgICBBcnJheShyZWNvcmRfZm9ybWF0KSA6XG4gICAgICAgICAgICAgICAgICAgICAgIHJlY29yZF9mb3JtYXQsXG4gICAgICAgIGFsYnVtX2Zvcm1hdDogYWxidW1fZm9ybWF0IHx8IFwiXCIsXG4gICAgICAgIGNhdGFsb2dfbnVtOiBjYXRhbG9nX251bSB8fCBcIlwiLFxuICAgICAgICBlZGl0aW9uX3llYXI6IGVkaXRpb25feWVhciB8fCBcIlwiLFxuICAgICAgICBjb3VudHJ5OiBjb3VudHJ5IHx8IFwiXCIsXG4gICAgICAgIHJlY29yZF9sYWJlbDogcmVjb3JkX2xhYmVsIHx8IFwiXCIsXG4gICAgICAgIG1hdHJpeDogbWF0cml4IHx8IFwiXCIsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZGl0aW9uIHx8IFwiXCIsXG4gICAgICAgIG5vdGVzOiBub3RlcyB8fCBcIk5vbmVcIixcbiAgICAgICAgamFja2V0OiBqYWNrZXQgfHwgXCJcIlxuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsYnVtIiwidmFyIGV2ZW50cyA9IHtcbiAgICBldmVudHM6IHt9LFxuICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgICB9LFxuICAgIG9mZjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgZm4oZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBldmVudHMiLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5cbnZhciBzdW1tYXJ5VmlldyA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50cmllcy1jb3VudFwiKSxcbiAgICAgICAgdGFibGVDb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpO1xuXG4gICAgZXZlbnRzLm9uKFwiZmlsdGVyQXBwbGllZFwiLCBfcmVuZGVyKTtcbiAgICBldmVudHMub24oXCJyb3dBZGRlZFwiLCBfcmVuZGVyKTtcbiAgICBldmVudHMub24oXCJyb3dEZWxldGVkXCIsIF9yZW5kZXIpO1xuXG4gICAgZnVuY3Rpb24gX3JlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdG90YWxFbnRyaWVzID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLmxlbmd0aCwgLy8gTGVuZ3RoIG9mIGxpYnJhcnkgbGlzdFxuICAgICAgICAgICAgc2hvd25FbnRyaWVzID0gdGFibGVDb250ZW50cy5xdWVyeVNlbGVjdG9yQWxsKFwidHI6bm90KC5leHRyYS1pbmZvKVwiKS5sZW5ndGg7IC8vIE51bWJlciBvZiByb3dzIGluIHRhYmxlXG5cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGFsYnVtcyBpbiB0aGUgbGlicmFyeSBwcmludCB3ZWxjb21lIG1lc3NhZ2VcbiAgICAgICAgc3VtbWFyeS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICB0b3RhbEVudHJpZXMgPT09IDBcbiAgICAgICAgICAgICAgICA/IFwiTm8gYWxidW1zIGluIHRoZSBsaWJyYXJ5LiBBZGQgb25lIGJ5IGNsaWNraW5nIHRoZSBidXR0b25cIlxuICAgICAgICAgICAgICAgIDogYFNob3dpbmcgJHtzaG93bkVudHJpZXN9IG91dCBvZiAke3RvdGFsRW50cmllc30gYWxidW1zYDtcbiAgICB9XG59KSgpO1xuXG52YXIgZmlsdGVyQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJGaWx0ZXIgPSB7IHR5cGU6IFwiXCIsIHZhbHVlOiBcIlwiIH07XG4gICAgY29uc3QgZmlsdGVyRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLWJ5XCIpLFxuICAgICAgICBmaWx0ZXJTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlclwiKSxcbiAgICAgICAgZmlsdGVyVmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci12YWx1ZVwiKSxcbiAgICAgICAgZW50cmllc0NvdW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbnRyaWVzLWNvdW50XCIpO1xuXG4gICAgZmlsdGVyU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgX3Jlc2V0RmlsdGVyKTtcbiAgICBmaWx0ZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgX2FwcGx5RmlsdGVyKTtcbiAgICBmaWx0ZXJWYWx1ZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgX3Jlc2V0RmlsdGVyKTtcblxuICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRGaWx0ZXIoKSB7XG4gICAgICAgIHJldHVybiBjdXJyRmlsdGVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9hcHBseUZpbHRlcihlID0gbnVsbCkge1xuICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgc3VibWl0IGJlaGF2aW91clxuICAgICAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICAvLyBVcGRhdGUgY3VycmVudCBmaWx0ZXIgd2l0aCB2YWx1ZXMgZnJvbSB0aGUgZmlsdGVyIGZvcm1cbiAgICAgICAgY3VyckZpbHRlcltcInR5cGVcIl0gPSBmaWx0ZXJTZWxlY3QudmFsdWU7XG4gICAgICAgIGN1cnJGaWx0ZXJbXCJ2YWx1ZVwiXSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLXZhbHVlXCIpLnZhbHVlO1xuICAgIFxuICAgICAgICAvLyBVcGRhdGUgdGFibGVcbiAgICAgICAgZXZlbnRzLmVtaXQoXCJmaWx0ZXJBcHBsaWVkXCIsIGN1cnJGaWx0ZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfcmVuZGVyUGxhY2Vob2xkZXIoKSB7XG4gICAgICAgIC8qIFVwZGF0ZSBwbGFjZWhvbGRlciBtZXNzYWdlIGFjY29yZGluZyB0byB0aGUgc2VsZWN0ZWQgb3B0aW9uICovXG4gICAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlclNlbGVjdC52YWx1ZTtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB7XG4gICAgICAgICAgICB0aXRsZTogJ2UuZy4gXCJzdWJtYXJpbmVcIicsXG4gICAgICAgICAgICBhcnRpc3Q6ICdlLmcuIFwiemVwcGVsaW5cIiwgXCJiZWF0bGVzLCByb2xsaW5nXCInLFxuICAgICAgICAgICAgcmVsZWFzZV95ZWFyOiAnZS5nLiBcIjE5OTBcIiwgXCIxLTIwMDBcIiwgXCI+MTkwMFwiLCBcIjwxOTgwXCInLFxuICAgICAgICAgICAgb3duZWQ6ICdlLmcuIFwidHJ1ZVwiLCBcIm5vXCIsIFwibm90IG93bmVkXCInLFxuICAgICAgICAgICAgZm9ybWF0OiAnZS5nLiBcIlZ5bmlsXCIsIFwiY2QrY2FzZXR0ZVwiLCBcInZ5bmlsL0NEXCInXG4gICAgICAgIH07XG5cbiAgICAgICAgZmlsdGVyVmFsdWUucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcltmaWx0ZXJdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZXNldEZpbHRlcihlKSB7XG4gICAgICAgIGlmIChlLnR5cGUgPT09IFwiaW5wdXRcIiAmJiBmaWx0ZXJWYWx1ZS52YWx1ZSAhPT0gXCJcIikgcmV0dXJuO1xuICAgICAgICAvKiBSZXNldCBmaWx0ZXIgd2hlbiB0aGUgaW5wdXQgYm94IGlzIGVtcHR5IGFuZCBhcHBseSBlbXB0eSBmaWx0ZXIgKi9cbiAgICAgICAgXG4gICAgICAgIGZpbHRlclZhbHVlLnZhbHVlID0gXCJcIjtcbiAgICAgICAgX3JlbmRlclBsYWNlaG9sZGVyKCk7XG4gICAgICAgIF9hcHBseUZpbHRlcigpO1xuICAgIFxuICAgIFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSAgICBcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldEN1cnJlbnRGaWx0ZXIsXG4gICAgfVxufSkoKTtcblxuZXhwb3J0IHsgZmlsdGVyQ29udHJvbGxlciB9IiwiaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHMuanNcIlxuXG52YXIgbXVzaWNMaWJyYXJ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYWxidW1MaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBnZXRBbGJ1bUxpc3QoKSB7XG4gICAgICAgIHJldHVybiBhbGJ1bUxpc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQWxidW0obmV3QWxidW0sIHBvcykge1xuICAgICAgICAvLyBJZiBwb3NpdGlvbiBpcyBwcm92aWRlZCB0aGVuIHJlbW92ZXMgZW50cnkgYXQgcG9zIGFuZCBpbnNlcnRzIG5ldyBvbmVcbiAgICAgICAgaWYgKGFsYnVtTGlzdC5ldmVyeSgoYWxidW0pID0+IG5ld0FsYnVtLmlkICE9PSBhbGJ1bS5pZCkgfHxcbiAgICAgICAgICAgIG5ld0FsYnVtLmlkID09PSBhbGJ1bUxpc3RbcG9zXS5pZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZihwb3MpID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgYWxidW1MaXN0LnNwbGljZShwb3MsIDEsIG5ld0FsYnVtKTtcbiAgICAgICAgICAgICAgICBldmVudHMuZW1pdChcImFsYnVtRWRpdGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3QudW5zaGlmdChuZXdBbGJ1bSk7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bUFkZGVkXCIsIG5ld0FsYnVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBhbGJ1bSBleGlzdCBsb2cgZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgYWxlcnQoXCJUaGlzIGFsYnVtIGFscmVhZHkgZXhpc3RzLlwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVwZWF0ZWQgSUQ6IFwiICsgbmV3QWxidW0uaWQpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZGVsZXRlQWxidW0oaWQpIHtcbiAgICAgICAgLyogRGVsZXRlIGFsYnVtIHdpdGggYSBnaXZlbiBJRCAqL1xuICAgICAgICBhbGJ1bUxpc3QgPSBhbGJ1bUxpc3QuZmlsdGVyKChhbGJ1bSkgPT4gYWxidW0uaWQgIT09IGlkKTtcblxuICAgICAgICBldmVudHMuZW1pdChcImFsYnVtRGVsZXRlZFwiLCBpZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZWRpdEFsYnVtKGlkLCBuZXdBbGJ1bSkge1xuICAgICAgICAvLyBuZXdBbGJ1bSBpcyB0aGUgYWxidW0gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHVwZGF0ZWQgaW5mb1xuICAgICAgICBjb25zdCBhbGJ1bUlkeCA9IGFsYnVtTGlzdC5maW5kSW5kZXgoXG4gICAgICAgICAgICAoYWxidW0pID0+IGlkID09PSBhbGJ1bS5pZFxuICAgICAgICApO1xuXG4gICAgICAgIGFkZEFsYnVtKG5ld0FsYnVtLCBhbGJ1bUlkeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZWRpdEFsYnVtRGV0YWlscyhpZCwgbmV3SW5mbykge1xuICAgICAgICBjb25zdCBhbGJ1bUlkeCA9IGFsYnVtTGlzdC5maW5kSW5kZXgoXG4gICAgICAgICAgICAoYWxidW0pID0+IGlkID09PSBhbGJ1bS5pZFxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBuZXdJbmZvKSB7XG4gICAgICAgICAgICBhbGJ1bUxpc3RbYWxidW1JZHhdW3Byb3BdID0gbmV3SW5mb1twcm9wXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1FZGl0ZWRcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc29ydCh7IGJ5LCBvcmQgPSBcImFzY1wiIH0pIHtcbiAgICAgICAgLyogUmV2ZXJzZSBzb3J0aW5nIGFsZ29yaXRobSBpcyBvcmQgPSAnZGVzYyc7ICovXG4gICAgICAgIGxldCBzb3J0T3JkZXIgPSBvcmQgPT09IFwiYXNjXCIgPyAxIDogLTE7XG5cbiAgICAgICAgc3dpdGNoIChieSkge1xuICAgICAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gbG9jYWxlQ29tcGFyZSB1c2VkIHRvIGNvbXBhcmUgc3RyaW5nIHdpdGhvdXQgbWF0aCBvcGVyYXRvcnNcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc29ydChcbiAgICAgICAgICAgICAgICAgICAgKGEsIGIpID0+IGFbYnldLmxvY2FsZUNvbXBhcmUoYltieV0pICogc29ydE9yZGVyXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWxlYXNlX3llYXJcIjpcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc29ydCgoYSwgYikgPT4gKGFbYnldIC0gYltieV0pICogc29ydE9yZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwibGlicmFyeVNvcnRlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRBbGJ1bUxpc3QsXG4gICAgICAgIGFkZEFsYnVtLFxuICAgICAgICBkZWxldGVBbGJ1bSxcbiAgICAgICAgZWRpdEFsYnVtLFxuICAgICAgICBzb3J0XG4gICAgfVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbXVzaWNMaWJyYXJ5XG5cbiIsImltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiXG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIlxuXG5jb25zdCBmaWxlTG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtbG9hZGVyJyk7XG5cbmZpbGVMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZUxpc3QgPSBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgdmFyIGZpbGUgPSBmaWxlTGlzdFswXTtcbiAgICByZWFkRmlsZShmaWxlKTtcbiAgICBmaWxlTG9hZGVyLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH0pO1xuXG5mdW5jdGlvbiByZWFkRmlsZShmKSB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgICB2YXIgbXVzaWNDb2xsZWN0aW9uID0gcGFyc2VBbGJ1bUxpYnJhcnkoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIGFkZENvbGxlY3Rpb24obXVzaWNDb2xsZWN0aW9uKVxuICAgIH0pO1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGYsIFwidXRmLThcIik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ1NWIChzdHJpbmcsIGRlbGltaXRlcj1cIixcIikge1xuICAgIC8vIENvbW1lbnRlZCBjb2RlIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyOTMxNDcvaG93LXRvLXBhcnNlLWNzdi1kYXRhXG4gICAgdmFyIG9ialBhdHRlcm4gPSBuZXcgUmVnRXhwKFxuICAgICAgICAoXG4gICAgICAgICAgICBcIihcXFxcXCIgKyBkZWxpbWl0ZXIgKyBcInxcXFxccj9cXFxcbnxcXFxccnxeKVwiICsgIC8vIERlbGltaXRlcnNcbiAgICAgICAgICAgIFwiKD86XFxcIihbXlxcXCJdKig/OlxcXCJcXFwiW15cXFwiXSopKilcXFwifFwiICsgLy8gUXVvdGVkIGZpZWxkc1xuICAgICAgICAgICAgXCIoW15cXFwiXFxcXFwiICsgZGVsaW1pdGVyICsgXCJcXFxcclxcXFxuXSopKVwiIC8vIFN0YW5kYXJkIGZpZWxkc1xuICAgICAgICApLCBcImdpXCIpO1xuXG4gICAgdmFyIGFyckRhdGEgPSBbW11dO1xuICAgIHZhciBhcnJNYXRjaGVzID0gbnVsbDtcblxuICAgIHdoaWxlIChhcnJNYXRjaGVzID0gb2JqUGF0dGVybi5leGVjKCBzdHJpbmcgKSl7XG4gICAgICAgIHZhciBzdHJNYXRjaGVkRGVsaW1pdGVyID0gYXJyTWF0Y2hlc1sgMSBdO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIubGVuZ3RoICYmXG4gICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyICE9PSBkZWxpbWl0ZXJcbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICBhcnJEYXRhLnB1c2goIFtdICk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlO1xuICAgICAgICBpZiAoYXJyTWF0Y2hlc1sgMiBdKXtcbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDIgXS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAoIFwiXFxcIlxcXCJcIiwgXCJnXCIgKVxuICAgICAgICAgICAgICAgICwgXCJcXFwiXCIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDMgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyckRhdGFbIGFyckRhdGEubGVuZ3RoIC0gMSBdLnB1c2goIHN0ck1hdGNoZWRWYWx1ZSApO1xuICAgIH1cblxuICAgIHJldHVybiggYXJyRGF0YSApO1xufVxuXG5mdW5jdGlvbiBjc3ZUb09iamVjdCAoY3N2Q29udGVudCkge1xuICAgIHZhciBwcm9wcyA9IGNzdkNvbnRlbnRbMF07XG4gICAgdmFyIG9iamVjdCA9IFtdO1xuXG4gICAgY3N2Q29udGVudC5zbGljZSgxLCAtMSkuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICB2YXIgaXRlbSA9IHt9O1xuICAgICAgICByb3cuZm9yRWFjaCgodmFsLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGl0ZW1bcHJvcHNbaWR4XV0gPSB2YWw7XG4gICAgICAgIH0pXG5cbiAgICAgICAgb2JqZWN0LnB1c2goaXRlbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCBvYmplY3QgKVxufVxuXG5mdW5jdGlvbiBwYXJzZUFsYnVtTGlicmFyeShmaWxlQ29udGVudCkge1xuICAgIHZhciBwYXJzZWRDU1YgPSBwYXJzZUNTVihmaWxlQ29udGVudCk7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBjc3ZUb09iamVjdChwYXJzZWRDU1YpO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb25cbn07XG5cbmZ1bmN0aW9uIGFkZENvbGxlY3Rpb24gKGNvbGxlY3Rpb24pIHtcbiAgICBjb2xsZWN0aW9uLmZvckVhY2goKGFsYnVtLCBpZHgpID0+IHtcbiAgICAgICAgdmFyIG5ld0FsYnVtID0gQWxidW0oe1xuICAgICAgICAgICAgdGl0bGU6IGFsYnVtW1wiTm9tYnJlXCJdLFxuICAgICAgICAgICAgYXJ0aXN0OiBhbGJ1bVtcIkFydGlzdGFcIl0sXG4gICAgICAgICAgICByZWxlYXNlX3llYXI6IGFsYnVtW1wiQW5vIGxhbnphbWllbnRvXCJdLFxuICAgICAgICAgICAgb3duZWQ6IGFsYnVtW1wiQWRxdWlyaWRvXCJdID09PSBcIjFcIiA/XG4gICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBmb3JtYXQ6IGFsYnVtW1wiRm9ybWF0b1wiXS5pbmNsdWRlcyhcIi9cIikgP1xuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcIkZvcm1hdG9cIl0uc3BsaXQoXCIvXCIpIDpcbiAgICAgICAgICAgICAgICAgICAgW2FsYnVtW1wiRm9ybWF0b1wiXV1cbiAgICAgICAgfSlcblxuICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgIH0pXG5cbiAgICBtdXNpY0xpYnJhcnkuc29ydCh7IGJ5OiBcInRpdGxlXCIsIG9yZDogXCJhc2NcIn0pXG59O1xuXG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IEFsYnVtIGZyb20gXCIuL2FsYnVtLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxudmFyIG1vZGFsQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtb3ZlcmxheVwiKSwgXG4gICAgICAgIG9wZW5CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbW9kYWxcIiksXG4gICAgICAgIGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZS1tb2RhbFwiKSxcbiAgICAgICAgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsXCIpLFxuICAgICAgICBoZWFkZXIgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiaDJcIiksXG4gICAgICAgIHJlc2V0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uW3R5cGU9XCJyZXNldFwiXScpO1xuXG4gICAgb3BlbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gX29wZW4oXCJuZXdcIikpO1xuICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZSk7XG5cbiAgICBldmVudHMub24oXCJlZGl0QnV0dG9uQ2xpY2tlZFwiLCBhbGJ1bSA9PiBfb3BlbihcImVkaXRcIiwgYWxidW0pKTtcblxuICAgIGZ1bmN0aW9uIF9vcGVuKG1vZGUsIGFsYnVtKSB7XG4gICAgICAgIC8qIERpc3BsYXkgZm9ybSBtb2RhbCBvdmVyIG1haW4gd2luZG93IGFuZCBmb2N1cyBvbiBmaXJzdCBpbnB1dCAqL1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRpdGxlXCIpLmZvY3VzKCk7XG5cbiAgICAgICAgaWYgKG1vZGU9PT1cIm5ld1wiKSB7XG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIiwgXCJuZXdcIik7IFxuICAgICAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKFwiZGF0YS1hbGJ1bS1pZFwiLCBcIlwiKTsgXG4gICAgICAgICAgICBoZWFkZXIudGV4dENvbnRlbnQgPSBcIk5ldyBBbGJ1bVwiO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udGV4dENvbnRlbnQgPSBcIlJlc2V0XCI7XG4gICAgICAgIH0gIGVsc2UgaWYgKG1vZGU9PT1cImVkaXRcIikge1xuICAgICAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIsIFwiZWRpdFwiKTsgXG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFsYnVtLWlkXCIsIGFsYnVtLmlkKTsgXG4gICAgICAgICAgICBoZWFkZXIudGV4dENvbnRlbnQgPSBcIkVkaXQgQWxidW1cIjtcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uLnRleHRDb250ZW50ID0gXCJDYW5jZWxcIjtcbiAgICAgICAgICAgIF9wb3B1bGF0ZUZvcm0oYWxidW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICAvKiBIaWRlIG1vZGFsICovXG4gICAgICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgYWxidW1Gb3JtQ29udHJvbGxlci5yZXNldCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9wb3B1bGF0ZUZvcm0oYWxidW0pIHtcbiAgICAgICAgZm9yIChsZXQgcHJvcCBpbiBhbGJ1bSkge1xuICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImZhdm9yaXRlXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImFsYnVtX2Zvcm1hdFwiOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYWRpb0J1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgYGlucHV0W3R5cGU9cmFkaW9dW25hbWU9JHtwcm9wfV1gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYnV0dG9uIG9mIHJhZGlvQnV0dG9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFN0cmluZyhhbGJ1bVtwcm9wXSkgPT09IGJ1dHRvbi52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInJlY29yZF9mb3JtYXRcIjpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tCb3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBgaW5wdXRbdHlwZT1jaGVja2JveF1bbmFtZT0ke3Byb3B9XWBcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBib3ggb2YgY2hlY2tCb3hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsYnVtW3Byb3BdLnNvbWUoZm9ybWF0ID0+IGZvcm1hdCA9PT0gYm94LnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFtuYW1lPVwiJHtwcm9wfVwiXWApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dCAmJiBhbGJ1bVtwcm9wXSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBhbGJ1bVtwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNsb3NlXG4gICAgfVxufSkoKTtcblxudmFyIGFsYnVtRm9ybUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKSxcbiAgICAgICAgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLWFsYnVtXCIpLFxuICAgICAgICByZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwicmVzZXRcIl0nKSxcbiAgICAgICAgb3duc1RydWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm93bnMtdHJ1ZVwiKSxcbiAgICAgICAgb3duc0ZhbHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvd25zLWZhbHNlXCIpLFxuICAgICAgICByZWNvcmRGaWVsZFNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkLWluZm8tZnNcIik7XG5cbiAgICAvLyBTdWJtaXQgYW5kIHJlc2V0IFwiTmV3IEFsYnVtXCIgZm9ybVxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBfc3VibWl0TmV3QWxidW0pO1xuICAgIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHJlc2V0KCk7XG4gICAgICAgIGlmIChtb2RhbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIikgPT09IFwiZWRpdFwiKSBtb2RhbENvbnRyb2xsZXIuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIC8vIEVuYWJsZSBjaGVja2JveGVzIHdoZW4gdXNlciBjbGlja3MgYnV0dG9uIGFuZCBkaXNhYmxlIHdoZW4gbm90XG4gICAgb3duc1RydWUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfZW5hYmxlUmVjb3JkRmllbGRzZXQpO1xuICAgIG93bnNGYWxzZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIF9kaXNhYmxlUmVjb3JkRmllbGRzZXQpO1xuXG4gICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgX2Rpc2FibGVSZWNvcmRGaWVsZHNldCgpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfZGlzYWJsZVJlY29yZEZpZWxkc2V0KCkge1xuICAgICAgICAvKiBEaXNhYmxlIHNlY29uZCBmaWVsZHNldCAgKFJlY29yZCBpbmZvKSAqL1xuICAgICAgICByZWNvcmRGaWVsZFNldC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICByZWNvcmRGaWVsZFNldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9lbmFibGVSZWNvcmRGaWVsZHNldCgpIHtcbiAgICAgICAgLyogRW5hYmxlIHNlY29uZCBmaWVsZHNldCAgKFJlY29yZCBpbmZvKSAqL1xuICAgICAgICByZWNvcmRGaWVsZFNldC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICByZWNvcmRGaWVsZFNldC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfc3VibWl0TmV3QWxidW0oZSkge1xuICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgc3VibWl0IGFjdGlvblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgYWxidW0gb2JqZWN0IGFuZCBhZGQgaXQgdG8gdGhlIGxpYnJhcnlcbiAgICAgICAgY29uc3QgbmV3QWxidW0gPSBBbGJ1bShfcHJvY2Vzc05ld0FsYnVtRm9ybSgpKTtcblxuICAgICAgICBjb25zdCBtb2RlID0gbW9kYWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIpO1xuICAgICAgICBjb25zdCBpZCA9IG1vZGFsLmdldEF0dHJpYnV0ZShcImRhdGEtYWxidW0taWRcIik7XG5cbiAgICAgICAgaWYgKG1vZGUgPT09IFwibmV3XCIpIHtcbiAgICAgICAgICAgIG11c2ljTGlicmFyeS5hZGRBbGJ1bShuZXdBbGJ1bSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtdXNpY0xpYnJhcnkuZWRpdEFsYnVtKGlkLCBuZXdBbGJ1bSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2xvc2UgZm9ybSBtb2RhbFxuICAgICAgICBtb2RhbENvbnRyb2xsZXIuY2xvc2UoKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3Byb2Nlc3NOZXdBbGJ1bUZvcm0oKSB7XG4gICAgICAgIC8qIFByb2Nlc3MgbmV3IGFsYnVtIGZvcm0gdG8gcGFzcyBpdCB0byBuZXcgYWxidW0gKi9cbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xuICAgIFxuICAgICAgICBsZXQgZm9ybUNvbnRlbnQgPSBPYmplY3QuZnJvbUVudHJpZXMoZm9ybURhdGEuZW50cmllcygpKTtcblxuICAgICAgICBmb3JtQ29udGVudFtcIm93bmVkXCJdID0gZm9ybUNvbnRlbnRbXCJvd25lZFwiXSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGZvcm1Db250ZW50W1wiZmF2b3JpdGVcIl0gPSBmb3JtQ29udGVudFtcImZhdm9yaXRlXCJdID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgZm9ybUNvbnRlbnRbXCJmb3JtYXRcIl0gPSBmb3JtRGF0YS5nZXRBbGwoXCJmb3JtYXRcIik7XG4gICAgXG4gICAgICAgIHJldHVybiBmb3JtQ29udGVudDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXNldFxuICAgIH1cbn0pKCk7XG5cbi8vIHZhciBhcnRpc3RTdWdnZXN0aW9ucyA9IChmdW5jdGlvbiAoKSB7XG4vLyAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1hcnRpc3RcIiksXG4vLyAgICAgICAgIGRyb3Bkb3duID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKSxcbi8vICAgICAgICAgbGlzdCA9IGRyb3Bkb3duLmZpcnN0RWxlbWVudENoaWxkO1xuXG4vLyAgICAgLy8gU3VnZ2VzdCBhcnRpc3RzIHdoZW4gaW5wdXRpbmcgdmFsdWVzIG9yIHdoZW4gY2xpY2tpbmcgaW4gaW5wdXRcbi8vICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgX3JlbmRlcik7XG4vLyAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIF9yZW5kZXIpO1xuXG4vLyAgICAgLy8gQ2xvc2Ugc3VnZ2VzdGlvbnMgZGl2IHdoZW4gY2xpY2tpbmcgb3V0c2lkZSBzdWdnZXN0aW9uIGJveFxuLy8gICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfY2xvc2UsIHRydWUpO1xuXG4vLyAgICAgZnVuY3Rpb24gX3JlbmRlcihzdWdnZXN0ZWRBcnRpc3RzKSB7XG4vLyAgICAgICAgIGNvbnN0IGlucHV0VmFsdWUgPSBpbnB1dC52YWx1ZTtcbi8vICAgICAgICAgLy8gSWYgdXNlciBjbGVhcnMgaW5wdXQsIGRpc3BsYXkgcGxhY2Vob2xkZXIgYW5kIGNsb3NlIHN1Z2dlc3Rpb25zXG4vLyAgICAgICAgIGlmIChpbnB1dFZhbHVlID09PSBcIlwiKSB7XG4vLyAgICAgICAgICAgICBpbnB1dC5wbGFjZWhvbGRlciA9IGlucHV0LnBsYWNlaG9sZGVyO1xuLy8gICAgICAgICAgICAgX2Nsb3NlKCk7XG4gICAgXG4vLyAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLm1hcChcbi8vICAgICAgICAgICAgIChhbGJ1bSkgPT4gYWxidW0uYXJ0aXN0XG4vLyAgICAgICAgICk7XG4vLyAgICAgICAgIC8vIENvbXB1dGUgYXJ0aXN0IHN1Z2dlc3Rpb25zIGdpdmVuIHRoZSBjdXJyZW50IGFsYnVtcyBpbiB0aGUgbGlicmFyeVxuLy8gICAgICAgICB2YXIgc3VnZ2VzdGlvbnMgPSBtdXNpY0xpYnJhcnkuZ2V0QWxidW1MaXN0KCkucmVkdWNlKChzdWdnLCBhbGJ1bSkgPT4ge1xuLy8gICAgICAgICAgICAgICAgIGNvbnN0IGFydGlzdCA9IGFsYnVtLmFydGlzdDtcbi8vICAgICAgICAgICAgICAgICBpZiAoYXJ0aXN0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoaW5wdXRWYWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAvLyBBdm9pZCBkdXBsaWNhdGVzXG4vLyAgICAgICAgICAgICAgICAgICAgIGlmIChzdWdnLmluZGV4T2YoYXJ0aXN0KSA9PT0gLTEgKSBzdWdnLnB1c2goYXJ0aXN0KTtcbi8vICAgICAgICAgICAgICAgICB9IFxuLy8gICAgICAgICAgICAgICAgIHJldHVybiBzdWdnXG4vLyAgICAgICAgICAgICB9LCBbXSk7XG4vLyAgICAgICAgIGlmICghc3VnZ2VzdGlvbnMubGVuZ3RoKSB7IC8vIEhpZGUgZHJvcGRvd24gaWYgbm90IHN1Z2dlc3Rpb25zXG4vLyAgICAgICAgICAgICBfY2xvc2UoKTtcbi8vICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgfSAgICBcbi8vICAgICAgICAgLy8gUmVmcmVzaCBkaXYgYW5kIGRpc3BsYXkgbmV3IHN1Z2dlc3Rpb25zXG4vLyAgICAgICAgIGRyb3Bkb3duLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4vLyAgICAgICAgIF9jbGVhcigpO1xuXG4vLyAgICAgICAgIC8vIFJlZ2V4IHRvIGhpZ2hsaWdodCBtYXRjaFxuLy8gICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYCguKikoJHtpbnB1dFZhbHVlfSkoLiopYCwgXCJpXCIpO1xuLy8gICAgICAgICBzdWdnZXN0aW9ucy5mb3JFYWNoKGFydGlzdCA9PiB7XG4vLyAgICAgICAgICAgICAvLyBGb3IgZWFjaCBzdWdnZXN0aW9uIGFkZCBsaXN0IGVsZW1lbnQgaGlnaGxpZ2h0aW5nIG1hdGNoXG4vLyAgICAgICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuLy8gICAgICAgICAgICAgdmFyIG1hdGNoID0gYXJ0aXN0Lm1hdGNoKHJlZ2V4KTtcblxuLy8gICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgPSBgJHttYXRjaFsxXX08c3Ryb25nPiR7bWF0Y2hbMl19PC9zdHJvbmc+JHttYXRjaFszXX1gO1xuLy8gICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICBcbi8vICAgICAgICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byBzZWxlY3Qgc3VnZ2VzdGlvblxuLy8gICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2lucHV0U3VnZ2VzdGlvbik7XG4vLyAgICAgICAgIH0pO1xuLy8gICAgIH1cblxuLy8gICAgIGZ1bmN0aW9uIF9jbGVhcigpIHtcbi8vICAgICAgICAgLyogRGVsZXRlIGFsbCBzdWdnZXN0aW9ucyAqL1xuLy8gICAgICAgICB3aGlsZSAobGlzdC5sYXN0RWxlbWVudENoaWxkKSB7XG4vLyAgICAgICAgICAgICBsaXN0Lmxhc3RFbGVtZW50Q2hpbGQucmVtb3ZlKCk7XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG5cbi8vICAgICBmdW5jdGlvbiBfY2xvc2UoZSA9IG51bGwpIHtcbi8vICAgICAgICAgLyogSGlkZSBzdWdnZXN0aW9ucyBib3ggKi9cbi8vICAgICAgICAgLy8gRG8gbm90IHJlZ2lzdGVyIGNsaWNrcyBpbiB0aGUgaW5wdXQgYm94XG4vLyAgICAgICAgIGlmIChlICYmIGUudGFyZ2V0ID09PSBpbnB1dCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4vLyAgICAgICAgIC8vIElmIHRoZSBkcm9wZG93biBpcyBhbHJlYWR5IGhpZGRlbiBkbyBub3RoaW5nXG4vLyAgICAgICAgIGlmICghZHJvcGRvd24uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZGVuXCIpKSB7XG4vLyAgICAgICAgICAgICBfY2xlYXIoKTtcbi8vICAgICAgICAgICAgIGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG5cbi8vICAgICBmdW5jdGlvbiBfaW5wdXRTdWdnZXN0aW9uKCkge1xuLy8gICAgICAgICAvKiBDaG9vc2Ugc2VsZWN0ZWQgaXRlbSBhbmQgYWRkIGl0IHRvIHRoZSBpbnB1dCAqL1xuLy8gICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMudGV4dENvbnRlbnQ7XG4gICAgXG4vLyAgICAgICAgIF9jbG9zZSgpO1xuLy8gICAgIH0gICAgXG4vLyB9KSgpO1xuXG5cbiIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcbmltcG9ydCB7IGZpbHRlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9maWx0ZXIuanNcIjtcblxudmFyIHRhYmxlVmlldyA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY29udGVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUgPiB0Ym9keVwiKTtcblxuICAgIGV2ZW50cy5vbihcImFsYnVtQWRkZWRcIiwgX3VwZGF0ZSk7XG4gICAgZXZlbnRzLm9uKFwiYWxidW1FZGl0ZWRcIiwgX3VwZGF0ZSk7XG4gICAgZXZlbnRzLm9uKFwibGlicmFyeVNvcnRlZFwiLCBfdXBkYXRlKTtcbiAgICBldmVudHMub24oXCJmaWx0ZXJBcHBsaWVkXCIsIF91cGRhdGUpO1xuXG4gICAgZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgICAgICAgX2NsZWFyKCk7XG4gICAgICAgIF9yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyKCkge1xuICAgICAgICAvLyBBcHBseSBjdXJyZW50IGZpbHRlciB0byBhbGJ1bSBsaXN0XG4gICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5mb3JFYWNoKChhbGJ1bSkgPT4ge1xuICAgICAgICAgICAgX3JlbmRlckFsYnVtKGFsYnVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NsZWFyKCkge1xuICAgICAgICAvKiBSZW1vdmUgYWxsIHJvd3MgaW4gdGhlIHRhYmxlICovXG4gICAgICAgIHdoaWxlIChjb250ZW50cy5sYXN0RWxlbWVudENoaWxkKSB7XG4gICAgICAgICAgICBjb250ZW50cy5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlckFsYnVtKGFsYnVtKSB7XG4gICAgICAgIC8vIEFwcGx5IGZpbHRlci4gSWYgZmFsc2UgZG8gbm90IHJlbmRlclxuICAgICAgICBpZiAoIXRhYmxlQ29udHJvbGxlci5maWx0ZXJBbGJ1bShhbGJ1bSkpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyByb3cgZm9yIHRoZSBhbGJ1bVxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgIC8vIFNldCBhbGJ1bSBhdHRyaWJ1dGUgYXMgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSByb3dcbiAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoXCJhbGJ1bS1yb3dcIik7XG4gICAgICAgIHJvdy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGFsYnVtLmlkKTtcblxuICAgICAgICAvLyBBZGQgYWxidW0gaW5mb1xuICAgICAgICBjb25zdCBjb2x1bW5zID0gW1widGl0bGVcIiwgXCJhcnRpc3RcIiwgXCJyZWxlYXNlX3llYXJcIiwgXCJvd25lZFwiLCBcImZhdm9yaXRlXCJdO1xuICAgICAgICBmb3IgKGNvbnN0IHByb3Agb2YgY29sdW1ucykge1xuICAgICAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG5cbiAgICAgICAgICAgIGxldCBpY29uUGF0aCA9IHtcbiAgICAgICAgICAgICAgICBvd25lZDogeyB0cnVlOiBcImNoZWNrLnN2Z1wiLCBmYWxzZTogXCJjbG9zZS1yZWQuc3ZnXCIgfSxcbiAgICAgICAgICAgICAgICBmYXZvcml0ZTogeyB0cnVlOiBcImhlYXJ0LnN2Z1wiLCBmYWxzZTogXCJibGFuay5zdmdcIiB9LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHBhdGhcbiAgICAgICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmYXZvcml0ZVwiOlxuICAgICAgICAgICAgICAgICAgICAvLyBUcmFuc2xhdGUgXCJ0cnVlXCIgb3IgXCJmYWxzZVwiIHRvIGljb24gcmVwci4gYWNjb3JkaW5nbHlcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgICAgICAgICAgICAgICAgICBwcm9wSWNvbi5jbGFzc0xpc3QuYWRkKCdjZWxsLWljb24nKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IGljb25QYXRoW3Byb3BdW2FsYnVtW3Byb3BdXTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcEljb24uc3JjID0gXCIuLi9pbWFnZXMvXCIgKyBwYXRoO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChwcm9wSWNvbilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgZGF0YUNlbGwudGV4dENvbnRlbnQgPSBhbGJ1bVtwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoZGF0YUNlbGwpO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIENyZWF0ZSByZW1vdmUtYWxidW0gYnV0dG9uXG4gICAgICAgIC8vIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IF9yZW5kZXJSZW1vdmVCdXR0b24ocm93KTtcbiAgICAgICAgLy8gcm93LmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbik7XG4gICAgXG4gICAgICAgIC8vIEFwcGVuZCBuZXcgcm93XG4gICAgICAgIGNvbnRlbnRzLmFwcGVuZENoaWxkKHJvdyk7XG5cbiAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXh0Um93ID0gcm93Lm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICBfY29sbGFwc2VFeHRyYUluZm8oKTsgLy8gQ2xvc2UgYW55IG9wZW5lZCBleHRyYS1pbmZvIHBhbmVsc1xuICAgICAgICAgICAgLy8gSWYgdGhlIHJvdyBoYWQgYW4gZXh0cmEtaW5mbyBwYW5lbCB0aGVuXG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIChlZmZlY3RpdmVseSBjbG9zaW5nIGl0KVxuICAgICAgICAgICAgaWYgKG5leHRSb3cgJiYgbmV4dFJvdy5jbGFzc0xpc3QuY29udGFpbnMoXCJleHRyYS1pbmZvXCIpKSByZXR1cm47XG4gICAgICAgICAgICBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtLCByb3cpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwicm93QWRkZWRcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NvbGxhcHNlRXh0cmFJbmZvKCkge1xuICAgICAgICBjb25zdCBleHRyYVJvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmV4dHJhLWluZm9cIik7XG5cbiAgICAgICAgZXh0cmFSb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIHJvdy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHJvdyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJFeHRyYUluZm8oYWxidW0sIHJvdykge1xuICAgICAgICBjb25zdCBleHRyYUluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgIGV4dHJhSW5mby5jbGFzc0xpc3QuYWRkKFwiZXh0cmEtaW5mb1wiKTtcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIGRhdGFDZWxsLnNldEF0dHJpYnV0ZShcImNvbHNwYW5cIiwgNSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJpbmZvLWNvbnRhaW5lclwiKTtcblxuICAgICAgICBjb25zdCBhbGJ1bUphY2tldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIGFsYnVtSmFja2V0LnNldEF0dHJpYnV0ZShcInNyY1wiLCBhbGJ1bS5qYWNrZXQpO1xuICAgICAgICBhbGJ1bUphY2tldC5jbGFzc0xpc3QuYWRkKFwiamFja2V0XCIpO1xuXG4gICAgICAgIGNvbnN0IGdlbmVyYWxJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZ2VuZXJhbEluZm8uY2xhc3NMaXN0LmFkZChcImdlbmVyYWwtaW5mb1wiKTtcbiAgICAgICAgX3JlbmRlckdlbmVyYWxJbmZvKGdlbmVyYWxJbmZvLCBhbGJ1bSlcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgcmVjb3JkSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHJlY29yZEluZm8uY2xhc3NMaXN0LmFkZChcInJlY29yZC1pbmZvXCIpO1xuICAgICAgICBpZiAoYWxidW0ub3duZWQpIF9yZW5kZXJSZWNvcmRJbmZvKHJlY29yZEluZm8sIGFsYnVtKTtcblxuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChhbGJ1bUphY2tldCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoZ2VuZXJhbEluZm8pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKHJlY29yZEluZm8pO1xuXG4gICAgICAgIGRhdGFDZWxsLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgIGV4dHJhSW5mby5hcHBlbmRDaGlsZChkYXRhQ2VsbCk7XG5cbiAgICAgICAgLy8gSW5zZXJ0IGFmdGVyXG4gICAgICAgIHJvdy5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShleHRyYUluZm8sIHJvdy5uZXh0U2libGluZyk7XG5cbiAgICAgICAgZGF0YUNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwiZWRpdEJ1dHRvbkNsaWNrZWRcIiwgYWxidW0pO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJHZW5lcmFsSW5mbyhjb250YWluZXIsIGFsYnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiZ2VucmVcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJHZW5yZVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJ0b3BSUzFcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUb3A1MDAgKFJTMSlcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwidG9wUlMzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVG9wNTAwIChSUzMpXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgdXJscyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiZGlzY29nc1wiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRpc2NvZ3NcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwid2lraXBlZGlhXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiV2lraXBlZGlhXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgZmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke2ZpZWxkLmxhYmVsfTwvc3Ryb25nPjogJHtcbiAgICAgICAgICAgICAgICBhbGJ1bVtmaWVsZC5rZXldXG4gICAgICAgICAgICB9YDtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB1cmxzLmZvckVhY2goKHVybCkgPT4ge1xuICAgICAgICAgICAgbGV0IGhyZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgIGhyZWYuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBhbGJ1bVt1cmwua2V5XSk7XG4gICAgICAgICAgICBocmVmLmlubmVySFRNTCA9IGA8c3Ryb25nPiR7dXJsLmxhYmVsfTwvc3Ryb25nPmA7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChocmVmKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlclJlY29yZEluZm8oY29udGFpbmVyLCBhbGJ1bSkge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImNhdGFsb2dfbnVtXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiQ2F0YWxvZyNcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwicmVjb3JkX2xhYmVsXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiTGFiZWxcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiY291bnRyeVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNvdW50cnlcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiZWRpdGlvbl95ZWFyXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiRWRpdGlvblwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJtYXRyaXhcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJNYXRyaXhcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiY29uZGl0aW9uXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiQ29uZGl0aW9uXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcIm5vdGVzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiTm90ZXNcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIGxldCBmb3JtYXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgZm9ybWF0LmlubmVySFRNTCA9IGA8c3Ryb25nPkZvcm1hdDwvc3Ryb25nPjogJHthbGJ1bS5yZWNvcmRfZm9ybWF0fSAoJHthbGJ1bS5hbGJ1bV9mb3JtYXR9KWA7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmb3JtYXQpO1xuXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0ZXh0LmlubmVySFRNTCA9IGA8c3Ryb25nPiR7ZmllbGQubGFiZWx9PC9zdHJvbmc+OiAke2FsYnVtW2ZpZWxkLmtleV19YDtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJSZW1vdmVCdXR0b24ocm93KSB7XG4gICAgICAgIC8vIENyZWF0ZSB0cmFzaGNhbiBidXR0b24gYW5kIGFwcGVuZCBpdCB0byByb3dcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cbiAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmUtYWxidW1cIiwgXCJpbWctYnV0dG9uXCIsIFwiaGlkZGVuXCIpO1xuICAgICAgICByZW1vdmVCdXR0b24udGl0bGUgPSBcIkRlbGV0ZSBBbGJ1bVwiO1xuXG4gICAgICAgIGRhdGFDZWxsLmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgLy8gQ29ubmVjdCBuZXcgcm93IHNvIHRoYXQgcmVtb3ZlLWljb24gb25seSBhcHBlYXJzIG9uIGhvdmVyXG4gICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ29ubmVjdCBidXR0b24gdG8gcmVtb3ZlQWxidW0gZnVuY3Rpb25cbiAgICAgICAgcmVtb3ZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gcm93LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG4gICAgICAgICAgICBtdXNpY0xpYnJhcnkuZGVsZXRlQWxidW0oaWQpO1xuXG4gICAgICAgICAgICBldmVudHMuZW1pdChcInJvd0RlbGV0ZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkYXRhQ2VsbFxuICAgIH1cbn0pKCk7XG5cbnZhciB0YWJsZUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIiksXG4gICAgICAgICBzb3J0YWJsZUhlYWRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGFibGUgdGguc29ydGFibGVcIik7XG4gICAgdmFyIGN1cnJTb3J0aW5nID0geyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCIgfTtcblxuICAgIHNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfc29ydFRhYmxlKTtcbiAgICB9KTtcblxuICAgIGV2ZW50cy5vbihcImFsYnVtRGVsZXRlZFwiLCBfcmVtb3ZlUm93KTtcblxuICAgIGZ1bmN0aW9uIF9yZW1vdmVSb3coaWQpIHtcbiAgICAgICAgLy8gQXNrIGNvbmZpcm1hdGlvbiBiZWZvcmUgcmVtb3ZpbmcgYWxidW1cbiAgICAgICAgaWYgKCFjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGFsYnVtP1wiKSkgcmV0dXJuO1xuICAgIFxuICAgICAgICAvLyBSZW1vdmUgcm93IGFuZCBhbGJ1bSBmcm9tIGxpYnJhcnlcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdHJbZGF0YS1pZD0ke2lkfV1gKVxuICAgICAgICBcbiAgICAgICAgY29udGVudHMucmVtb3ZlQ2hpbGQocm93KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfc29ydFRhYmxlKGUpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBuZXdTb3J0QnkgPSBoZWFkZXIuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgICAgIGNvbnN0IHsgYnk6IHNvcnRCeSwgb3JkOiBzb3J0T3JkIH0gPSBjdXJyU29ydGluZztcbiAgICBcbiAgICAgICAgLy8gSWYgc29ydGluZyBuZXcgcm93IGZsaXAgcm93IG9yZGVyLCBlbHNlIHJvdyBvcmRlciBhcyBhc2MgYXMgZGVmYXVsdFxuICAgICAgICBpZiAobmV3U29ydEJ5ID09PSBzb3J0QnkpIHtcbiAgICAgICAgICAgIGN1cnJTb3J0aW5nLm9yZCA9IHNvcnRPcmQgPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5ieSA9IG5ld1NvcnRCeTtcbiAgICAgICAgICAgIGN1cnJTb3J0aW5nLm9yZCA9IFwiYXNjXCI7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gU29ydCBsaWJyYXJ5IGFsYnVtcztcbiAgICAgICAgbXVzaWNMaWJyYXJ5LnNvcnQoY3VyclNvcnRpbmcpO1xuICAgIFxuICAgICAgICAvLyBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGFuZCBkaXNwbGF5IHRoZSBjb3JyZXNwb25kaW5nIG9uZVxuICAgICAgICBfaGlkZVNvcnRpbmdBcnJvd3MoKTtcbiAgICAgICAgX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfcmVuZGVyU29ydGluZ0Fycm93KGhlYWRlcikge1xuICAgICAgICAvKiBBZGQgc29ydGluZyBhcnJvd3Mgd2l0aCB0aGUgY29ycmVwc29uZGluZyBvcmRlciBpbiB0aGUgY2xpY2tlZCBoZWFkZXIgKi9cbiAgICAgICAgY29uc3Qgc29ydEFycm93ID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCIuc29ydC1hcnJvd1wiKTtcblxuICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LmFkZChjdXJyU29ydGluZy5vcmQpO1xuICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX2hpZGVTb3J0aW5nQXJyb3dzKCkge1xuICAgICAgICAvKiBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGZvcm0gYWxsIGhlYWRlcnMgKi9cbiAgICAgICAgc29ydGFibGVIZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc29ydEFycm93ID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCIuc29ydC1hcnJvd1wiKTtcbiAgICBcbiAgICAgICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NcIik7XG4gICAgICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImRlc2NcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZXNldFNvcnRpbmcoKSB7XG4gICAgICAgIGN1cnJTb3J0aW5nID0geyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCIgfTtcblxuICAgICAgICBfaGlkZVNvcnRpbmdBcnJvd3MoKTtcbiAgICAgICAgX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckFsYnVtKGFsYnVtKSB7XG4gICAgICAgIHZhciBjdXJyRmlsdGVyID0gZmlsdGVyQ29udHJvbGxlci5nZXRDdXJyZW50RmlsdGVyKCk7XG4gICAgICAgIHZhciB7IHR5cGU6IGZpbHRlclR5cGUsIHZhbHVlOiBmaWx0ZXJWYWx1ZSB9ID0gY3VyckZpbHRlcjtcbiAgICBcbiAgICAgICAgLy8gUmVzZXQgZGlzcGxheSBpZiBubyBmaWx0ZXIgYXBwbHkgKGlucHV0IGVtcHR5KSBkbyBub3RoaW5nXG4gICAgICAgIGlmIChmaWx0ZXJWYWx1ZSA9PT0gXCJcIikgcmV0dXJuIHRydWU7XG4gICAgXG4gICAgICAgIHN3aXRjaCAoZmlsdGVyVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1widGl0bGVcIl0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgICAgICAvLyBNYXRjaCBhbnkgb2YgdGhlIGNvbW1hIHNlcGFyYXRlZCBtYXRjaGVzXG4gICAgICAgICAgICAgICAgY29uc3QgYXJ0aXN0TGlzdCA9IGZpbHRlclZhbHVlLnNwbGl0KC9cXHMqWyw7XVxccyovKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJ0aXN0TGlzdC5zb21lKChhcnRpc3QpID0+XG4gICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiYXJ0aXN0XCJdLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoYXJ0aXN0LnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWxlYXNlX3llYXJcIjpcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2ggPSAocmVnZXgpID0+IGZpbHRlclZhbHVlLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgICAgICAvLyBSZWdleCBmb3IgeWVhciBmb3IgZGlmZmVyZW50IHJlbGVhc2UgeWVhciBmaWx0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleEVxID0gL15cXHMqKFxcZCspXFxzKiQvLCAvLyBTaW5nbGUgeWVhciB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICByZWdleEd0ID0gLyg/Ol4+XFxzPyhcXGQrKSQpLywgLy8gR3JlYXRlciB0aGFuXG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4THQgPSAvKD86XjxcXHM/KFxcZCspJCkvLCAvLyBMb3dlciB0aGFuXG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4QnR3ID0gLyg/Ol4oXFxkKylcXHM/Wy0sLztdXFxzPyhcXGQrKSQpLzsgLy9Ud28gdmFsdWVzIGludGVydmFsXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKHJlZ2V4RXEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA9PSBtYXRjaChyZWdleEVxKVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKHJlZ2V4R3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA+PSBtYXRjaChyZWdleEd0KVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKHJlZ2V4THQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA8PSBtYXRjaChyZWdleEx0KVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKHJlZ2V4QnR3KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPj0gbWF0Y2gocmVnZXhCdHcpWzFdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA8PSBtYXRjaChyZWdleEJ0dylbMl1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgLy8gQWxsb3cgdGhlIHVzZSBvZiBkaWZmZXJlbnQgd29yZHMgZm9yIHRydWUgYW5kIGZhbHNlXG4gICAgICAgICAgICAgICAgc3dpdGNoIChmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ5ZXNcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRydWVcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCIxXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJvd25lZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5vXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmYWxzZVwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibm90IG93bmVkXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3YW50XCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCIwXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwiZm9ybWF0XCI6XG4gICAgICAgICAgICAgICAgLy8gSW4gdGhpcyBmaWx0ZXIgXCIrXCIgPSBcImFuZFwiIGFuZCBcIlssOy9dXCIgPSBcIm9yXCJcbiAgICAgICAgICAgICAgICBsZXQgZm9ybWF0TGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJWYWx1ZS5pbmNsdWRlcyhcIitcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0TGlzdCA9IGZpbHRlclZhbHVlLnNwbGl0KC9cXHMqXFwrXFxzKi8pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TGlzdC5ldmVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgIChmb3JtYXQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJmb3JtYXRcIl0uZmluZEluZGV4KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsKSA9PiB2YWwudG9Mb3dlckNhc2UoKSA9PT0gZm9ybWF0LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0TGlzdCA9IGZpbHRlclZhbHVlLnNwbGl0KC9cXHMqWyw7L11cXHMqLyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRMaXN0LnNvbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAoZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiZm9ybWF0XCJdLmZpbmRJbmRleChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCkgPT4gdmFsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gRWxzZSBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBmaWx0ZXJBbGJ1bVxuICAgIH1cbn0pKCk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vdGFibGUuanNcIlxuaW1wb3J0IFwiLi9maWx0ZXIuanNcIlxuaW1wb3J0IFwiLi9tb2RhbC5qc1wiXG5pbXBvcnQgXCIuL2xvYWRlci5qc1wiXG5cbmltcG9ydCBtdXNpY0xpYnJhcnkgZnJvbSBcIi4vbGlicmFyeS5qc1wiO1xuaW1wb3J0IEFsYnVtIGZyb20gXCIuL2FsYnVtLmpzXCI7XG5cbnZhciBzYW1wbGUgPSByZXF1aXJlKFwiLi4vYWxidW1fc2FtcGxlLmpzb25cIilcblxuZm9yIChjb25zdCBrZXkgaW4gc2FtcGxlKSB7XG4gICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNhbXBsZSwga2V5KSkge1xuICAgICAgICB2YXIgbmV3QWxidW0gPSBBbGJ1bShzYW1wbGVba2V5XSk7XG4gICAgICAgIG11c2ljTGlicmFyeS5hZGRBbGJ1bShuZXdBbGJ1bSk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9