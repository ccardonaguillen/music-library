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
        editAlbumDetails,
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
                    const icon = document.createElement('img')
                    icon.classList.add("cell-icon");
                
                    if (prop === "favorite") icon.classList.add("fav-icon");

                    path = iconPath[prop][album[prop]];
                    icon.src = "../images/" + path;
    
                    dataCell.appendChild(icon)

                    icon.addEventListener("click", (e) => {
                        e.stopPropagation()
                        _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].editAlbumDetails(album.id, {
                            [prop]: !album[prop],
                        });
                    })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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anMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9saWJyYXJ5LmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvbG9hZGVyLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvbW9kYWwuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy90YWJsZS5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQWxidW0gPSAoXG4gICAgeyB0aXRsZSxcbiAgICAgIGFydGlzdCxcbiAgICAgIHJlbGVhc2VfeWVhcixcbiAgICAgIG93bmVkLFxuICAgICAgZmF2b3JpdGUsXG4gICAgICBnZW5yZSxcbiAgICAgIHRvcFJTMSxcbiAgICAgIHRvcFJTMyxcbiAgICAgIGRpc2NvZ3MsXG4gICAgICB3aWtpcGVkaWEsXG4gICAgICByZWNvcmRfZm9ybWF0LFxuICAgICAgYWxidW1fZm9ybWF0LFxuICAgICAgY2F0YWxvZ19udW0sXG4gICAgICBlZGl0aW9uX3llYXIsXG4gICAgICBjb3VudHJ5LFxuICAgICAgcmVjb3JkX2xhYmVsLFxuICAgICAgbWF0cml4LFxuICAgICAgY29uZGl0aW9uLFxuICAgICAgbm90ZXMsXG4gICAgICBqYWNrZXRcbiAgICB9XG4pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpZDogdGl0bGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlQWxsKC9cXFcvZywgXCJcIikgK1xuICAgICAgICAgICAgYXJ0aXN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZUFsbCgvXFxXL2csIFwiXCIpICtcbiAgICAgICAgICAgIHJlbGVhc2VfeWVhcixcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGFydGlzdCxcbiAgICAgICAgcmVsZWFzZV95ZWFyLFxuICAgICAgICBvd25lZDogQm9vbGVhbihvd25lZCksXG4gICAgICAgIGZhdm9yaXRlOiBCb29sZWFuKGZhdm9yaXRlKSxcbiAgICAgICAgZ2VucmU6IGdlbnJlIHx8IFwiXCIsXG4gICAgICAgIHRvcFJTMTogdG9wUlMxIHx8IFwiXCIsXG4gICAgICAgIHRvcFJTMzogdG9wUlMzIHx8IFwiXCIsXG4gICAgICAgIGRpc2NvZ3M6IGRpc2NvZ3MgfHwgXCJcIixcbiAgICAgICAgd2lraXBlZGlhOiB3aWtpcGVkaWEgfHwgXCJcIixcbiAgICAgICAgcmVjb3JkX2Zvcm1hdDogdHlwZW9mKHJlY29yZF9mb3JtYXQpID09PSBcInN0cmluZ1wiID9cbiAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkocmVjb3JkX2Zvcm1hdCkgOlxuICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRfZm9ybWF0LFxuICAgICAgICBhbGJ1bV9mb3JtYXQ6IGFsYnVtX2Zvcm1hdCB8fCBcIlwiLFxuICAgICAgICBjYXRhbG9nX251bTogY2F0YWxvZ19udW0gfHwgXCJcIixcbiAgICAgICAgZWRpdGlvbl95ZWFyOiBlZGl0aW9uX3llYXIgfHwgXCJcIixcbiAgICAgICAgY291bnRyeTogY291bnRyeSB8fCBcIlwiLFxuICAgICAgICByZWNvcmRfbGFiZWw6IHJlY29yZF9sYWJlbCB8fCBcIlwiLFxuICAgICAgICBtYXRyaXg6IG1hdHJpeCB8fCBcIlwiLFxuICAgICAgICBjb25kaXRpb246IGNvbmRpdGlvbiB8fCBcIlwiLFxuICAgICAgICBub3Rlczogbm90ZXMgfHwgXCJOb25lXCIsXG4gICAgICAgIGphY2tldDogamFja2V0IHx8IFwiXCJcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGJ1bSIsInZhciBldmVudHMgPSB7XG4gICAgZXZlbnRzOiB7fSxcbiAgICBvbjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gICAgfSxcbiAgICBvZmY6IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW1pdDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIGZuKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzIiwiaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHMuanNcIjtcbmltcG9ydCBtdXNpY0xpYnJhcnkgZnJvbSBcIi4vbGlicmFyeS5qc1wiO1xuXG52YXIgc3VtbWFyeVZpZXcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVudHJpZXMtY291bnRcIiksXG4gICAgICAgIHRhYmxlQ29udGVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUgPiB0Ym9keVwiKTtcblxuICAgIGV2ZW50cy5vbihcImZpbHRlckFwcGxpZWRcIiwgX3JlbmRlcik7XG4gICAgZXZlbnRzLm9uKFwicm93QWRkZWRcIiwgX3JlbmRlcik7XG4gICAgZXZlbnRzLm9uKFwicm93RGVsZXRlZFwiLCBfcmVuZGVyKTtcblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsRW50cmllcyA9IG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5sZW5ndGgsIC8vIExlbmd0aCBvZiBsaWJyYXJ5IGxpc3RcbiAgICAgICAgICAgIHNob3duRW50cmllcyA9IHRhYmxlQ29udGVudHMucXVlcnlTZWxlY3RvckFsbChcInRyOm5vdCguZXh0cmEtaW5mbylcIikubGVuZ3RoOyAvLyBOdW1iZXIgb2Ygcm93cyBpbiB0YWJsZVxuXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBhbGJ1bXMgaW4gdGhlIGxpYnJhcnkgcHJpbnQgd2VsY29tZSBtZXNzYWdlXG4gICAgICAgIHN1bW1hcnkudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgdG90YWxFbnRyaWVzID09PSAwXG4gICAgICAgICAgICAgICAgPyBcIk5vIGFsYnVtcyBpbiB0aGUgbGlicmFyeS4gQWRkIG9uZSBieSBjbGlja2luZyB0aGUgYnV0dG9uXCJcbiAgICAgICAgICAgICAgICA6IGBTaG93aW5nICR7c2hvd25FbnRyaWVzfSBvdXQgb2YgJHt0b3RhbEVudHJpZXN9IGFsYnVtc2A7XG4gICAgfVxufSkoKTtcblxudmFyIGZpbHRlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyRmlsdGVyID0geyB0eXBlOiBcIlwiLCB2YWx1ZTogXCJcIiB9O1xuICAgIGNvbnN0IGZpbHRlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci1ieVwiKSxcbiAgICAgICAgZmlsdGVyU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXJcIiksXG4gICAgICAgIGZpbHRlclZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItdmFsdWVcIiksXG4gICAgICAgIGVudHJpZXNDb3VudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50cmllcy1jb3VudFwiKTtcblxuICAgIGZpbHRlclNlbGVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIF9yZXNldEZpbHRlcik7XG4gICAgZmlsdGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIF9hcHBseUZpbHRlcik7XG4gICAgZmlsdGVyVmFsdWUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9yZXNldEZpbHRlcik7XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50RmlsdGVyKCkge1xuICAgICAgICByZXR1cm4gY3VyckZpbHRlcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYXBwbHlGaWx0ZXIoZSA9IG51bGwpIHtcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IHN1Ym1pdCBiZWhhdmlvdXJcbiAgICAgICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICAgICAgLy8gVXBkYXRlIGN1cnJlbnQgZmlsdGVyIHdpdGggdmFsdWVzIGZyb20gdGhlIGZpbHRlciBmb3JtXG4gICAgICAgIGN1cnJGaWx0ZXJbXCJ0eXBlXCJdID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgICAgICBjdXJyRmlsdGVyW1widmFsdWVcIl0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci12YWx1ZVwiKS52YWx1ZTtcbiAgICBcbiAgICAgICAgLy8gVXBkYXRlIHRhYmxlXG4gICAgICAgIGV2ZW50cy5lbWl0KFwiZmlsdGVyQXBwbGllZFwiLCBjdXJyRmlsdGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3JlbmRlclBsYWNlaG9sZGVyKCkge1xuICAgICAgICAvKiBVcGRhdGUgcGxhY2Vob2xkZXIgbWVzc2FnZSBhY2NvcmRpbmcgdG8gdGhlIHNlbGVjdGVkIG9wdGlvbiAqL1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJTZWxlY3QudmFsdWU7XG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0ge1xuICAgICAgICAgICAgdGl0bGU6ICdlLmcuIFwic3VibWFyaW5lXCInLFxuICAgICAgICAgICAgYXJ0aXN0OiAnZS5nLiBcInplcHBlbGluXCIsIFwiYmVhdGxlcywgcm9sbGluZ1wiJyxcbiAgICAgICAgICAgIHJlbGVhc2VfeWVhcjogJ2UuZy4gXCIxOTkwXCIsIFwiMS0yMDAwXCIsIFwiPjE5MDBcIiwgXCI8MTk4MFwiJyxcbiAgICAgICAgICAgIG93bmVkOiAnZS5nLiBcInRydWVcIiwgXCJub1wiLCBcIm5vdCBvd25lZFwiJyxcbiAgICAgICAgICAgIGZvcm1hdDogJ2UuZy4gXCJWeW5pbFwiLCBcImNkK2Nhc2V0dGVcIiwgXCJ2eW5pbC9DRFwiJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGZpbHRlclZhbHVlLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXJbZmlsdGVyXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVzZXRGaWx0ZXIoZSkge1xuICAgICAgICBpZiAoZS50eXBlID09PSBcImlucHV0XCIgJiYgZmlsdGVyVmFsdWUudmFsdWUgIT09IFwiXCIpIHJldHVybjtcbiAgICAgICAgLyogUmVzZXQgZmlsdGVyIHdoZW4gdGhlIGlucHV0IGJveCBpcyBlbXB0eSBhbmQgYXBwbHkgZW1wdHkgZmlsdGVyICovXG4gICAgICAgIFxuICAgICAgICBmaWx0ZXJWYWx1ZS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIF9yZW5kZXJQbGFjZWhvbGRlcigpO1xuICAgICAgICBfYXBwbHlGaWx0ZXIoKTtcbiAgICBcbiAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gICAgXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRDdXJyZW50RmlsdGVyLFxuICAgIH1cbn0pKCk7XG5cbmV4cG9ydCB7IGZpbHRlckNvbnRyb2xsZXIgfSIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCJcblxudmFyIG11c2ljTGlicmFyeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFsYnVtTGlzdCA9IFtdO1xuXG4gICAgZnVuY3Rpb24gZ2V0QWxidW1MaXN0KCkge1xuICAgICAgICByZXR1cm4gYWxidW1MaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZEFsYnVtKG5ld0FsYnVtLCBwb3MpIHtcbiAgICAgICAgLy8gSWYgcG9zaXRpb24gaXMgcHJvdmlkZWQgdGhlbiByZW1vdmVzIGVudHJ5IGF0IHBvcyBhbmQgaW5zZXJ0cyBuZXcgb25lXG4gICAgICAgIGlmIChhbGJ1bUxpc3QuZXZlcnkoKGFsYnVtKSA9PiBuZXdBbGJ1bS5pZCAhPT0gYWxidW0uaWQpIHx8XG4gICAgICAgICAgICBuZXdBbGJ1bS5pZCA9PT0gYWxidW1MaXN0W3Bvc10uaWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YocG9zKSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC5zcGxpY2UocG9zLCAxLCBuZXdBbGJ1bSk7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bUVkaXRlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxidW1MaXN0LnVuc2hpZnQobmV3QWxidW0pO1xuICAgICAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1BZGRlZFwiLCBuZXdBbGJ1bSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgYWxidW0gZXhpc3QgbG9nIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgIGFsZXJ0KFwiVGhpcyBhbGJ1bSBhbHJlYWR5IGV4aXN0cy5cIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGVhdGVkIElEOiBcIiArIG5ld0FsYnVtLmlkKVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUFsYnVtKGlkKSB7XG4gICAgICAgIC8qIERlbGV0ZSBhbGJ1bSB3aXRoIGEgZ2l2ZW4gSUQgKi9cbiAgICAgICAgYWxidW1MaXN0ID0gYWxidW1MaXN0LmZpbHRlcigoYWxidW0pID0+IGFsYnVtLmlkICE9PSBpZCk7XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bURlbGV0ZWRcIiwgaWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVkaXRBbGJ1bShpZCwgbmV3QWxidW0pIHtcbiAgICAgICAgLy8gbmV3QWxidW0gaXMgdGhlIGFsYnVtIG9iamVjdCBjb250YWluaW5nIHRoZSB1cGRhdGVkIGluZm9cbiAgICAgICAgY29uc3QgYWxidW1JZHggPSBhbGJ1bUxpc3QuZmluZEluZGV4KFxuICAgICAgICAgICAgKGFsYnVtKSA9PiBpZCA9PT0gYWxidW0uaWRcbiAgICAgICAgKTtcblxuICAgICAgICBhZGRBbGJ1bShuZXdBbGJ1bSwgYWxidW1JZHgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVkaXRBbGJ1bURldGFpbHMoaWQsIG5ld0luZm8pIHtcbiAgICAgICAgY29uc3QgYWxidW1JZHggPSBhbGJ1bUxpc3QuZmluZEluZGV4KFxuICAgICAgICAgICAgKGFsYnVtKSA9PiBpZCA9PT0gYWxidW0uaWRcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gbmV3SW5mbykge1xuICAgICAgICAgICAgYWxidW1MaXN0W2FsYnVtSWR4XVtwcm9wXSA9IG5ld0luZm9bcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICBldmVudHMuZW1pdChcImFsYnVtRWRpdGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNvcnQoeyBieSwgb3JkID0gXCJhc2NcIiB9KSB7XG4gICAgICAgIC8qIFJldmVyc2Ugc29ydGluZyBhbGdvcml0aG0gaXMgb3JkID0gJ2Rlc2MnOyAqL1xuICAgICAgICBsZXQgc29ydE9yZGVyID0gb3JkID09PSBcImFzY1wiID8gMSA6IC0xO1xuXG4gICAgICAgIHN3aXRjaCAoYnkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgY2FzZSBcImFydGlzdFwiOlxuICAgICAgICAgICAgICAgIC8vIGxvY2FsZUNvbXBhcmUgdXNlZCB0byBjb21wYXJlIHN0cmluZyB3aXRob3V0IG1hdGggb3BlcmF0b3JzXG4gICAgICAgICAgICAgICAgYWxidW1MaXN0LnNvcnQoXG4gICAgICAgICAgICAgICAgICAgIChhLCBiKSA9PiBhW2J5XS5sb2NhbGVDb21wYXJlKGJbYnldKSAqIHNvcnRPcmRlclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICAgICAgYWxidW1MaXN0LnNvcnQoKGEsIGIpID0+IChhW2J5XSAtIGJbYnldKSAqIHNvcnRPcmRlcik7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudHMuZW1pdChcImxpYnJhcnlTb3J0ZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0QWxidW1MaXN0LFxuICAgICAgICBhZGRBbGJ1bSxcbiAgICAgICAgZGVsZXRlQWxidW0sXG4gICAgICAgIGVkaXRBbGJ1bSxcbiAgICAgICAgZWRpdEFsYnVtRGV0YWlscyxcbiAgICAgICAgc29ydFxuICAgIH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IG11c2ljTGlicmFyeVxuXG4iLCJpbXBvcnQgQWxidW0gZnJvbSBcIi4vYWxidW0uanNcIlxuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCJcblxuY29uc3QgZmlsZUxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlLWxvYWRlcicpO1xuXG5maWxlTG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGVMaXN0ID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgIHZhciBmaWxlID0gZmlsZUxpc3RbMF07XG4gICAgcmVhZEZpbGUoZmlsZSk7XG4gICAgZmlsZUxvYWRlci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9KTtcblxuZnVuY3Rpb24gcmVhZEZpbGUoZikge1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdmFyIG11c2ljQ29sbGVjdGlvbiA9IHBhcnNlQWxidW1MaWJyYXJ5KGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICBhZGRDb2xsZWN0aW9uKG11c2ljQ29sbGVjdGlvbilcbiAgICB9KTtcbiAgICByZWFkZXIucmVhZEFzVGV4dChmLCBcInV0Zi04XCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUNTViAoc3RyaW5nLCBkZWxpbWl0ZXI9XCIsXCIpIHtcbiAgICAvLyBDb21tZW50ZWQgY29kZSBpbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjkzMTQ3L2hvdy10by1wYXJzZS1jc3YtZGF0YVxuICAgIHZhciBvYmpQYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICAgICAgKFxuICAgICAgICAgICAgXCIoXFxcXFwiICsgZGVsaW1pdGVyICsgXCJ8XFxcXHI/XFxcXG58XFxcXHJ8XilcIiArICAvLyBEZWxpbWl0ZXJzXG4gICAgICAgICAgICBcIig/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInxcIiArIC8vIFF1b3RlZCBmaWVsZHNcbiAgICAgICAgICAgIFwiKFteXFxcIlxcXFxcIiArIGRlbGltaXRlciArIFwiXFxcXHJcXFxcbl0qKSlcIiAvLyBTdGFuZGFyZCBmaWVsZHNcbiAgICAgICAgKSwgXCJnaVwiKTtcblxuICAgIHZhciBhcnJEYXRhID0gW1tdXTtcbiAgICB2YXIgYXJyTWF0Y2hlcyA9IG51bGw7XG5cbiAgICB3aGlsZSAoYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyggc3RyaW5nICkpe1xuICAgICAgICB2YXIgc3RyTWF0Y2hlZERlbGltaXRlciA9IGFyck1hdGNoZXNbIDEgXTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJlxuICAgICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gZGVsaW1pdGVyXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgYXJyRGF0YS5wdXNoKCBbXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWRWYWx1ZTtcbiAgICAgICAgaWYgKGFyck1hdGNoZXNbIDIgXSl7XG4gICAgICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAyIF0ucmVwbGFjZShcbiAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKCBcIlxcXCJcXFwiXCIsIFwiZ1wiIClcbiAgICAgICAgICAgICAgICAsIFwiXFxcIlwiICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAzIF07XG4gICAgICAgIH1cblxuICAgICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKCBzdHJNYXRjaGVkVmFsdWUgKTtcbiAgICB9XG5cbiAgICByZXR1cm4oIGFyckRhdGEgKTtcbn1cblxuZnVuY3Rpb24gY3N2VG9PYmplY3QgKGNzdkNvbnRlbnQpIHtcbiAgICB2YXIgcHJvcHMgPSBjc3ZDb250ZW50WzBdO1xuICAgIHZhciBvYmplY3QgPSBbXTtcblxuICAgIGNzdkNvbnRlbnQuc2xpY2UoMSwgLTEpLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgdmFyIGl0ZW0gPSB7fTtcbiAgICAgICAgcm93LmZvckVhY2goKHZhbCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBpdGVtW3Byb3BzW2lkeF1dID0gdmFsO1xuICAgICAgICB9KVxuXG4gICAgICAgIG9iamVjdC5wdXNoKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICggb2JqZWN0IClcbn1cblxuZnVuY3Rpb24gcGFyc2VBbGJ1bUxpYnJhcnkoZmlsZUNvbnRlbnQpIHtcbiAgICB2YXIgcGFyc2VkQ1NWID0gcGFyc2VDU1YoZmlsZUNvbnRlbnQpO1xuICAgIHZhciBjb2xsZWN0aW9uID0gY3N2VG9PYmplY3QocGFyc2VkQ1NWKTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uXG59O1xuXG5mdW5jdGlvbiBhZGRDb2xsZWN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgY29sbGVjdGlvbi5mb3JFYWNoKChhbGJ1bSwgaWR4KSA9PiB7XG4gICAgICAgIHZhciBuZXdBbGJ1bSA9IEFsYnVtKHtcbiAgICAgICAgICAgIHRpdGxlOiBhbGJ1bVtcIk5vbWJyZVwiXSxcbiAgICAgICAgICAgIGFydGlzdDogYWxidW1bXCJBcnRpc3RhXCJdLFxuICAgICAgICAgICAgcmVsZWFzZV95ZWFyOiBhbGJ1bVtcIkFubyBsYW56YW1pZW50b1wiXSxcbiAgICAgICAgICAgIG93bmVkOiBhbGJ1bVtcIkFkcXVpcmlkb1wiXSA9PT0gXCIxXCIgP1xuICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgZm9ybWF0OiBhbGJ1bVtcIkZvcm1hdG9cIl0uaW5jbHVkZXMoXCIvXCIpID9cbiAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJGb3JtYXRvXCJdLnNwbGl0KFwiL1wiKSA6XG4gICAgICAgICAgICAgICAgICAgIFthbGJ1bVtcIkZvcm1hdG9cIl1dXG4gICAgICAgIH0pXG5cbiAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICB9KVxuXG4gICAgbXVzaWNMaWJyYXJ5LnNvcnQoeyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCJ9KVxufTtcblxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHMuanNcIjtcbmltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5cbnZhciBtb2RhbENvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLW92ZXJsYXlcIiksIFxuICAgICAgICBvcGVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW1vZGFsXCIpLFxuICAgICAgICBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xvc2UtbW9kYWxcIiksXG4gICAgICAgIG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKSxcbiAgICAgICAgaGVhZGVyID0gbW9kYWwucXVlcnlTZWxlY3RvcihcImgyXCIpLFxuICAgICAgICByZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwicmVzZXRcIl0nKTtcblxuICAgIG9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IF9vcGVuKFwibmV3XCIpKTtcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2UpO1xuXG4gICAgZXZlbnRzLm9uKFwiZWRpdEJ1dHRvbkNsaWNrZWRcIiwgYWxidW0gPT4gX29wZW4oXCJlZGl0XCIsIGFsYnVtKSk7XG5cbiAgICBmdW5jdGlvbiBfb3Blbihtb2RlLCBhbGJ1bSkge1xuICAgICAgICAvKiBEaXNwbGF5IGZvcm0gbW9kYWwgb3ZlciBtYWluIHdpbmRvdyBhbmQgZm9jdXMgb24gZmlyc3QgaW5wdXQgKi9cbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy10aXRsZVwiKS5mb2N1cygpO1xuXG4gICAgICAgIGlmIChtb2RlPT09XCJuZXdcIikge1xuICAgICAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIsIFwibmV3XCIpOyBcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtYWxidW0taWRcIiwgXCJcIik7IFxuICAgICAgICAgICAgaGVhZGVyLnRleHRDb250ZW50ID0gXCJOZXcgQWxidW1cIjtcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uLnRleHRDb250ZW50ID0gXCJSZXNldFwiO1xuICAgICAgICB9ICBlbHNlIGlmIChtb2RlPT09XCJlZGl0XCIpIHtcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiLCBcImVkaXRcIik7IFxuICAgICAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKFwiZGF0YS1hbGJ1bS1pZFwiLCBhbGJ1bS5pZCk7IFxuICAgICAgICAgICAgaGVhZGVyLnRleHRDb250ZW50ID0gXCJFZGl0IEFsYnVtXCI7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQ2FuY2VsXCI7XG4gICAgICAgICAgICBfcG9wdWxhdGVGb3JtKGFsYnVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgLyogSGlkZSBtb2RhbCAqL1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGFsYnVtRm9ybUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcG9wdWxhdGVGb3JtKGFsYnVtKSB7XG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gYWxidW0pIHtcbiAgICAgICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmYXZvcml0ZVwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJhbGJ1bV9mb3JtYXRcIjpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFkaW9CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpbnB1dFt0eXBlPXJhZGlvXVtuYW1lPSR7cHJvcH1dYFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGJ1dHRvbiBvZiByYWRpb0J1dHRvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmcoYWxidW1bcHJvcF0pID09PSBidXR0b24udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJyZWNvcmRfZm9ybWF0XCI6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrQm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgYGlucHV0W3R5cGU9Y2hlY2tib3hdW25hbWU9JHtwcm9wfV1gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYm94IG9mIGNoZWNrQm94ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGJ1bVtwcm9wXS5zb21lKGZvcm1hdCA9PiBmb3JtYXQgPT09IGJveC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cIiR7cHJvcH1cIl1gKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQgJiYgYWxidW1bcHJvcF0gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gYWxidW1bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjbG9zZVxuICAgIH1cbn0pKCk7XG5cbnZhciBhbGJ1bUZvcm1Db250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWxcIiksXG4gICAgICAgIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC1hbGJ1bVwiKSxcbiAgICAgICAgcmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInJlc2V0XCJdJyksXG4gICAgICAgIG93bnNUcnVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvd25zLXRydWVcIiksXG4gICAgICAgIG93bnNGYWxzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ducy1mYWxzZVwiKSxcbiAgICAgICAgcmVjb3JkRmllbGRTZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZC1pbmZvLWZzXCIpO1xuXG4gICAgLy8gU3VibWl0IGFuZCByZXNldCBcIk5ldyBBbGJ1bVwiIGZvcm1cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgX3N1Ym1pdE5ld0FsYnVtKTtcbiAgICByZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICByZXNldCgpO1xuICAgICAgICBpZiAobW9kYWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIpID09PSBcImVkaXRcIikgbW9kYWxDb250cm9sbGVyLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBFbmFibGUgY2hlY2tib3hlcyB3aGVuIHVzZXIgY2xpY2tzIGJ1dHRvbiBhbmQgZGlzYWJsZSB3aGVuIG5vdFxuICAgIG93bnNUcnVlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgX2VuYWJsZVJlY29yZEZpZWxkc2V0KTtcbiAgICBvd25zRmFsc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfZGlzYWJsZVJlY29yZEZpZWxkc2V0KTtcblxuICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICBmb3JtLnJlc2V0KCk7XG4gICAgICAgIF9kaXNhYmxlUmVjb3JkRmllbGRzZXQoKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX2Rpc2FibGVSZWNvcmRGaWVsZHNldCgpIHtcbiAgICAgICAgLyogRGlzYWJsZSBzZWNvbmQgZmllbGRzZXQgIChSZWNvcmQgaW5mbykgKi9cbiAgICAgICAgcmVjb3JkRmllbGRTZXQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgcmVjb3JkRmllbGRTZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfZW5hYmxlUmVjb3JkRmllbGRzZXQoKSB7XG4gICAgICAgIC8qIEVuYWJsZSBzZWNvbmQgZmllbGRzZXQgIChSZWNvcmQgaW5mbykgKi9cbiAgICAgICAgcmVjb3JkRmllbGRTZXQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgcmVjb3JkRmllbGRTZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3N1Ym1pdE5ld0FsYnVtKGUpIHtcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IHN1Ym1pdCBhY3Rpb25cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICAvLyBDcmVhdGUgbmV3IGFsYnVtIG9iamVjdCBhbmQgYWRkIGl0IHRvIHRoZSBsaWJyYXJ5XG4gICAgICAgIGNvbnN0IG5ld0FsYnVtID0gQWxidW0oX3Byb2Nlc3NOZXdBbGJ1bUZvcm0oKSk7XG5cbiAgICAgICAgY29uc3QgbW9kZSA9IG1vZGFsLmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKTtcbiAgICAgICAgY29uc3QgaWQgPSBtb2RhbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWFsYnVtLWlkXCIpO1xuXG4gICAgICAgIGlmIChtb2RlID09PSBcIm5ld1wiKSB7XG4gICAgICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmVkaXRBbGJ1bShpZCwgbmV3QWxidW0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIENsb3NlIGZvcm0gbW9kYWxcbiAgICAgICAgbW9kYWxDb250cm9sbGVyLmNsb3NlKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9wcm9jZXNzTmV3QWxidW1Gb3JtKCkge1xuICAgICAgICAvKiBQcm9jZXNzIG5ldyBhbGJ1bSBmb3JtIHRvIHBhc3MgaXQgdG8gbmV3IGFsYnVtICovXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcbiAgICBcbiAgICAgICAgbGV0IGZvcm1Db250ZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKGZvcm1EYXRhLmVudHJpZXMoKSk7XG5cbiAgICAgICAgZm9ybUNvbnRlbnRbXCJvd25lZFwiXSA9IGZvcm1Db250ZW50W1wib3duZWRcIl0gPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBmb3JtQ29udGVudFtcImZhdm9yaXRlXCJdID0gZm9ybUNvbnRlbnRbXCJmYXZvcml0ZVwiXSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGZvcm1Db250ZW50W1wiZm9ybWF0XCJdID0gZm9ybURhdGEuZ2V0QWxsKFwiZm9ybWF0XCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gZm9ybUNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzZXRcbiAgICB9XG59KSgpO1xuXG4vLyB2YXIgYXJ0aXN0U3VnZ2VzdGlvbnMgPSAoZnVuY3Rpb24gKCkge1xuLy8gICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYXJ0aXN0XCIpLFxuLy8gICAgICAgICBkcm9wZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIiksXG4vLyAgICAgICAgIGxpc3QgPSBkcm9wZG93bi5maXJzdEVsZW1lbnRDaGlsZDtcblxuLy8gICAgIC8vIFN1Z2dlc3QgYXJ0aXN0cyB3aGVuIGlucHV0aW5nIHZhbHVlcyBvciB3aGVuIGNsaWNraW5nIGluIGlucHV0XG4vLyAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9yZW5kZXIpO1xuLy8gICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBfcmVuZGVyKTtcblxuLy8gICAgIC8vIENsb3NlIHN1Z2dlc3Rpb25zIGRpdiB3aGVuIGNsaWNraW5nIG91dHNpZGUgc3VnZ2VzdGlvbiBib3hcbi8vICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2Nsb3NlLCB0cnVlKTtcblxuLy8gICAgIGZ1bmN0aW9uIF9yZW5kZXIoc3VnZ2VzdGVkQXJ0aXN0cykge1xuLy8gICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gaW5wdXQudmFsdWU7XG4vLyAgICAgICAgIC8vIElmIHVzZXIgY2xlYXJzIGlucHV0LCBkaXNwbGF5IHBsYWNlaG9sZGVyIGFuZCBjbG9zZSBzdWdnZXN0aW9uc1xuLy8gICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gXCJcIikge1xuLy8gICAgICAgICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBpbnB1dC5wbGFjZWhvbGRlcjtcbi8vICAgICAgICAgICAgIF9jbG9zZSgpO1xuICAgIFxuLy8gICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5tYXAoXG4vLyAgICAgICAgICAgICAoYWxidW0pID0+IGFsYnVtLmFydGlzdFxuLy8gICAgICAgICApO1xuLy8gICAgICAgICAvLyBDb21wdXRlIGFydGlzdCBzdWdnZXN0aW9ucyBnaXZlbiB0aGUgY3VycmVudCBhbGJ1bXMgaW4gdGhlIGxpYnJhcnlcbi8vICAgICAgICAgdmFyIHN1Z2dlc3Rpb25zID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLnJlZHVjZSgoc3VnZywgYWxidW0pID0+IHtcbi8vICAgICAgICAgICAgICAgICBjb25zdCBhcnRpc3QgPSBhbGJ1bS5hcnRpc3Q7XG4vLyAgICAgICAgICAgICAgICAgaWYgKGFydGlzdC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGlucHV0VmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuLy8gICAgICAgICAgICAgICAgICAgICBpZiAoc3VnZy5pbmRleE9mKGFydGlzdCkgPT09IC0xICkgc3VnZy5wdXNoKGFydGlzdCk7XG4vLyAgICAgICAgICAgICAgICAgfSBcbi8vICAgICAgICAgICAgICAgICByZXR1cm4gc3VnZ1xuLy8gICAgICAgICAgICAgfSwgW10pO1xuLy8gICAgICAgICBpZiAoIXN1Z2dlc3Rpb25zLmxlbmd0aCkgeyAvLyBIaWRlIGRyb3Bkb3duIGlmIG5vdCBzdWdnZXN0aW9uc1xuLy8gICAgICAgICAgICAgX2Nsb3NlKCk7XG4vLyAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgIH0gICAgXG4vLyAgICAgICAgIC8vIFJlZnJlc2ggZGl2IGFuZCBkaXNwbGF5IG5ldyBzdWdnZXN0aW9uc1xuLy8gICAgICAgICBkcm9wZG93bi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuLy8gICAgICAgICBfY2xlYXIoKTtcblxuLy8gICAgICAgICAvLyBSZWdleCB0byBoaWdobGlnaHQgbWF0Y2hcbi8vICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGAoLiopKCR7aW5wdXRWYWx1ZX0pKC4qKWAsIFwiaVwiKTtcbi8vICAgICAgICAgc3VnZ2VzdGlvbnMuZm9yRWFjaChhcnRpc3QgPT4ge1xuLy8gICAgICAgICAgICAgLy8gRm9yIGVhY2ggc3VnZ2VzdGlvbiBhZGQgbGlzdCBlbGVtZW50IGhpZ2hsaWdodGluZyBtYXRjaFxuLy8gICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbi8vICAgICAgICAgICAgIHZhciBtYXRjaCA9IGFydGlzdC5tYXRjaChyZWdleCk7XG5cbi8vICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gYCR7bWF0Y2hbMV19PHN0cm9uZz4ke21hdGNoWzJdfTwvc3Ryb25nPiR7bWF0Y2hbM119YDtcbi8vICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgXG4vLyAgICAgICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gc2VsZWN0IHN1Z2dlc3Rpb25cbi8vICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9pbnB1dFN1Z2dlc3Rpb24pO1xuLy8gICAgICAgICB9KTtcbi8vICAgICB9XG5cbi8vICAgICBmdW5jdGlvbiBfY2xlYXIoKSB7XG4vLyAgICAgICAgIC8qIERlbGV0ZSBhbGwgc3VnZ2VzdGlvbnMgKi9cbi8vICAgICAgICAgd2hpbGUgKGxpc3QubGFzdEVsZW1lbnRDaGlsZCkge1xuLy8gICAgICAgICAgICAgbGlzdC5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgZnVuY3Rpb24gX2Nsb3NlKGUgPSBudWxsKSB7XG4vLyAgICAgICAgIC8qIEhpZGUgc3VnZ2VzdGlvbnMgYm94ICovXG4vLyAgICAgICAgIC8vIERvIG5vdCByZWdpc3RlciBjbGlja3MgaW4gdGhlIGlucHV0IGJveFxuLy8gICAgICAgICBpZiAoZSAmJiBlLnRhcmdldCA9PT0gaW5wdXQpIHJldHVybjtcbiAgICAgICAgICAgIFxuLy8gICAgICAgICAvLyBJZiB0aGUgZHJvcGRvd24gaXMgYWxyZWFkeSBoaWRkZW4gZG8gbm90aGluZ1xuLy8gICAgICAgICBpZiAoIWRyb3Bkb3duLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkge1xuLy8gICAgICAgICAgICAgX2NsZWFyKCk7XG4vLyAgICAgICAgICAgICBkcm9wZG93bi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgZnVuY3Rpb24gX2lucHV0U3VnZ2VzdGlvbigpIHtcbi8vICAgICAgICAgLyogQ2hvb3NlIHNlbGVjdGVkIGl0ZW0gYW5kIGFkZCBpdCB0byB0aGUgaW5wdXQgKi9cbi8vICAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLnRleHRDb250ZW50O1xuICAgIFxuLy8gICAgICAgICBfY2xvc2UoKTtcbi8vICAgICB9ICAgIFxuLy8gfSkoKTtcblxuXG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5pbXBvcnQgeyBmaWx0ZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5cbnZhciB0YWJsZVZpZXcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIik7XG5cbiAgICBldmVudHMub24oXCJhbGJ1bUFkZGVkXCIsIF91cGRhdGUpO1xuICAgIGV2ZW50cy5vbihcImFsYnVtRWRpdGVkXCIsIF91cGRhdGUpO1xuICAgIGV2ZW50cy5vbihcImxpYnJhcnlTb3J0ZWRcIiwgX3VwZGF0ZSk7XG4gICAgZXZlbnRzLm9uKFwiZmlsdGVyQXBwbGllZFwiLCBfdXBkYXRlKTtcblxuICAgIGZ1bmN0aW9uIF91cGRhdGUoKSB7XG4gICAgICAgIF9jbGVhcigpO1xuICAgICAgICBfcmVuZGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlcigpIHtcbiAgICAgICAgLy8gQXBwbHkgY3VycmVudCBmaWx0ZXIgdG8gYWxidW0gbGlzdFxuICAgICAgICBtdXNpY0xpYnJhcnkuZ2V0QWxidW1MaXN0KCkuZm9yRWFjaCgoYWxidW0pID0+IHtcbiAgICAgICAgICAgIF9yZW5kZXJBbGJ1bShhbGJ1bSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jbGVhcigpIHtcbiAgICAgICAgLyogUmVtb3ZlIGFsbCByb3dzIGluIHRoZSB0YWJsZSAqL1xuICAgICAgICB3aGlsZSAoY29udGVudHMubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICAgICAgY29udGVudHMubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJBbGJ1bShhbGJ1bSkge1xuICAgICAgICAvLyBBcHBseSBmaWx0ZXIuIElmIGZhbHNlIGRvIG5vdCByZW5kZXJcbiAgICAgICAgaWYgKCF0YWJsZUNvbnRyb2xsZXIuZmlsdGVyQWxidW0oYWxidW0pKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcm93IGZvciB0aGUgYWxidW1cbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgICAgICAvLyBTZXQgYWxidW0gYXR0cmlidXRlIGFzIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgcm93XG4gICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKFwiYWxidW0tcm93XCIpO1xuICAgICAgICByb3cuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBhbGJ1bS5pZCk7XG5cbiAgICAgICAgLy8gQWRkIGFsYnVtIGluZm9cbiAgICAgICAgY29uc3QgY29sdW1ucyA9IFtcInRpdGxlXCIsIFwiYXJ0aXN0XCIsIFwicmVsZWFzZV95ZWFyXCIsIFwib3duZWRcIiwgXCJmYXZvcml0ZVwiXTtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wIG9mIGNvbHVtbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuXG4gICAgICAgICAgICBsZXQgaWNvblBhdGggPSB7XG4gICAgICAgICAgICAgICAgb3duZWQ6IHsgdHJ1ZTogXCJjaGVjay5zdmdcIiwgZmFsc2U6IFwiY2xvc2UtcmVkLnN2Z1wiIH0sXG4gICAgICAgICAgICAgICAgZmF2b3JpdGU6IHsgdHJ1ZTogXCJoZWFydC5zdmdcIiwgZmFsc2U6IFwiYmxhbmsuc3ZnXCIgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBwYXRoXG4gICAgICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwib3duZWRcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiZmF2b3JpdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJhbnNsYXRlIFwidHJ1ZVwiIG9yIFwiZmFsc2VcIiB0byBpY29uIHJlcHIuIGFjY29yZGluZ2x5XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgICAgICAgICAgICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoXCJjZWxsLWljb25cIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSBcImZhdm9yaXRlXCIpIGljb24uY2xhc3NMaXN0LmFkZChcImZhdi1pY29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBpY29uUGF0aFtwcm9wXVthbGJ1bVtwcm9wXV07XG4gICAgICAgICAgICAgICAgICAgIGljb24uc3JjID0gXCIuLi9pbWFnZXMvXCIgKyBwYXRoO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChpY29uKVxuXG4gICAgICAgICAgICAgICAgICAgIGljb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICBtdXNpY0xpYnJhcnkuZWRpdEFsYnVtRGV0YWlscyhhbGJ1bS5pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwcm9wXTogIWFsYnVtW3Byb3BdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGRhdGFDZWxsLnRleHRDb250ZW50ID0gYWxidW1bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGRhdGFDZWxsKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyBDcmVhdGUgcmVtb3ZlLWFsYnVtIGJ1dHRvblxuICAgICAgICAvLyBjb25zdCByZW1vdmVCdXR0b24gPSBfcmVuZGVyUmVtb3ZlQnV0dG9uKHJvdyk7XG4gICAgICAgIC8vIHJvdy5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xuICAgIFxuICAgICAgICAvLyBBcHBlbmQgbmV3IHJvd1xuICAgICAgICBjb250ZW50cy5hcHBlbmRDaGlsZChyb3cpO1xuXG4gICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV4dFJvdyA9IHJvdy5uZXh0U2libGluZztcblxuICAgICAgICAgICAgX2NvbGxhcHNlRXh0cmFJbmZvKCk7IC8vIENsb3NlIGFueSBvcGVuZWQgZXh0cmEtaW5mbyBwYW5lbHNcbiAgICAgICAgICAgIC8vIElmIHRoZSByb3cgaGFkIGFuIGV4dHJhLWluZm8gcGFuZWwgdGhlblxuICAgICAgICAgICAgLy8gZG8gbm90aGluZyAoZWZmZWN0aXZlbHkgY2xvc2luZyBpdClcbiAgICAgICAgICAgIGlmIChuZXh0Um93ICYmIG5leHRSb3cuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZXh0cmEtaW5mb1wiKSkgcmV0dXJuO1xuICAgICAgICAgICAgX3JlbmRlckV4dHJhSW5mbyhhbGJ1bSwgcm93KTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBldmVudHMuZW1pdChcInJvd0FkZGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jb2xsYXBzZUV4dHJhSW5mbygpIHtcbiAgICAgICAgY29uc3QgZXh0cmFSb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5leHRyYS1pbmZvXCIpO1xuXG4gICAgICAgIGV4dHJhUm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICByb3cucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChyb3cpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtLCByb3cpIHtcbiAgICAgICAgY29uc3QgZXh0cmFJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgICAgICBleHRyYUluZm8uY2xhc3NMaXN0LmFkZChcImV4dHJhLWluZm9cIik7XG4gICAgICAgIGNvbnN0IGRhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgICAgICBkYXRhQ2VsbC5zZXRBdHRyaWJ1dGUoXCJjb2xzcGFuXCIsIDUpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaW5mby1jb250YWluZXJcIik7XG5cbiAgICAgICAgY29uc3QgYWxidW1KYWNrZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBhbGJ1bUphY2tldC5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgYWxidW0uamFja2V0KTtcbiAgICAgICAgYWxidW1KYWNrZXQuY2xhc3NMaXN0LmFkZChcImphY2tldFwiKTtcblxuICAgICAgICBjb25zdCBnZW5lcmFsSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGdlbmVyYWxJbmZvLmNsYXNzTGlzdC5hZGQoXCJnZW5lcmFsLWluZm9cIik7XG4gICAgICAgIF9yZW5kZXJHZW5lcmFsSW5mbyhnZW5lcmFsSW5mbywgYWxidW0pXG4gICAgICAgIFxuXG4gICAgICAgIGNvbnN0IHJlY29yZEluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICByZWNvcmRJbmZvLmNsYXNzTGlzdC5hZGQoXCJyZWNvcmQtaW5mb1wiKTtcbiAgICAgICAgaWYgKGFsYnVtLm93bmVkKSBfcmVuZGVyUmVjb3JkSW5mbyhyZWNvcmRJbmZvLCBhbGJ1bSk7XG5cbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoYWxidW1KYWNrZXQpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKGdlbmVyYWxJbmZvKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChyZWNvcmRJbmZvKTtcblxuICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgICBleHRyYUluZm8uYXBwZW5kQ2hpbGQoZGF0YUNlbGwpO1xuXG4gICAgICAgIC8vIEluc2VydCBhZnRlclxuICAgICAgICByb3cucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZXh0cmFJbmZvLCByb3cubmV4dFNpYmxpbmcpO1xuXG4gICAgICAgIGRhdGFDZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBldmVudHMuZW1pdChcImVkaXRCdXR0b25DbGlja2VkXCIsIGFsYnVtKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyR2VuZXJhbEluZm8oY29udGFpbmVyLCBhbGJ1bSkge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImdlbnJlXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiR2VucmVcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwidG9wUlMxXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVG9wNTAwIChSUzEpXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcInRvcFJTM1wiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRvcDUwMCAoUlMzKVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IHVybHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImRpc2NvZ3NcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJEaXNjb2dzXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcIndpa2lwZWRpYVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIldpa2lwZWRpYVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHRleHQuaW5uZXJIVE1MID0gYDxzdHJvbmc+JHtmaWVsZC5sYWJlbH08L3N0cm9uZz46ICR7XG4gICAgICAgICAgICAgICAgYWxidW1bZmllbGQua2V5XVxuICAgICAgICAgICAgfWA7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdXJscy5mb3JFYWNoKCh1cmwpID0+IHtcbiAgICAgICAgICAgIGxldCBocmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICBocmVmLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgYWxidW1bdXJsLmtleV0pO1xuICAgICAgICAgICAgaHJlZi5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke3VybC5sYWJlbH08L3N0cm9uZz5gO1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaHJlZik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJSZWNvcmRJbmZvKGNvbnRhaW5lciwgYWxidW0pIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjYXRhbG9nX251bVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNhdGFsb2cjXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcInJlY29yZF9sYWJlbFwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkxhYmVsXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImNvdW50cnlcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJDb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImVkaXRpb25feWVhclwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkVkaXRpb25cIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwibWF0cml4XCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiTWF0cml4XCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImNvbmRpdGlvblwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNvbmRpdGlvblwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJub3Rlc1wiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIk5vdGVzXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBsZXQgZm9ybWF0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGZvcm1hdC5pbm5lckhUTUwgPSBgPHN0cm9uZz5Gb3JtYXQ8L3N0cm9uZz46ICR7YWxidW0ucmVjb3JkX2Zvcm1hdH0gKCR7YWxidW0uYWxidW1fZm9ybWF0fSlgO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZm9ybWF0KTtcblxuICAgICAgICBmaWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke2ZpZWxkLmxhYmVsfTwvc3Ryb25nPjogJHthbGJ1bVtmaWVsZC5rZXldfWA7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyUmVtb3ZlQnV0dG9uKHJvdykge1xuICAgICAgICAvLyBDcmVhdGUgdHJhc2hjYW4gYnV0dG9uIGFuZCBhcHBlbmQgaXQgdG8gcm93XG4gICAgICAgIGNvbnN0IGRhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgICAgICBjb25zdCByZW1vdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG4gICAgICAgIHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlLWFsYnVtXCIsIFwiaW1nLWJ1dHRvblwiLCBcImhpZGRlblwiKTtcbiAgICAgICAgcmVtb3ZlQnV0dG9uLnRpdGxlID0gXCJEZWxldGUgQWxidW1cIjtcblxuICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xuXG4gICAgICAgIC8vIENvbm5lY3QgbmV3IHJvdyBzbyB0aGF0IHJlbW92ZS1pY29uIG9ubHkgYXBwZWFycyBvbiBob3ZlclxuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIH0pO1xuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENvbm5lY3QgYnV0dG9uIHRvIHJlbW92ZUFsYnVtIGZ1bmN0aW9uXG4gICAgICAgIHJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHJvdy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmRlbGV0ZUFsYnVtKGlkKTtcblxuICAgICAgICAgICAgZXZlbnRzLmVtaXQoXCJyb3dEZWxldGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGF0YUNlbGxcbiAgICB9XG59KSgpO1xuXG52YXIgdGFibGVDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpLFxuICAgICAgICAgc29ydGFibGVIZWFkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRhYmxlIHRoLnNvcnRhYmxlXCIpO1xuICAgIHZhciBjdXJyU29ydGluZyA9IHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wiIH07XG5cbiAgICBzb3J0YWJsZUhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3NvcnRUYWJsZSk7XG4gICAgfSk7XG5cbiAgICBldmVudHMub24oXCJhbGJ1bURlbGV0ZWRcIiwgX3JlbW92ZVJvdyk7XG5cbiAgICBmdW5jdGlvbiBfcmVtb3ZlUm93KGlkKSB7XG4gICAgICAgIC8vIEFzayBjb25maXJtYXRpb24gYmVmb3JlIHJlbW92aW5nIGFsYnVtXG4gICAgICAgIGlmICghY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBhbGJ1bT9cIikpIHJldHVybjtcbiAgICBcbiAgICAgICAgLy8gUmVtb3ZlIHJvdyBhbmQgYWxidW0gZnJvbSBsaWJyYXJ5XG4gICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRyW2RhdGEtaWQ9JHtpZH1dYClcbiAgICAgICAgXG4gICAgICAgIGNvbnRlbnRzLnJlbW92ZUNoaWxkKHJvdyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3NvcnRUYWJsZShlKSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgbmV3U29ydEJ5ID0gaGVhZGVyLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpO1xuICAgICAgICBjb25zdCB7IGJ5OiBzb3J0QnksIG9yZDogc29ydE9yZCB9ID0gY3VyclNvcnRpbmc7XG4gICAgXG4gICAgICAgIC8vIElmIHNvcnRpbmcgbmV3IHJvdyBmbGlwIHJvdyBvcmRlciwgZWxzZSByb3cgb3JkZXIgYXMgYXNjIGFzIGRlZmF1bHRcbiAgICAgICAgaWYgKG5ld1NvcnRCeSA9PT0gc29ydEJ5KSB7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5vcmQgPSBzb3J0T3JkID09PSBcImFzY1wiID8gXCJkZXNjXCIgOiBcImFzY1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyclNvcnRpbmcuYnkgPSBuZXdTb3J0Qnk7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5vcmQgPSBcImFzY1wiO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIFNvcnQgbGlicmFyeSBhbGJ1bXM7XG4gICAgICAgIG11c2ljTGlicmFyeS5zb3J0KGN1cnJTb3J0aW5nKTtcbiAgICBcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBhbmQgZGlzcGxheSB0aGUgY29ycmVzcG9uZGluZyBvbmVcbiAgICAgICAgX2hpZGVTb3J0aW5nQXJyb3dzKCk7XG4gICAgICAgIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpIHtcbiAgICAgICAgLyogQWRkIHNvcnRpbmcgYXJyb3dzIHdpdGggdGhlIGNvcnJlcHNvbmRpbmcgb3JkZXIgaW4gdGhlIGNsaWNrZWQgaGVhZGVyICovXG4gICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG5cbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5hZGQoY3VyclNvcnRpbmcub3JkKTtcbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9oaWRlU29ydGluZ0Fycm93cygpIHtcbiAgICAgICAgLyogUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBmb3JtIGFsbCBoZWFkZXJzICovXG4gICAgICAgIHNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG4gICAgXG4gICAgICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QucmVtb3ZlKFwiYXNjXCIpO1xuICAgICAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNjXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVzZXRTb3J0aW5nKCkge1xuICAgICAgICBjdXJyU29ydGluZyA9IHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wiIH07XG5cbiAgICAgICAgX2hpZGVTb3J0aW5nQXJyb3dzKCk7XG4gICAgICAgIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJBbGJ1bShhbGJ1bSkge1xuICAgICAgICB2YXIgY3VyckZpbHRlciA9IGZpbHRlckNvbnRyb2xsZXIuZ2V0Q3VycmVudEZpbHRlcigpO1xuICAgICAgICB2YXIgeyB0eXBlOiBmaWx0ZXJUeXBlLCB2YWx1ZTogZmlsdGVyVmFsdWUgfSA9IGN1cnJGaWx0ZXI7XG4gICAgXG4gICAgICAgIC8vIFJlc2V0IGRpc3BsYXkgaWYgbm8gZmlsdGVyIGFwcGx5IChpbnB1dCBlbXB0eSkgZG8gbm90aGluZ1xuICAgICAgICBpZiAoZmlsdGVyVmFsdWUgPT09IFwiXCIpIHJldHVybiB0cnVlO1xuICAgIFxuICAgICAgICBzd2l0Y2ggKGZpbHRlclR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInRpdGxlXCJdLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gTWF0Y2ggYW55IG9mIHRoZSBjb21tYSBzZXBhcmF0ZWQgbWF0Y2hlc1xuICAgICAgICAgICAgICAgIGNvbnN0IGFydGlzdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlssO11cXHMqLyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFydGlzdExpc3Quc29tZSgoYXJ0aXN0KSA9PlxuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImFydGlzdFwiXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGFydGlzdC50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoID0gKHJlZ2V4KSA9PiBmaWx0ZXJWYWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgLy8gUmVnZXggZm9yIHllYXIgZm9yIGRpZmZlcmVudCByZWxlYXNlIHllYXIgZmlsdGVyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXhFcSA9IC9eXFxzKihcXGQrKVxccyokLywgLy8gU2luZ2xlIHllYXIgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhHdCA9IC8oPzpePlxccz8oXFxkKykkKS8sIC8vIEdyZWF0ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEx0ID0gLyg/Ol48XFxzPyhcXGQrKSQpLywgLy8gTG93ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEJ0dyA9IC8oPzpeKFxcZCspXFxzP1stLC87XVxccz8oXFxkKykkKS87IC8vVHdvIHZhbHVlcyBpbnRlcnZhbFxuICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXRjaChyZWdleEVxKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPT0gbWF0Y2gocmVnZXhFcSlbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEd0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPj0gbWF0Y2gocmVnZXhHdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEx0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhMdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEJ0dykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID49IG1hdGNoKHJlZ2V4QnR3KVsxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhCdHcpWzJdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIC8vIEFsbG93IHRoZSB1c2Ugb2YgZGlmZmVyZW50IHdvcmRzIGZvciB0cnVlIGFuZCBmYWxzZVxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwieWVzXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cnVlXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiMVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJub1wiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmFsc2VcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5vdCBvd25lZFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2FudFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiMFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcImZvcm1hdFwiOlxuICAgICAgICAgICAgICAgIC8vIEluIHRoaXMgZmlsdGVyIFwiK1wiID0gXCJhbmRcIiBhbmQgXCJbLDsvXVwiID0gXCJvclwiXG4gICAgICAgICAgICAgICAgbGV0IGZvcm1hdExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyVmFsdWUuaW5jbHVkZXMoXCIrXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlxcK1xccyovKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdExpc3QuZXZlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAoZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiZm9ybWF0XCJdLmZpbmRJbmRleChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCkgPT4gdmFsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlssOy9dXFxzKi8pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TGlzdC5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZvcm1hdCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImZvcm1hdFwiXS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWwpID0+IHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vIEVsc2UgZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmlsdGVyQWxidW1cbiAgICB9XG59KSgpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3RhYmxlLmpzXCJcbmltcG9ydCBcIi4vZmlsdGVyLmpzXCJcbmltcG9ydCBcIi4vbW9kYWwuanNcIlxuaW1wb3J0IFwiLi9sb2FkZXIuanNcIlxuXG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcbmltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiO1xuXG52YXIgc2FtcGxlID0gcmVxdWlyZShcIi4uL2FsYnVtX3NhbXBsZS5qc29uXCIpXG5cbmZvciAoY29uc3Qga2V5IGluIHNhbXBsZSkge1xuICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChzYW1wbGUsIGtleSkpIHtcbiAgICAgICAgdmFyIG5ld0FsYnVtID0gQWxidW0oc2FtcGxlW2tleV0pO1xuICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==