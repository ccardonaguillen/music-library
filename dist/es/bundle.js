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



const lang = window.navigator.language.slice(0, 2);

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




const lang = window.navigator.language.slice(0, 2);

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




const lang = window.navigator.language.slice(0, 2);

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
        const confirmDelete = lang === "es" ?
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
        })

        delAlbum.addEventListener("click", () => {
            _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("removeRow", album.id);
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

console.log(window.navigator.language.slice(0, 2))

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1CO0FBQ0M7QUFDRDtBQUNDOztBQUVvQjtBQUNUOztBQUUvQixhQUFhLG1CQUFPLENBQUMsaURBQXNCOztBQUUzQztBQUNBO0FBQ0EsdUJBQXVCLHFEQUFLO0FBQzVCLFFBQVEsNERBQXFCO0FBQzdCO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2FsYnVtLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvZXZlbnRzLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvZmlsdGVyLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvbGlicmFyeS5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2xvYWRlci5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL21vZGFsLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvdGFibGUuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIEFsYnVtID0gKFxuICAgIHsgdGl0bGUsXG4gICAgICBhcnRpc3QsXG4gICAgICByZWxlYXNlX3llYXIsXG4gICAgICBvd25lZCxcbiAgICAgIGZhdm9yaXRlLFxuICAgICAgZ2VucmUsXG4gICAgICB0b3BSUzEsXG4gICAgICB0b3BSUzMsXG4gICAgICBkaXNjb2dzLFxuICAgICAgd2lraXBlZGlhLFxuICAgICAgcmVjb3JkX2Zvcm1hdCxcbiAgICAgIGFsYnVtX2Zvcm1hdCxcbiAgICAgIGNhdGFsb2dfbnVtLFxuICAgICAgZWRpdGlvbl95ZWFyLFxuICAgICAgY291bnRyeSxcbiAgICAgIHJlY29yZF9sYWJlbCxcbiAgICAgIG1hdHJpeCxcbiAgICAgIGNvbmRpdGlvbixcbiAgICAgIG5vdGVzLFxuICAgICAgamFja2V0XG4gICAgfVxuKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHRpdGxlLnRvTG93ZXJDYXNlKCkucmVwbGFjZUFsbCgvXFxXL2csIFwiXCIpICtcbiAgICAgICAgICAgIGFydGlzdC50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoL1xcVy9nLCBcIlwiKSArXG4gICAgICAgICAgICByZWxlYXNlX3llYXIsXG4gICAgICAgIHRpdGxlLFxuICAgICAgICBhcnRpc3QsXG4gICAgICAgIHJlbGVhc2VfeWVhcixcbiAgICAgICAgb3duZWQ6IEJvb2xlYW4ob3duZWQpLFxuICAgICAgICBmYXZvcml0ZTogQm9vbGVhbihmYXZvcml0ZSksXG4gICAgICAgIGdlbnJlOiBnZW5yZSB8fCBcIlwiLFxuICAgICAgICB0b3BSUzE6IHRvcFJTMSB8fCBcIlwiLFxuICAgICAgICB0b3BSUzM6IHRvcFJTMyB8fCBcIlwiLFxuICAgICAgICBkaXNjb2dzOiBkaXNjb2dzIHx8IFwiXCIsXG4gICAgICAgIHdpa2lwZWRpYTogd2lraXBlZGlhIHx8IFwiXCIsXG4gICAgICAgIHJlY29yZF9mb3JtYXQ6IHR5cGVvZihyZWNvcmRfZm9ybWF0KSA9PT0gXCJzdHJpbmdcIiA/XG4gICAgICAgICAgICAgICAgICAgICAgIEFycmF5KHJlY29yZF9mb3JtYXQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkX2Zvcm1hdCxcbiAgICAgICAgYWxidW1fZm9ybWF0OiBhbGJ1bV9mb3JtYXQgfHwgXCJcIixcbiAgICAgICAgY2F0YWxvZ19udW06IGNhdGFsb2dfbnVtIHx8IFwiXCIsXG4gICAgICAgIGVkaXRpb25feWVhcjogZWRpdGlvbl95ZWFyIHx8IFwiXCIsXG4gICAgICAgIGNvdW50cnk6IGNvdW50cnkgfHwgXCJcIixcbiAgICAgICAgcmVjb3JkX2xhYmVsOiByZWNvcmRfbGFiZWwgfHwgXCJcIixcbiAgICAgICAgbWF0cml4OiBtYXRyaXggfHwgXCJcIixcbiAgICAgICAgY29uZGl0aW9uOiBjb25kaXRpb24gfHwgXCJcIixcbiAgICAgICAgbm90ZXM6IG5vdGVzIHx8IFwiTm9uZVwiLFxuICAgICAgICBqYWNrZXQ6IGphY2tldCB8fCBcIlwiXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxidW0iLCJ2YXIgZXZlbnRzID0ge1xuICAgIGV2ZW50czoge30sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmbihkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50cyIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxuY29uc3QgbGFuZyA9IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2Uuc2xpY2UoMCwgMik7XG5cbnZhciBzdW1tYXJ5VmlldyA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50cmllcy1jb3VudFwiKSxcbiAgICAgICAgdGFibGVDb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpO1xuXG4gICAgZXZlbnRzLm9uKFwiZmlsdGVyQXBwbGllZFwiLCBfcmVuZGVyKTtcbiAgICBldmVudHMub24oXCJyb3dBZGRlZFwiLCBfcmVuZGVyKTtcbiAgICBldmVudHMub24oXCJyb3dEZWxldGVkXCIsIF9yZW5kZXIpO1xuXG4gICAgZnVuY3Rpb24gX3JlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdG90YWxFbnRyaWVzID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLmxlbmd0aCwgLy8gTGVuZ3RoIG9mIGxpYnJhcnkgbGlzdFxuICAgICAgICAgICAgc2hvd25FbnRyaWVzID0gdGFibGVDb250ZW50cy5xdWVyeVNlbGVjdG9yQWxsKFwidHI6bm90KC5leHRyYS1pbmZvKVwiKS5sZW5ndGg7IC8vIE51bWJlciBvZiByb3dzIGluIHRhYmxlXG5cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGFsYnVtcyBpbiB0aGUgbGlicmFyeSBwcmludCB3ZWxjb21lIG1lc3NhZ2VcbiAgICAgICAgaWYgKGxhbmcgPT09IFwiZXNcIikge1xuICAgICAgICAgICAgc3VtbWFyeS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICB0b3RhbEVudHJpZXMgPT09IDBcbiAgICAgICAgICAgICAgICA/IFwiTm8gaGF5IG5pbmfDum4gw6FsYnVtIGVuIGxhIGNvbGVjY2nDs24uIEHDsWFkZSB1bm8gdXNhbmRvIGVsIGJvdMOzblwiXG4gICAgICAgICAgICAgICAgOiBgTW9zdHJhbmRvICR7c2hvd25FbnRyaWVzfSBkZSAke3RvdGFsRW50cmllc30gw6FsYnVtc2A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW1tYXJ5LnRleHRDb250ZW50ID1cbiAgICAgICAgICAgIHRvdGFsRW50cmllcyA9PT0gMFxuICAgICAgICAgICAgICAgID8gXCJObyBhbGJ1bXMgaW4gdGhlIGxpYnJhcnkuIEFkZCBvbmUgYnkgY2xpY2tpbmcgdGhlIGJ1dHRvblwiXG4gICAgICAgICAgICAgICAgOiBgU2hvd2luZyAke3Nob3duRW50cmllc30gb3V0IG9mICR7dG90YWxFbnRyaWVzfSBhbGJ1bXNgO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcblxudmFyIGZpbHRlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyRmlsdGVyID0geyB0eXBlOiBcIlwiLCB2YWx1ZTogXCJcIiB9O1xuICAgIGNvbnN0IGZpbHRlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci1ieVwiKSxcbiAgICAgICAgZmlsdGVyU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXJcIiksXG4gICAgICAgIGZpbHRlclZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItdmFsdWVcIiksXG4gICAgICAgIGVudHJpZXNDb3VudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50cmllcy1jb3VudFwiKTtcblxuICAgIGZpbHRlclNlbGVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIF9yZXNldEZpbHRlcik7XG4gICAgZmlsdGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIF9hcHBseUZpbHRlcik7XG4gICAgZmlsdGVyVmFsdWUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9yZXNldEZpbHRlcik7XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50RmlsdGVyKCkge1xuICAgICAgICByZXR1cm4gY3VyckZpbHRlcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYXBwbHlGaWx0ZXIoZSA9IG51bGwpIHtcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IHN1Ym1pdCBiZWhhdmlvdXJcbiAgICAgICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICAgICAgLy8gVXBkYXRlIGN1cnJlbnQgZmlsdGVyIHdpdGggdmFsdWVzIGZyb20gdGhlIGZpbHRlciBmb3JtXG4gICAgICAgIGN1cnJGaWx0ZXJbXCJ0eXBlXCJdID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgICAgICBjdXJyRmlsdGVyW1widmFsdWVcIl0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci12YWx1ZVwiKS52YWx1ZTtcbiAgICBcbiAgICAgICAgLy8gVXBkYXRlIHRhYmxlXG4gICAgICAgIGV2ZW50cy5lbWl0KFwiZmlsdGVyQXBwbGllZFwiLCBjdXJyRmlsdGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3JlbmRlclBsYWNlaG9sZGVyKCkge1xuICAgICAgICAvKiBVcGRhdGUgcGxhY2Vob2xkZXIgbWVzc2FnZSBhY2NvcmRpbmcgdG8gdGhlIHNlbGVjdGVkIG9wdGlvbiAqL1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJTZWxlY3QudmFsdWU7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGxhbmcgPT09IFwiZXNcIiA/IFwicC4gZWouIFwiIDogXCJlLmcuIFwiO1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnXCJzdWJtYXJpbmVcIicsXG4gICAgICAgICAgICBhcnRpc3Q6ICdcInplcHBlbGluXCIsIFwiYmVhdGxlcywgcm9sbGluZ1wiJyxcbiAgICAgICAgICAgIHJlbGVhc2VfeWVhcjogJ1wiMTk5MFwiLCBcIjEtMjAwMFwiLCBcIj4xOTAwXCIsIFwiPDE5ODBcIicsXG4gICAgICAgICAgICBvd25lZDogJ1widHJ1ZVwiLCBcIm5vXCIsIFwibm90IG93bmVkXCInLFxuICAgICAgICAgICAgZm9ybWF0OiAnXCJWeW5pbFwiLCBcImNkK2Nhc2V0dGVcIiwgXCJ2eW5pbC9DRFwiJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGZpbHRlclZhbHVlLnBsYWNlaG9sZGVyID0gcHJlZml4ICsgcGxhY2Vob2xkZXJbZmlsdGVyXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVzZXRGaWx0ZXIoZSkge1xuICAgICAgICBpZiAoZS50eXBlID09PSBcImlucHV0XCIgJiYgZmlsdGVyVmFsdWUudmFsdWUgIT09IFwiXCIpIHJldHVybjtcbiAgICAgICAgLyogUmVzZXQgZmlsdGVyIHdoZW4gdGhlIGlucHV0IGJveCBpcyBlbXB0eSBhbmQgYXBwbHkgZW1wdHkgZmlsdGVyICovXG4gICAgICAgIFxuICAgICAgICBmaWx0ZXJWYWx1ZS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIF9yZW5kZXJQbGFjZWhvbGRlcigpO1xuICAgICAgICBfYXBwbHlGaWx0ZXIoKTtcbiAgICBcbiAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gICAgXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRDdXJyZW50RmlsdGVyLFxuICAgIH1cbn0pKCk7XG5cbmV4cG9ydCB7IGZpbHRlckNvbnRyb2xsZXIgfSIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCJcblxudmFyIG11c2ljTGlicmFyeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFsYnVtTGlzdCA9IFtdO1xuXG4gICAgZnVuY3Rpb24gZ2V0QWxidW1MaXN0KCkge1xuICAgICAgICByZXR1cm4gYWxidW1MaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZEFsYnVtKG5ld0FsYnVtLCBwb3MpIHtcbiAgICAgICAgLy8gSWYgcG9zaXRpb24gaXMgcHJvdmlkZWQgdGhlbiByZW1vdmVzIGVudHJ5IGF0IHBvcyBhbmQgaW5zZXJ0cyBuZXcgb25lXG4gICAgICAgIGlmIChhbGJ1bUxpc3QuZXZlcnkoKGFsYnVtKSA9PiBuZXdBbGJ1bS5pZCAhPT0gYWxidW0uaWQpIHx8XG4gICAgICAgICAgICBuZXdBbGJ1bS5pZCA9PT0gYWxidW1MaXN0W3Bvc10uaWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YocG9zKSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC5zcGxpY2UocG9zLCAxLCBuZXdBbGJ1bSk7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bUVkaXRlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxidW1MaXN0LnVuc2hpZnQobmV3QWxidW0pO1xuICAgICAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1BZGRlZFwiLCBuZXdBbGJ1bSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgYWxidW0gZXhpc3QgbG9nIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgIGFsZXJ0KFwiVGhpcyBhbGJ1bSBhbHJlYWR5IGV4aXN0cy5cIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGVhdGVkIElEOiBcIiArIG5ld0FsYnVtLmlkKVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUFsYnVtKGlkKSB7XG4gICAgICAgIC8qIERlbGV0ZSBhbGJ1bSB3aXRoIGEgZ2l2ZW4gSUQgKi9cbiAgICAgICAgYWxidW1MaXN0ID0gYWxidW1MaXN0LmZpbHRlcigoYWxidW0pID0+IGFsYnVtLmlkICE9PSBpZCk7XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bURlbGV0ZWRcIiwgaWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVkaXRBbGJ1bShpZCwgbmV3QWxidW0pIHtcbiAgICAgICAgLy8gbmV3QWxidW0gaXMgdGhlIGFsYnVtIG9iamVjdCBjb250YWluaW5nIHRoZSB1cGRhdGVkIGluZm9cbiAgICAgICAgY29uc3QgYWxidW1JZHggPSBhbGJ1bUxpc3QuZmluZEluZGV4KFxuICAgICAgICAgICAgKGFsYnVtKSA9PiBpZCA9PT0gYWxidW0uaWRcbiAgICAgICAgKTtcblxuICAgICAgICBhZGRBbGJ1bShuZXdBbGJ1bSwgYWxidW1JZHgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVkaXRBbGJ1bURldGFpbHMoaWQsIG5ld0luZm8pIHtcbiAgICAgICAgY29uc3QgYWxidW1JZHggPSBhbGJ1bUxpc3QuZmluZEluZGV4KFxuICAgICAgICAgICAgKGFsYnVtKSA9PiBpZCA9PT0gYWxidW0uaWRcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gbmV3SW5mbykge1xuICAgICAgICAgICAgYWxidW1MaXN0W2FsYnVtSWR4XVtwcm9wXSA9IG5ld0luZm9bcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICBldmVudHMuZW1pdChcImFsYnVtRWRpdGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEFsYnVtKGlkKSB7XG4gICAgICAgIHJldHVybiBhbGJ1bUxpc3QuZmlsdGVyKChhbGJ1bSkgPT4gaWQgPT09IGFsYnVtLmlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzb3J0KHsgYnksIG9yZCA9IFwiYXNjXCIgfSkge1xuICAgICAgICAvKiBSZXZlcnNlIHNvcnRpbmcgYWxnb3JpdGhtIGlzIG9yZCA9ICdkZXNjJzsgKi9cbiAgICAgICAgbGV0IHNvcnRPcmRlciA9IG9yZCA9PT0gXCJhc2NcIiA/IDEgOiAtMTtcblxuICAgICAgICBzd2l0Y2ggKGJ5KSB7XG4gICAgICAgICAgICBjYXNlIFwidGl0bGVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgICAgICAvLyBsb2NhbGVDb21wYXJlIHVzZWQgdG8gY29tcGFyZSBzdHJpbmcgd2l0aG91dCBtYXRoIG9wZXJhdG9yc1xuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC5zb3J0KFxuICAgICAgICAgICAgICAgICAgICAoYSwgYikgPT4gYVtieV0ubG9jYWxlQ29tcGFyZShiW2J5XSkgKiBzb3J0T3JkZXJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSBcInJlbGVhc2VfeWVhclwiOlxuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC5zb3J0KChhLCBiKSA9PiAoYVtieV0gLSBiW2J5XSkgKiBzb3J0T3JkZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJsaWJyYXJ5U29ydGVkXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldEFsYnVtTGlzdCxcbiAgICAgICAgYWRkQWxidW0sXG4gICAgICAgIGRlbGV0ZUFsYnVtLFxuICAgICAgICBlZGl0QWxidW0sXG4gICAgICAgIGVkaXRBbGJ1bURldGFpbHMsXG4gICAgICAgIGdldEFsYnVtLFxuICAgICAgICBzb3J0XG4gICAgfVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbXVzaWNMaWJyYXJ5XG5cbiIsImltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiXG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIlxuXG5jb25zdCBmaWxlTG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtbG9hZGVyJyk7XG5cbmZpbGVMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZUxpc3QgPSBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgdmFyIGZpbGUgPSBmaWxlTGlzdFswXTtcbiAgICByZWFkRmlsZShmaWxlKTtcbiAgICBmaWxlTG9hZGVyLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH0pO1xuXG5mdW5jdGlvbiByZWFkRmlsZShmKSB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgICB2YXIgbXVzaWNDb2xsZWN0aW9uID0gcGFyc2VBbGJ1bUxpYnJhcnkoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIGFkZENvbGxlY3Rpb24obXVzaWNDb2xsZWN0aW9uKVxuICAgIH0pO1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGYsIFwidXRmLThcIik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ1NWIChzdHJpbmcsIGRlbGltaXRlcj1cIixcIikge1xuICAgIC8vIENvbW1lbnRlZCBjb2RlIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyOTMxNDcvaG93LXRvLXBhcnNlLWNzdi1kYXRhXG4gICAgdmFyIG9ialBhdHRlcm4gPSBuZXcgUmVnRXhwKFxuICAgICAgICAoXG4gICAgICAgICAgICBcIihcXFxcXCIgKyBkZWxpbWl0ZXIgKyBcInxcXFxccj9cXFxcbnxcXFxccnxeKVwiICsgIC8vIERlbGltaXRlcnNcbiAgICAgICAgICAgIFwiKD86XFxcIihbXlxcXCJdKig/OlxcXCJcXFwiW15cXFwiXSopKilcXFwifFwiICsgLy8gUXVvdGVkIGZpZWxkc1xuICAgICAgICAgICAgXCIoW15cXFwiXFxcXFwiICsgZGVsaW1pdGVyICsgXCJcXFxcclxcXFxuXSopKVwiIC8vIFN0YW5kYXJkIGZpZWxkc1xuICAgICAgICApLCBcImdpXCIpO1xuXG4gICAgdmFyIGFyckRhdGEgPSBbW11dO1xuICAgIHZhciBhcnJNYXRjaGVzID0gbnVsbDtcblxuICAgIHdoaWxlIChhcnJNYXRjaGVzID0gb2JqUGF0dGVybi5leGVjKCBzdHJpbmcgKSl7XG4gICAgICAgIHZhciBzdHJNYXRjaGVkRGVsaW1pdGVyID0gYXJyTWF0Y2hlc1sgMSBdO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIubGVuZ3RoICYmXG4gICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyICE9PSBkZWxpbWl0ZXJcbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICBhcnJEYXRhLnB1c2goIFtdICk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlO1xuICAgICAgICBpZiAoYXJyTWF0Y2hlc1sgMiBdKXtcbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDIgXS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAoIFwiXFxcIlxcXCJcIiwgXCJnXCIgKVxuICAgICAgICAgICAgICAgICwgXCJcXFwiXCIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDMgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyckRhdGFbIGFyckRhdGEubGVuZ3RoIC0gMSBdLnB1c2goIHN0ck1hdGNoZWRWYWx1ZSApO1xuICAgIH1cblxuICAgIHJldHVybiggYXJyRGF0YSApO1xufVxuXG5mdW5jdGlvbiBjc3ZUb09iamVjdCAoY3N2Q29udGVudCkge1xuICAgIHZhciBwcm9wcyA9IGNzdkNvbnRlbnRbMF07XG4gICAgdmFyIG9iamVjdCA9IFtdO1xuXG4gICAgY3N2Q29udGVudC5zbGljZSgxLCAtMSkuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICB2YXIgaXRlbSA9IHt9O1xuICAgICAgICByb3cuZm9yRWFjaCgodmFsLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGl0ZW1bcHJvcHNbaWR4XV0gPSB2YWw7XG4gICAgICAgIH0pXG5cbiAgICAgICAgb2JqZWN0LnB1c2goaXRlbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCBvYmplY3QgKVxufVxuXG5mdW5jdGlvbiBwYXJzZUFsYnVtTGlicmFyeShmaWxlQ29udGVudCkge1xuICAgIHZhciBwYXJzZWRDU1YgPSBwYXJzZUNTVihmaWxlQ29udGVudCk7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBjc3ZUb09iamVjdChwYXJzZWRDU1YpO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb25cbn07XG5cbmZ1bmN0aW9uIGFkZENvbGxlY3Rpb24gKGNvbGxlY3Rpb24pIHtcbiAgICBjb2xsZWN0aW9uLmZvckVhY2goKGFsYnVtLCBpZHgpID0+IHtcbiAgICAgICAgdmFyIG5ld0FsYnVtID0gQWxidW0oe1xuICAgICAgICAgICAgdGl0bGU6IGFsYnVtW1wiTm9tYnJlXCJdLFxuICAgICAgICAgICAgYXJ0aXN0OiBhbGJ1bVtcIkFydGlzdGFcIl0sXG4gICAgICAgICAgICByZWxlYXNlX3llYXI6IGFsYnVtW1wiQW5vIGxhbnphbWllbnRvXCJdLFxuICAgICAgICAgICAgb3duZWQ6IGFsYnVtW1wiQWRxdWlyaWRvXCJdID09PSBcIjFcIiA/XG4gICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBmb3JtYXQ6IGFsYnVtW1wiRm9ybWF0b1wiXS5pbmNsdWRlcyhcIi9cIikgP1xuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcIkZvcm1hdG9cIl0uc3BsaXQoXCIvXCIpIDpcbiAgICAgICAgICAgICAgICAgICAgW2FsYnVtW1wiRm9ybWF0b1wiXV1cbiAgICAgICAgfSlcblxuICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgIH0pXG5cbiAgICBtdXNpY0xpYnJhcnkuc29ydCh7IGJ5OiBcInRpdGxlXCIsIG9yZDogXCJhc2NcIn0pXG59O1xuXG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IEFsYnVtIGZyb20gXCIuL2FsYnVtLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxuY29uc3QgbGFuZyA9IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2Uuc2xpY2UoMCwgMik7XG5cbnZhciBtb2RhbENvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLW92ZXJsYXlcIiksIFxuICAgICAgICBvcGVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW1vZGFsXCIpLFxuICAgICAgICBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xvc2UtbW9kYWxcIiksXG4gICAgICAgIG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKSxcbiAgICAgICAgaGVhZGVyID0gbW9kYWwucXVlcnlTZWxlY3RvcihcImgyXCIpLFxuICAgICAgICByZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwicmVzZXRcIl0nKTtcblxuICAgIG9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IF9vcGVuKFwibmV3XCIpKTtcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2UpO1xuXG4gICAgZXZlbnRzLm9uKFwiZWRpdEFsYnVtXCIsIGFsYnVtID0+IF9vcGVuKFwiZWRpdFwiLCBhbGJ1bSkpO1xuXG4gICAgZnVuY3Rpb24gX29wZW4obW9kZSwgYWxidW0pIHtcbiAgICAgICAgLyogRGlzcGxheSBmb3JtIG1vZGFsIG92ZXIgbWFpbiB3aW5kb3cgYW5kIGZvY3VzIG9uIGZpcnN0IGlucHV0ICovXG4gICAgICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdGl0bGVcIikuZm9jdXMoKTtcblxuICAgICAgICBpZiAobW9kZT09PVwibmV3XCIpIHtcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiLCBcIm5ld1wiKTsgXG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFsYnVtLWlkXCIsIFwiXCIpOyBcbiAgICAgICAgICAgIGhlYWRlci50ZXh0Q29udGVudCA9IGxhbmcgPT09IFwiZXNcIiA/IFwiQcOxYWRpciDDgWxidW1cIiA6IFwiTmV3IEFsYnVtXCI7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiUmVzZXRcIjtcbiAgICAgICAgfSAgZWxzZSBpZiAobW9kZT09PVwiZWRpdFwiKSB7XG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIiwgXCJlZGl0XCIpOyBcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtYWxidW0taWRcIiwgYWxidW0uaWQpOyBcbiAgICAgICAgICAgIGhlYWRlci50ZXh0Q29udGVudCA9IGxhbmcgPT09IFwiZXNcIiA/IFwiRWRpdGFyIMOBbGJ1bVwiIDogXCJFZGl0IEFsYnVtXCI7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi50ZXh0Q29udGVudCA9IGxhbmcgPT09IFwiZXNcIiA/IFwiQ2FuY2VsYXJcIiA6IFwiQ2FuY2VsXCI7XG4gICAgICAgICAgICBfcG9wdWxhdGVGb3JtKGFsYnVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgLyogSGlkZSBtb2RhbCAqL1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGFsYnVtRm9ybUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcG9wdWxhdGVGb3JtKGFsYnVtKSB7XG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gYWxidW0pIHtcbiAgICAgICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmYXZvcml0ZVwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJhbGJ1bV9mb3JtYXRcIjpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFkaW9CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpbnB1dFt0eXBlPXJhZGlvXVtuYW1lPSR7cHJvcH1dYFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGJ1dHRvbiBvZiByYWRpb0J1dHRvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmcoYWxidW1bcHJvcF0pID09PSBidXR0b24udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJyZWNvcmRfZm9ybWF0XCI6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrQm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgYGlucHV0W3R5cGU9Y2hlY2tib3hdW25hbWU9JHtwcm9wfV1gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYm94IG9mIGNoZWNrQm94ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGJ1bVtwcm9wXS5zb21lKGZvcm1hdCA9PiBmb3JtYXQgPT09IGJveC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cIiR7cHJvcH1cIl1gKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQgJiYgYWxidW1bcHJvcF0gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gYWxidW1bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjbG9zZVxuICAgIH1cbn0pKCk7XG5cbnZhciBhbGJ1bUZvcm1Db250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWxcIiksXG4gICAgICAgIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC1hbGJ1bVwiKSxcbiAgICAgICAgcmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInJlc2V0XCJdJyksXG4gICAgICAgIG93bnNUcnVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvd25zLXRydWVcIiksXG4gICAgICAgIG93bnNGYWxzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ducy1mYWxzZVwiKSxcbiAgICAgICAgcmVjb3JkRmllbGRTZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZC1pbmZvLWZzXCIpO1xuXG4gICAgLy8gU3VibWl0IGFuZCByZXNldCBcIk5ldyBBbGJ1bVwiIGZvcm1cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgX3N1Ym1pdE5ld0FsYnVtKTtcbiAgICByZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICByZXNldCgpO1xuICAgICAgICBpZiAobW9kYWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIpID09PSBcImVkaXRcIikgbW9kYWxDb250cm9sbGVyLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBFbmFibGUgY2hlY2tib3hlcyB3aGVuIHVzZXIgY2xpY2tzIGJ1dHRvbiBhbmQgZGlzYWJsZSB3aGVuIG5vdFxuICAgIG93bnNUcnVlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgX2VuYWJsZVJlY29yZEZpZWxkc2V0KTtcbiAgICBvd25zRmFsc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfZGlzYWJsZVJlY29yZEZpZWxkc2V0KTtcblxuICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICBmb3JtLnJlc2V0KCk7XG4gICAgICAgIF9kaXNhYmxlUmVjb3JkRmllbGRzZXQoKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX2Rpc2FibGVSZWNvcmRGaWVsZHNldCgpIHtcbiAgICAgICAgLyogRGlzYWJsZSBzZWNvbmQgZmllbGRzZXQgIChSZWNvcmQgaW5mbykgKi9cbiAgICAgICAgcmVjb3JkRmllbGRTZXQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgcmVjb3JkRmllbGRTZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfZW5hYmxlUmVjb3JkRmllbGRzZXQoKSB7XG4gICAgICAgIC8qIEVuYWJsZSBzZWNvbmQgZmllbGRzZXQgIChSZWNvcmQgaW5mbykgKi9cbiAgICAgICAgcmVjb3JkRmllbGRTZXQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgcmVjb3JkRmllbGRTZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3N1Ym1pdE5ld0FsYnVtKGUpIHtcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IHN1Ym1pdCBhY3Rpb25cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICAvLyBDcmVhdGUgbmV3IGFsYnVtIG9iamVjdCBhbmQgYWRkIGl0IHRvIHRoZSBsaWJyYXJ5XG4gICAgICAgIGNvbnN0IG5ld0FsYnVtID0gQWxidW0oX3Byb2Nlc3NOZXdBbGJ1bUZvcm0oKSk7XG5cbiAgICAgICAgY29uc3QgbW9kZSA9IG1vZGFsLmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKTtcbiAgICAgICAgY29uc3QgaWQgPSBtb2RhbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWFsYnVtLWlkXCIpO1xuXG4gICAgICAgIGlmIChtb2RlID09PSBcIm5ld1wiKSB7XG4gICAgICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmVkaXRBbGJ1bShpZCwgbmV3QWxidW0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIENsb3NlIGZvcm0gbW9kYWxcbiAgICAgICAgbW9kYWxDb250cm9sbGVyLmNsb3NlKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9wcm9jZXNzTmV3QWxidW1Gb3JtKCkge1xuICAgICAgICAvKiBQcm9jZXNzIG5ldyBhbGJ1bSBmb3JtIHRvIHBhc3MgaXQgdG8gbmV3IGFsYnVtICovXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcbiAgICBcbiAgICAgICAgbGV0IGZvcm1Db250ZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKGZvcm1EYXRhLmVudHJpZXMoKSk7XG5cbiAgICAgICAgZm9ybUNvbnRlbnRbXCJvd25lZFwiXSA9IGZvcm1Db250ZW50W1wib3duZWRcIl0gPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBmb3JtQ29udGVudFtcImZhdm9yaXRlXCJdID0gZm9ybUNvbnRlbnRbXCJmYXZvcml0ZVwiXSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGZvcm1Db250ZW50W1wiZm9ybWF0XCJdID0gZm9ybURhdGEuZ2V0QWxsKFwiZm9ybWF0XCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gZm9ybUNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzZXRcbiAgICB9XG59KSgpO1xuXG52YXIgYXJ0aXN0U3VnZ2VzdGlvbnMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYXJ0aXN0XCIpLFxuICAgICAgICBkcm9wZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIiksXG4gICAgICAgIGxpc3QgPSBkcm9wZG93bi5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIC8vIFN1Z2dlc3QgYXJ0aXN0cyB3aGVuIGlucHV0aW5nIHZhbHVlcyBvciB3aGVuIGNsaWNraW5nIGluIGlucHV0XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9yZW5kZXIpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBfcmVuZGVyKTtcblxuICAgIC8vIENsb3NlIHN1Z2dlc3Rpb25zIGRpdiB3aGVuIGNsaWNraW5nIG91dHNpZGUgc3VnZ2VzdGlvbiBib3hcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2Nsb3NlLCB0cnVlKTtcblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoc3VnZ2VzdGVkQXJ0aXN0cykge1xuICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgICAgIC8vIElmIHVzZXIgY2xlYXJzIGlucHV0LCBkaXNwbGF5IHBsYWNlaG9sZGVyIGFuZCBjbG9zZSBzdWdnZXN0aW9uc1xuICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBpbnB1dC5wbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIF9jbG9zZSgpO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5tYXAoXG4gICAgICAgICAgICAoYWxidW0pID0+IGFsYnVtLmFydGlzdFxuICAgICAgICApO1xuICAgICAgICAvLyBDb21wdXRlIGFydGlzdCBzdWdnZXN0aW9ucyBnaXZlbiB0aGUgY3VycmVudCBhbGJ1bXMgaW4gdGhlIGxpYnJhcnlcbiAgICAgICAgdmFyIHN1Z2dlc3Rpb25zID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLnJlZHVjZSgoc3VnZywgYWxidW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnRpc3QgPSBhbGJ1bS5hcnRpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKGFydGlzdC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGlucHV0VmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3VnZy5pbmRleE9mKGFydGlzdCkgPT09IC0xICkgc3VnZy5wdXNoKGFydGlzdCk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VnZ1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICBpZiAoIXN1Z2dlc3Rpb25zLmxlbmd0aCkgeyAvLyBIaWRlIGRyb3Bkb3duIGlmIG5vdCBzdWdnZXN0aW9uc1xuICAgICAgICAgICAgX2Nsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gICAgXG4gICAgICAgIC8vIFJlZnJlc2ggZGl2IGFuZCBkaXNwbGF5IG5ldyBzdWdnZXN0aW9uc1xuICAgICAgICBkcm9wZG93bi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICBfY2xlYXIoKTtcblxuICAgICAgICAvLyBSZWdleCB0byBoaWdobGlnaHQgbWF0Y2hcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGAoLiopKCR7aW5wdXRWYWx1ZX0pKC4qKWAsIFwiaVwiKTtcbiAgICAgICAgc3VnZ2VzdGlvbnMuZm9yRWFjaChhcnRpc3QgPT4ge1xuICAgICAgICAgICAgLy8gRm9yIGVhY2ggc3VnZ2VzdGlvbiBhZGQgbGlzdCBlbGVtZW50IGhpZ2hsaWdodGluZyBtYXRjaFxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGFydGlzdC5tYXRjaChyZWdleCk7XG5cbiAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gYCR7bWF0Y2hbMV19PHN0cm9uZz4ke21hdGNoWzJdfTwvc3Ryb25nPiR7bWF0Y2hbM119YDtcbiAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgXG4gICAgICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gc2VsZWN0IHN1Z2dlc3Rpb25cbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9pbnB1dFN1Z2dlc3Rpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2xlYXIoKSB7XG4gICAgICAgIC8qIERlbGV0ZSBhbGwgc3VnZ2VzdGlvbnMgKi9cbiAgICAgICAgd2hpbGUgKGxpc3QubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICAgICAgbGlzdC5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2Nsb3NlKGUgPSBudWxsKSB7XG4gICAgICAgIC8qIEhpZGUgc3VnZ2VzdGlvbnMgYm94ICovXG4gICAgICAgIC8vIERvIG5vdCByZWdpc3RlciBjbGlja3MgaW4gdGhlIGlucHV0IGJveFxuICAgICAgICBpZiAoZSAmJiBlLnRhcmdldCA9PT0gaW5wdXQpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBJZiB0aGUgZHJvcGRvd24gaXMgYWxyZWFkeSBoaWRkZW4gZG8gbm90aGluZ1xuICAgICAgICBpZiAoIWRyb3Bkb3duLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkge1xuICAgICAgICAgICAgX2NsZWFyKCk7XG4gICAgICAgICAgICBkcm9wZG93bi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2lucHV0U3VnZ2VzdGlvbigpIHtcbiAgICAgICAgLyogQ2hvb3NlIHNlbGVjdGVkIGl0ZW0gYW5kIGFkZCBpdCB0byB0aGUgaW5wdXQgKi9cbiAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLnRleHRDb250ZW50O1xuICAgIFxuICAgICAgICBfY2xvc2UoKTtcbiAgICB9ICAgIFxufSkoKTtcblxuXG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5pbXBvcnQgeyBmaWx0ZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5cbmNvbnN0IGxhbmcgPSB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlLnNsaWNlKDAsIDIpO1xuXG52YXIgdGFibGVWaWV3ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpO1xuXG4gICAgZXZlbnRzLm9uKFwiYWxidW1BZGRlZFwiLCBfdXBkYXRlKTtcbiAgICBldmVudHMub24oXCJhbGJ1bUVkaXRlZFwiLCBfdXBkYXRlKTtcbiAgICBldmVudHMub24oXCJsaWJyYXJ5U29ydGVkXCIsIF91cGRhdGUpO1xuICAgIGV2ZW50cy5vbihcImZpbHRlckFwcGxpZWRcIiwgX3VwZGF0ZSk7XG4gICAgZXZlbnRzLm9uKFwicmVtb3ZlUm93XCIsIF9yZW1vdmVSb3cpO1xuXG4gICAgZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgICAgICAgX2NsZWFyKCk7XG4gICAgICAgIF9yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyKCkge1xuICAgICAgICAvLyBBcHBseSBjdXJyZW50IGZpbHRlciB0byBhbGJ1bSBsaXN0XG4gICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5mb3JFYWNoKChhbGJ1bSkgPT4ge1xuICAgICAgICAgICAgX3JlbmRlckFsYnVtKGFsYnVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NsZWFyKCkge1xuICAgICAgICAvKiBSZW1vdmUgYWxsIHJvd3MgaW4gdGhlIHRhYmxlICovXG4gICAgICAgIHdoaWxlIChjb250ZW50cy5sYXN0RWxlbWVudENoaWxkKSB7XG4gICAgICAgICAgICBjb250ZW50cy5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbW92ZVJvdyhpZCkge1xuICAgICAgICAvLyBBc2sgY29uZmlybWF0aW9uIGJlZm9yZSByZW1vdmluZyBhbGJ1bVxuICAgICAgICBjb25zdCBjb25maXJtRGVsZXRlID0gbGFuZyA9PT0gXCJlc1wiID9cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiwr9Fc3TDoXMgc2VndXJvIGRlIHF1ZSBxdWllcmUgYm9ycmFyIGVzdGUgw6FsYnVtP1wiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGFsYnVtP1wiXG4gICAgICAgIGlmICghY29uZmlybShjb25maXJtRGVsZXRlKSkgcmV0dXJuO1xuICAgIFxuICAgICAgICAvLyBSZW1vdmUgcm93IGFuZCBhbGJ1bSBmcm9tIGxpYnJhcnlcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdHJbZGF0YS1pZD0ke2lkfV1gKVxuICAgICAgICBcbiAgICAgICAgY29udGVudHMucmVtb3ZlQ2hpbGQocm93KTtcbiAgICAgICAgbXVzaWNMaWJyYXJ5LmRlbGV0ZUFsYnVtKGlkKTtcbiAgICAgICAgX2NvbGxhcHNlRXh0cmFJbmZvKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlckFsYnVtKGFsYnVtKSB7XG4gICAgICAgIC8vIEFwcGx5IGZpbHRlci4gSWYgZmFsc2UgZG8gbm90IHJlbmRlclxuICAgICAgICBpZiAoIXRhYmxlQ29udHJvbGxlci5maWx0ZXJBbGJ1bShhbGJ1bSkpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyByb3cgZm9yIHRoZSBhbGJ1bVxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgIC8vIFNldCBhbGJ1bSBhdHRyaWJ1dGUgYXMgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSByb3dcbiAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoXCJhbGJ1bS1yb3dcIik7XG4gICAgICAgIHJvdy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGFsYnVtLmlkKTtcblxuICAgICAgICAvLyBBZGQgYWxidW0gb3B0aW9ucyBpY29uICh0aHJlZSBkb3RzKVxuICAgICAgICBjb25zdCBvcHRpb25zQnV0dG9uID0gX2FwcGVuZE9wdGlvbnNCdXR0b24ocm93KTtcbiAgICAgICAgcm93LmFwcGVuZChvcHRpb25zQnV0dG9uKTtcbiAgICAgICAgb3B0aW9uc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBvcHRpb25zTW9kYWwub3BlbihlLngsIGUueSwgYWxidW0pO1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFkZCBhbGJ1bSBpbmZvXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXCJ0aXRsZVwiLCBcImFydGlzdFwiLCBcInJlbGVhc2VfeWVhclwiLCBcIm93bmVkXCIsIFwiZmF2b3JpdGVcIl07XG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBvZiBjb2x1bW5zKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcblxuICAgICAgICAgICAgbGV0IGljb25QYXRoID0ge1xuICAgICAgICAgICAgICAgIG93bmVkOiB7IHRydWU6IFwiY2hlY2suc3ZnXCIsIGZhbHNlOiBcImNsb3NlLXJlZC5zdmdcIiB9LFxuICAgICAgICAgICAgICAgIGZhdm9yaXRlOiB7IHRydWU6IFwiaGVhcnQuc3ZnXCIsIGZhbHNlOiBcImJsYW5rLnN2Z1wiIH0sXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgcGF0aFxuICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImZhdm9yaXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIC8vIFRyYW5zbGF0ZSBcInRydWVcIiBvciBcImZhbHNlXCIgdG8gaWNvbiByZXByLiBhY2NvcmRpbmdseVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcbiAgICAgICAgICAgICAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKFwiY2VsbC1pY29uXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJmYXZvcml0ZVwiKSBpY29uLmNsYXNzTGlzdC5hZGQoXCJmYXYtaWNvblwiKTtcblxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gaWNvblBhdGhbcHJvcF1bYWxidW1bcHJvcF1dO1xuICAgICAgICAgICAgICAgICAgICBpY29uLnNyYyA9IFwiLi4vaW1hZ2VzL1wiICsgcGF0aDtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgZGF0YUNlbGwuYXBwZW5kQ2hpbGQoaWNvbilcblxuICAgICAgICAgICAgICAgICAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmVkaXRBbGJ1bURldGFpbHMoYWxidW0uaWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcHJvcF06ICFhbGJ1bVtwcm9wXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC50ZXh0Q29udGVudCA9IGFsYnVtW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChkYXRhQ2VsbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBcHBlbmQgbmV3IHJvd1xuICAgICAgICBjb250ZW50cy5hcHBlbmRDaGlsZChyb3cpO1xuXG4gICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV4dFJvdyA9IHJvdy5uZXh0U2libGluZztcblxuICAgICAgICAgICAgX2NvbGxhcHNlRXh0cmFJbmZvKCk7IFxuICAgICAgICAgICAgLy8gQ2xvc2UgYW55IG9wZW5lZCBleHRyYS1pbmZvIHBhbmVsc1xuICAgICAgICAgICAgLy8gSWYgdGhlIHJvdyBoYWQgYW4gZXh0cmEtaW5mbyBwYW5lbCB0aGVuXG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIChlZmZlY3RpdmVseSBjbG9zaW5nIGl0KVxuICAgICAgICAgICAgaWYgKG5leHRSb3cgJiYgbmV4dFJvdy5jbGFzc0xpc3QuY29udGFpbnMoXCJleHRyYS1pbmZvXCIpKSByZXR1cm47XG4gICAgICAgICAgICBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtLCByb3cpO1xuICAgICAgICB9KTtcblxuICAgICAgICBldmVudHMuZW1pdChcInJvd0FkZGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jb2xsYXBzZUV4dHJhSW5mbygpIHtcbiAgICAgICAgY29uc3QgZXh0cmFSb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5leHRyYS1pbmZvXCIpO1xuXG4gICAgICAgIGV4dHJhUm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICByb3cucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChyb3cpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtLCByb3cpIHtcbiAgICAgICAgY29uc3QgZXh0cmFJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgICAgICBleHRyYUluZm8uY2xhc3NMaXN0LmFkZChcImV4dHJhLWluZm9cIik7XG4gICAgICAgIGNvbnN0IGRhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgICAgICBkYXRhQ2VsbC5zZXRBdHRyaWJ1dGUoXCJjb2xzcGFuXCIsIDUpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaW5mby1jb250YWluZXJcIik7XG5cbiAgICAgICAgY29uc3QgYWxidW1KYWNrZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBhbGJ1bUphY2tldC5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgYWxidW0uamFja2V0KTtcbiAgICAgICAgYWxidW1KYWNrZXQuY2xhc3NMaXN0LmFkZChcImphY2tldFwiKTtcblxuICAgICAgICBjb25zdCBnZW5lcmFsSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGdlbmVyYWxJbmZvLmNsYXNzTGlzdC5hZGQoXCJnZW5lcmFsLWluZm9cIik7XG4gICAgICAgIF9yZW5kZXJHZW5lcmFsSW5mbyhnZW5lcmFsSW5mbywgYWxidW0pXG4gICAgICAgIFxuXG4gICAgICAgIGNvbnN0IHJlY29yZEluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICByZWNvcmRJbmZvLmNsYXNzTGlzdC5hZGQoXCJyZWNvcmQtaW5mb1wiKTtcbiAgICAgICAgaWYgKGFsYnVtLm93bmVkKSBfcmVuZGVyUmVjb3JkSW5mbyhyZWNvcmRJbmZvLCBhbGJ1bSk7XG5cbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoYWxidW1KYWNrZXQpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKGdlbmVyYWxJbmZvKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChyZWNvcmRJbmZvKTtcblxuICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgICBleHRyYUluZm8uYXBwZW5kQ2hpbGQoZGF0YUNlbGwpO1xuXG4gICAgICAgIC8vIEluc2VydCBhZnRlclxuICAgICAgICByb3cucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZXh0cmFJbmZvLCByb3cubmV4dFNpYmxpbmcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJHZW5lcmFsSW5mbyhjb250YWluZXIsIGFsYnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiZ2VucmVcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJHw6luZXJvXCIgOiBcIkdlbnJlXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcInRvcFJTMVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRvcDUwMCAoUlMxKVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJ0b3BSUzNcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUb3A1MDAgKFJTMylcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcblxuICAgICAgICBjb25zdCB1cmxzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJkaXNjb2dzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiRGlzY29nc1wiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJ3aWtpcGVkaWFcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJXaWtpcGVkaWFcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcblxuICAgICAgICBmaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0ZXh0LmlubmVySFRNTCA9IGA8c3Ryb25nPiR7ZmllbGQubGFiZWx9PC9zdHJvbmc+OiAke1xuICAgICAgICAgICAgICAgIGFsYnVtW2ZpZWxkLmtleV1cbiAgICAgICAgICAgIH1gO1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVybHMuZm9yRWFjaCgodXJsKSA9PiB7XG4gICAgICAgICAgICBsZXQgaHJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgaHJlZi5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGFsYnVtW3VybC5rZXldKTtcbiAgICAgICAgICAgIGhyZWYuaW5uZXJIVE1MID0gYDxzdHJvbmc+JHt1cmwubGFiZWx9PC9zdHJvbmc+YDtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhyZWYpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyUmVjb3JkSW5mbyhjb250YWluZXIsIGFsYnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiY2F0YWxvZ19udW1cIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJOwrogQ2F0w6Fsb2dvXCIgOiBcIkNhdGFsb2cgI1wiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJyZWNvcmRfbGFiZWxcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJTZWxsb1wiIDogXCJMYWJlbFwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiUGHDrXNcIiA6IFwiQ291bnRyeVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJlZGl0aW9uX3llYXJcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJBw7FvIEVkaWNpw7NuXCIgOiBcIkVkaXRpb25cIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwibWF0cml4XCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiTWF0cml6XCIgOiBcIk1hdHJpeFwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjb25kaXRpb25cIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJFc3RhZG9cIiA6IFwiQ29uZGl0aW9uXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcIm5vdGVzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiT2JzLlwiIDogXCJOb3Rlc1wiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgbGV0IGZvcm1hdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBmb3JtYXQuaW5uZXJIVE1MID0gYDxzdHJvbmc+Rm9ybWF0PC9zdHJvbmc+OiAke2FsYnVtLnJlY29yZF9mb3JtYXR9ICgke2FsYnVtLmFsYnVtX2Zvcm1hdH0pYDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZvcm1hdCk7XG5cbiAgICAgICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHRleHQuaW5uZXJIVE1MID0gYDxzdHJvbmc+JHtmaWVsZC5sYWJlbH08L3N0cm9uZz46ICR7YWxidW1bZmllbGQua2V5XX1gO1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FwcGVuZE9wdGlvbnNCdXR0b24ocm93KSB7XG4gICAgICAgIC8vIENyZWF0ZSB0cmFzaGNhbiBidXR0b24gYW5kIGFwcGVuZCBpdCB0byByb3dcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cbiAgICAgICAgZGF0YUNlbGwuY2xhc3NMaXN0LmFkZChcImFsYnVtLW9wdGlvbnNcIik7XG5cbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4uL2ltYWdlcy9kb3RzLXZlcnRpY2FsLnN2Z1wiKVxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImNlbGwtaWNvblwiKVxuICAgICAgICBidXR0b24udGl0bGUgPSBsYW5nID09PSBcImVzXCIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJPcGNpb25lc1wiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWxidW0gT3B0aW9uc1wiO1xuICAgICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cbiAgICAgICAgZGF0YUNlbGwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgICAgICAvLyBDb25uZWN0IG5ldyByb3cgc28gdGhhdCByZW1vdmUtaWNvbiBvbmx5IGFwcGVhcnMgb24gaG92ZXJcbiAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIH0pO1xuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGF0YUNlbGw7XG4gICAgfVxufSkoKTtcblxudmFyIHRhYmxlQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY29udGVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUgPiB0Ym9keVwiKSxcbiAgICAgICAgIHNvcnRhYmxlSGVhZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0YWJsZSB0aC5zb3J0YWJsZVwiKTtcbiAgICB2YXIgY3VyclNvcnRpbmcgPSB7IGJ5OiBcInRpdGxlXCIsIG9yZDogXCJhc2NcIiB9O1xuXG4gICAgc29ydGFibGVIZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9zb3J0VGFibGUpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gX3NvcnRUYWJsZShlKSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgbmV3U29ydEJ5ID0gaGVhZGVyLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpO1xuICAgICAgICBjb25zdCB7IGJ5OiBzb3J0QnksIG9yZDogc29ydE9yZCB9ID0gY3VyclNvcnRpbmc7XG4gICAgXG4gICAgICAgIC8vIElmIHNvcnRpbmcgbmV3IHJvdyBmbGlwIHJvdyBvcmRlciwgZWxzZSByb3cgb3JkZXIgYXMgYXNjIGFzIGRlZmF1bHRcbiAgICAgICAgaWYgKG5ld1NvcnRCeSA9PT0gc29ydEJ5KSB7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5vcmQgPSBzb3J0T3JkID09PSBcImFzY1wiID8gXCJkZXNjXCIgOiBcImFzY1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VyclNvcnRpbmcuYnkgPSBuZXdTb3J0Qnk7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5vcmQgPSBcImFzY1wiO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIFNvcnQgbGlicmFyeSBhbGJ1bXM7XG4gICAgICAgIG11c2ljTGlicmFyeS5zb3J0KGN1cnJTb3J0aW5nKTtcbiAgICBcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBhbmQgZGlzcGxheSB0aGUgY29ycmVzcG9uZGluZyBvbmVcbiAgICAgICAgX2hpZGVTb3J0aW5nQXJyb3dzKCk7XG4gICAgICAgIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpIHtcbiAgICAgICAgLyogQWRkIHNvcnRpbmcgYXJyb3dzIHdpdGggdGhlIGNvcnJlcHNvbmRpbmcgb3JkZXIgaW4gdGhlIGNsaWNrZWQgaGVhZGVyICovXG4gICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG5cbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5hZGQoY3VyclNvcnRpbmcub3JkKTtcbiAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9oaWRlU29ydGluZ0Fycm93cygpIHtcbiAgICAgICAgLyogUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBmb3JtIGFsbCBoZWFkZXJzICovXG4gICAgICAgIHNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG4gICAgXG4gICAgICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QucmVtb3ZlKFwiYXNjXCIpO1xuICAgICAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNjXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVzZXRTb3J0aW5nKCkge1xuICAgICAgICBjdXJyU29ydGluZyA9IHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wiIH07XG5cbiAgICAgICAgX2hpZGVTb3J0aW5nQXJyb3dzKCk7XG4gICAgICAgIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJBbGJ1bShhbGJ1bSkge1xuICAgICAgICB2YXIgY3VyckZpbHRlciA9IGZpbHRlckNvbnRyb2xsZXIuZ2V0Q3VycmVudEZpbHRlcigpO1xuICAgICAgICB2YXIgeyB0eXBlOiBmaWx0ZXJUeXBlLCB2YWx1ZTogZmlsdGVyVmFsdWUgfSA9IGN1cnJGaWx0ZXI7XG4gICAgXG4gICAgICAgIC8vIFJlc2V0IGRpc3BsYXkgaWYgbm8gZmlsdGVyIGFwcGx5IChpbnB1dCBlbXB0eSkgZG8gbm90aGluZ1xuICAgICAgICBpZiAoZmlsdGVyVmFsdWUgPT09IFwiXCIpIHJldHVybiB0cnVlO1xuICAgIFxuICAgICAgICBzd2l0Y2ggKGZpbHRlclR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInRpdGxlXCJdLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gTWF0Y2ggYW55IG9mIHRoZSBjb21tYSBzZXBhcmF0ZWQgbWF0Y2hlc1xuICAgICAgICAgICAgICAgIGNvbnN0IGFydGlzdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlssO11cXHMqLyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFydGlzdExpc3Quc29tZSgoYXJ0aXN0KSA9PlxuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImFydGlzdFwiXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGFydGlzdC50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFwicmVsZWFzZV95ZWFyXCI6XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoID0gKHJlZ2V4KSA9PiBmaWx0ZXJWYWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgLy8gUmVnZXggZm9yIHllYXIgZm9yIGRpZmZlcmVudCByZWxlYXNlIHllYXIgZmlsdGVyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXhFcSA9IC9eXFxzKihcXGQrKVxccyokLywgLy8gU2luZ2xlIHllYXIgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhHdCA9IC8oPzpePlxccz8oXFxkKykkKS8sIC8vIEdyZWF0ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEx0ID0gLyg/Ol48XFxzPyhcXGQrKSQpLywgLy8gTG93ZXIgdGhhblxuICAgICAgICAgICAgICAgICAgICByZWdleEJ0dyA9IC8oPzpeKFxcZCspXFxzP1stLC87XVxccz8oXFxkKykkKS87IC8vVHdvIHZhbHVlcyBpbnRlcnZhbFxuICAgIFxuICAgICAgICAgICAgICAgIGlmIChtYXRjaChyZWdleEVxKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPT0gbWF0Y2gocmVnZXhFcSlbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEd0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPj0gbWF0Y2gocmVnZXhHdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEx0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhMdClbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaChyZWdleEJ0dykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID49IG1hdGNoKHJlZ2V4QnR3KVsxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPD0gbWF0Y2gocmVnZXhCdHcpWzJdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIC8vIEFsbG93IHRoZSB1c2Ugb2YgZGlmZmVyZW50IHdvcmRzIGZvciB0cnVlIGFuZCBmYWxzZVxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIGluIFtcbiAgICAgICAgICAgICAgICAgICAgXCIxXCIsIFwieWVzXCIsIFwidHJ1ZVwiLCBcIm93blwiLCBcInPDrVwiLCBcInNpXCIsIFwiYWRxXCIsIFwiYWRxdWlyaWRvXCJcbiAgICAgICAgICAgICAgICBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSBpbiBbXG4gICAgICAgICAgICAgICAgICAgIFwiMFwiLCBcIm5vXCIsIFwibm90XCIsIFwiZmFsc2VcIiwgXCIhb3duZWRcIiwgXCJ3YW50XCIsIFwiIWFkcVwiLCBcIiFhZHF1aXJpZG9cIlxuICAgICAgICAgICAgICAgIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJmb3JtYXRcIjpcbiAgICAgICAgICAgICAgICAvLyBJbiB0aGlzIGZpbHRlciBcIitcIiA9IFwiYW5kXCIgYW5kIFwiWyw7L11cIiA9IFwib3JcIlxuICAgICAgICAgICAgICAgIGxldCBmb3JtYXRMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlclZhbHVlLmluY2x1ZGVzKFwiK1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXRMaXN0ID0gZmlsdGVyVmFsdWUuc3BsaXQoL1xccypcXCtcXHMqLyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRMaXN0LmV2ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZvcm1hdCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImZvcm1hdFwiXS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWwpID0+IHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXRMaXN0ID0gZmlsdGVyVmFsdWUuc3BsaXQoL1xccypbLDsvXVxccyovKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdExpc3Quc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChmb3JtYXQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJmb3JtYXRcIl0uZmluZEluZGV4KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsKSA9PiB2YWwudG9Mb3dlckNhc2UoKSA9PT0gZm9ybWF0LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBFbHNlIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGZpbHRlckFsYnVtXG4gICAgfVxufSkoKTtcblxuXG52YXIgb3B0aW9uc01vZGFsID0gKGZ1bmN0aW9uKGFsYnVtKSB7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbnMtbW9kYWxcIik7XG5cbiAgICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBjbG9zZSlcblxuICAgIGZ1bmN0aW9uIG9wZW4oeCwgeSwgYWxidW0pIHtcbiAgICAgICAgY29uc3QgZWRpdEFsYnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LWFsYnVtXCIpLFxuICAgICAgICAgICAgZGVsQWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1hbGJ1bVwiKTtcblxuICAgICAgICBfcmVuZGVyKHgsIHkpXG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cbiAgICAgICAgZWRpdEFsYnVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBldmVudHMuZW1pdChcImVkaXRBbGJ1bVwiLCBhbGJ1bSk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgZGVsQWxidW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwicmVtb3ZlUm93XCIsIGFsYnVtLmlkKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgY29uc3QgZWRpdEFsYnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LWFsYnVtXCIpLFxuICAgICAgICAgICAgZGVsQWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1hbGJ1bVwiKTtcblxuICAgICAgICBlZGl0QWxidW0ucmVwbGFjZVdpdGgoZWRpdEFsYnVtLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIGRlbEFsYnVtLnJlcGxhY2VXaXRoKGRlbEFsYnVtLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoeCwgeSkge1xuICAgICAgICBtb2RhbC5zdHlsZS5sZWZ0ID0geCAtIDUgKyBcInB4XCI7XG4gICAgICAgIG1vZGFsLnN0eWxlLnRvcCA9IHkgLSA1ICsgXCJweFwiO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG9wZW5cbiAgICB9XG59KSgpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi90YWJsZS5qc1wiXG5pbXBvcnQgXCIuL2ZpbHRlci5qc1wiXG5pbXBvcnQgXCIuL21vZGFsLmpzXCJcbmltcG9ydCBcIi4vbG9hZGVyLmpzXCJcblxuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5pbXBvcnQgQWxidW0gZnJvbSBcIi4vYWxidW0uanNcIjtcblxudmFyIHNhbXBsZSA9IHJlcXVpcmUoXCIuLi9hbGJ1bV9zYW1wbGUuanNvblwiKVxuXG5mb3IgKGNvbnN0IGtleSBpbiBzYW1wbGUpIHtcbiAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoc2FtcGxlLCBrZXkpKSB7XG4gICAgICAgIHZhciBuZXdBbGJ1bSA9IEFsYnVtKHNhbXBsZVtrZXldKTtcbiAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICB9XG59XG5cbmNvbnNvbGUubG9nKHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2Uuc2xpY2UoMCwgMikpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=