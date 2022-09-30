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



const lang = window.navigator.language;

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
        if (lang === "es") {
            summary.textContent =
            totalEntries === 0
                ? "No hay ningún álbum en la colección. Añade uno usando el botón"
                : `Mostrando ${shownEntries} de ${totalEntries} álbums`;
        } else {
            summary.textContent =
            totalEntries === 0
                ? "No albums in the library. Add one by clicking the button"
                : `Showing ${shownEntries} out of ${totalEntries} albums`;
        }
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
        const prefix = lang === "es" ? "p. ej. " : "e.g. ";
        const placeholder = {
            title: '"submarine"',
            artist: '"zeppelin", "beatles, rolling"',
            release_year: '"1990", "1-2000", ">1900", "<1980"',
            owned: '"true", "no", "not owned"',
            format: '"Vynil", "cd+casette", "vynil/CD"'
        };

        filterValue.placeholder = prefix + placeholder[filter];
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

    function getAlbum(id) {
        return albumList.filter((album) => id === album.id);
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
        getAlbum,
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




const lang = window.navigator.language;

var modalController = (function () {
    const overlay = document.querySelector(".modal-overlay"), 
        openButton = document.getElementById("open-modal"),
        closeButton = document.getElementById("close-modal"),
        modal = document.querySelector(".modal"),
        header = modal.querySelector("h2"),
        resetButton = document.querySelector('button[type="reset"]');

    openButton.addEventListener("click", () => _open("new"));
    closeButton.addEventListener("click", close);

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("editAlbum", album => _open("edit", album));

    function _open(mode, album) {
        /* Display form modal over main window and focus on first input */
        overlay.classList.remove("hidden");
        document.getElementById("new-title").focus();

        if (mode==="new") {
            modal.setAttribute("data-mode", "new"); 
            modal.setAttribute("data-album-id", ""); 
            header.textContent = lang === "es" ? "Añadir Álbum" : "New Album";
            resetButton.textContent = "Reset";
        }  else if (mode==="edit") {
            modal.setAttribute("data-mode", "edit"); 
            modal.setAttribute("data-album-id", album.id); 
            header.textContent = lang === "es" ? "Editar Álbum" : "Edit Album";
            resetButton.textContent = lang === "es" ? "Cancelar" : "Cancel";
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
        _library_js__WEBPACK_IMPORTED_MODULE_2__["default"].getAlbumList().map(
            (album) => album.artist
        );
        // Compute artist suggestions given the current albums in the library
        var suggestions = _library_js__WEBPACK_IMPORTED_MODULE_2__["default"].getAlbumList().reduce((sugg, album) => {
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




const lang = window.navigator.language

var tableView = (function () {
    const contents = document.querySelector("table > tbody");

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("albumAdded", _update);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("albumEdited", _update);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("librarySorted", _update);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("filterApplied", _update);
    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("removeRow", _removeRow);

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

    function _removeRow(id) {
        // Ask confirmation before removing album
        confirmDelete = lang === "es" ?
                        "¿Estás seguro de que quiere borrar este álbum?" :
                        "Are you sure you want to delete this album?"
        if (!confirm(confirmDelete)) return;
    
        // Remove row and album from library
        const row = document.querySelector(`tr[data-id=${id}]`)
        
        contents.removeChild(row);
        _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].deleteAlbum(id);
        _collapseExtraInfo();
    }

    function _renderAlbum(album) {
        // Apply filter. If false do not render
        if (!tableController.filterAlbum(album)) return;
        
        // Create a new row for the album
        const row = document.createElement("tr");
        // Set album attribute as unique identifier for the row
        row.classList.add("album-row");
        row.setAttribute("data-id", album.id);

        // Add album options icon (three dots)
        const optionsButton = _appendOptionsButton(row);
        row.append(optionsButton);
        optionsButton.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            optionsModal.open(e.x, e.y, album);
        })

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

        // Append new row
        contents.appendChild(row);

        row.addEventListener("click", () => {
            const nextRow = row.nextSibling;

            _collapseExtraInfo(); 
            // Close any opened extra-info panels
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
    }

    function _renderGeneralInfo(container, album) {
        const fields = [
            {
                key: "genre",
                label: lang === "es" ? "Género" : "Genre",
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
                label: lang === "es" ? "Nº Catálogo" : "Catalog #",
                icon: "",
            },
            {
                key: "record_label",
                label: lang === "es" ? "Sello" : "Label",
                icon: "",
            },
            {
                key: "country",
                label: lang === "es" ? "País" : "Country",
                icon: "",
            },
            {
                key: "edition_year",
                label: lang === "es" ? "Año Edición" : "Edition",
                icon: "",
            },
            {
                key: "matrix",
                label: lang === "es" ? "Matriz" : "Matrix",
                icon: "",
            },
            {
                key: "condition",
                label: lang === "es" ? "Estado" : "Condition",
                icon: "",
            },
            {
                key: "notes",
                label: lang === "es" ? "Obs." : "Notes",
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

    function _appendOptionsButton(row) {
        // Create trashcan button and append it to row
        const dataCell = document.createElement("td");
        const button = document.createElement("img");

        dataCell.classList.add("album-options");

        button.setAttribute("src", "../images/dots-vertical.svg")
        button.classList.add("cell-icon")
        button.title = lang === "es" ?
                        "Opciones" :
                        "Album Options";
        button.style.visibility = "hidden";

        dataCell.appendChild(button);

        // Connect new row so that remove-icon only appears on hover
        row.addEventListener("mouseenter", function () {
            button.style.visibility = "visible";
        });
        row.addEventListener("mouseleave", function () {
            button.style.visibility = "hidden";
        });

        return dataCell;
    }
})();

var tableController = (function () {
    const contents = document.querySelector("table > tbody"),
         sortableHeaders = document.querySelectorAll("table th.sortable");
    var currSorting = { by: "title", ord: "asc" };

    sortableHeaders.forEach((header) => {
        header.addEventListener("click", _sortTable);
    });

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
                if (filterValue.toLowerCase() in [
                    "1", "yes", "true", "own", "sí", "si", "adq", "adquirido"
                ]) {
                    return album["owned"];
                } else if (filterValue.toLowerCase() in [
                    "0", "no", "not", "false", "!owned", "want", "!adq", "!adquirido"
                ]) {
                    return !album["owned"];
                } else {
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


var optionsModal = (function(album) {
    const modal = document.getElementById("options-modal");

    modal.addEventListener("mouseleave", close)

    function open(x, y, album) {
        const editAlbum = document.getElementById("edit-album"),
            delAlbum = document.getElementById("delete-album");

        _render(x, y)
        modal.classList.remove("hidden");

        editAlbum.addEventListener("click", () => {
            _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("editAlbum", album);
            console.log("edit")
        })

        delAlbum.addEventListener("click", () => {
            _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("removeRow", album.id);
            console.log("remove")
        })
    }

    function close() {
        const editAlbum = document.getElementById("edit-album"),
            delAlbum = document.getElementById("delete-album");

        editAlbum.replaceWith(editAlbum.cloneNode(true));
        delAlbum.replaceWith(delAlbum.cloneNode(true));
        modal.classList.add("hidden");
        
    }

    function _render(x, y) {
        modal.style.left = x - 5 + "px";
        modal.style.top = y - 5 + "px";
    }

    return {
        open
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05tQjtBQUNDO0FBQ0Q7QUFDQzs7QUFFb0I7QUFDVDs7QUFFL0IsYUFBYSxtQkFBTyxDQUFDLGlEQUFzQjs7QUFFM0M7QUFDQTtBQUNBLHVCQUF1QixxREFBSztBQUM1QixRQUFRLDREQUFxQjtBQUM3QjtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9hbGJ1bS5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2xpYnJhcnkuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9tb2RhbC5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL3RhYmxlLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBBbGJ1bSA9IChcbiAgICB7IHRpdGxlLFxuICAgICAgYXJ0aXN0LFxuICAgICAgcmVsZWFzZV95ZWFyLFxuICAgICAgb3duZWQsXG4gICAgICBmYXZvcml0ZSxcbiAgICAgIGdlbnJlLFxuICAgICAgdG9wUlMxLFxuICAgICAgdG9wUlMzLFxuICAgICAgZGlzY29ncyxcbiAgICAgIHdpa2lwZWRpYSxcbiAgICAgIHJlY29yZF9mb3JtYXQsXG4gICAgICBhbGJ1bV9mb3JtYXQsXG4gICAgICBjYXRhbG9nX251bSxcbiAgICAgIGVkaXRpb25feWVhcixcbiAgICAgIGNvdW50cnksXG4gICAgICByZWNvcmRfbGFiZWwsXG4gICAgICBtYXRyaXgsXG4gICAgICBjb25kaXRpb24sXG4gICAgICBub3RlcyxcbiAgICAgIGphY2tldFxuICAgIH1cbikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlkOiB0aXRsZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoL1xcVy9nLCBcIlwiKSArXG4gICAgICAgICAgICBhcnRpc3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlQWxsKC9cXFcvZywgXCJcIikgK1xuICAgICAgICAgICAgcmVsZWFzZV95ZWFyLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgYXJ0aXN0LFxuICAgICAgICByZWxlYXNlX3llYXIsXG4gICAgICAgIG93bmVkOiBCb29sZWFuKG93bmVkKSxcbiAgICAgICAgZmF2b3JpdGU6IEJvb2xlYW4oZmF2b3JpdGUpLFxuICAgICAgICBnZW5yZTogZ2VucmUgfHwgXCJcIixcbiAgICAgICAgdG9wUlMxOiB0b3BSUzEgfHwgXCJcIixcbiAgICAgICAgdG9wUlMzOiB0b3BSUzMgfHwgXCJcIixcbiAgICAgICAgZGlzY29nczogZGlzY29ncyB8fCBcIlwiLFxuICAgICAgICB3aWtpcGVkaWE6IHdpa2lwZWRpYSB8fCBcIlwiLFxuICAgICAgICByZWNvcmRfZm9ybWF0OiB0eXBlb2YocmVjb3JkX2Zvcm1hdCkgPT09IFwic3RyaW5nXCIgP1xuICAgICAgICAgICAgICAgICAgICAgICBBcnJheShyZWNvcmRfZm9ybWF0KSA6XG4gICAgICAgICAgICAgICAgICAgICAgIHJlY29yZF9mb3JtYXQsXG4gICAgICAgIGFsYnVtX2Zvcm1hdDogYWxidW1fZm9ybWF0IHx8IFwiXCIsXG4gICAgICAgIGNhdGFsb2dfbnVtOiBjYXRhbG9nX251bSB8fCBcIlwiLFxuICAgICAgICBlZGl0aW9uX3llYXI6IGVkaXRpb25feWVhciB8fCBcIlwiLFxuICAgICAgICBjb3VudHJ5OiBjb3VudHJ5IHx8IFwiXCIsXG4gICAgICAgIHJlY29yZF9sYWJlbDogcmVjb3JkX2xhYmVsIHx8IFwiXCIsXG4gICAgICAgIG1hdHJpeDogbWF0cml4IHx8IFwiXCIsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZGl0aW9uIHx8IFwiXCIsXG4gICAgICAgIG5vdGVzOiBub3RlcyB8fCBcIk5vbmVcIixcbiAgICAgICAgamFja2V0OiBqYWNrZXQgfHwgXCJcIlxuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsYnVtIiwidmFyIGV2ZW50cyA9IHtcbiAgICBldmVudHM6IHt9LFxuICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgICB9LFxuICAgIG9mZjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgZm4oZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBldmVudHMiLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5cbmNvbnN0IGxhbmcgPSB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlO1xuXG52YXIgc3VtbWFyeVZpZXcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVudHJpZXMtY291bnRcIiksXG4gICAgICAgIHRhYmxlQ29udGVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUgPiB0Ym9keVwiKTtcblxuICAgIGV2ZW50cy5vbihcImZpbHRlckFwcGxpZWRcIiwgX3JlbmRlcik7XG4gICAgZXZlbnRzLm9uKFwicm93QWRkZWRcIiwgX3JlbmRlcik7XG4gICAgZXZlbnRzLm9uKFwicm93RGVsZXRlZFwiLCBfcmVuZGVyKTtcblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsRW50cmllcyA9IG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5sZW5ndGgsIC8vIExlbmd0aCBvZiBsaWJyYXJ5IGxpc3RcbiAgICAgICAgICAgIHNob3duRW50cmllcyA9IHRhYmxlQ29udGVudHMucXVlcnlTZWxlY3RvckFsbChcInRyOm5vdCguZXh0cmEtaW5mbylcIikubGVuZ3RoOyAvLyBOdW1iZXIgb2Ygcm93cyBpbiB0YWJsZVxuXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBhbGJ1bXMgaW4gdGhlIGxpYnJhcnkgcHJpbnQgd2VsY29tZSBtZXNzYWdlXG4gICAgICAgIGlmIChsYW5nID09PSBcImVzXCIpIHtcbiAgICAgICAgICAgIHN1bW1hcnkudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgdG90YWxFbnRyaWVzID09PSAwXG4gICAgICAgICAgICAgICAgPyBcIk5vIGhheSBuaW5nw7puIMOhbGJ1bSBlbiBsYSBjb2xlY2Npw7NuLiBBw7FhZGUgdW5vIHVzYW5kbyBlbCBib3TDs25cIlxuICAgICAgICAgICAgICAgIDogYE1vc3RyYW5kbyAke3Nob3duRW50cmllc30gZGUgJHt0b3RhbEVudHJpZXN9IMOhbGJ1bXNgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VtbWFyeS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICB0b3RhbEVudHJpZXMgPT09IDBcbiAgICAgICAgICAgICAgICA/IFwiTm8gYWxidW1zIGluIHRoZSBsaWJyYXJ5LiBBZGQgb25lIGJ5IGNsaWNraW5nIHRoZSBidXR0b25cIlxuICAgICAgICAgICAgICAgIDogYFNob3dpbmcgJHtzaG93bkVudHJpZXN9IG91dCBvZiAke3RvdGFsRW50cmllc30gYWxidW1zYDtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG5cbnZhciBmaWx0ZXJDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VyckZpbHRlciA9IHsgdHlwZTogXCJcIiwgdmFsdWU6IFwiXCIgfTtcbiAgICBjb25zdCBmaWx0ZXJGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItYnlcIiksXG4gICAgICAgIGZpbHRlclNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyXCIpLFxuICAgICAgICBmaWx0ZXJWYWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLXZhbHVlXCIpLFxuICAgICAgICBlbnRyaWVzQ291bnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVudHJpZXMtY291bnRcIik7XG5cbiAgICBmaWx0ZXJTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfcmVzZXRGaWx0ZXIpO1xuICAgIGZpbHRlckZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBfYXBwbHlGaWx0ZXIpO1xuICAgIGZpbHRlclZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfcmVzZXRGaWx0ZXIpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudEZpbHRlcigpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJGaWx0ZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FwcGx5RmlsdGVyKGUgPSBudWxsKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBzdWJtaXQgYmVoYXZpb3VyXG4gICAgICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgXG4gICAgICAgIC8vIFVwZGF0ZSBjdXJyZW50IGZpbHRlciB3aXRoIHZhbHVlcyBmcm9tIHRoZSBmaWx0ZXIgZm9ybVxuICAgICAgICBjdXJyRmlsdGVyW1widHlwZVwiXSA9IGZpbHRlclNlbGVjdC52YWx1ZTtcbiAgICAgICAgY3VyckZpbHRlcltcInZhbHVlXCJdID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItdmFsdWVcIikudmFsdWU7XG4gICAgXG4gICAgICAgIC8vIFVwZGF0ZSB0YWJsZVxuICAgICAgICBldmVudHMuZW1pdChcImZpbHRlckFwcGxpZWRcIiwgY3VyckZpbHRlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJQbGFjZWhvbGRlcigpIHtcbiAgICAgICAgLyogVXBkYXRlIHBsYWNlaG9sZGVyIG1lc3NhZ2UgYWNjb3JkaW5nIHRvIHRoZSBzZWxlY3RlZCBvcHRpb24gKi9cbiAgICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgICAgICBjb25zdCBwcmVmaXggPSBsYW5nID09PSBcImVzXCIgPyBcInAuIGVqLiBcIiA6IFwiZS5nLiBcIjtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB7XG4gICAgICAgICAgICB0aXRsZTogJ1wic3VibWFyaW5lXCInLFxuICAgICAgICAgICAgYXJ0aXN0OiAnXCJ6ZXBwZWxpblwiLCBcImJlYXRsZXMsIHJvbGxpbmdcIicsXG4gICAgICAgICAgICByZWxlYXNlX3llYXI6ICdcIjE5OTBcIiwgXCIxLTIwMDBcIiwgXCI+MTkwMFwiLCBcIjwxOTgwXCInLFxuICAgICAgICAgICAgb3duZWQ6ICdcInRydWVcIiwgXCJub1wiLCBcIm5vdCBvd25lZFwiJyxcbiAgICAgICAgICAgIGZvcm1hdDogJ1wiVnluaWxcIiwgXCJjZCtjYXNldHRlXCIsIFwidnluaWwvQ0RcIidcbiAgICAgICAgfTtcblxuICAgICAgICBmaWx0ZXJWYWx1ZS5wbGFjZWhvbGRlciA9IHByZWZpeCArIHBsYWNlaG9sZGVyW2ZpbHRlcl07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3Jlc2V0RmlsdGVyKGUpIHtcbiAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJpbnB1dFwiICYmIGZpbHRlclZhbHVlLnZhbHVlICE9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIC8qIFJlc2V0IGZpbHRlciB3aGVuIHRoZSBpbnB1dCBib3ggaXMgZW1wdHkgYW5kIGFwcGx5IGVtcHR5IGZpbHRlciAqL1xuICAgICAgICBcbiAgICAgICAgZmlsdGVyVmFsdWUudmFsdWUgPSBcIlwiO1xuICAgICAgICBfcmVuZGVyUGxhY2Vob2xkZXIoKTtcbiAgICAgICAgX2FwcGx5RmlsdGVyKCk7XG4gICAgXG4gICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9ICAgIFxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Q3VycmVudEZpbHRlcixcbiAgICB9XG59KSgpO1xuXG5leHBvcnQgeyBmaWx0ZXJDb250cm9sbGVyIH0iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiXG5cbnZhciBtdXNpY0xpYnJhcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbGJ1bUxpc3QgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGdldEFsYnVtTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIGFsYnVtTGlzdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRBbGJ1bShuZXdBbGJ1bSwgcG9zKSB7XG4gICAgICAgIC8vIElmIHBvc2l0aW9uIGlzIHByb3ZpZGVkIHRoZW4gcmVtb3ZlcyBlbnRyeSBhdCBwb3MgYW5kIGluc2VydHMgbmV3IG9uZVxuICAgICAgICBpZiAoYWxidW1MaXN0LmV2ZXJ5KChhbGJ1bSkgPT4gbmV3QWxidW0uaWQgIT09IGFsYnVtLmlkKSB8fFxuICAgICAgICAgICAgbmV3QWxidW0uaWQgPT09IGFsYnVtTGlzdFtwb3NdLmlkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKHBvcykgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc3BsaWNlKHBvcywgMSwgbmV3QWxidW0pO1xuICAgICAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1FZGl0ZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC51bnNoaWZ0KG5ld0FsYnVtKTtcbiAgICAgICAgICAgICAgICBldmVudHMuZW1pdChcImFsYnVtQWRkZWRcIiwgbmV3QWxidW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGFsYnVtIGV4aXN0IGxvZyBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICBhbGVydChcIlRoaXMgYWxidW0gYWxyZWFkeSBleGlzdHMuXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXBlYXRlZCBJRDogXCIgKyBuZXdBbGJ1bS5pZClcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBkZWxldGVBbGJ1bShpZCkge1xuICAgICAgICAvKiBEZWxldGUgYWxidW0gd2l0aCBhIGdpdmVuIElEICovXG4gICAgICAgIGFsYnVtTGlzdCA9IGFsYnVtTGlzdC5maWx0ZXIoKGFsYnVtKSA9PiBhbGJ1bS5pZCAhPT0gaWQpO1xuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1EZWxldGVkXCIsIGlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlZGl0QWxidW0oaWQsIG5ld0FsYnVtKSB7XG4gICAgICAgIC8vIG5ld0FsYnVtIGlzIHRoZSBhbGJ1bSBvYmplY3QgY29udGFpbmluZyB0aGUgdXBkYXRlZCBpbmZvXG4gICAgICAgIGNvbnN0IGFsYnVtSWR4ID0gYWxidW1MaXN0LmZpbmRJbmRleChcbiAgICAgICAgICAgIChhbGJ1bSkgPT4gaWQgPT09IGFsYnVtLmlkXG4gICAgICAgICk7XG5cbiAgICAgICAgYWRkQWxidW0obmV3QWxidW0sIGFsYnVtSWR4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlZGl0QWxidW1EZXRhaWxzKGlkLCBuZXdJbmZvKSB7XG4gICAgICAgIGNvbnN0IGFsYnVtSWR4ID0gYWxidW1MaXN0LmZpbmRJbmRleChcbiAgICAgICAgICAgIChhbGJ1bSkgPT4gaWQgPT09IGFsYnVtLmlkXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIG5ld0luZm8pIHtcbiAgICAgICAgICAgIGFsYnVtTGlzdFthbGJ1bUlkeF1bcHJvcF0gPSBuZXdJbmZvW3Byb3BdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bUVkaXRlZFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBbGJ1bShpZCkge1xuICAgICAgICByZXR1cm4gYWxidW1MaXN0LmZpbHRlcigoYWxidW0pID0+IGlkID09PSBhbGJ1bS5pZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc29ydCh7IGJ5LCBvcmQgPSBcImFzY1wiIH0pIHtcbiAgICAgICAgLyogUmV2ZXJzZSBzb3J0aW5nIGFsZ29yaXRobSBpcyBvcmQgPSAnZGVzYyc7ICovXG4gICAgICAgIGxldCBzb3J0T3JkZXIgPSBvcmQgPT09IFwiYXNjXCIgPyAxIDogLTE7XG5cbiAgICAgICAgc3dpdGNoIChieSkge1xuICAgICAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gbG9jYWxlQ29tcGFyZSB1c2VkIHRvIGNvbXBhcmUgc3RyaW5nIHdpdGhvdXQgbWF0aCBvcGVyYXRvcnNcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc29ydChcbiAgICAgICAgICAgICAgICAgICAgKGEsIGIpID0+IGFbYnldLmxvY2FsZUNvbXBhcmUoYltieV0pICogc29ydE9yZGVyXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWxlYXNlX3llYXJcIjpcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc29ydCgoYSwgYikgPT4gKGFbYnldIC0gYltieV0pICogc29ydE9yZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwibGlicmFyeVNvcnRlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRBbGJ1bUxpc3QsXG4gICAgICAgIGFkZEFsYnVtLFxuICAgICAgICBkZWxldGVBbGJ1bSxcbiAgICAgICAgZWRpdEFsYnVtLFxuICAgICAgICBlZGl0QWxidW1EZXRhaWxzLFxuICAgICAgICBnZXRBbGJ1bSxcbiAgICAgICAgc29ydFxuICAgIH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IG11c2ljTGlicmFyeVxuXG4iLCJpbXBvcnQgQWxidW0gZnJvbSBcIi4vYWxidW0uanNcIlxuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCJcblxuY29uc3QgZmlsZUxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlLWxvYWRlcicpO1xuXG5maWxlTG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGVMaXN0ID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgIHZhciBmaWxlID0gZmlsZUxpc3RbMF07XG4gICAgcmVhZEZpbGUoZmlsZSk7XG4gICAgZmlsZUxvYWRlci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9KTtcblxuZnVuY3Rpb24gcmVhZEZpbGUoZikge1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdmFyIG11c2ljQ29sbGVjdGlvbiA9IHBhcnNlQWxidW1MaWJyYXJ5KGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICBhZGRDb2xsZWN0aW9uKG11c2ljQ29sbGVjdGlvbilcbiAgICB9KTtcbiAgICByZWFkZXIucmVhZEFzVGV4dChmLCBcInV0Zi04XCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUNTViAoc3RyaW5nLCBkZWxpbWl0ZXI9XCIsXCIpIHtcbiAgICAvLyBDb21tZW50ZWQgY29kZSBpbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjkzMTQ3L2hvdy10by1wYXJzZS1jc3YtZGF0YVxuICAgIHZhciBvYmpQYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICAgICAgKFxuICAgICAgICAgICAgXCIoXFxcXFwiICsgZGVsaW1pdGVyICsgXCJ8XFxcXHI/XFxcXG58XFxcXHJ8XilcIiArICAvLyBEZWxpbWl0ZXJzXG4gICAgICAgICAgICBcIig/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInxcIiArIC8vIFF1b3RlZCBmaWVsZHNcbiAgICAgICAgICAgIFwiKFteXFxcIlxcXFxcIiArIGRlbGltaXRlciArIFwiXFxcXHJcXFxcbl0qKSlcIiAvLyBTdGFuZGFyZCBmaWVsZHNcbiAgICAgICAgKSwgXCJnaVwiKTtcblxuICAgIHZhciBhcnJEYXRhID0gW1tdXTtcbiAgICB2YXIgYXJyTWF0Y2hlcyA9IG51bGw7XG5cbiAgICB3aGlsZSAoYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyggc3RyaW5nICkpe1xuICAgICAgICB2YXIgc3RyTWF0Y2hlZERlbGltaXRlciA9IGFyck1hdGNoZXNbIDEgXTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJlxuICAgICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gZGVsaW1pdGVyXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgYXJyRGF0YS5wdXNoKCBbXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWRWYWx1ZTtcbiAgICAgICAgaWYgKGFyck1hdGNoZXNbIDIgXSl7XG4gICAgICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAyIF0ucmVwbGFjZShcbiAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKCBcIlxcXCJcXFwiXCIsIFwiZ1wiIClcbiAgICAgICAgICAgICAgICAsIFwiXFxcIlwiICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAzIF07XG4gICAgICAgIH1cblxuICAgICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKCBzdHJNYXRjaGVkVmFsdWUgKTtcbiAgICB9XG5cbiAgICByZXR1cm4oIGFyckRhdGEgKTtcbn1cblxuZnVuY3Rpb24gY3N2VG9PYmplY3QgKGNzdkNvbnRlbnQpIHtcbiAgICB2YXIgcHJvcHMgPSBjc3ZDb250ZW50WzBdO1xuICAgIHZhciBvYmplY3QgPSBbXTtcblxuICAgIGNzdkNvbnRlbnQuc2xpY2UoMSwgLTEpLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgdmFyIGl0ZW0gPSB7fTtcbiAgICAgICAgcm93LmZvckVhY2goKHZhbCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBpdGVtW3Byb3BzW2lkeF1dID0gdmFsO1xuICAgICAgICB9KVxuXG4gICAgICAgIG9iamVjdC5wdXNoKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICggb2JqZWN0IClcbn1cblxuZnVuY3Rpb24gcGFyc2VBbGJ1bUxpYnJhcnkoZmlsZUNvbnRlbnQpIHtcbiAgICB2YXIgcGFyc2VkQ1NWID0gcGFyc2VDU1YoZmlsZUNvbnRlbnQpO1xuICAgIHZhciBjb2xsZWN0aW9uID0gY3N2VG9PYmplY3QocGFyc2VkQ1NWKTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uXG59O1xuXG5mdW5jdGlvbiBhZGRDb2xsZWN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgY29sbGVjdGlvbi5mb3JFYWNoKChhbGJ1bSwgaWR4KSA9PiB7XG4gICAgICAgIHZhciBuZXdBbGJ1bSA9IEFsYnVtKHtcbiAgICAgICAgICAgIHRpdGxlOiBhbGJ1bVtcIk5vbWJyZVwiXSxcbiAgICAgICAgICAgIGFydGlzdDogYWxidW1bXCJBcnRpc3RhXCJdLFxuICAgICAgICAgICAgcmVsZWFzZV95ZWFyOiBhbGJ1bVtcIkFubyBsYW56YW1pZW50b1wiXSxcbiAgICAgICAgICAgIG93bmVkOiBhbGJ1bVtcIkFkcXVpcmlkb1wiXSA9PT0gXCIxXCIgP1xuICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgZm9ybWF0OiBhbGJ1bVtcIkZvcm1hdG9cIl0uaW5jbHVkZXMoXCIvXCIpID9cbiAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJGb3JtYXRvXCJdLnNwbGl0KFwiL1wiKSA6XG4gICAgICAgICAgICAgICAgICAgIFthbGJ1bVtcIkZvcm1hdG9cIl1dXG4gICAgICAgIH0pXG5cbiAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICB9KVxuXG4gICAgbXVzaWNMaWJyYXJ5LnNvcnQoeyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCJ9KVxufTtcblxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHMuanNcIjtcbmltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5cbmNvbnN0IGxhbmcgPSB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlO1xuXG52YXIgbW9kYWxDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1vdmVybGF5XCIpLCBcbiAgICAgICAgb3BlbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1tb2RhbFwiKSxcbiAgICAgICAgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsb3NlLW1vZGFsXCIpLFxuICAgICAgICBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWxcIiksXG4gICAgICAgIGhlYWRlciA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKSxcbiAgICAgICAgcmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInJlc2V0XCJdJyk7XG5cbiAgICBvcGVuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfb3BlbihcIm5ld1wiKSk7XG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlKTtcblxuICAgIGV2ZW50cy5vbihcImVkaXRBbGJ1bVwiLCBhbGJ1bSA9PiBfb3BlbihcImVkaXRcIiwgYWxidW0pKTtcblxuICAgIGZ1bmN0aW9uIF9vcGVuKG1vZGUsIGFsYnVtKSB7XG4gICAgICAgIC8qIERpc3BsYXkgZm9ybSBtb2RhbCBvdmVyIG1haW4gd2luZG93IGFuZCBmb2N1cyBvbiBmaXJzdCBpbnB1dCAqL1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRpdGxlXCIpLmZvY3VzKCk7XG5cbiAgICAgICAgaWYgKG1vZGU9PT1cIm5ld1wiKSB7XG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIiwgXCJuZXdcIik7IFxuICAgICAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKFwiZGF0YS1hbGJ1bS1pZFwiLCBcIlwiKTsgXG4gICAgICAgICAgICBoZWFkZXIudGV4dENvbnRlbnQgPSBsYW5nID09PSBcImVzXCIgPyBcIkHDsWFkaXIgw4FsYnVtXCIgOiBcIk5ldyBBbGJ1bVwiO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udGV4dENvbnRlbnQgPSBcIlJlc2V0XCI7XG4gICAgICAgIH0gIGVsc2UgaWYgKG1vZGU9PT1cImVkaXRcIikge1xuICAgICAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIsIFwiZWRpdFwiKTsgXG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFsYnVtLWlkXCIsIGFsYnVtLmlkKTsgXG4gICAgICAgICAgICBoZWFkZXIudGV4dENvbnRlbnQgPSBsYW5nID09PSBcImVzXCIgPyBcIkVkaXRhciDDgWxidW1cIiA6IFwiRWRpdCBBbGJ1bVwiO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udGV4dENvbnRlbnQgPSBsYW5nID09PSBcImVzXCIgPyBcIkNhbmNlbGFyXCIgOiBcIkNhbmNlbFwiO1xuICAgICAgICAgICAgX3BvcHVsYXRlRm9ybShhbGJ1bSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgIC8qIEhpZGUgbW9kYWwgKi9cbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICBhbGJ1bUZvcm1Db250cm9sbGVyLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3BvcHVsYXRlRm9ybShhbGJ1bSkge1xuICAgICAgICBmb3IgKGxldCBwcm9wIGluIGFsYnVtKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwib3duZWRcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiZmF2b3JpdGVcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiYWxidW1fZm9ybWF0XCI6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhZGlvQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBgaW5wdXRbdHlwZT1yYWRpb11bbmFtZT0ke3Byb3B9XWBcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBidXR0b24gb2YgcmFkaW9CdXR0b25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU3RyaW5nKGFsYnVtW3Byb3BdKSA9PT0gYnV0dG9uLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwicmVjb3JkX2Zvcm1hdFwiOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja0JveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpbnB1dFt0eXBlPWNoZWNrYm94XVtuYW1lPSR7cHJvcH1dYFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGJveCBvZiBjaGVja0JveGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxidW1bcHJvcF0uc29tZShmb3JtYXQgPT4gZm9ybWF0ID09PSBib3gudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XCIke3Byb3B9XCJdYCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0ICYmIGFsYnVtW3Byb3BdICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IGFsYnVtW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2xvc2VcbiAgICB9XG59KSgpO1xuXG52YXIgYWxidW1Gb3JtQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsXCIpLFxuICAgICAgICBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGQtYWxidW1cIiksXG4gICAgICAgIHJlc2V0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uW3R5cGU9XCJyZXNldFwiXScpLFxuICAgICAgICBvd25zVHJ1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ducy10cnVlXCIpLFxuICAgICAgICBvd25zRmFsc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm93bnMtZmFsc2VcIiksXG4gICAgICAgIHJlY29yZEZpZWxkU2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWNvcmQtaW5mby1mc1wiKTtcblxuICAgIC8vIFN1Ym1pdCBhbmQgcmVzZXQgXCJOZXcgQWxidW1cIiBmb3JtXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIF9zdWJtaXROZXdBbGJ1bSk7XG4gICAgcmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgaWYgKG1vZGFsLmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKSA9PT0gXCJlZGl0XCIpIG1vZGFsQ29udHJvbGxlci5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gRW5hYmxlIGNoZWNrYm94ZXMgd2hlbiB1c2VyIGNsaWNrcyBidXR0b24gYW5kIGRpc2FibGUgd2hlbiBub3RcbiAgICBvd25zVHJ1ZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIF9lbmFibGVSZWNvcmRGaWVsZHNldCk7XG4gICAgb3duc0ZhbHNlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgX2Rpc2FibGVSZWNvcmRGaWVsZHNldCk7XG5cbiAgICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICBfZGlzYWJsZVJlY29yZEZpZWxkc2V0KCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9kaXNhYmxlUmVjb3JkRmllbGRzZXQoKSB7XG4gICAgICAgIC8qIERpc2FibGUgc2Vjb25kIGZpZWxkc2V0ICAoUmVjb3JkIGluZm8pICovXG4gICAgICAgIHJlY29yZEZpZWxkU2V0LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIHJlY29yZEZpZWxkU2V0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX2VuYWJsZVJlY29yZEZpZWxkc2V0KCkge1xuICAgICAgICAvKiBFbmFibGUgc2Vjb25kIGZpZWxkc2V0ICAoUmVjb3JkIGluZm8pICovXG4gICAgICAgIHJlY29yZEZpZWxkU2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIHJlY29yZEZpZWxkU2V0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9zdWJtaXROZXdBbGJ1bShlKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBzdWJtaXQgYWN0aW9uXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBhbGJ1bSBvYmplY3QgYW5kIGFkZCBpdCB0byB0aGUgbGlicmFyeVxuICAgICAgICBjb25zdCBuZXdBbGJ1bSA9IEFsYnVtKF9wcm9jZXNzTmV3QWxidW1Gb3JtKCkpO1xuXG4gICAgICAgIGNvbnN0IG1vZGUgPSBtb2RhbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIik7XG4gICAgICAgIGNvbnN0IGlkID0gbW9kYWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1hbGJ1bS1pZFwiKTtcblxuICAgICAgICBpZiAobW9kZSA9PT0gXCJuZXdcIikge1xuICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG11c2ljTGlicmFyeS5lZGl0QWxidW0oaWQsIG5ld0FsYnVtKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDbG9zZSBmb3JtIG1vZGFsXG4gICAgICAgIG1vZGFsQ29udHJvbGxlci5jbG9zZSgpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfcHJvY2Vzc05ld0FsYnVtRm9ybSgpIHtcbiAgICAgICAgLyogUHJvY2VzcyBuZXcgYWxidW0gZm9ybSB0byBwYXNzIGl0IHRvIG5ldyBhbGJ1bSAqL1xuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XG4gICAgXG4gICAgICAgIGxldCBmb3JtQ29udGVudCA9IE9iamVjdC5mcm9tRW50cmllcyhmb3JtRGF0YS5lbnRyaWVzKCkpO1xuXG4gICAgICAgIGZvcm1Db250ZW50W1wib3duZWRcIl0gPSBmb3JtQ29udGVudFtcIm93bmVkXCJdID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgZm9ybUNvbnRlbnRbXCJmYXZvcml0ZVwiXSA9IGZvcm1Db250ZW50W1wiZmF2b3JpdGVcIl0gPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBmb3JtQ29udGVudFtcImZvcm1hdFwiXSA9IGZvcm1EYXRhLmdldEFsbChcImZvcm1hdFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGZvcm1Db250ZW50O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc2V0XG4gICAgfVxufSkoKTtcblxudmFyIGFydGlzdFN1Z2dlc3Rpb25zID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWFydGlzdFwiKSxcbiAgICAgICAgZHJvcGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpLFxuICAgICAgICBsaXN0ID0gZHJvcGRvd24uZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAvLyBTdWdnZXN0IGFydGlzdHMgd2hlbiBpbnB1dGluZyB2YWx1ZXMgb3Igd2hlbiBjbGlja2luZyBpbiBpbnB1dFxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfcmVuZGVyKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgX3JlbmRlcik7XG5cbiAgICAvLyBDbG9zZSBzdWdnZXN0aW9ucyBkaXYgd2hlbiBjbGlja2luZyBvdXRzaWRlIHN1Z2dlc3Rpb24gYm94XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9jbG9zZSwgdHJ1ZSk7XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyKHN1Z2dlc3RlZEFydGlzdHMpIHtcbiAgICAgICAgY29uc3QgaW5wdXRWYWx1ZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAvLyBJZiB1c2VyIGNsZWFycyBpbnB1dCwgZGlzcGxheSBwbGFjZWhvbGRlciBhbmQgY2xvc2Ugc3VnZ2VzdGlvbnNcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGlucHV0LnBsYWNlaG9sZGVyID0gaW5wdXQucGxhY2Vob2xkZXI7XG4gICAgICAgICAgICBfY2xvc2UoKTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtdXNpY0xpYnJhcnkuZ2V0QWxidW1MaXN0KCkubWFwKFxuICAgICAgICAgICAgKGFsYnVtKSA9PiBhbGJ1bS5hcnRpc3RcbiAgICAgICAgKTtcbiAgICAgICAgLy8gQ29tcHV0ZSBhcnRpc3Qgc3VnZ2VzdGlvbnMgZ2l2ZW4gdGhlIGN1cnJlbnQgYWxidW1zIGluIHRoZSBsaWJyYXJ5XG4gICAgICAgIHZhciBzdWdnZXN0aW9ucyA9IG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5yZWR1Y2UoKHN1Z2csIGFsYnVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJ0aXN0ID0gYWxidW0uYXJ0aXN0O1xuICAgICAgICAgICAgICAgIGlmIChhcnRpc3QudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhpbnB1dFZhbHVlLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEF2b2lkIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Z2cuaW5kZXhPZihhcnRpc3QpID09PSAtMSApIHN1Z2cucHVzaChhcnRpc3QpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1Z2dcbiAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgaWYgKCFzdWdnZXN0aW9ucy5sZW5ndGgpIHsgLy8gSGlkZSBkcm9wZG93biBpZiBub3Qgc3VnZ2VzdGlvbnNcbiAgICAgICAgICAgIF9jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9ICAgIFxuICAgICAgICAvLyBSZWZyZXNoIGRpdiBhbmQgZGlzcGxheSBuZXcgc3VnZ2VzdGlvbnNcbiAgICAgICAgZHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgX2NsZWFyKCk7XG5cbiAgICAgICAgLy8gUmVnZXggdG8gaGlnaGxpZ2h0IG1hdGNoXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgKC4qKSgke2lucHV0VmFsdWV9KSguKilgLCBcImlcIik7XG4gICAgICAgIHN1Z2dlc3Rpb25zLmZvckVhY2goYXJ0aXN0ID0+IHtcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIHN1Z2dlc3Rpb24gYWRkIGxpc3QgZWxlbWVudCBoaWdobGlnaHRpbmcgbWF0Y2hcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBhcnRpc3QubWF0Y2gocmVnZXgpO1xuXG4gICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IGAke21hdGNoWzFdfTxzdHJvbmc+JHttYXRjaFsyXX08L3N0cm9uZz4ke21hdGNoWzNdfWA7XG4gICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgIFxuICAgICAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHNlbGVjdCBzdWdnZXN0aW9uXG4gICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfaW5wdXRTdWdnZXN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NsZWFyKCkge1xuICAgICAgICAvKiBEZWxldGUgYWxsIHN1Z2dlc3Rpb25zICovXG4gICAgICAgIHdoaWxlIChsaXN0Lmxhc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgICAgICAgIGxpc3QubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jbG9zZShlID0gbnVsbCkge1xuICAgICAgICAvKiBIaWRlIHN1Z2dlc3Rpb25zIGJveCAqL1xuICAgICAgICAvLyBEbyBub3QgcmVnaXN0ZXIgY2xpY2tzIGluIHRoZSBpbnB1dCBib3hcbiAgICAgICAgaWYgKGUgJiYgZS50YXJnZXQgPT09IGlucHV0KSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gSWYgdGhlIGRyb3Bkb3duIGlzIGFscmVhZHkgaGlkZGVuIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKCFkcm9wZG93bi5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcbiAgICAgICAgICAgIF9jbGVhcigpO1xuICAgICAgICAgICAgZHJvcGRvd24uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbnB1dFN1Z2dlc3Rpb24oKSB7XG4gICAgICAgIC8qIENob29zZSBzZWxlY3RlZCBpdGVtIGFuZCBhZGQgaXQgdG8gdGhlIGlucHV0ICovXG4gICAgICAgIGlucHV0LnZhbHVlID0gdGhpcy50ZXh0Q29udGVudDtcbiAgICBcbiAgICAgICAgX2Nsb3NlKCk7XG4gICAgfSAgICBcbn0pKCk7XG5cblxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHMuanNcIjtcbmltcG9ydCBtdXNpY0xpYnJhcnkgZnJvbSBcIi4vbGlicmFyeS5qc1wiO1xuaW1wb3J0IHsgZmlsdGVyQ29udHJvbGxlciB9IGZyb20gXCIuL2ZpbHRlci5qc1wiO1xuXG5jb25zdCBsYW5nID0gd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZVxuXG52YXIgdGFibGVWaWV3ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpO1xuXG4gICAgZXZlbnRzLm9uKFwiYWxidW1BZGRlZFwiLCBfdXBkYXRlKTtcbiAgICBldmVudHMub24oXCJhbGJ1bUVkaXRlZFwiLCBfdXBkYXRlKTtcbiAgICBldmVudHMub24oXCJsaWJyYXJ5U29ydGVkXCIsIF91cGRhdGUpO1xuICAgIGV2ZW50cy5vbihcImZpbHRlckFwcGxpZWRcIiwgX3VwZGF0ZSk7XG4gICAgZXZlbnRzLm9uKFwicmVtb3ZlUm93XCIsIF9yZW1vdmVSb3cpO1xuXG4gICAgZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgICAgICAgX2NsZWFyKCk7XG4gICAgICAgIF9yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyKCkge1xuICAgICAgICAvLyBBcHBseSBjdXJyZW50IGZpbHRlciB0byBhbGJ1bSBsaXN0XG4gICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5mb3JFYWNoKChhbGJ1bSkgPT4ge1xuICAgICAgICAgICAgX3JlbmRlckFsYnVtKGFsYnVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NsZWFyKCkge1xuICAgICAgICAvKiBSZW1vdmUgYWxsIHJvd3MgaW4gdGhlIHRhYmxlICovXG4gICAgICAgIHdoaWxlIChjb250ZW50cy5sYXN0RWxlbWVudENoaWxkKSB7XG4gICAgICAgICAgICBjb250ZW50cy5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbW92ZVJvdyhpZCkge1xuICAgICAgICAvLyBBc2sgY29uZmlybWF0aW9uIGJlZm9yZSByZW1vdmluZyBhbGJ1bVxuICAgICAgICBjb25maXJtRGVsZXRlID0gbGFuZyA9PT0gXCJlc1wiID9cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiwr9Fc3TDoXMgc2VndXJvIGRlIHF1ZSBxdWllcmUgYm9ycmFyIGVzdGUgw6FsYnVtP1wiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGFsYnVtP1wiXG4gICAgICAgIGlmICghY29uZmlybShjb25maXJtRGVsZXRlKSkgcmV0dXJuO1xuICAgIFxuICAgICAgICAvLyBSZW1vdmUgcm93IGFuZCBhbGJ1bSBmcm9tIGxpYnJhcnlcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdHJbZGF0YS1pZD0ke2lkfV1gKVxuICAgICAgICBcbiAgICAgICAgY29udGVudHMucmVtb3ZlQ2hpbGQocm93KTtcbiAgICAgICAgbXVzaWNMaWJyYXJ5LmRlbGV0ZUFsYnVtKGlkKTtcbiAgICAgICAgX2NvbGxhcHNlRXh0cmFJbmZvKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlckFsYnVtKGFsYnVtKSB7XG4gICAgICAgIC8vIEFwcGx5IGZpbHRlci4gSWYgZmFsc2UgZG8gbm90IHJlbmRlclxuICAgICAgICBpZiAoIXRhYmxlQ29udHJvbGxlci5maWx0ZXJBbGJ1bShhbGJ1bSkpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyByb3cgZm9yIHRoZSBhbGJ1bVxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgIC8vIFNldCBhbGJ1bSBhdHRyaWJ1dGUgYXMgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSByb3dcbiAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoXCJhbGJ1bS1yb3dcIik7XG4gICAgICAgIHJvdy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGFsYnVtLmlkKTtcblxuICAgICAgICAvLyBBZGQgYWxidW0gb3B0aW9ucyBpY29uICh0aHJlZSBkb3RzKVxuICAgICAgICBjb25zdCBvcHRpb25zQnV0dG9uID0gX2FwcGVuZE9wdGlvbnNCdXR0b24ocm93KTtcbiAgICAgICAgcm93LmFwcGVuZChvcHRpb25zQnV0dG9uKTtcbiAgICAgICAgb3B0aW9uc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBvcHRpb25zTW9kYWwub3BlbihlLngsIGUueSwgYWxidW0pO1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFkZCBhbGJ1bSBpbmZvXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXCJ0aXRsZVwiLCBcImFydGlzdFwiLCBcInJlbGVhc2VfeWVhclwiLCBcIm93bmVkXCIsIFwiZmF2b3JpdGVcIl07XG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBvZiBjb2x1bW5zKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcblxuICAgICAgICAgICAgbGV0IGljb25QYXRoID0ge1xuICAgICAgICAgICAgICAgIG93bmVkOiB7IHRydWU6IFwiY2hlY2suc3ZnXCIsIGZhbHNlOiBcImNsb3NlLXJlZC5zdmdcIiB9LFxuICAgICAgICAgICAgICAgIGZhdm9yaXRlOiB7IHRydWU6IFwiaGVhcnQuc3ZnXCIsIGZhbHNlOiBcImJsYW5rLnN2Z1wiIH0sXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgcGF0aFxuICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImZhdm9yaXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIC8vIFRyYW5zbGF0ZSBcInRydWVcIiBvciBcImZhbHNlXCIgdG8gaWNvbiByZXByLiBhY2NvcmRpbmdseVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcbiAgICAgICAgICAgICAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKFwiY2VsbC1pY29uXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJmYXZvcml0ZVwiKSBpY29uLmNsYXNzTGlzdC5hZGQoXCJmYXYtaWNvblwiKTtcblxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gaWNvblBhdGhbcHJvcF1bYWxidW1bcHJvcF1dO1xuICAgICAgICAgICAgICAgICAgICBpY29uLnNyYyA9IFwiLi4vaW1hZ2VzL1wiICsgcGF0aDtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgZGF0YUNlbGwuYXBwZW5kQ2hpbGQoaWNvbilcblxuICAgICAgICAgICAgICAgICAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmVkaXRBbGJ1bURldGFpbHMoYWxidW0uaWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcHJvcF06ICFhbGJ1bVtwcm9wXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC50ZXh0Q29udGVudCA9IGFsYnVtW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChkYXRhQ2VsbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBcHBlbmQgbmV3IHJvd1xuICAgICAgICBjb250ZW50cy5hcHBlbmRDaGlsZChyb3cpO1xuXG4gICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV4dFJvdyA9IHJvdy5uZXh0U2libGluZztcblxuICAgICAgICAgICAgX2NvbGxhcHNlRXh0cmFJbmZvKCk7IFxuICAgICAgICAgICAgLy8gQ2xvc2UgYW55IG9wZW5lZCBleHRyYS1pbmZvIHBhbmVsc1xuICAgICAgICAgICAgLy8gSWYgdGhlIHJvdyBoYWQgYW4gZXh0cmEtaW5mbyBwYW5lbCB0aGVuXG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIChlZmZlY3RpdmVseSBjbG9zaW5nIGl0KVxuICAgICAgICAgICAgaWYgKG5leHRSb3cgJiYgbmV4dFJvdy5jbGFzc0xpc3QuY29udGFpbnMoXCJleHRyYS1pbmZvXCIpKSByZXR1cm47XG4gICAgICAgICAgICBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtLCByb3cpO1xuICAgICAgICB9KTtcblxuICAgICAgICBldmVudHMuZW1pdChcInJvd0FkZGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jb2xsYXBzZUV4dHJhSW5mbygpIHtcbiAgICAgICAgY29uc3QgZXh0cmFSb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5leHRyYS1pbmZvXCIpO1xuXG4gICAgICAgIGV4dHJhUm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICByb3cucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChyb3cpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtLCByb3cpIHtcbiAgICAgICAgY29uc3QgZXh0cmFJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgICAgICBleHRyYUluZm8uY2xhc3NMaXN0LmFkZChcImV4dHJhLWluZm9cIik7XG4gICAgICAgIGNvbnN0IGRhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgICAgICBkYXRhQ2VsbC5zZXRBdHRyaWJ1dGUoXCJjb2xzcGFuXCIsIDUpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaW5mby1jb250YWluZXJcIik7XG5cbiAgICAgICAgY29uc3QgYWxidW1KYWNrZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBhbGJ1bUphY2tldC5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgYWxidW0uamFja2V0KTtcbiAgICAgICAgYWxidW1KYWNrZXQuY2xhc3NMaXN0LmFkZChcImphY2tldFwiKTtcblxuICAgICAgICBjb25zdCBnZW5lcmFsSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGdlbmVyYWxJbmZvLmNsYXNzTGlzdC5hZGQoXCJnZW5lcmFsLWluZm9cIik7XG4gICAgICAgIF9yZW5kZXJHZW5lcmFsSW5mbyhnZW5lcmFsSW5mbywgYWxidW0pXG4gICAgICAgIFxuXG4gICAgICAgIGNvbnN0IHJlY29yZEluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICByZWNvcmRJbmZvLmNsYXNzTGlzdC5hZGQoXCJyZWNvcmQtaW5mb1wiKTtcbiAgICAgICAgaWYgKGFsYnVtLm93bmVkKSBfcmVuZGVyUmVjb3JkSW5mbyhyZWNvcmRJbmZvLCBhbGJ1bSk7XG5cbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoYWxidW1KYWNrZXQpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKGdlbmVyYWxJbmZvKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChyZWNvcmRJbmZvKTtcblxuICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgICBleHRyYUluZm8uYXBwZW5kQ2hpbGQoZGF0YUNlbGwpO1xuXG4gICAgICAgIC8vIEluc2VydCBhZnRlclxuICAgICAgICByb3cucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZXh0cmFJbmZvLCByb3cubmV4dFNpYmxpbmcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJHZW5lcmFsSW5mbyhjb250YWluZXIsIGFsYnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiZ2VucmVcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJHw6luZXJvXCIgOiBcIkdlbnJlXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcInRvcFJTMVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRvcDUwMCAoUlMxKVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJ0b3BSUzNcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUb3A1MDAgKFJTMylcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcblxuICAgICAgICBjb25zdCB1cmxzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJkaXNjb2dzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiRGlzY29nc1wiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJ3aWtpcGVkaWFcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJXaWtpcGVkaWFcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcblxuICAgICAgICBmaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0ZXh0LmlubmVySFRNTCA9IGA8c3Ryb25nPiR7ZmllbGQubGFiZWx9PC9zdHJvbmc+OiAke1xuICAgICAgICAgICAgICAgIGFsYnVtW2ZpZWxkLmtleV1cbiAgICAgICAgICAgIH1gO1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVybHMuZm9yRWFjaCgodXJsKSA9PiB7XG4gICAgICAgICAgICBsZXQgaHJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgaHJlZi5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGFsYnVtW3VybC5rZXldKTtcbiAgICAgICAgICAgIGhyZWYuaW5uZXJIVE1MID0gYDxzdHJvbmc+JHt1cmwubGFiZWx9PC9zdHJvbmc+YDtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhyZWYpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyUmVjb3JkSW5mbyhjb250YWluZXIsIGFsYnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiY2F0YWxvZ19udW1cIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJOwrogQ2F0w6Fsb2dvXCIgOiBcIkNhdGFsb2cgI1wiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJyZWNvcmRfbGFiZWxcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJTZWxsb1wiIDogXCJMYWJlbFwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiUGHDrXNcIiA6IFwiQ291bnRyeVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJlZGl0aW9uX3llYXJcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJBw7FvIEVkaWNpw7NuXCIgOiBcIkVkaXRpb25cIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwibWF0cml4XCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiTWF0cml6XCIgOiBcIk1hdHJpeFwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjb25kaXRpb25cIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJFc3RhZG9cIiA6IFwiQ29uZGl0aW9uXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcIm5vdGVzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiT2JzLlwiIDogXCJOb3Rlc1wiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgbGV0IGZvcm1hdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBmb3JtYXQuaW5uZXJIVE1MID0gYDxzdHJvbmc+Rm9ybWF0PC9zdHJvbmc+OiAke2FsYnVtLnJlY29yZF9mb3JtYXR9ICgke2FsYnVtLmFsYnVtX2Zvcm1hdH0pYDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZvcm1hdCk7XG5cbiAgICAgICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHRleHQuaW5uZXJIVE1MID0gYDxzdHJvbmc+JHtmaWVsZC5sYWJlbH08L3N0cm9uZz46ICR7YWxidW1bZmllbGQua2V5XX1gO1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FwcGVuZE9wdGlvbnNCdXR0b24ocm93KSB7XG4gICAgICAgIC8vIENyZWF0ZSB0cmFzaGNhbiBidXR0b24gYW5kIGFwcGVuZCBpdCB0byByb3dcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cbiAgICAgICAgZGF0YUNlbGwuY2xhc3NMaXN0LmFkZChcImFsYnVtLW9wdGlvbnNcIik7XG5cbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4uL2ltYWdlcy9kb3RzLXZlcnRpY2FsLnN2Z1wiKVxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImNlbGwtaWNvblwiKVxuICAgICAgICBidXR0b24udGl0bGUgPSBsYW5nID09PSBcImVzXCIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJPcGNpb25lc1wiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWxidW0gT3B0aW9uc1wiO1xuICAgICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cbiAgICAgICAgZGF0YUNlbGwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgICAgICAvLyBDb25uZWN0IG5ldyByb3cgc28gdGhhdCByZW1vdmUtaWNvbiBvbmx5IGFwcGVhcnMgb24gaG92ZXJcbiAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIH0pO1xuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGF0YUNlbGw7XG4gICAgfVxufSkoKTtcblxudmFyIHRhYmxlQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY29udGVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUgPiB0Ym9keVwiKSxcbiAgICAgICAgIHNvcnRhYmxlSGVhZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0YWJsZSB0aC5zb3J0YWJsZVwiKTtcbiAgICB2YXIgY3VyclNvcnRpbmcgPSB7IGJ5OiBcInRpdGxlXCIsIG9yZDogXCJhc2NcIiB9O1xuXG4gICAgc29ydGFibGVIZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9zb3J0VGFibGUpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gX3NvcnRUYWJsZShlKSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgbmV3U29ydEJ5ID0gaGVhZGVyLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpO1xuICAgICAgICBjb25zdCB7IGJ5OiBzb3J0QnksIG9yZDogc29ydE9yZCB9ID0gY3VyclNvcnRpbmc7XG4gICAgXG4gICAgICAgIC8vIElmIHNvcnRpbmcgbmV3IHJvdyBmbGlwIHJvdyBvcmRlciwgZWxzZSByb3cgb3JkZXIgYXMgYXNjIGFzIGRlZmF1bHRcbiAgICAgICAgaWYgKG5ld1NvcnRCeSA9PT0gc29ydEJ5KSB7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5vcmQgPSBzb3J0T3JkID09PSBcImFzY1wiID8gXCJkZXNjXCIgOiBcImFzY1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyclNvcnRpbmcuYnkgPSBuZXdTb3J0Qnk7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5vcmQgPSBcImFzY1wiO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIFNvcnQgbGlicmFyeSBhbGJ1bXM7XG4gICAgICAgIG11c2ljTGlicmFyeS5zb3J0KGN1cnJTb3J0aW5nKTtcbiAgICBcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBhbmQgZGlzcGxheSB0aGUgY29ycmVzcG9uZGluZyBvbmVcbiAgICAgICAgX2hpZGVTb3J0aW5nQXJyb3dzKCk7XG4gICAgICAgIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpIHtcbiAgICAgICAgLyogQWRkIHNvcnRpbmcgYXJyb3dzIHdpdGggdGhlIGNvcnJlcHNvbmRpbmcgb3JkZXIgaW4gdGhlIGNsaWNrZWQgaGVhZGVyICovXG4gICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG5cbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5hZGQoY3VyclNvcnRpbmcub3JkKTtcbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9oaWRlU29ydGluZ0Fycm93cygpIHtcbiAgICAgICAgLyogUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBmb3JtIGFsbCBoZWFkZXJzICovXG4gICAgICAgIHNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG4gICAgXG4gICAgICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QucmVtb3ZlKFwiYXNjXCIpO1xuICAgICAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNjXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVzZXRTb3J0aW5nKCkge1xuICAgICAgICBjdXJyU29ydGluZyA9IHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wiIH07XG5cbiAgICAgICAgX2hpZGVTb3J0aW5nQXJyb3dzKCk7XG4gICAgICAgIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJBbGJ1bShhbGJ1bSkge1xuICAgICAgICB2YXIgY3VyckZpbHRlciA9IGZpbHRlckNvbnRyb2xsZXIuZ2V0Q3VycmVudEZpbHRlcigpO1xuICAgICAgICB2YXIgeyB0eXBlOiBmaWx0ZXJUeXBlLCB2YWx1ZTogZmlsdGVyVmFsdWUgfSA9IGN1cnJGaWx0ZXI7XG4gICAgXG4gICAgICAgIC8vIFJlc2V0IGRpc3BsYXkgaWYgbm8gZmlsdGVyIGFwcGx5IChpbnB1dCBlbXB0eSkgZG8gbm90aGluZ1xuICAgICAgICBpZiAoZmlsdGVyVmFsdWUgPT09IFwiXCIpIHJldHVybiB0cnVlO1xuICAgIFxuICAgICAgICBzd2l0Y2ggKGZpbHRlclR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInRpdGxlXCJdLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gTWF0Y2ggYW55IG9mIHRoZSBjb21tYSBzZXBhcmF0ZWQgbWF0Y2hlc1xuICAgICAgICAgICAgICAgIGNvbnN0IGFydGlzdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlssO11cXHMqLyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFydGlzdExpc3Quc29tZSgoYXJ0aXN0KSA9PlxuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImFydGlzdFwiXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGFydGlzdC50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoID0gKHJlZ2V4KSA9PiBmaWx0ZXJWYWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgLy8gUmVnZXggZm9yIHllYXIgZm9yIGRpZmZlcmVudCByZWxlYXNlIHllYXIgZmlsdGVyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXhFcSA9IC9eXFxzKihcXGQrKVxccyokLywgLy8gU2luZ2xlIHllYXIgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhHdCA9IC8oPzpePlxccz8oXFxkKykkKS8sIC8vIEdyZWF0ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEx0ID0gLyg/Ol48XFxzPyhcXGQrKSQpLywgLy8gTG93ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEJ0dyA9IC8oPzpeKFxcZCspXFxzP1stLC87XVxccz8oXFxkKykkKS87IC8vVHdvIHZhbHVlcyBpbnRlcnZhbFxuICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXRjaChyZWdleEVxKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPT0gbWF0Y2gocmVnZXhFcSlbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEd0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPj0gbWF0Y2gocmVnZXhHdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEx0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhMdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEJ0dykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID49IG1hdGNoKHJlZ2V4QnR3KVsxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhCdHcpWzJdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIC8vIEFsbG93IHRoZSB1c2Ugb2YgZGlmZmVyZW50IHdvcmRzIGZvciB0cnVlIGFuZCBmYWxzZVxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIGluIFtcbiAgICAgICAgICAgICAgICAgICAgXCIxXCIsIFwieWVzXCIsIFwidHJ1ZVwiLCBcIm93blwiLCBcInPDrVwiLCBcInNpXCIsIFwiYWRxXCIsIFwiYWRxdWlyaWRvXCJcbiAgICAgICAgICAgICAgICBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSBpbiBbXG4gICAgICAgICAgICAgICAgICAgIFwiMFwiLCBcIm5vXCIsIFwibm90XCIsIFwiZmFsc2VcIiwgXCIhb3duZWRcIiwgXCJ3YW50XCIsIFwiIWFkcVwiLCBcIiFhZHF1aXJpZG9cIlxuICAgICAgICAgICAgICAgIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJmb3JtYXRcIjpcbiAgICAgICAgICAgICAgICAvLyBJbiB0aGlzIGZpbHRlciBcIitcIiA9IFwiYW5kXCIgYW5kIFwiWyw7L11cIiA9IFwib3JcIlxuICAgICAgICAgICAgICAgIGxldCBmb3JtYXRMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlclZhbHVlLmluY2x1ZGVzKFwiK1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXRMaXN0ID0gZmlsdGVyVmFsdWUuc3BsaXQoL1xccypcXCtcXHMqLyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRMaXN0LmV2ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZvcm1hdCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImZvcm1hdFwiXS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWwpID0+IHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXRMaXN0ID0gZmlsdGVyVmFsdWUuc3BsaXQoL1xccypbLDsvXVxccyovKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdExpc3Quc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChmb3JtYXQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJmb3JtYXRcIl0uZmluZEluZGV4KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsKSA9PiB2YWwudG9Mb3dlckNhc2UoKSA9PT0gZm9ybWF0LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBFbHNlIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGZpbHRlckFsYnVtXG4gICAgfVxufSkoKTtcblxuXG52YXIgb3B0aW9uc01vZGFsID0gKGZ1bmN0aW9uKGFsYnVtKSB7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbnMtbW9kYWxcIik7XG5cbiAgICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBjbG9zZSlcblxuICAgIGZ1bmN0aW9uIG9wZW4oeCwgeSwgYWxidW0pIHtcbiAgICAgICAgY29uc3QgZWRpdEFsYnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LWFsYnVtXCIpLFxuICAgICAgICAgICAgZGVsQWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1hbGJ1bVwiKTtcblxuICAgICAgICBfcmVuZGVyKHgsIHkpXG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cbiAgICAgICAgZWRpdEFsYnVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBldmVudHMuZW1pdChcImVkaXRBbGJ1bVwiLCBhbGJ1bSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVkaXRcIilcbiAgICAgICAgfSlcblxuICAgICAgICBkZWxBbGJ1bS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgZXZlbnRzLmVtaXQoXCJyZW1vdmVSb3dcIiwgYWxidW0uaWQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZW1vdmVcIilcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgY29uc3QgZWRpdEFsYnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LWFsYnVtXCIpLFxuICAgICAgICAgICAgZGVsQWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1hbGJ1bVwiKTtcblxuICAgICAgICBlZGl0QWxidW0ucmVwbGFjZVdpdGgoZWRpdEFsYnVtLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIGRlbEFsYnVtLnJlcGxhY2VXaXRoKGRlbEFsYnVtLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoeCwgeSkge1xuICAgICAgICBtb2RhbC5zdHlsZS5sZWZ0ID0geCAtIDUgKyBcInB4XCI7XG4gICAgICAgIG1vZGFsLnN0eWxlLnRvcCA9IHkgLSA1ICsgXCJweFwiO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG9wZW5cbiAgICB9XG59KSgpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi90YWJsZS5qc1wiXG5pbXBvcnQgXCIuL2ZpbHRlci5qc1wiXG5pbXBvcnQgXCIuL21vZGFsLmpzXCJcbmltcG9ydCBcIi4vbG9hZGVyLmpzXCJcblxuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5pbXBvcnQgQWxidW0gZnJvbSBcIi4vYWxidW0uanNcIjtcblxudmFyIHNhbXBsZSA9IHJlcXVpcmUoXCIuLi9hbGJ1bV9zYW1wbGUuanNvblwiKVxuXG5mb3IgKGNvbnN0IGtleSBpbiBzYW1wbGUpIHtcbiAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoc2FtcGxlLCBrZXkpKSB7XG4gICAgICAgIHZhciBuZXdBbGJ1bSA9IEFsYnVtKHNhbXBsZVtrZXldKTtcbiAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=