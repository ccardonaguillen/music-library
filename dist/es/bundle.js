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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1CO0FBQ0M7QUFDRDtBQUNDOztBQUVvQjtBQUNUOztBQUUvQixhQUFhLG1CQUFPLENBQUMsaURBQXNCOztBQUUzQztBQUNBO0FBQ0EsdUJBQXVCLHFEQUFLO0FBQzVCLFFBQVEsNERBQXFCO0FBQzdCO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2FsYnVtLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvZXZlbnRzLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvZmlsdGVyLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvbGlicmFyeS5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2xvYWRlci5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL21vZGFsLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvdGFibGUuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL211c2ljLWxpYnJhcnkvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIEFsYnVtID0gKFxuICAgIHsgdGl0bGUsXG4gICAgICBhcnRpc3QsXG4gICAgICByZWxlYXNlX3llYXIsXG4gICAgICBvd25lZCxcbiAgICAgIGZhdm9yaXRlLFxuICAgICAgZ2VucmUsXG4gICAgICB0b3BSUzEsXG4gICAgICB0b3BSUzMsXG4gICAgICBkaXNjb2dzLFxuICAgICAgd2lraXBlZGlhLFxuICAgICAgcmVjb3JkX2Zvcm1hdCxcbiAgICAgIGFsYnVtX2Zvcm1hdCxcbiAgICAgIGNhdGFsb2dfbnVtLFxuICAgICAgZWRpdGlvbl95ZWFyLFxuICAgICAgY291bnRyeSxcbiAgICAgIHJlY29yZF9sYWJlbCxcbiAgICAgIG1hdHJpeCxcbiAgICAgIGNvbmRpdGlvbixcbiAgICAgIG5vdGVzLFxuICAgICAgamFja2V0XG4gICAgfVxuKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHRpdGxlLnRvTG93ZXJDYXNlKCkucmVwbGFjZUFsbCgvXFxXL2csIFwiXCIpICtcbiAgICAgICAgICAgIGFydGlzdC50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoL1xcVy9nLCBcIlwiKSArXG4gICAgICAgICAgICByZWxlYXNlX3llYXIsXG4gICAgICAgIHRpdGxlLFxuICAgICAgICBhcnRpc3QsXG4gICAgICAgIHJlbGVhc2VfeWVhcixcbiAgICAgICAgb3duZWQ6IEJvb2xlYW4ob3duZWQpLFxuICAgICAgICBmYXZvcml0ZTogQm9vbGVhbihmYXZvcml0ZSksXG4gICAgICAgIGdlbnJlOiBnZW5yZSB8fCBcIlwiLFxuICAgICAgICB0b3BSUzE6IHRvcFJTMSB8fCBcIlwiLFxuICAgICAgICB0b3BSUzM6IHRvcFJTMyB8fCBcIlwiLFxuICAgICAgICBkaXNjb2dzOiBkaXNjb2dzIHx8IFwiXCIsXG4gICAgICAgIHdpa2lwZWRpYTogd2lraXBlZGlhIHx8IFwiXCIsXG4gICAgICAgIHJlY29yZF9mb3JtYXQ6IHR5cGVvZihyZWNvcmRfZm9ybWF0KSA9PT0gXCJzdHJpbmdcIiA/XG4gICAgICAgICAgICAgICAgICAgICAgIEFycmF5KHJlY29yZF9mb3JtYXQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkX2Zvcm1hdCxcbiAgICAgICAgYWxidW1fZm9ybWF0OiBhbGJ1bV9mb3JtYXQgfHwgXCJcIixcbiAgICAgICAgY2F0YWxvZ19udW06IGNhdGFsb2dfbnVtIHx8IFwiXCIsXG4gICAgICAgIGVkaXRpb25feWVhcjogZWRpdGlvbl95ZWFyIHx8IFwiXCIsXG4gICAgICAgIGNvdW50cnk6IGNvdW50cnkgfHwgXCJcIixcbiAgICAgICAgcmVjb3JkX2xhYmVsOiByZWNvcmRfbGFiZWwgfHwgXCJcIixcbiAgICAgICAgbWF0cml4OiBtYXRyaXggfHwgXCJcIixcbiAgICAgICAgY29uZGl0aW9uOiBjb25kaXRpb24gfHwgXCJcIixcbiAgICAgICAgbm90ZXM6IG5vdGVzIHx8IFwiTm9uZVwiLFxuICAgICAgICBqYWNrZXQ6IGphY2tldCB8fCBcIlwiXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxidW0iLCJ2YXIgZXZlbnRzID0ge1xuICAgIGV2ZW50czoge30sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmbihkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50cyIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxuY29uc3QgbGFuZyA9IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2U7XG5cbnZhciBzdW1tYXJ5VmlldyA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50cmllcy1jb3VudFwiKSxcbiAgICAgICAgdGFibGVDb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpO1xuXG4gICAgZXZlbnRzLm9uKFwiZmlsdGVyQXBwbGllZFwiLCBfcmVuZGVyKTtcbiAgICBldmVudHMub24oXCJyb3dBZGRlZFwiLCBfcmVuZGVyKTtcbiAgICBldmVudHMub24oXCJyb3dEZWxldGVkXCIsIF9yZW5kZXIpO1xuXG4gICAgZnVuY3Rpb24gX3JlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdG90YWxFbnRyaWVzID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLmxlbmd0aCwgLy8gTGVuZ3RoIG9mIGxpYnJhcnkgbGlzdFxuICAgICAgICAgICAgc2hvd25FbnRyaWVzID0gdGFibGVDb250ZW50cy5xdWVyeVNlbGVjdG9yQWxsKFwidHI6bm90KC5leHRyYS1pbmZvKVwiKS5sZW5ndGg7IC8vIE51bWJlciBvZiByb3dzIGluIHRhYmxlXG5cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGFsYnVtcyBpbiB0aGUgbGlicmFyeSBwcmludCB3ZWxjb21lIG1lc3NhZ2VcbiAgICAgICAgaWYgKGxhbmcgPT09IFwiZXNcIikge1xuICAgICAgICAgICAgc3VtbWFyeS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICB0b3RhbEVudHJpZXMgPT09IDBcbiAgICAgICAgICAgICAgICA/IFwiTm8gaGF5IG5pbmfDum4gw6FsYnVtIGVuIGxhIGNvbGVjY2nDs24uIEHDsWFkZSB1bm8gdXNhbmRvIGVsIGJvdMOzblwiXG4gICAgICAgICAgICAgICAgOiBgTW9zdHJhbmRvICR7c2hvd25FbnRyaWVzfSBkZSAke3RvdGFsRW50cmllc30gw6FsYnVtc2A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW1tYXJ5LnRleHRDb250ZW50ID1cbiAgICAgICAgICAgIHRvdGFsRW50cmllcyA9PT0gMFxuICAgICAgICAgICAgICAgID8gXCJObyBhbGJ1bXMgaW4gdGhlIGxpYnJhcnkuIEFkZCBvbmUgYnkgY2xpY2tpbmcgdGhlIGJ1dHRvblwiXG4gICAgICAgICAgICAgICAgOiBgU2hvd2luZyAke3Nob3duRW50cmllc30gb3V0IG9mICR7dG90YWxFbnRyaWVzfSBhbGJ1bXNgO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcblxudmFyIGZpbHRlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyRmlsdGVyID0geyB0eXBlOiBcIlwiLCB2YWx1ZTogXCJcIiB9O1xuICAgIGNvbnN0IGZpbHRlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci1ieVwiKSxcbiAgICAgICAgZmlsdGVyU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXJcIiksXG4gICAgICAgIGZpbHRlclZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItdmFsdWVcIiksXG4gICAgICAgIGVudHJpZXNDb3VudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50cmllcy1jb3VudFwiKTtcblxuICAgIGZpbHRlclNlbGVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIF9yZXNldEZpbHRlcik7XG4gICAgZmlsdGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIF9hcHBseUZpbHRlcik7XG4gICAgZmlsdGVyVmFsdWUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9yZXNldEZpbHRlcik7XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50RmlsdGVyKCkge1xuICAgICAgICByZXR1cm4gY3VyckZpbHRlcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYXBwbHlGaWx0ZXIoZSA9IG51bGwpIHtcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IHN1Ym1pdCBiZWhhdmlvdXJcbiAgICAgICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICAgICAgLy8gVXBkYXRlIGN1cnJlbnQgZmlsdGVyIHdpdGggdmFsdWVzIGZyb20gdGhlIGZpbHRlciBmb3JtXG4gICAgICAgIGN1cnJGaWx0ZXJbXCJ0eXBlXCJdID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgICAgICBjdXJyRmlsdGVyW1widmFsdWVcIl0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci12YWx1ZVwiKS52YWx1ZTtcbiAgICBcbiAgICAgICAgLy8gVXBkYXRlIHRhYmxlXG4gICAgICAgIGV2ZW50cy5lbWl0KFwiZmlsdGVyQXBwbGllZFwiLCBjdXJyRmlsdGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3JlbmRlclBsYWNlaG9sZGVyKCkge1xuICAgICAgICAvKiBVcGRhdGUgcGxhY2Vob2xkZXIgbWVzc2FnZSBhY2NvcmRpbmcgdG8gdGhlIHNlbGVjdGVkIG9wdGlvbiAqL1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJTZWxlY3QudmFsdWU7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGxhbmcgPT09IFwiZXNcIiA/IFwicC4gZWouIFwiIDogXCJlLmcuIFwiO1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnXCJzdWJtYXJpbmVcIicsXG4gICAgICAgICAgICBhcnRpc3Q6ICdcInplcHBlbGluXCIsIFwiYmVhdGxlcywgcm9sbGluZ1wiJyxcbiAgICAgICAgICAgIHJlbGVhc2VfeWVhcjogJ1wiMTk5MFwiLCBcIjEtMjAwMFwiLCBcIj4xOTAwXCIsIFwiPDE5ODBcIicsXG4gICAgICAgICAgICBvd25lZDogJ1widHJ1ZVwiLCBcIm5vXCIsIFwibm90IG93bmVkXCInLFxuICAgICAgICAgICAgZm9ybWF0OiAnXCJWeW5pbFwiLCBcImNkK2Nhc2V0dGVcIiwgXCJ2eW5pbC9DRFwiJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGZpbHRlclZhbHVlLnBsYWNlaG9sZGVyID0gcHJlZml4ICsgcGxhY2Vob2xkZXJbZmlsdGVyXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVzZXRGaWx0ZXIoZSkge1xuICAgICAgICBpZiAoZS50eXBlID09PSBcImlucHV0XCIgJiYgZmlsdGVyVmFsdWUudmFsdWUgIT09IFwiXCIpIHJldHVybjtcbiAgICAgICAgLyogUmVzZXQgZmlsdGVyIHdoZW4gdGhlIGlucHV0IGJveCBpcyBlbXB0eSBhbmQgYXBwbHkgZW1wdHkgZmlsdGVyICovXG4gICAgICAgIFxuICAgICAgICBmaWx0ZXJWYWx1ZS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIF9yZW5kZXJQbGFjZWhvbGRlcigpO1xuICAgICAgICBfYXBwbHlGaWx0ZXIoKTtcbiAgICBcbiAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gICAgXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRDdXJyZW50RmlsdGVyLFxuICAgIH1cbn0pKCk7XG5cbmV4cG9ydCB7IGZpbHRlckNvbnRyb2xsZXIgfSIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCJcblxudmFyIG11c2ljTGlicmFyeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFsYnVtTGlzdCA9IFtdO1xuXG4gICAgZnVuY3Rpb24gZ2V0QWxidW1MaXN0KCkge1xuICAgICAgICByZXR1cm4gYWxidW1MaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZEFsYnVtKG5ld0FsYnVtLCBwb3MpIHtcbiAgICAgICAgLy8gSWYgcG9zaXRpb24gaXMgcHJvdmlkZWQgdGhlbiByZW1vdmVzIGVudHJ5IGF0IHBvcyBhbmQgaW5zZXJ0cyBuZXcgb25lXG4gICAgICAgIGlmIChhbGJ1bUxpc3QuZXZlcnkoKGFsYnVtKSA9PiBuZXdBbGJ1bS5pZCAhPT0gYWxidW0uaWQpIHx8XG4gICAgICAgICAgICBuZXdBbGJ1bS5pZCA9PT0gYWxidW1MaXN0W3Bvc10uaWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YocG9zKSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC5zcGxpY2UocG9zLCAxLCBuZXdBbGJ1bSk7XG4gICAgICAgICAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bUVkaXRlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxidW1MaXN0LnVuc2hpZnQobmV3QWxidW0pO1xuICAgICAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1BZGRlZFwiLCBuZXdBbGJ1bSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgYWxidW0gZXhpc3QgbG9nIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgIGFsZXJ0KFwiVGhpcyBhbGJ1bSBhbHJlYWR5IGV4aXN0cy5cIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGVhdGVkIElEOiBcIiArIG5ld0FsYnVtLmlkKVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUFsYnVtKGlkKSB7XG4gICAgICAgIC8qIERlbGV0ZSBhbGJ1bSB3aXRoIGEgZ2l2ZW4gSUQgKi9cbiAgICAgICAgYWxidW1MaXN0ID0gYWxidW1MaXN0LmZpbHRlcigoYWxidW0pID0+IGFsYnVtLmlkICE9PSBpZCk7XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bURlbGV0ZWRcIiwgaWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVkaXRBbGJ1bShpZCwgbmV3QWxidW0pIHtcbiAgICAgICAgLy8gbmV3QWxidW0gaXMgdGhlIGFsYnVtIG9iamVjdCBjb250YWluaW5nIHRoZSB1cGRhdGVkIGluZm9cbiAgICAgICAgY29uc3QgYWxidW1JZHggPSBhbGJ1bUxpc3QuZmluZEluZGV4KFxuICAgICAgICAgICAgKGFsYnVtKSA9PiBpZCA9PT0gYWxidW0uaWRcbiAgICAgICAgKTtcblxuICAgICAgICBhZGRBbGJ1bShuZXdBbGJ1bSwgYWxidW1JZHgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVkaXRBbGJ1bURldGFpbHMoaWQsIG5ld0luZm8pIHtcbiAgICAgICAgY29uc3QgYWxidW1JZHggPSBhbGJ1bUxpc3QuZmluZEluZGV4KFxuICAgICAgICAgICAgKGFsYnVtKSA9PiBpZCA9PT0gYWxidW0uaWRcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gbmV3SW5mbykge1xuICAgICAgICAgICAgYWxidW1MaXN0W2FsYnVtSWR4XVtwcm9wXSA9IG5ld0luZm9bcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICBldmVudHMuZW1pdChcImFsYnVtRWRpdGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEFsYnVtKGlkKSB7XG4gICAgICAgIHJldHVybiBhbGJ1bUxpc3QuZmlsdGVyKChhbGJ1bSkgPT4gaWQgPT09IGFsYnVtLmlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzb3J0KHsgYnksIG9yZCA9IFwiYXNjXCIgfSkge1xuICAgICAgICAvKiBSZXZlcnNlIHNvcnRpbmcgYWxnb3JpdGhtIGlzIG9yZCA9ICdkZXNjJzsgKi9cbiAgICAgICAgbGV0IHNvcnRPcmRlciA9IG9yZCA9PT0gXCJhc2NcIiA/IDEgOiAtMTtcblxuICAgICAgICBzd2l0Y2ggKGJ5KSB7XG4gICAgICAgICAgICBjYXNlIFwidGl0bGVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgICAgICAvLyBsb2NhbGVDb21wYXJlIHVzZWQgdG8gY29tcGFyZSBzdHJpbmcgd2l0aG91dCBtYXRoIG9wZXJhdG9yc1xuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC5zb3J0KFxuICAgICAgICAgICAgICAgICAgICAoYSwgYikgPT4gYVtieV0ubG9jYWxlQ29tcGFyZShiW2J5XSkgKiBzb3J0T3JkZXJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSBcInJlbGVhc2VfeWVhclwiOlxuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC5zb3J0KChhLCBiKSA9PiAoYVtieV0gLSBiW2J5XSkgKiBzb3J0T3JkZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJsaWJyYXJ5U29ydGVkXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldEFsYnVtTGlzdCxcbiAgICAgICAgYWRkQWxidW0sXG4gICAgICAgIGRlbGV0ZUFsYnVtLFxuICAgICAgICBlZGl0QWxidW0sXG4gICAgICAgIGVkaXRBbGJ1bURldGFpbHMsXG4gICAgICAgIGdldEFsYnVtLFxuICAgICAgICBzb3J0XG4gICAgfVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbXVzaWNMaWJyYXJ5XG5cbiIsImltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiXG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIlxuXG5jb25zdCBmaWxlTG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtbG9hZGVyJyk7XG5cbmZpbGVMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZUxpc3QgPSBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgdmFyIGZpbGUgPSBmaWxlTGlzdFswXTtcbiAgICByZWFkRmlsZShmaWxlKTtcbiAgICBmaWxlTG9hZGVyLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH0pO1xuXG5mdW5jdGlvbiByZWFkRmlsZShmKSB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgICB2YXIgbXVzaWNDb2xsZWN0aW9uID0gcGFyc2VBbGJ1bUxpYnJhcnkoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIGFkZENvbGxlY3Rpb24obXVzaWNDb2xsZWN0aW9uKVxuICAgIH0pO1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGYsIFwidXRmLThcIik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ1NWIChzdHJpbmcsIGRlbGltaXRlcj1cIixcIikge1xuICAgIC8vIENvbW1lbnRlZCBjb2RlIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyOTMxNDcvaG93LXRvLXBhcnNlLWNzdi1kYXRhXG4gICAgdmFyIG9ialBhdHRlcm4gPSBuZXcgUmVnRXhwKFxuICAgICAgICAoXG4gICAgICAgICAgICBcIihcXFxcXCIgKyBkZWxpbWl0ZXIgKyBcInxcXFxccj9cXFxcbnxcXFxccnxeKVwiICsgIC8vIERlbGltaXRlcnNcbiAgICAgICAgICAgIFwiKD86XFxcIihbXlxcXCJdKig/OlxcXCJcXFwiW15cXFwiXSopKilcXFwifFwiICsgLy8gUXVvdGVkIGZpZWxkc1xuICAgICAgICAgICAgXCIoW15cXFwiXFxcXFwiICsgZGVsaW1pdGVyICsgXCJcXFxcclxcXFxuXSopKVwiIC8vIFN0YW5kYXJkIGZpZWxkc1xuICAgICAgICApLCBcImdpXCIpO1xuXG4gICAgdmFyIGFyckRhdGEgPSBbW11dO1xuICAgIHZhciBhcnJNYXRjaGVzID0gbnVsbDtcblxuICAgIHdoaWxlIChhcnJNYXRjaGVzID0gb2JqUGF0dGVybi5leGVjKCBzdHJpbmcgKSl7XG4gICAgICAgIHZhciBzdHJNYXRjaGVkRGVsaW1pdGVyID0gYXJyTWF0Y2hlc1sgMSBdO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIubGVuZ3RoICYmXG4gICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyICE9PSBkZWxpbWl0ZXJcbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICBhcnJEYXRhLnB1c2goIFtdICk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlO1xuICAgICAgICBpZiAoYXJyTWF0Y2hlc1sgMiBdKXtcbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDIgXS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAoIFwiXFxcIlxcXCJcIiwgXCJnXCIgKVxuICAgICAgICAgICAgICAgICwgXCJcXFwiXCIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDMgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyckRhdGFbIGFyckRhdGEubGVuZ3RoIC0gMSBdLnB1c2goIHN0ck1hdGNoZWRWYWx1ZSApO1xuICAgIH1cblxuICAgIHJldHVybiggYXJyRGF0YSApO1xufVxuXG5mdW5jdGlvbiBjc3ZUb09iamVjdCAoY3N2Q29udGVudCkge1xuICAgIHZhciBwcm9wcyA9IGNzdkNvbnRlbnRbMF07XG4gICAgdmFyIG9iamVjdCA9IFtdO1xuXG4gICAgY3N2Q29udGVudC5zbGljZSgxLCAtMSkuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICB2YXIgaXRlbSA9IHt9O1xuICAgICAgICByb3cuZm9yRWFjaCgodmFsLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGl0ZW1bcHJvcHNbaWR4XV0gPSB2YWw7XG4gICAgICAgIH0pXG5cbiAgICAgICAgb2JqZWN0LnB1c2goaXRlbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCBvYmplY3QgKVxufVxuXG5mdW5jdGlvbiBwYXJzZUFsYnVtTGlicmFyeShmaWxlQ29udGVudCkge1xuICAgIHZhciBwYXJzZWRDU1YgPSBwYXJzZUNTVihmaWxlQ29udGVudCk7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBjc3ZUb09iamVjdChwYXJzZWRDU1YpO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb25cbn07XG5cbmZ1bmN0aW9uIGFkZENvbGxlY3Rpb24gKGNvbGxlY3Rpb24pIHtcbiAgICBjb2xsZWN0aW9uLmZvckVhY2goKGFsYnVtLCBpZHgpID0+IHtcbiAgICAgICAgdmFyIG5ld0FsYnVtID0gQWxidW0oe1xuICAgICAgICAgICAgdGl0bGU6IGFsYnVtW1wiTm9tYnJlXCJdLFxuICAgICAgICAgICAgYXJ0aXN0OiBhbGJ1bVtcIkFydGlzdGFcIl0sXG4gICAgICAgICAgICByZWxlYXNlX3llYXI6IGFsYnVtW1wiQW5vIGxhbnphbWllbnRvXCJdLFxuICAgICAgICAgICAgb3duZWQ6IGFsYnVtW1wiQWRxdWlyaWRvXCJdID09PSBcIjFcIiA/XG4gICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBmb3JtYXQ6IGFsYnVtW1wiRm9ybWF0b1wiXS5pbmNsdWRlcyhcIi9cIikgP1xuICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcIkZvcm1hdG9cIl0uc3BsaXQoXCIvXCIpIDpcbiAgICAgICAgICAgICAgICAgICAgW2FsYnVtW1wiRm9ybWF0b1wiXV1cbiAgICAgICAgfSlcblxuICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgIH0pXG5cbiAgICBtdXNpY0xpYnJhcnkuc29ydCh7IGJ5OiBcInRpdGxlXCIsIG9yZDogXCJhc2NcIn0pXG59O1xuXG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IEFsYnVtIGZyb20gXCIuL2FsYnVtLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxuY29uc3QgbGFuZyA9IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2U7XG5cbnZhciBtb2RhbENvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLW92ZXJsYXlcIiksIFxuICAgICAgICBvcGVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW1vZGFsXCIpLFxuICAgICAgICBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xvc2UtbW9kYWxcIiksXG4gICAgICAgIG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKSxcbiAgICAgICAgaGVhZGVyID0gbW9kYWwucXVlcnlTZWxlY3RvcihcImgyXCIpLFxuICAgICAgICByZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwicmVzZXRcIl0nKTtcblxuICAgIG9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IF9vcGVuKFwibmV3XCIpKTtcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2UpO1xuXG4gICAgZXZlbnRzLm9uKFwiZWRpdEFsYnVtXCIsIGFsYnVtID0+IF9vcGVuKFwiZWRpdFwiLCBhbGJ1bSkpO1xuXG4gICAgZnVuY3Rpb24gX29wZW4obW9kZSwgYWxidW0pIHtcbiAgICAgICAgLyogRGlzcGxheSBmb3JtIG1vZGFsIG92ZXIgbWFpbiB3aW5kb3cgYW5kIGZvY3VzIG9uIGZpcnN0IGlucHV0ICovXG4gICAgICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctdGl0bGVcIikuZm9jdXMoKTtcblxuICAgICAgICBpZiAobW9kZT09PVwibmV3XCIpIHtcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiLCBcIm5ld1wiKTsgXG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFsYnVtLWlkXCIsIFwiXCIpOyBcbiAgICAgICAgICAgIGhlYWRlci50ZXh0Q29udGVudCA9IGxhbmcgPT09IFwiZXNcIiA/IFwiQcOxYWRpciDDgWxidW1cIiA6IFwiTmV3IEFsYnVtXCI7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiUmVzZXRcIjtcbiAgICAgICAgfSAgZWxzZSBpZiAobW9kZT09PVwiZWRpdFwiKSB7XG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIiwgXCJlZGl0XCIpOyBcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtYWxidW0taWRcIiwgYWxidW0uaWQpOyBcbiAgICAgICAgICAgIGhlYWRlci50ZXh0Q29udGVudCA9IGxhbmcgPT09IFwiZXNcIiA/IFwiRWRpdGFyIMOBbGJ1bVwiIDogXCJFZGl0IEFsYnVtXCI7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi50ZXh0Q29udGVudCA9IGxhbmcgPT09IFwiZXNcIiA/IFwiQ2FuY2VsYXJcIiA6IFwiQ2FuY2VsXCI7XG4gICAgICAgICAgICBfcG9wdWxhdGVGb3JtKGFsYnVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgLyogSGlkZSBtb2RhbCAqL1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGFsYnVtRm9ybUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcG9wdWxhdGVGb3JtKGFsYnVtKSB7XG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gYWxidW0pIHtcbiAgICAgICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmYXZvcml0ZVwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJhbGJ1bV9mb3JtYXRcIjpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFkaW9CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpbnB1dFt0eXBlPXJhZGlvXVtuYW1lPSR7cHJvcH1dYFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGJ1dHRvbiBvZiByYWRpb0J1dHRvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmcoYWxidW1bcHJvcF0pID09PSBidXR0b24udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJyZWNvcmRfZm9ybWF0XCI6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrQm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgYGlucHV0W3R5cGU9Y2hlY2tib3hdW25hbWU9JHtwcm9wfV1gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYm94IG9mIGNoZWNrQm94ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGJ1bVtwcm9wXS5zb21lKGZvcm1hdCA9PiBmb3JtYXQgPT09IGJveC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cIiR7cHJvcH1cIl1gKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQgJiYgYWxidW1bcHJvcF0gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gYWxidW1bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjbG9zZVxuICAgIH1cbn0pKCk7XG5cbnZhciBhbGJ1bUZvcm1Db250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWxcIiksXG4gICAgICAgIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC1hbGJ1bVwiKSxcbiAgICAgICAgcmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInJlc2V0XCJdJyksXG4gICAgICAgIG93bnNUcnVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvd25zLXRydWVcIiksXG4gICAgICAgIG93bnNGYWxzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ducy1mYWxzZVwiKSxcbiAgICAgICAgcmVjb3JkRmllbGRTZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZC1pbmZvLWZzXCIpO1xuXG4gICAgLy8gU3VibWl0IGFuZCByZXNldCBcIk5ldyBBbGJ1bVwiIGZvcm1cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgX3N1Ym1pdE5ld0FsYnVtKTtcbiAgICByZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICByZXNldCgpO1xuICAgICAgICBpZiAobW9kYWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIpID09PSBcImVkaXRcIikgbW9kYWxDb250cm9sbGVyLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBFbmFibGUgY2hlY2tib3hlcyB3aGVuIHVzZXIgY2xpY2tzIGJ1dHRvbiBhbmQgZGlzYWJsZSB3aGVuIG5vdFxuICAgIG93bnNUcnVlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgX2VuYWJsZVJlY29yZEZpZWxkc2V0KTtcbiAgICBvd25zRmFsc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfZGlzYWJsZVJlY29yZEZpZWxkc2V0KTtcblxuICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICBmb3JtLnJlc2V0KCk7XG4gICAgICAgIF9kaXNhYmxlUmVjb3JkRmllbGRzZXQoKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX2Rpc2FibGVSZWNvcmRGaWVsZHNldCgpIHtcbiAgICAgICAgLyogRGlzYWJsZSBzZWNvbmQgZmllbGRzZXQgIChSZWNvcmQgaW5mbykgKi9cbiAgICAgICAgcmVjb3JkRmllbGRTZXQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgcmVjb3JkRmllbGRTZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfZW5hYmxlUmVjb3JkRmllbGRzZXQoKSB7XG4gICAgICAgIC8qIEVuYWJsZSBzZWNvbmQgZmllbGRzZXQgIChSZWNvcmQgaW5mbykgKi9cbiAgICAgICAgcmVjb3JkRmllbGRTZXQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgcmVjb3JkRmllbGRTZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX3N1Ym1pdE5ld0FsYnVtKGUpIHtcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IHN1Ym1pdCBhY3Rpb25cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICAvLyBDcmVhdGUgbmV3IGFsYnVtIG9iamVjdCBhbmQgYWRkIGl0IHRvIHRoZSBsaWJyYXJ5XG4gICAgICAgIGNvbnN0IG5ld0FsYnVtID0gQWxidW0oX3Byb2Nlc3NOZXdBbGJ1bUZvcm0oKSk7XG5cbiAgICAgICAgY29uc3QgbW9kZSA9IG1vZGFsLmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKTtcbiAgICAgICAgY29uc3QgaWQgPSBtb2RhbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWFsYnVtLWlkXCIpO1xuXG4gICAgICAgIGlmIChtb2RlID09PSBcIm5ld1wiKSB7XG4gICAgICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmVkaXRBbGJ1bShpZCwgbmV3QWxidW0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIENsb3NlIGZvcm0gbW9kYWxcbiAgICAgICAgbW9kYWxDb250cm9sbGVyLmNsb3NlKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIF9wcm9jZXNzTmV3QWxidW1Gb3JtKCkge1xuICAgICAgICAvKiBQcm9jZXNzIG5ldyBhbGJ1bSBmb3JtIHRvIHBhc3MgaXQgdG8gbmV3IGFsYnVtICovXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcbiAgICBcbiAgICAgICAgbGV0IGZvcm1Db250ZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKGZvcm1EYXRhLmVudHJpZXMoKSk7XG5cbiAgICAgICAgZm9ybUNvbnRlbnRbXCJvd25lZFwiXSA9IGZvcm1Db250ZW50W1wib3duZWRcIl0gPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBmb3JtQ29udGVudFtcImZhdm9yaXRlXCJdID0gZm9ybUNvbnRlbnRbXCJmYXZvcml0ZVwiXSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGZvcm1Db250ZW50W1wiZm9ybWF0XCJdID0gZm9ybURhdGEuZ2V0QWxsKFwiZm9ybWF0XCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gZm9ybUNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzZXRcbiAgICB9XG59KSgpO1xuXG4vLyB2YXIgYXJ0aXN0U3VnZ2VzdGlvbnMgPSAoZnVuY3Rpb24gKCkge1xuLy8gICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYXJ0aXN0XCIpLFxuLy8gICAgICAgICBkcm9wZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIiksXG4vLyAgICAgICAgIGxpc3QgPSBkcm9wZG93bi5maXJzdEVsZW1lbnRDaGlsZDtcblxuLy8gICAgIC8vIFN1Z2dlc3QgYXJ0aXN0cyB3aGVuIGlucHV0aW5nIHZhbHVlcyBvciB3aGVuIGNsaWNraW5nIGluIGlucHV0XG4vLyAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9yZW5kZXIpO1xuLy8gICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBfcmVuZGVyKTtcblxuLy8gICAgIC8vIENsb3NlIHN1Z2dlc3Rpb25zIGRpdiB3aGVuIGNsaWNraW5nIG91dHNpZGUgc3VnZ2VzdGlvbiBib3hcbi8vICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2Nsb3NlLCB0cnVlKTtcblxuLy8gICAgIGZ1bmN0aW9uIF9yZW5kZXIoc3VnZ2VzdGVkQXJ0aXN0cykge1xuLy8gICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gaW5wdXQudmFsdWU7XG4vLyAgICAgICAgIC8vIElmIHVzZXIgY2xlYXJzIGlucHV0LCBkaXNwbGF5IHBsYWNlaG9sZGVyIGFuZCBjbG9zZSBzdWdnZXN0aW9uc1xuLy8gICAgICAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gXCJcIikge1xuLy8gICAgICAgICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBpbnB1dC5wbGFjZWhvbGRlcjtcbi8vICAgICAgICAgICAgIF9jbG9zZSgpO1xuICAgIFxuLy8gICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5tYXAoXG4vLyAgICAgICAgICAgICAoYWxidW0pID0+IGFsYnVtLmFydGlzdFxuLy8gICAgICAgICApO1xuLy8gICAgICAgICAvLyBDb21wdXRlIGFydGlzdCBzdWdnZXN0aW9ucyBnaXZlbiB0aGUgY3VycmVudCBhbGJ1bXMgaW4gdGhlIGxpYnJhcnlcbi8vICAgICAgICAgdmFyIHN1Z2dlc3Rpb25zID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLnJlZHVjZSgoc3VnZywgYWxidW0pID0+IHtcbi8vICAgICAgICAgICAgICAgICBjb25zdCBhcnRpc3QgPSBhbGJ1bS5hcnRpc3Q7XG4vLyAgICAgICAgICAgICAgICAgaWYgKGFydGlzdC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGlucHV0VmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuLy8gICAgICAgICAgICAgICAgICAgICBpZiAoc3VnZy5pbmRleE9mKGFydGlzdCkgPT09IC0xICkgc3VnZy5wdXNoKGFydGlzdCk7XG4vLyAgICAgICAgICAgICAgICAgfSBcbi8vICAgICAgICAgICAgICAgICByZXR1cm4gc3VnZ1xuLy8gICAgICAgICAgICAgfSwgW10pO1xuLy8gICAgICAgICBpZiAoIXN1Z2dlc3Rpb25zLmxlbmd0aCkgeyAvLyBIaWRlIGRyb3Bkb3duIGlmIG5vdCBzdWdnZXN0aW9uc1xuLy8gICAgICAgICAgICAgX2Nsb3NlKCk7XG4vLyAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgIH0gICAgXG4vLyAgICAgICAgIC8vIFJlZnJlc2ggZGl2IGFuZCBkaXNwbGF5IG5ldyBzdWdnZXN0aW9uc1xuLy8gICAgICAgICBkcm9wZG93bi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuLy8gICAgICAgICBfY2xlYXIoKTtcblxuLy8gICAgICAgICAvLyBSZWdleCB0byBoaWdobGlnaHQgbWF0Y2hcbi8vICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGAoLiopKCR7aW5wdXRWYWx1ZX0pKC4qKWAsIFwiaVwiKTtcbi8vICAgICAgICAgc3VnZ2VzdGlvbnMuZm9yRWFjaChhcnRpc3QgPT4ge1xuLy8gICAgICAgICAgICAgLy8gRm9yIGVhY2ggc3VnZ2VzdGlvbiBhZGQgbGlzdCBlbGVtZW50IGhpZ2hsaWdodGluZyBtYXRjaFxuLy8gICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbi8vICAgICAgICAgICAgIHZhciBtYXRjaCA9IGFydGlzdC5tYXRjaChyZWdleCk7XG5cbi8vICAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gYCR7bWF0Y2hbMV19PHN0cm9uZz4ke21hdGNoWzJdfTwvc3Ryb25nPiR7bWF0Y2hbM119YDtcbi8vICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgXG4vLyAgICAgICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gc2VsZWN0IHN1Z2dlc3Rpb25cbi8vICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9pbnB1dFN1Z2dlc3Rpb24pO1xuLy8gICAgICAgICB9KTtcbi8vICAgICB9XG5cbi8vICAgICBmdW5jdGlvbiBfY2xlYXIoKSB7XG4vLyAgICAgICAgIC8qIERlbGV0ZSBhbGwgc3VnZ2VzdGlvbnMgKi9cbi8vICAgICAgICAgd2hpbGUgKGxpc3QubGFzdEVsZW1lbnRDaGlsZCkge1xuLy8gICAgICAgICAgICAgbGlzdC5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgZnVuY3Rpb24gX2Nsb3NlKGUgPSBudWxsKSB7XG4vLyAgICAgICAgIC8qIEhpZGUgc3VnZ2VzdGlvbnMgYm94ICovXG4vLyAgICAgICAgIC8vIERvIG5vdCByZWdpc3RlciBjbGlja3MgaW4gdGhlIGlucHV0IGJveFxuLy8gICAgICAgICBpZiAoZSAmJiBlLnRhcmdldCA9PT0gaW5wdXQpIHJldHVybjtcbiAgICAgICAgICAgIFxuLy8gICAgICAgICAvLyBJZiB0aGUgZHJvcGRvd24gaXMgYWxyZWFkeSBoaWRkZW4gZG8gbm90aGluZ1xuLy8gICAgICAgICBpZiAoIWRyb3Bkb3duLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkge1xuLy8gICAgICAgICAgICAgX2NsZWFyKCk7XG4vLyAgICAgICAgICAgICBkcm9wZG93bi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgZnVuY3Rpb24gX2lucHV0U3VnZ2VzdGlvbigpIHtcbi8vICAgICAgICAgLyogQ2hvb3NlIHNlbGVjdGVkIGl0ZW0gYW5kIGFkZCBpdCB0byB0aGUgaW5wdXQgKi9cbi8vICAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLnRleHRDb250ZW50O1xuICAgIFxuLy8gICAgICAgICBfY2xvc2UoKTtcbi8vICAgICB9ICAgIFxuLy8gfSkoKTtcblxuXG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5pbXBvcnQgeyBmaWx0ZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5cbmNvbnN0IGxhbmcgPSB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlXG5cbnZhciB0YWJsZVZpZXcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIik7XG5cbiAgICBldmVudHMub24oXCJhbGJ1bUFkZGVkXCIsIF91cGRhdGUpO1xuICAgIGV2ZW50cy5vbihcImFsYnVtRWRpdGVkXCIsIF91cGRhdGUpO1xuICAgIGV2ZW50cy5vbihcImxpYnJhcnlTb3J0ZWRcIiwgX3VwZGF0ZSk7XG4gICAgZXZlbnRzLm9uKFwiZmlsdGVyQXBwbGllZFwiLCBfdXBkYXRlKTtcbiAgICBldmVudHMub24oXCJyZW1vdmVSb3dcIiwgX3JlbW92ZVJvdyk7XG5cbiAgICBmdW5jdGlvbiBfdXBkYXRlKCkge1xuICAgICAgICBfY2xlYXIoKTtcbiAgICAgICAgX3JlbmRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoKSB7XG4gICAgICAgIC8vIEFwcGx5IGN1cnJlbnQgZmlsdGVyIHRvIGFsYnVtIGxpc3RcbiAgICAgICAgbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLmZvckVhY2goKGFsYnVtKSA9PiB7XG4gICAgICAgICAgICBfcmVuZGVyQWxidW0oYWxidW0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2xlYXIoKSB7XG4gICAgICAgIC8qIFJlbW92ZSBhbGwgcm93cyBpbiB0aGUgdGFibGUgKi9cbiAgICAgICAgd2hpbGUgKGNvbnRlbnRzLmxhc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgICAgICAgIGNvbnRlbnRzLmxhc3RFbGVtZW50Q2hpbGQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVtb3ZlUm93KGlkKSB7XG4gICAgICAgIC8vIEFzayBjb25maXJtYXRpb24gYmVmb3JlIHJlbW92aW5nIGFsYnVtXG4gICAgICAgIGNvbmZpcm1EZWxldGUgPSBsYW5nID09PSBcImVzXCIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgXCLCv0VzdMOhcyBzZWd1cm8gZGUgcXVlIHF1aWVyZSBib3JyYXIgZXN0ZSDDoWxidW0/XCIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgYWxidW0/XCJcbiAgICAgICAgaWYgKCFjb25maXJtKGNvbmZpcm1EZWxldGUpKSByZXR1cm47XG4gICAgXG4gICAgICAgIC8vIFJlbW92ZSByb3cgYW5kIGFsYnVtIGZyb20gbGlicmFyeVxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGB0cltkYXRhLWlkPSR7aWR9XWApXG4gICAgICAgIFxuICAgICAgICBjb250ZW50cy5yZW1vdmVDaGlsZChyb3cpO1xuICAgICAgICBtdXNpY0xpYnJhcnkuZGVsZXRlQWxidW0oaWQpO1xuICAgICAgICBfY29sbGFwc2VFeHRyYUluZm8oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyQWxidW0oYWxidW0pIHtcbiAgICAgICAgLy8gQXBwbHkgZmlsdGVyLiBJZiBmYWxzZSBkbyBub3QgcmVuZGVyXG4gICAgICAgIGlmICghdGFibGVDb250cm9sbGVyLmZpbHRlckFsYnVtKGFsYnVtKSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHJvdyBmb3IgdGhlIGFsYnVtXG4gICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICAgICAgLy8gU2V0IGFsYnVtIGF0dHJpYnV0ZSBhcyB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHJvd1xuICAgICAgICByb3cuY2xhc3NMaXN0LmFkZChcImFsYnVtLXJvd1wiKTtcbiAgICAgICAgcm93LnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgYWxidW0uaWQpO1xuXG4gICAgICAgIC8vIEFkZCBhbGJ1bSBvcHRpb25zIGljb24gKHRocmVlIGRvdHMpXG4gICAgICAgIGNvbnN0IG9wdGlvbnNCdXR0b24gPSBfYXBwZW5kT3B0aW9uc0J1dHRvbihyb3cpO1xuICAgICAgICByb3cuYXBwZW5kKG9wdGlvbnNCdXR0b24pO1xuICAgICAgICBvcHRpb25zQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIG9wdGlvbnNNb2RhbC5vcGVuKGUueCwgZS55LCBhbGJ1bSk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWRkIGFsYnVtIGluZm9cbiAgICAgICAgY29uc3QgY29sdW1ucyA9IFtcInRpdGxlXCIsIFwiYXJ0aXN0XCIsIFwicmVsZWFzZV95ZWFyXCIsIFwib3duZWRcIiwgXCJmYXZvcml0ZVwiXTtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wIG9mIGNvbHVtbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuXG4gICAgICAgICAgICBsZXQgaWNvblBhdGggPSB7XG4gICAgICAgICAgICAgICAgb3duZWQ6IHsgdHJ1ZTogXCJjaGVjay5zdmdcIiwgZmFsc2U6IFwiY2xvc2UtcmVkLnN2Z1wiIH0sXG4gICAgICAgICAgICAgICAgZmF2b3JpdGU6IHsgdHJ1ZTogXCJoZWFydC5zdmdcIiwgZmFsc2U6IFwiYmxhbmsuc3ZnXCIgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBwYXRoXG4gICAgICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwib3duZWRcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiZmF2b3JpdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJhbnNsYXRlIFwidHJ1ZVwiIG9yIFwiZmFsc2VcIiB0byBpY29uIHJlcHIuIGFjY29yZGluZ2x5XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgICAgICAgICAgICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoXCJjZWxsLWljb25cIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSBcImZhdm9yaXRlXCIpIGljb24uY2xhc3NMaXN0LmFkZChcImZhdi1pY29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBpY29uUGF0aFtwcm9wXVthbGJ1bVtwcm9wXV07XG4gICAgICAgICAgICAgICAgICAgIGljb24uc3JjID0gXCIuLi9pbWFnZXMvXCIgKyBwYXRoO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChpY29uKVxuXG4gICAgICAgICAgICAgICAgICAgIGljb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICBtdXNpY0xpYnJhcnkuZWRpdEFsYnVtRGV0YWlscyhhbGJ1bS5pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwcm9wXTogIWFsYnVtW3Byb3BdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGRhdGFDZWxsLnRleHRDb250ZW50ID0gYWxidW1bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGRhdGFDZWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFwcGVuZCBuZXcgcm93XG4gICAgICAgIGNvbnRlbnRzLmFwcGVuZENoaWxkKHJvdyk7XG5cbiAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXh0Um93ID0gcm93Lm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICBfY29sbGFwc2VFeHRyYUluZm8oKTsgXG4gICAgICAgICAgICAvLyBDbG9zZSBhbnkgb3BlbmVkIGV4dHJhLWluZm8gcGFuZWxzXG4gICAgICAgICAgICAvLyBJZiB0aGUgcm93IGhhZCBhbiBleHRyYS1pbmZvIHBhbmVsIHRoZW5cbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgKGVmZmVjdGl2ZWx5IGNsb3NpbmcgaXQpXG4gICAgICAgICAgICBpZiAobmV4dFJvdyAmJiBuZXh0Um93LmNsYXNzTGlzdC5jb250YWlucyhcImV4dHJhLWluZm9cIikpIHJldHVybjtcbiAgICAgICAgICAgIF9yZW5kZXJFeHRyYUluZm8oYWxidW0sIHJvdyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwicm93QWRkZWRcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NvbGxhcHNlRXh0cmFJbmZvKCkge1xuICAgICAgICBjb25zdCBleHRyYVJvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmV4dHJhLWluZm9cIik7XG5cbiAgICAgICAgZXh0cmFSb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIHJvdy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHJvdyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJFeHRyYUluZm8oYWxidW0sIHJvdykge1xuICAgICAgICBjb25zdCBleHRyYUluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgIGV4dHJhSW5mby5jbGFzc0xpc3QuYWRkKFwiZXh0cmEtaW5mb1wiKTtcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIGRhdGFDZWxsLnNldEF0dHJpYnV0ZShcImNvbHNwYW5cIiwgNSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJpbmZvLWNvbnRhaW5lclwiKTtcblxuICAgICAgICBjb25zdCBhbGJ1bUphY2tldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIGFsYnVtSmFja2V0LnNldEF0dHJpYnV0ZShcInNyY1wiLCBhbGJ1bS5qYWNrZXQpO1xuICAgICAgICBhbGJ1bUphY2tldC5jbGFzc0xpc3QuYWRkKFwiamFja2V0XCIpO1xuXG4gICAgICAgIGNvbnN0IGdlbmVyYWxJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZ2VuZXJhbEluZm8uY2xhc3NMaXN0LmFkZChcImdlbmVyYWwtaW5mb1wiKTtcbiAgICAgICAgX3JlbmRlckdlbmVyYWxJbmZvKGdlbmVyYWxJbmZvLCBhbGJ1bSlcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgcmVjb3JkSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHJlY29yZEluZm8uY2xhc3NMaXN0LmFkZChcInJlY29yZC1pbmZvXCIpO1xuICAgICAgICBpZiAoYWxidW0ub3duZWQpIF9yZW5kZXJSZWNvcmRJbmZvKHJlY29yZEluZm8sIGFsYnVtKTtcblxuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChhbGJ1bUphY2tldCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoZ2VuZXJhbEluZm8pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKHJlY29yZEluZm8pO1xuXG4gICAgICAgIGRhdGFDZWxsLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgIGV4dHJhSW5mby5hcHBlbmRDaGlsZChkYXRhQ2VsbCk7XG5cbiAgICAgICAgLy8gSW5zZXJ0IGFmdGVyXG4gICAgICAgIHJvdy5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShleHRyYUluZm8sIHJvdy5uZXh0U2libGluZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlckdlbmVyYWxJbmZvKGNvbnRhaW5lciwgYWxidW0pIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJnZW5yZVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYW5nID09PSBcImVzXCIgPyBcIkfDqW5lcm9cIiA6IFwiR2VucmVcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwidG9wUlMxXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVG9wNTAwIChSUzEpXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcInRvcFJTM1wiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRvcDUwMCAoUlMzKVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IHVybHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImRpc2NvZ3NcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJEaXNjb2dzXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcIndpa2lwZWRpYVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIldpa2lwZWRpYVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHRleHQuaW5uZXJIVE1MID0gYDxzdHJvbmc+JHtmaWVsZC5sYWJlbH08L3N0cm9uZz46ICR7XG4gICAgICAgICAgICAgICAgYWxidW1bZmllbGQua2V5XVxuICAgICAgICAgICAgfWA7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdXJscy5mb3JFYWNoKCh1cmwpID0+IHtcbiAgICAgICAgICAgIGxldCBocmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICBocmVmLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgYWxidW1bdXJsLmtleV0pO1xuICAgICAgICAgICAgaHJlZi5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke3VybC5sYWJlbH08L3N0cm9uZz5gO1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaHJlZik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJSZWNvcmRJbmZvKGNvbnRhaW5lciwgYWxidW0pIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjYXRhbG9nX251bVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYW5nID09PSBcImVzXCIgPyBcIk7CuiBDYXTDoWxvZ29cIiA6IFwiQ2F0YWxvZyAjXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcInJlY29yZF9sYWJlbFwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYW5nID09PSBcImVzXCIgPyBcIlNlbGxvXCIgOiBcIkxhYmVsXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImNvdW50cnlcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJQYcOtc1wiIDogXCJDb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImVkaXRpb25feWVhclwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYW5nID09PSBcImVzXCIgPyBcIkHDsW8gRWRpY2nDs25cIiA6IFwiRWRpdGlvblwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJtYXRyaXhcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJNYXRyaXpcIiA6IFwiTWF0cml4XCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImNvbmRpdGlvblwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYW5nID09PSBcImVzXCIgPyBcIkVzdGFkb1wiIDogXCJDb25kaXRpb25cIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwibm90ZXNcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJPYnMuXCIgOiBcIk5vdGVzXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBsZXQgZm9ybWF0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGZvcm1hdC5pbm5lckhUTUwgPSBgPHN0cm9uZz5Gb3JtYXQ8L3N0cm9uZz46ICR7YWxidW0ucmVjb3JkX2Zvcm1hdH0gKCR7YWxidW0uYWxidW1fZm9ybWF0fSlgO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZm9ybWF0KTtcblxuICAgICAgICBmaWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke2ZpZWxkLmxhYmVsfTwvc3Ryb25nPjogJHthbGJ1bVtmaWVsZC5rZXldfWA7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYXBwZW5kT3B0aW9uc0J1dHRvbihyb3cpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRyYXNoY2FuIGJ1dHRvbiBhbmQgYXBwZW5kIGl0IHRvIHJvd1xuICAgICAgICBjb25zdCBkYXRhQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblxuICAgICAgICBkYXRhQ2VsbC5jbGFzc0xpc3QuYWRkKFwiYWxidW0tb3B0aW9uc1wiKTtcblxuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi4vaW1hZ2VzL2RvdHMtdmVydGljYWwuc3ZnXCIpXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2VsbC1pY29uXCIpXG4gICAgICAgIGJ1dHRvbi50aXRsZSA9IGxhbmcgPT09IFwiZXNcIiA/XG4gICAgICAgICAgICAgICAgICAgICAgICBcIk9wY2lvbmVzXCIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBbGJ1bSBPcHRpb25zXCI7XG4gICAgICAgIGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblxuICAgICAgICBkYXRhQ2VsbC5hcHBlbmRDaGlsZChidXR0b24pO1xuXG4gICAgICAgIC8vIENvbm5lY3QgbmV3IHJvdyBzbyB0aGF0IHJlbW92ZS1pY29uIG9ubHkgYXBwZWFycyBvbiBob3ZlclxuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkYXRhQ2VsbDtcbiAgICB9XG59KSgpO1xuXG52YXIgdGFibGVDb250cm9sbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjb250ZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZSA+IHRib2R5XCIpLFxuICAgICAgICAgc29ydGFibGVIZWFkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRhYmxlIHRoLnNvcnRhYmxlXCIpO1xuICAgIHZhciBjdXJyU29ydGluZyA9IHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wiIH07XG5cbiAgICBzb3J0YWJsZUhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3NvcnRUYWJsZSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBfc29ydFRhYmxlKGUpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBuZXdTb3J0QnkgPSBoZWFkZXIuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgICAgIGNvbnN0IHsgYnk6IHNvcnRCeSwgb3JkOiBzb3J0T3JkIH0gPSBjdXJyU29ydGluZztcbiAgICBcbiAgICAgICAgLy8gSWYgc29ydGluZyBuZXcgcm93IGZsaXAgcm93IG9yZGVyLCBlbHNlIHJvdyBvcmRlciBhcyBhc2MgYXMgZGVmYXVsdFxuICAgICAgICBpZiAobmV3U29ydEJ5ID09PSBzb3J0QnkpIHtcbiAgICAgICAgICAgIGN1cnJTb3J0aW5nLm9yZCA9IHNvcnRPcmQgPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyU29ydGluZy5ieSA9IG5ld1NvcnRCeTtcbiAgICAgICAgICAgIGN1cnJTb3J0aW5nLm9yZCA9IFwiYXNjXCI7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gU29ydCBsaWJyYXJ5IGFsYnVtcztcbiAgICAgICAgbXVzaWNMaWJyYXJ5LnNvcnQoY3VyclNvcnRpbmcpO1xuICAgIFxuICAgICAgICAvLyBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGFuZCBkaXNwbGF5IHRoZSBjb3JyZXNwb25kaW5nIG9uZVxuICAgICAgICBfaGlkZVNvcnRpbmdBcnJvd3MoKTtcbiAgICAgICAgX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBfcmVuZGVyU29ydGluZ0Fycm93KGhlYWRlcikge1xuICAgICAgICAvKiBBZGQgc29ydGluZyBhcnJvd3Mgd2l0aCB0aGUgY29ycmVwc29uZGluZyBvcmRlciBpbiB0aGUgY2xpY2tlZCBoZWFkZXIgKi9cbiAgICAgICAgY29uc3Qgc29ydEFycm93ID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCIuc29ydC1hcnJvd1wiKTtcblxuICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LmFkZChjdXJyU29ydGluZy5vcmQpO1xuICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gX2hpZGVTb3J0aW5nQXJyb3dzKCkge1xuICAgICAgICAvKiBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGZvcm0gYWxsIGhlYWRlcnMgKi9cbiAgICAgICAgc29ydGFibGVIZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc29ydEFycm93ID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCIuc29ydC1hcnJvd1wiKTtcbiAgICBcbiAgICAgICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NcIik7XG4gICAgICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImRlc2NcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZXNldFNvcnRpbmcoKSB7XG4gICAgICAgIGN1cnJTb3J0aW5nID0geyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCIgfTtcblxuICAgICAgICBfaGlkZVNvcnRpbmdBcnJvd3MoKTtcbiAgICAgICAgX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckFsYnVtKGFsYnVtKSB7XG4gICAgICAgIHZhciBjdXJyRmlsdGVyID0gZmlsdGVyQ29udHJvbGxlci5nZXRDdXJyZW50RmlsdGVyKCk7XG4gICAgICAgIHZhciB7IHR5cGU6IGZpbHRlclR5cGUsIHZhbHVlOiBmaWx0ZXJWYWx1ZSB9ID0gY3VyckZpbHRlcjtcbiAgICBcbiAgICAgICAgLy8gUmVzZXQgZGlzcGxheSBpZiBubyBmaWx0ZXIgYXBwbHkgKGlucHV0IGVtcHR5KSBkbyBub3RoaW5nXG4gICAgICAgIGlmIChmaWx0ZXJWYWx1ZSA9PT0gXCJcIikgcmV0dXJuIHRydWU7XG4gICAgXG4gICAgICAgIHN3aXRjaCAoZmlsdGVyVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1widGl0bGVcIl0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgICAgICAvLyBNYXRjaCBhbnkgb2YgdGhlIGNvbW1hIHNlcGFyYXRlZCBtYXRjaGVzXG4gICAgICAgICAgICAgICAgY29uc3QgYXJ0aXN0TGlzdCA9IGZpbHRlclZhbHVlLnNwbGl0KC9cXHMqWyw7XVxccyovKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJ0aXN0TGlzdC5zb21lKChhcnRpc3QpID0+XG4gICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiYXJ0aXN0XCJdLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoYXJ0aXN0LnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWxlYXNlX3llYXJcIjpcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2ggPSAocmVnZXgpID0+IGZpbHRlclZhbHVlLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgICAgICAvLyBSZWdleCBmb3IgeWVhciBmb3IgZGlmZmVyZW50IHJlbGVhc2UgeWVhciBmaWx0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleEVxID0gL15cXHMqKFxcZCspXFxzKiQvLCAvLyBTaW5nbGUgeWVhciB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICByZWdleEd0ID0gLyg/Ol4+XFxzPyhcXGQrKSQpLywgLy8gR3JlYXRlciB0aGFuXG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4THQgPSAvKD86XjxcXHM/KFxcZCspJCkvLCAvLyBMb3dlciB0aGFuXG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4QnR3ID0gLyg/Ol4oXFxkKylcXHM/Wy0sLztdXFxzPyhcXGQrKSQpLzsgLy9Ud28gdmFsdWVzIGludGVydmFsXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKHJlZ2V4RXEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA9PSBtYXRjaChyZWdleEVxKVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKHJlZ2V4R3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA+PSBtYXRjaChyZWdleEd0KVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKHJlZ2V4THQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA8PSBtYXRjaChyZWdleEx0KVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKHJlZ2V4QnR3KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJyZWxlYXNlX3llYXJcIl0gPj0gbWF0Y2gocmVnZXhCdHcpWzFdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA8PSBtYXRjaChyZWdleEJ0dylbMl1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgLy8gQWxsb3cgdGhlIHVzZSBvZiBkaWZmZXJlbnQgd29yZHMgZm9yIHRydWUgYW5kIGZhbHNlXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlclZhbHVlLnRvTG93ZXJDYXNlKCkgaW4gW1xuICAgICAgICAgICAgICAgICAgICBcIjFcIiwgXCJ5ZXNcIiwgXCJ0cnVlXCIsIFwib3duXCIsIFwic8OtXCIsIFwic2lcIiwgXCJhZHFcIiwgXCJhZHF1aXJpZG9cIlxuICAgICAgICAgICAgICAgIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpIGluIFtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCIsIFwibm9cIiwgXCJub3RcIiwgXCJmYWxzZVwiLCBcIiFvd25lZFwiLCBcIndhbnRcIiwgXCIhYWRxXCIsIFwiIWFkcXVpcmlkb1wiXG4gICAgICAgICAgICAgICAgXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcImZvcm1hdFwiOlxuICAgICAgICAgICAgICAgIC8vIEluIHRoaXMgZmlsdGVyIFwiK1wiID0gXCJhbmRcIiBhbmQgXCJbLDsvXVwiID0gXCJvclwiXG4gICAgICAgICAgICAgICAgbGV0IGZvcm1hdExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyVmFsdWUuaW5jbHVkZXMoXCIrXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlxcK1xccyovKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdExpc3QuZXZlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAoZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiZm9ybWF0XCJdLmZpbmRJbmRleChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCkgPT4gdmFsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlssOy9dXFxzKi8pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TGlzdC5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZvcm1hdCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcImZvcm1hdFwiXS5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWwpID0+IHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vIEVsc2UgZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmlsdGVyQWxidW1cbiAgICB9XG59KSgpO1xuXG5cbnZhciBvcHRpb25zTW9kYWwgPSAoZnVuY3Rpb24oYWxidW0pIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9ucy1tb2RhbFwiKTtcblxuICAgIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIGNsb3NlKVxuXG4gICAgZnVuY3Rpb24gb3Blbih4LCB5LCBhbGJ1bSkge1xuICAgICAgICBjb25zdCBlZGl0QWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXQtYWxidW1cIiksXG4gICAgICAgICAgICBkZWxBbGJ1bSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWFsYnVtXCIpO1xuXG4gICAgICAgIF9yZW5kZXIoeCwgeSlcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblxuICAgICAgICBlZGl0QWxidW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwiZWRpdEFsYnVtXCIsIGFsYnVtKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZWRpdFwiKVxuICAgICAgICB9KVxuXG4gICAgICAgIGRlbEFsYnVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBldmVudHMuZW1pdChcInJlbW92ZVJvd1wiLCBhbGJ1bS5pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlbW92ZVwiKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICBjb25zdCBlZGl0QWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXQtYWxidW1cIiksXG4gICAgICAgICAgICBkZWxBbGJ1bSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWFsYnVtXCIpO1xuXG4gICAgICAgIGVkaXRBbGJ1bS5yZXBsYWNlV2l0aChlZGl0QWxidW0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgZGVsQWxidW0ucmVwbGFjZVdpdGgoZGVsQWxidW0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlcih4LCB5KSB7XG4gICAgICAgIG1vZGFsLnN0eWxlLmxlZnQgPSB4IC0gNSArIFwicHhcIjtcbiAgICAgICAgbW9kYWwuc3R5bGUudG9wID0geSAtIDUgKyBcInB4XCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgb3BlblxuICAgIH1cbn0pKCk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3RhYmxlLmpzXCJcbmltcG9ydCBcIi4vZmlsdGVyLmpzXCJcbmltcG9ydCBcIi4vbW9kYWwuanNcIlxuaW1wb3J0IFwiLi9sb2FkZXIuanNcIlxuXG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcbmltcG9ydCBBbGJ1bSBmcm9tIFwiLi9hbGJ1bS5qc1wiO1xuXG52YXIgc2FtcGxlID0gcmVxdWlyZShcIi4uL2FsYnVtX3NhbXBsZS5qc29uXCIpXG5cbmZvciAoY29uc3Qga2V5IGluIHNhbXBsZSkge1xuICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChzYW1wbGUsIGtleSkpIHtcbiAgICAgICAgdmFyIG5ld0FsYnVtID0gQWxidW0oc2FtcGxlW2tleV0pO1xuICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==