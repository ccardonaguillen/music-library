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
            shownEntries = tableContents.querySelectorAll(
                "tr:not(.extra-info)"
            ).length; // Number of rows in table

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
            format: '"Vynil", "cd+casette", "vynil/CD"',
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
    };
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
        if (
            albumList.every((album) => newAlbum.id !== album.id) ||
            newAlbum.id === albumList[pos].id
        ) {
            if (typeof pos === "number") {
                albumList.splice(pos, 1, newAlbum);
                _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumEdited");
            } else {
                albumList.unshift(newAlbum);
                _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumAdded", newAlbum);
            }
        } else {
            // If the album exist log error message
            alert("This album already exists.");
            console.log("Repeated ID: " + newAlbum.id);
        }
    }

    function deleteAlbum(id) {
        /* Delete album with a given ID */
        albumList = albumList.filter((album) => album.id !== id);

        _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("albumDeleted", id);
    }

    function editAlbum(id, newAlbum) {
        // newAlbum is the album object containing the updated info
        const albumIdx = albumList.findIndex((album) => id === album.id);

        addAlbum(newAlbum, albumIdx);
    }

    function editAlbumDetails(id, newInfo) {
        const albumIdx = albumList.findIndex((album) => id === album.id);

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
        sort,
    };
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



const fileLoader = document.getElementById("file-loader");

fileLoader.addEventListener("change", (event) => {
    const fileList = event.target.files;
    var file = fileList[0];
    readFile(file);
    fileLoader.classList.add("hidden");
});

function readFile(f) {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        var musicCollection = parseAlbumLibrary(event.target.result);
        addCollection(musicCollection);
    });
    reader.readAsText(f, "utf-8");
}

function parseCSV(string, delimiter = ",") {
    // Commented code in https://stackoverflow.com/questions/1293147/how-to-parse-csv-data
    var objPattern = new RegExp(
        "(\\" +
            delimiter +
            "|\\r?\\n|\\r|^)" + // Delimiters
            '(?:"([^"]*(?:""[^"]*)*)"|' + // Quoted fields
            '([^"\\' +
            delimiter +
            "\\r\\n]*))", // Standard fields
        "gi"
    );

    var arrData = [[]];
    var arrMatches = null;

    while ((arrMatches = objPattern.exec(string))) {
        var strMatchedDelimiter = arrMatches[1];

        if (strMatchedDelimiter.length && strMatchedDelimiter !== delimiter) {
            arrData.push([]);
        }

        var strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
        } else {
            strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}

function csvToObject(csvContent) {
    var props = csvContent[0];
    var object = [];

    csvContent.slice(1, -1).forEach((row) => {
        var item = {};
        row.forEach((val, idx) => {
            item[props[idx]] = val;
        });

        object.push(item);
    });

    return object;
}

function parseAlbumLibrary(fileContent) {
    var parsedCSV = parseCSV(fileContent);
    var collection = csvToObject(parsedCSV);

    return collection;
}

function addCollection(collection) {
    collection.forEach((album, idx) => {
        var newAlbum = (0,_album_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
            title: album["Nombre"],
            artist: album["Artista"],
            release_year: album["Ano lanzamiento"],
            owned: album["Adquirido"] === "1" ? true : false,
            format: album["Formato"].includes("/")
                ? album["Formato"].split("/")
                : [album["Formato"]],
        });

        _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].addAlbum(newAlbum);
    });

    _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].sort({ by: "title", ord: "asc" });
}


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

    _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].on("editAlbum", (album) => _open("edit", album));

    function _open(mode, album) {
        /* Display form modal over main window and focus on first input */
        overlay.classList.remove("hidden");
        document.getElementById("new-title").focus();

        if (mode === "new") {
            modal.setAttribute("data-mode", "new");
            modal.setAttribute("data-album-id", "");
            header.textContent = lang === "es" ? "Añadir Álbum" : "New Album";
            resetButton.textContent = "Reset";
        } else if (mode === "edit") {
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
                        if (
                            album[prop].some((format) => format === box.value)
                        ) {
                            box.click();
                        }
                    }
                    break;

                default:
                    const input = document.querySelector(
                        `input[name="${prop}"]`
                    );

                    if (input && album[prop] !== "") {
                        input.value = album[prop];
                    }
                    break;
            }
        }
    }

    return {
        close,
    };
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
        formContent["favorite"] =
            formContent["favorite"] === "true" ? true : false;
        formContent["format"] = formData.getAll("format");

        return formContent;
    }

    return {
        reset,
    };
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
        _library_js__WEBPACK_IMPORTED_MODULE_2__["default"].getAlbumList().map((album) => album.artist);
        // Compute artist suggestions given the current albums in the library
        var suggestions = _library_js__WEBPACK_IMPORTED_MODULE_2__["default"].getAlbumList().reduce((sugg, album) => {
            const artist = album.artist;
            if (artist.toLowerCase().includes(inputValue.toLowerCase())) {
                // Avoid duplicates
                if (sugg.indexOf(artist) === -1) sugg.push(artist);
            }
            return sugg;
        }, []);
        if (!suggestions.length) {
            // Hide dropdown if not suggestions
            _close();
            return;
        }
        // Refresh div and display new suggestions
        dropdown.classList.remove("hidden");
        _clear();

        // Regex to highlight match
        const regex = new RegExp(`(.*)(${inputValue})(.*)`, "i");
        suggestions.forEach((artist) => {
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
        const confirmDelete =
            lang === "es"
                ? "¿Estás seguro de que quiere borrar este álbum?"
                : "Are you sure you want to delete this album?";
        if (!confirm(confirmDelete)) return;

        // Remove row and album from library
        const row = document.querySelector(`tr[data-id=${id}]`);

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
        });

        // Add album info
        const columns = [
            "title",
            "artist",
            "release_year",
            "owned",
            "favorite",
        ];
        for (const prop of columns) {
            const dataCell = document.createElement("td");

            let iconPath = {
                owned: { true: "check.svg", false: "close-red.svg" },
                favorite: { true: "heart.svg", false: "blank.svg" },
            };

            let path;
            switch (prop) {
                case "owned":
                case "favorite":
                    // Translate "true" or "false" to icon repr. accordingly
                    const icon = document.createElement("img");
                    icon.classList.add("cell-icon");

                    if (prop === "favorite") icon.classList.add("fav-icon");

                    path = iconPath[prop][album[prop]];
                    icon.src = "../images/" + path;

                    dataCell.appendChild(icon);

                    icon.addEventListener("click", (e) => {
                        e.stopPropagation();
                        _library_js__WEBPACK_IMPORTED_MODULE_1__["default"].editAlbumDetails(album.id, {
                            [prop]: !album[prop],
                        });
                    });
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

        extraRows.forEach((row) => {
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
        _renderGeneralInfo(generalInfo, album);

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
            href.setAttribute("target", "_blank");

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
            },
        ];

        let format = document.createElement("p");
        const formatLabel = lang === "es" ? "Formato" : "Format";
        format.innerHTML = `<strong>${formatLabel}</strong>: ${album.record_format} (${album.album_format})`;
        container.appendChild(format);

        fields.forEach((field) => {
            let text = document.createElement("p");
            text.innerHTML = `<strong>${field.label}</strong>: ${
                album[field.key]
            }`;

            container.appendChild(text);
        });
    }

    function _appendOptionsButton(row) {
        // Create trashcan button and append it to row
        const dataCell = document.createElement("td");
        const button = document.createElement("img");

        dataCell.classList.add("album-options");

        button.setAttribute("src", "../images/dots-vertical.svg");
        button.classList.add("cell-icon");
        button.title = lang === "es" ? "Opciones" : "Album Options";
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
                return album["title"]
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
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
                if (
                    filterValue.toLowerCase() in
                    ["1", "yes", "true", "own", "sí", "si", "adq", "adquirido"]
                ) {
                    return album["owned"];
                } else if (
                    filterValue.toLowerCase() in
                    [
                        "0",
                        "no",
                        "not",
                        "false",
                        "!owned",
                        "want",
                        "!adq",
                        "!adquirido",
                    ]
                ) {
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
                                (val) =>
                                    val.toLowerCase() === format.toLowerCase()
                            ) != -1
                    );
                } else {
                    formatList = filterValue.split(/\s*[,;/]\s*/);
                    return formatList.some(
                        (format) =>
                            album["format"].findIndex(
                                (val) =>
                                    val.toLowerCase() === format.toLowerCase()
                            ) != -1
                    );
                }
            default:
                // Else do nothing
                return true;
        }
    }

    return {
        filterAlbum,
    };
})();

var optionsModal = (function (album) {
    const modal = document.getElementById("options-modal");

    modal.addEventListener("mouseleave", close);

    function open(x, y, album) {
        const editAlbum = document.getElementById("edit-album"),
            delAlbum = document.getElementById("delete-album");

        _render(x, y);
        modal.classList.remove("hidden");

        editAlbum.addEventListener("click", () => {
            _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("editAlbum", album);
        });

        delAlbum.addEventListener("click", () => {
            _events_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("removeRow", album.id);
        });
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
        open,
    };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFjLHVDQUF1Qzs7QUFFckQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsY0FBYzs7QUFFL0Q7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQiwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsWUFBWSx1REFBVztBQUN2QixTQUFTOztBQUVUO0FBQ0EsWUFBWSx1REFBVztBQUN2QixTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDN2VEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05tQjtBQUNDO0FBQ0Q7QUFDQzs7QUFFb0I7QUFDVDs7QUFFL0IsYUFBYSxtQkFBTyxDQUFDLGlEQUFzQjs7QUFFM0M7QUFDQTtBQUNBLHVCQUF1QixxREFBSztBQUM1QixRQUFRLDREQUFxQjtBQUM3QjtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9hbGJ1bS5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2xpYnJhcnkuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS8uL3NyYy9tb2RhbC5qcyIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL3RhYmxlLmpzIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXVzaWMtbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL211c2ljLWxpYnJhcnkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tdXNpYy1saWJyYXJ5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBBbGJ1bSA9IChcbiAgICB7IHRpdGxlLFxuICAgICAgYXJ0aXN0LFxuICAgICAgcmVsZWFzZV95ZWFyLFxuICAgICAgb3duZWQsXG4gICAgICBmYXZvcml0ZSxcbiAgICAgIGdlbnJlLFxuICAgICAgdG9wUlMxLFxuICAgICAgdG9wUlMzLFxuICAgICAgZGlzY29ncyxcbiAgICAgIHdpa2lwZWRpYSxcbiAgICAgIHJlY29yZF9mb3JtYXQsXG4gICAgICBhbGJ1bV9mb3JtYXQsXG4gICAgICBjYXRhbG9nX251bSxcbiAgICAgIGVkaXRpb25feWVhcixcbiAgICAgIGNvdW50cnksXG4gICAgICByZWNvcmRfbGFiZWwsXG4gICAgICBtYXRyaXgsXG4gICAgICBjb25kaXRpb24sXG4gICAgICBub3RlcyxcbiAgICAgIGphY2tldFxuICAgIH1cbikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlkOiB0aXRsZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoL1xcVy9nLCBcIlwiKSArXG4gICAgICAgICAgICBhcnRpc3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlQWxsKC9cXFcvZywgXCJcIikgK1xuICAgICAgICAgICAgcmVsZWFzZV95ZWFyLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgYXJ0aXN0LFxuICAgICAgICByZWxlYXNlX3llYXIsXG4gICAgICAgIG93bmVkOiBCb29sZWFuKG93bmVkKSxcbiAgICAgICAgZmF2b3JpdGU6IEJvb2xlYW4oZmF2b3JpdGUpLFxuICAgICAgICBnZW5yZTogZ2VucmUgfHwgXCJcIixcbiAgICAgICAgdG9wUlMxOiB0b3BSUzEgfHwgXCJcIixcbiAgICAgICAgdG9wUlMzOiB0b3BSUzMgfHwgXCJcIixcbiAgICAgICAgZGlzY29nczogZGlzY29ncyB8fCBcIlwiLFxuICAgICAgICB3aWtpcGVkaWE6IHdpa2lwZWRpYSB8fCBcIlwiLFxuICAgICAgICByZWNvcmRfZm9ybWF0OiB0eXBlb2YocmVjb3JkX2Zvcm1hdCkgPT09IFwic3RyaW5nXCIgP1xuICAgICAgICAgICAgICAgICAgICAgICBBcnJheShyZWNvcmRfZm9ybWF0KSA6XG4gICAgICAgICAgICAgICAgICAgICAgIHJlY29yZF9mb3JtYXQsXG4gICAgICAgIGFsYnVtX2Zvcm1hdDogYWxidW1fZm9ybWF0IHx8IFwiXCIsXG4gICAgICAgIGNhdGFsb2dfbnVtOiBjYXRhbG9nX251bSB8fCBcIlwiLFxuICAgICAgICBlZGl0aW9uX3llYXI6IGVkaXRpb25feWVhciB8fCBcIlwiLFxuICAgICAgICBjb3VudHJ5OiBjb3VudHJ5IHx8IFwiXCIsXG4gICAgICAgIHJlY29yZF9sYWJlbDogcmVjb3JkX2xhYmVsIHx8IFwiXCIsXG4gICAgICAgIG1hdHJpeDogbWF0cml4IHx8IFwiXCIsXG4gICAgICAgIGNvbmRpdGlvbjogY29uZGl0aW9uIHx8IFwiXCIsXG4gICAgICAgIG5vdGVzOiBub3RlcyB8fCBcIk5vbmVcIixcbiAgICAgICAgamFja2V0OiBqYWNrZXQgfHwgXCJcIlxuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsYnVtIiwidmFyIGV2ZW50cyA9IHtcbiAgICBldmVudHM6IHt9LFxuICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgICB9LFxuICAgIG9mZjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgZm4oZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBldmVudHM7XG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5cbmNvbnN0IGxhbmcgPSB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlLnNsaWNlKDAsIDIpO1xuXG52YXIgc3VtbWFyeVZpZXcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVudHJpZXMtY291bnRcIiksXG4gICAgICAgIHRhYmxlQ29udGVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUgPiB0Ym9keVwiKTtcblxuICAgIGV2ZW50cy5vbihcImZpbHRlckFwcGxpZWRcIiwgX3JlbmRlcik7XG4gICAgZXZlbnRzLm9uKFwicm93QWRkZWRcIiwgX3JlbmRlcik7XG4gICAgZXZlbnRzLm9uKFwicm93RGVsZXRlZFwiLCBfcmVuZGVyKTtcblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsRW50cmllcyA9IG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5sZW5ndGgsIC8vIExlbmd0aCBvZiBsaWJyYXJ5IGxpc3RcbiAgICAgICAgICAgIHNob3duRW50cmllcyA9IHRhYmxlQ29udGVudHMucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICBcInRyOm5vdCguZXh0cmEtaW5mbylcIlxuICAgICAgICAgICAgKS5sZW5ndGg7IC8vIE51bWJlciBvZiByb3dzIGluIHRhYmxlXG5cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGFsYnVtcyBpbiB0aGUgbGlicmFyeSBwcmludCB3ZWxjb21lIG1lc3NhZ2VcbiAgICAgICAgaWYgKGxhbmcgPT09IFwiZXNcIikge1xuICAgICAgICAgICAgc3VtbWFyeS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICAgICAgdG90YWxFbnRyaWVzID09PSAwXG4gICAgICAgICAgICAgICAgICAgID8gXCJObyBoYXkgbmluZ8O6biDDoWxidW0gZW4gbGEgY29sZWNjacOzbi4gQcOxYWRlIHVubyB1c2FuZG8gZWwgYm90w7NuXCJcbiAgICAgICAgICAgICAgICAgICAgOiBgTW9zdHJhbmRvICR7c2hvd25FbnRyaWVzfSBkZSAke3RvdGFsRW50cmllc30gw6FsYnVtc2A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW1tYXJ5LnRleHRDb250ZW50ID1cbiAgICAgICAgICAgICAgICB0b3RhbEVudHJpZXMgPT09IDBcbiAgICAgICAgICAgICAgICAgICAgPyBcIk5vIGFsYnVtcyBpbiB0aGUgbGlicmFyeS4gQWRkIG9uZSBieSBjbGlja2luZyB0aGUgYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgOiBgU2hvd2luZyAke3Nob3duRW50cmllc30gb3V0IG9mICR7dG90YWxFbnRyaWVzfSBhbGJ1bXNgO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcblxudmFyIGZpbHRlckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyRmlsdGVyID0geyB0eXBlOiBcIlwiLCB2YWx1ZTogXCJcIiB9O1xuICAgIGNvbnN0IGZpbHRlckZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbHRlci1ieVwiKSxcbiAgICAgICAgZmlsdGVyU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXJcIiksXG4gICAgICAgIGZpbHRlclZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWx0ZXItdmFsdWVcIiksXG4gICAgICAgIGVudHJpZXNDb3VudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW50cmllcy1jb3VudFwiKTtcblxuICAgIGZpbHRlclNlbGVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIF9yZXNldEZpbHRlcik7XG4gICAgZmlsdGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIF9hcHBseUZpbHRlcik7XG4gICAgZmlsdGVyVmFsdWUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF9yZXNldEZpbHRlcik7XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50RmlsdGVyKCkge1xuICAgICAgICByZXR1cm4gY3VyckZpbHRlcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYXBwbHlGaWx0ZXIoZSA9IG51bGwpIHtcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IHN1Ym1pdCBiZWhhdmlvdXJcbiAgICAgICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAvLyBVcGRhdGUgY3VycmVudCBmaWx0ZXIgd2l0aCB2YWx1ZXMgZnJvbSB0aGUgZmlsdGVyIGZvcm1cbiAgICAgICAgY3VyckZpbHRlcltcInR5cGVcIl0gPSBmaWx0ZXJTZWxlY3QudmFsdWU7XG4gICAgICAgIGN1cnJGaWx0ZXJbXCJ2YWx1ZVwiXSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLXZhbHVlXCIpLnZhbHVlO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0YWJsZVxuICAgICAgICBldmVudHMuZW1pdChcImZpbHRlckFwcGxpZWRcIiwgY3VyckZpbHRlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlclBsYWNlaG9sZGVyKCkge1xuICAgICAgICAvKiBVcGRhdGUgcGxhY2Vob2xkZXIgbWVzc2FnZSBhY2NvcmRpbmcgdG8gdGhlIHNlbGVjdGVkIG9wdGlvbiAqL1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJTZWxlY3QudmFsdWU7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGxhbmcgPT09IFwiZXNcIiA/IFwicC4gZWouIFwiIDogXCJlLmcuIFwiO1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnXCJzdWJtYXJpbmVcIicsXG4gICAgICAgICAgICBhcnRpc3Q6ICdcInplcHBlbGluXCIsIFwiYmVhdGxlcywgcm9sbGluZ1wiJyxcbiAgICAgICAgICAgIHJlbGVhc2VfeWVhcjogJ1wiMTk5MFwiLCBcIjEtMjAwMFwiLCBcIj4xOTAwXCIsIFwiPDE5ODBcIicsXG4gICAgICAgICAgICBvd25lZDogJ1widHJ1ZVwiLCBcIm5vXCIsIFwibm90IG93bmVkXCInLFxuICAgICAgICAgICAgZm9ybWF0OiAnXCJWeW5pbFwiLCBcImNkK2Nhc2V0dGVcIiwgXCJ2eW5pbC9DRFwiJyxcbiAgICAgICAgfTtcblxuICAgICAgICBmaWx0ZXJWYWx1ZS5wbGFjZWhvbGRlciA9IHByZWZpeCArIHBsYWNlaG9sZGVyW2ZpbHRlcl07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3Jlc2V0RmlsdGVyKGUpIHtcbiAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJpbnB1dFwiICYmIGZpbHRlclZhbHVlLnZhbHVlICE9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIC8qIFJlc2V0IGZpbHRlciB3aGVuIHRoZSBpbnB1dCBib3ggaXMgZW1wdHkgYW5kIGFwcGx5IGVtcHR5IGZpbHRlciAqL1xuXG4gICAgICAgIGZpbHRlclZhbHVlLnZhbHVlID0gXCJcIjtcbiAgICAgICAgX3JlbmRlclBsYWNlaG9sZGVyKCk7XG4gICAgICAgIF9hcHBseUZpbHRlcigpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRDdXJyZW50RmlsdGVyLFxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgeyBmaWx0ZXJDb250cm9sbGVyIH07XG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuXG52YXIgbXVzaWNMaWJyYXJ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYWxidW1MaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBnZXRBbGJ1bUxpc3QoKSB7XG4gICAgICAgIHJldHVybiBhbGJ1bUxpc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQWxidW0obmV3QWxidW0sIHBvcykge1xuICAgICAgICAvLyBJZiBwb3NpdGlvbiBpcyBwcm92aWRlZCB0aGVuIHJlbW92ZXMgZW50cnkgYXQgcG9zIGFuZCBpbnNlcnRzIG5ldyBvbmVcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgYWxidW1MaXN0LmV2ZXJ5KChhbGJ1bSkgPT4gbmV3QWxidW0uaWQgIT09IGFsYnVtLmlkKSB8fFxuICAgICAgICAgICAgbmV3QWxidW0uaWQgPT09IGFsYnVtTGlzdFtwb3NdLmlkXG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwb3MgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc3BsaWNlKHBvcywgMSwgbmV3QWxidW0pO1xuICAgICAgICAgICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1FZGl0ZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsYnVtTGlzdC51bnNoaWZ0KG5ld0FsYnVtKTtcbiAgICAgICAgICAgICAgICBldmVudHMuZW1pdChcImFsYnVtQWRkZWRcIiwgbmV3QWxidW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGFsYnVtIGV4aXN0IGxvZyBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICBhbGVydChcIlRoaXMgYWxidW0gYWxyZWFkeSBleGlzdHMuXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXBlYXRlZCBJRDogXCIgKyBuZXdBbGJ1bS5pZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWxldGVBbGJ1bShpZCkge1xuICAgICAgICAvKiBEZWxldGUgYWxidW0gd2l0aCBhIGdpdmVuIElEICovXG4gICAgICAgIGFsYnVtTGlzdCA9IGFsYnVtTGlzdC5maWx0ZXIoKGFsYnVtKSA9PiBhbGJ1bS5pZCAhPT0gaWQpO1xuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwiYWxidW1EZWxldGVkXCIsIGlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlZGl0QWxidW0oaWQsIG5ld0FsYnVtKSB7XG4gICAgICAgIC8vIG5ld0FsYnVtIGlzIHRoZSBhbGJ1bSBvYmplY3QgY29udGFpbmluZyB0aGUgdXBkYXRlZCBpbmZvXG4gICAgICAgIGNvbnN0IGFsYnVtSWR4ID0gYWxidW1MaXN0LmZpbmRJbmRleCgoYWxidW0pID0+IGlkID09PSBhbGJ1bS5pZCk7XG5cbiAgICAgICAgYWRkQWxidW0obmV3QWxidW0sIGFsYnVtSWR4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlZGl0QWxidW1EZXRhaWxzKGlkLCBuZXdJbmZvKSB7XG4gICAgICAgIGNvbnN0IGFsYnVtSWR4ID0gYWxidW1MaXN0LmZpbmRJbmRleCgoYWxidW0pID0+IGlkID09PSBhbGJ1bS5pZCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIG5ld0luZm8pIHtcbiAgICAgICAgICAgIGFsYnVtTGlzdFthbGJ1bUlkeF1bcHJvcF0gPSBuZXdJbmZvW3Byb3BdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoXCJhbGJ1bUVkaXRlZFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBbGJ1bShpZCkge1xuICAgICAgICByZXR1cm4gYWxidW1MaXN0LmZpbHRlcigoYWxidW0pID0+IGlkID09PSBhbGJ1bS5pZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc29ydCh7IGJ5LCBvcmQgPSBcImFzY1wiIH0pIHtcbiAgICAgICAgLyogUmV2ZXJzZSBzb3J0aW5nIGFsZ29yaXRobSBpcyBvcmQgPSAnZGVzYyc7ICovXG4gICAgICAgIGxldCBzb3J0T3JkZXIgPSBvcmQgPT09IFwiYXNjXCIgPyAxIDogLTE7XG5cbiAgICAgICAgc3dpdGNoIChieSkge1xuICAgICAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgICBjYXNlIFwiYXJ0aXN0XCI6XG4gICAgICAgICAgICAgICAgLy8gbG9jYWxlQ29tcGFyZSB1c2VkIHRvIGNvbXBhcmUgc3RyaW5nIHdpdGhvdXQgbWF0aCBvcGVyYXRvcnNcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc29ydChcbiAgICAgICAgICAgICAgICAgICAgKGEsIGIpID0+IGFbYnldLmxvY2FsZUNvbXBhcmUoYltieV0pICogc29ydE9yZGVyXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWxlYXNlX3llYXJcIjpcbiAgICAgICAgICAgICAgICBhbGJ1bUxpc3Quc29ydCgoYSwgYikgPT4gKGFbYnldIC0gYltieV0pICogc29ydE9yZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cy5lbWl0KFwibGlicmFyeVNvcnRlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRBbGJ1bUxpc3QsXG4gICAgICAgIGFkZEFsYnVtLFxuICAgICAgICBkZWxldGVBbGJ1bSxcbiAgICAgICAgZWRpdEFsYnVtLFxuICAgICAgICBlZGl0QWxidW1EZXRhaWxzLFxuICAgICAgICBnZXRBbGJ1bSxcbiAgICAgICAgc29ydCxcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbXVzaWNMaWJyYXJ5O1xuIiwiaW1wb3J0IEFsYnVtIGZyb20gXCIuL2FsYnVtLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxuY29uc3QgZmlsZUxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZS1sb2FkZXJcIik7XG5cbmZpbGVMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlTGlzdCA9IGV2ZW50LnRhcmdldC5maWxlcztcbiAgICB2YXIgZmlsZSA9IGZpbGVMaXN0WzBdO1xuICAgIHJlYWRGaWxlKGZpbGUpO1xuICAgIGZpbGVMb2FkZXIuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn0pO1xuXG5mdW5jdGlvbiByZWFkRmlsZShmKSB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIHZhciBtdXNpY0NvbGxlY3Rpb24gPSBwYXJzZUFsYnVtTGlicmFyeShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgYWRkQ29sbGVjdGlvbihtdXNpY0NvbGxlY3Rpb24pO1xuICAgIH0pO1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGYsIFwidXRmLThcIik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ1NWKHN0cmluZywgZGVsaW1pdGVyID0gXCIsXCIpIHtcbiAgICAvLyBDb21tZW50ZWQgY29kZSBpbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjkzMTQ3L2hvdy10by1wYXJzZS1jc3YtZGF0YVxuICAgIHZhciBvYmpQYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICAgICAgXCIoXFxcXFwiICtcbiAgICAgICAgICAgIGRlbGltaXRlciArXG4gICAgICAgICAgICBcInxcXFxccj9cXFxcbnxcXFxccnxeKVwiICsgLy8gRGVsaW1pdGVyc1xuICAgICAgICAgICAgJyg/OlwiKFteXCJdKig/OlwiXCJbXlwiXSopKilcInwnICsgLy8gUXVvdGVkIGZpZWxkc1xuICAgICAgICAgICAgJyhbXlwiXFxcXCcgK1xuICAgICAgICAgICAgZGVsaW1pdGVyICtcbiAgICAgICAgICAgIFwiXFxcXHJcXFxcbl0qKSlcIiwgLy8gU3RhbmRhcmQgZmllbGRzXG4gICAgICAgIFwiZ2lcIlxuICAgICk7XG5cbiAgICB2YXIgYXJyRGF0YSA9IFtbXV07XG4gICAgdmFyIGFyck1hdGNoZXMgPSBudWxsO1xuXG4gICAgd2hpbGUgKChhcnJNYXRjaGVzID0gb2JqUGF0dGVybi5leGVjKHN0cmluZykpKSB7XG4gICAgICAgIHZhciBzdHJNYXRjaGVkRGVsaW1pdGVyID0gYXJyTWF0Y2hlc1sxXTtcblxuICAgICAgICBpZiAoc3RyTWF0Y2hlZERlbGltaXRlci5sZW5ndGggJiYgc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gZGVsaW1pdGVyKSB7XG4gICAgICAgICAgICBhcnJEYXRhLnB1c2goW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWRWYWx1ZTtcbiAgICAgICAgaWYgKGFyck1hdGNoZXNbMl0pIHtcbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbMl0ucmVwbGFjZShuZXcgUmVnRXhwKCdcIlwiJywgXCJnXCIpLCAnXCInKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbM107XG4gICAgICAgIH1cblxuICAgICAgICBhcnJEYXRhW2FyckRhdGEubGVuZ3RoIC0gMV0ucHVzaChzdHJNYXRjaGVkVmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJEYXRhO1xufVxuXG5mdW5jdGlvbiBjc3ZUb09iamVjdChjc3ZDb250ZW50KSB7XG4gICAgdmFyIHByb3BzID0gY3N2Q29udGVudFswXTtcbiAgICB2YXIgb2JqZWN0ID0gW107XG5cbiAgICBjc3ZDb250ZW50LnNsaWNlKDEsIC0xKS5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgdmFyIGl0ZW0gPSB7fTtcbiAgICAgICAgcm93LmZvckVhY2goKHZhbCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBpdGVtW3Byb3BzW2lkeF1dID0gdmFsO1xuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3QucHVzaChpdGVtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQWxidW1MaWJyYXJ5KGZpbGVDb250ZW50KSB7XG4gICAgdmFyIHBhcnNlZENTViA9IHBhcnNlQ1NWKGZpbGVDb250ZW50KTtcbiAgICB2YXIgY29sbGVjdGlvbiA9IGNzdlRvT2JqZWN0KHBhcnNlZENTVik7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbn1cblxuZnVuY3Rpb24gYWRkQ29sbGVjdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgY29sbGVjdGlvbi5mb3JFYWNoKChhbGJ1bSwgaWR4KSA9PiB7XG4gICAgICAgIHZhciBuZXdBbGJ1bSA9IEFsYnVtKHtcbiAgICAgICAgICAgIHRpdGxlOiBhbGJ1bVtcIk5vbWJyZVwiXSxcbiAgICAgICAgICAgIGFydGlzdDogYWxidW1bXCJBcnRpc3RhXCJdLFxuICAgICAgICAgICAgcmVsZWFzZV95ZWFyOiBhbGJ1bVtcIkFubyBsYW56YW1pZW50b1wiXSxcbiAgICAgICAgICAgIG93bmVkOiBhbGJ1bVtcIkFkcXVpcmlkb1wiXSA9PT0gXCIxXCIgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICBmb3JtYXQ6IGFsYnVtW1wiRm9ybWF0b1wiXS5pbmNsdWRlcyhcIi9cIilcbiAgICAgICAgICAgICAgICA/IGFsYnVtW1wiRm9ybWF0b1wiXS5zcGxpdChcIi9cIilcbiAgICAgICAgICAgICAgICA6IFthbGJ1bVtcIkZvcm1hdG9cIl1dLFxuICAgICAgICB9KTtcblxuICAgICAgICBtdXNpY0xpYnJhcnkuYWRkQWxidW0obmV3QWxidW0pO1xuICAgIH0pO1xuXG4gICAgbXVzaWNMaWJyYXJ5LnNvcnQoeyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCIgfSk7XG59XG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50cy5qc1wiO1xuaW1wb3J0IEFsYnVtIGZyb20gXCIuL2FsYnVtLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcblxuY29uc3QgbGFuZyA9IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2Uuc2xpY2UoMCwgMik7XG5cbnZhciBtb2RhbENvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLW92ZXJsYXlcIiksXG4gICAgICAgIG9wZW5CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbW9kYWxcIiksXG4gICAgICAgIGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZS1tb2RhbFwiKSxcbiAgICAgICAgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsXCIpLFxuICAgICAgICBoZWFkZXIgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiaDJcIiksXG4gICAgICAgIHJlc2V0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uW3R5cGU9XCJyZXNldFwiXScpO1xuXG4gICAgb3BlbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gX29wZW4oXCJuZXdcIikpO1xuICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZSk7XG5cbiAgICBldmVudHMub24oXCJlZGl0QWxidW1cIiwgKGFsYnVtKSA9PiBfb3BlbihcImVkaXRcIiwgYWxidW0pKTtcblxuICAgIGZ1bmN0aW9uIF9vcGVuKG1vZGUsIGFsYnVtKSB7XG4gICAgICAgIC8qIERpc3BsYXkgZm9ybSBtb2RhbCBvdmVyIG1haW4gd2luZG93IGFuZCBmb2N1cyBvbiBmaXJzdCBpbnB1dCAqL1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LXRpdGxlXCIpLmZvY3VzKCk7XG5cbiAgICAgICAgaWYgKG1vZGUgPT09IFwibmV3XCIpIHtcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiLCBcIm5ld1wiKTtcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtYWxidW0taWRcIiwgXCJcIik7XG4gICAgICAgICAgICBoZWFkZXIudGV4dENvbnRlbnQgPSBsYW5nID09PSBcImVzXCIgPyBcIkHDsWFkaXIgw4FsYnVtXCIgOiBcIk5ldyBBbGJ1bVwiO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udGV4dENvbnRlbnQgPSBcIlJlc2V0XCI7XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gXCJlZGl0XCIpIHtcbiAgICAgICAgICAgIG1vZGFsLnNldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiLCBcImVkaXRcIik7XG4gICAgICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFsYnVtLWlkXCIsIGFsYnVtLmlkKTtcbiAgICAgICAgICAgIGhlYWRlci50ZXh0Q29udGVudCA9IGxhbmcgPT09IFwiZXNcIiA/IFwiRWRpdGFyIMOBbGJ1bVwiIDogXCJFZGl0IEFsYnVtXCI7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi50ZXh0Q29udGVudCA9IGxhbmcgPT09IFwiZXNcIiA/IFwiQ2FuY2VsYXJcIiA6IFwiQ2FuY2VsXCI7XG4gICAgICAgICAgICBfcG9wdWxhdGVGb3JtKGFsYnVtKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICAvKiBIaWRlIG1vZGFsICovXG4gICAgICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgYWxidW1Gb3JtQ29udHJvbGxlci5yZXNldCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9wb3B1bGF0ZUZvcm0oYWxidW0pIHtcbiAgICAgICAgZm9yIChsZXQgcHJvcCBpbiBhbGJ1bSkge1xuICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImZhdm9yaXRlXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImFsYnVtX2Zvcm1hdFwiOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYWRpb0J1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgYGlucHV0W3R5cGU9cmFkaW9dW25hbWU9JHtwcm9wfV1gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYnV0dG9uIG9mIHJhZGlvQnV0dG9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFN0cmluZyhhbGJ1bVtwcm9wXSkgPT09IGJ1dHRvbi52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInJlY29yZF9mb3JtYXRcIjpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tCb3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBgaW5wdXRbdHlwZT1jaGVja2JveF1bbmFtZT0ke3Byb3B9XWBcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBib3ggb2YgY2hlY2tCb3hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW3Byb3BdLnNvbWUoKGZvcm1hdCkgPT4gZm9ybWF0ID09PSBib3gudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3guY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpbnB1dFtuYW1lPVwiJHtwcm9wfVwiXWBcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQgJiYgYWxidW1bcHJvcF0gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gYWxidW1bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjbG9zZSxcbiAgICB9O1xufSkoKTtcblxudmFyIGFsYnVtRm9ybUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKSxcbiAgICAgICAgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLWFsYnVtXCIpLFxuICAgICAgICByZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwicmVzZXRcIl0nKSxcbiAgICAgICAgb3duc1RydWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm93bnMtdHJ1ZVwiKSxcbiAgICAgICAgb3duc0ZhbHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvd25zLWZhbHNlXCIpLFxuICAgICAgICByZWNvcmRGaWVsZFNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkLWluZm8tZnNcIik7XG5cbiAgICAvLyBTdWJtaXQgYW5kIHJlc2V0IFwiTmV3IEFsYnVtXCIgZm9ybVxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBfc3VibWl0TmV3QWxidW0pO1xuICAgIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHJlc2V0KCk7XG4gICAgICAgIGlmIChtb2RhbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIikgPT09IFwiZWRpdFwiKSBtb2RhbENvbnRyb2xsZXIuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIC8vIEVuYWJsZSBjaGVja2JveGVzIHdoZW4gdXNlciBjbGlja3MgYnV0dG9uIGFuZCBkaXNhYmxlIHdoZW4gbm90XG4gICAgb3duc1RydWUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBfZW5hYmxlUmVjb3JkRmllbGRzZXQpO1xuICAgIG93bnNGYWxzZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIF9kaXNhYmxlUmVjb3JkRmllbGRzZXQpO1xuXG4gICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgX2Rpc2FibGVSZWNvcmRGaWVsZHNldCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9kaXNhYmxlUmVjb3JkRmllbGRzZXQoKSB7XG4gICAgICAgIC8qIERpc2FibGUgc2Vjb25kIGZpZWxkc2V0ICAoUmVjb3JkIGluZm8pICovXG4gICAgICAgIHJlY29yZEZpZWxkU2V0LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIHJlY29yZEZpZWxkU2V0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZW5hYmxlUmVjb3JkRmllbGRzZXQoKSB7XG4gICAgICAgIC8qIEVuYWJsZSBzZWNvbmQgZmllbGRzZXQgIChSZWNvcmQgaW5mbykgKi9cbiAgICAgICAgcmVjb3JkRmllbGRTZXQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgcmVjb3JkRmllbGRTZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfc3VibWl0TmV3QWxidW0oZSkge1xuICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgc3VibWl0IGFjdGlvblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBhbGJ1bSBvYmplY3QgYW5kIGFkZCBpdCB0byB0aGUgbGlicmFyeVxuICAgICAgICBjb25zdCBuZXdBbGJ1bSA9IEFsYnVtKF9wcm9jZXNzTmV3QWxidW1Gb3JtKCkpO1xuXG4gICAgICAgIGNvbnN0IG1vZGUgPSBtb2RhbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIik7XG4gICAgICAgIGNvbnN0IGlkID0gbW9kYWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1hbGJ1bS1pZFwiKTtcblxuICAgICAgICBpZiAobW9kZSA9PT0gXCJuZXdcIikge1xuICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG11c2ljTGlicmFyeS5lZGl0QWxidW0oaWQsIG5ld0FsYnVtKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDbG9zZSBmb3JtIG1vZGFsXG4gICAgICAgIG1vZGFsQ29udHJvbGxlci5jbG9zZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9wcm9jZXNzTmV3QWxidW1Gb3JtKCkge1xuICAgICAgICAvKiBQcm9jZXNzIG5ldyBhbGJ1bSBmb3JtIHRvIHBhc3MgaXQgdG8gbmV3IGFsYnVtICovXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcblxuICAgICAgICBsZXQgZm9ybUNvbnRlbnQgPSBPYmplY3QuZnJvbUVudHJpZXMoZm9ybURhdGEuZW50cmllcygpKTtcblxuICAgICAgICBmb3JtQ29udGVudFtcIm93bmVkXCJdID0gZm9ybUNvbnRlbnRbXCJvd25lZFwiXSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGZvcm1Db250ZW50W1wiZmF2b3JpdGVcIl0gPVxuICAgICAgICAgICAgZm9ybUNvbnRlbnRbXCJmYXZvcml0ZVwiXSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGZvcm1Db250ZW50W1wiZm9ybWF0XCJdID0gZm9ybURhdGEuZ2V0QWxsKFwiZm9ybWF0XCIpO1xuXG4gICAgICAgIHJldHVybiBmb3JtQ29udGVudDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXNldCxcbiAgICB9O1xufSkoKTtcblxudmFyIGFydGlzdFN1Z2dlc3Rpb25zID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWFydGlzdFwiKSxcbiAgICAgICAgZHJvcGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpLFxuICAgICAgICBsaXN0ID0gZHJvcGRvd24uZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAvLyBTdWdnZXN0IGFydGlzdHMgd2hlbiBpbnB1dGluZyB2YWx1ZXMgb3Igd2hlbiBjbGlja2luZyBpbiBpbnB1dFxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBfcmVuZGVyKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgX3JlbmRlcik7XG5cbiAgICAvLyBDbG9zZSBzdWdnZXN0aW9ucyBkaXYgd2hlbiBjbGlja2luZyBvdXRzaWRlIHN1Z2dlc3Rpb24gYm94XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9jbG9zZSwgdHJ1ZSk7XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyKHN1Z2dlc3RlZEFydGlzdHMpIHtcbiAgICAgICAgY29uc3QgaW5wdXRWYWx1ZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAvLyBJZiB1c2VyIGNsZWFycyBpbnB1dCwgZGlzcGxheSBwbGFjZWhvbGRlciBhbmQgY2xvc2Ugc3VnZ2VzdGlvbnNcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGlucHV0LnBsYWNlaG9sZGVyID0gaW5wdXQucGxhY2Vob2xkZXI7XG4gICAgICAgICAgICBfY2xvc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG11c2ljTGlicmFyeS5nZXRBbGJ1bUxpc3QoKS5tYXAoKGFsYnVtKSA9PiBhbGJ1bS5hcnRpc3QpO1xuICAgICAgICAvLyBDb21wdXRlIGFydGlzdCBzdWdnZXN0aW9ucyBnaXZlbiB0aGUgY3VycmVudCBhbGJ1bXMgaW4gdGhlIGxpYnJhcnlcbiAgICAgICAgdmFyIHN1Z2dlc3Rpb25zID0gbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLnJlZHVjZSgoc3VnZywgYWxidW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFydGlzdCA9IGFsYnVtLmFydGlzdDtcbiAgICAgICAgICAgIGlmIChhcnRpc3QudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhpbnB1dFZhbHVlLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgIGlmIChzdWdnLmluZGV4T2YoYXJ0aXN0KSA9PT0gLTEpIHN1Z2cucHVzaChhcnRpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN1Z2c7XG4gICAgICAgIH0sIFtdKTtcbiAgICAgICAgaWYgKCFzdWdnZXN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIEhpZGUgZHJvcGRvd24gaWYgbm90IHN1Z2dlc3Rpb25zXG4gICAgICAgICAgICBfY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZWZyZXNoIGRpdiBhbmQgZGlzcGxheSBuZXcgc3VnZ2VzdGlvbnNcbiAgICAgICAgZHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgX2NsZWFyKCk7XG5cbiAgICAgICAgLy8gUmVnZXggdG8gaGlnaGxpZ2h0IG1hdGNoXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgKC4qKSgke2lucHV0VmFsdWV9KSguKilgLCBcImlcIik7XG4gICAgICAgIHN1Z2dlc3Rpb25zLmZvckVhY2goKGFydGlzdCkgPT4ge1xuICAgICAgICAgICAgLy8gRm9yIGVhY2ggc3VnZ2VzdGlvbiBhZGQgbGlzdCBlbGVtZW50IGhpZ2hsaWdodGluZyBtYXRjaFxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGFydGlzdC5tYXRjaChyZWdleCk7XG5cbiAgICAgICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gYCR7bWF0Y2hbMV19PHN0cm9uZz4ke21hdGNoWzJdfTwvc3Ryb25nPiR7bWF0Y2hbM119YDtcbiAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byBzZWxlY3Qgc3VnZ2VzdGlvblxuICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2lucHV0U3VnZ2VzdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jbGVhcigpIHtcbiAgICAgICAgLyogRGVsZXRlIGFsbCBzdWdnZXN0aW9ucyAqL1xuICAgICAgICB3aGlsZSAobGlzdC5sYXN0RWxlbWVudENoaWxkKSB7XG4gICAgICAgICAgICBsaXN0Lmxhc3RFbGVtZW50Q2hpbGQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2xvc2UoZSA9IG51bGwpIHtcbiAgICAgICAgLyogSGlkZSBzdWdnZXN0aW9ucyBib3ggKi9cbiAgICAgICAgLy8gRG8gbm90IHJlZ2lzdGVyIGNsaWNrcyBpbiB0aGUgaW5wdXQgYm94XG4gICAgICAgIGlmIChlICYmIGUudGFyZ2V0ID09PSBpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIElmIHRoZSBkcm9wZG93biBpcyBhbHJlYWR5IGhpZGRlbiBkbyBub3RoaW5nXG4gICAgICAgIGlmICghZHJvcGRvd24uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZGVuXCIpKSB7XG4gICAgICAgICAgICBfY2xlYXIoKTtcbiAgICAgICAgICAgIGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfaW5wdXRTdWdnZXN0aW9uKCkge1xuICAgICAgICAvKiBDaG9vc2Ugc2VsZWN0ZWQgaXRlbSBhbmQgYWRkIGl0IHRvIHRoZSBpbnB1dCAqL1xuICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMudGV4dENvbnRlbnQ7XG5cbiAgICAgICAgX2Nsb3NlKCk7XG4gICAgfVxufSkoKTtcbiIsImltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzLmpzXCI7XG5pbXBvcnQgbXVzaWNMaWJyYXJ5IGZyb20gXCIuL2xpYnJhcnkuanNcIjtcbmltcG9ydCB7IGZpbHRlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9maWx0ZXIuanNcIjtcblxuY29uc3QgbGFuZyA9IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2Uuc2xpY2UoMCwgMik7XG5cbnZhciB0YWJsZVZpZXcgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlID4gdGJvZHlcIik7XG5cbiAgICBldmVudHMub24oXCJhbGJ1bUFkZGVkXCIsIF91cGRhdGUpO1xuICAgIGV2ZW50cy5vbihcImFsYnVtRWRpdGVkXCIsIF91cGRhdGUpO1xuICAgIGV2ZW50cy5vbihcImxpYnJhcnlTb3J0ZWRcIiwgX3VwZGF0ZSk7XG4gICAgZXZlbnRzLm9uKFwiZmlsdGVyQXBwbGllZFwiLCBfdXBkYXRlKTtcbiAgICBldmVudHMub24oXCJyZW1vdmVSb3dcIiwgX3JlbW92ZVJvdyk7XG5cbiAgICBmdW5jdGlvbiBfdXBkYXRlKCkge1xuICAgICAgICBfY2xlYXIoKTtcbiAgICAgICAgX3JlbmRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXIoKSB7XG4gICAgICAgIC8vIEFwcGx5IGN1cnJlbnQgZmlsdGVyIHRvIGFsYnVtIGxpc3RcbiAgICAgICAgbXVzaWNMaWJyYXJ5LmdldEFsYnVtTGlzdCgpLmZvckVhY2goKGFsYnVtKSA9PiB7XG4gICAgICAgICAgICBfcmVuZGVyQWxidW0oYWxidW0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2xlYXIoKSB7XG4gICAgICAgIC8qIFJlbW92ZSBhbGwgcm93cyBpbiB0aGUgdGFibGUgKi9cbiAgICAgICAgd2hpbGUgKGNvbnRlbnRzLmxhc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgICAgICAgIGNvbnRlbnRzLmxhc3RFbGVtZW50Q2hpbGQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVtb3ZlUm93KGlkKSB7XG4gICAgICAgIC8vIEFzayBjb25maXJtYXRpb24gYmVmb3JlIHJlbW92aW5nIGFsYnVtXG4gICAgICAgIGNvbnN0IGNvbmZpcm1EZWxldGUgPVxuICAgICAgICAgICAgbGFuZyA9PT0gXCJlc1wiXG4gICAgICAgICAgICAgICAgPyBcIsK/RXN0w6FzIHNlZ3VybyBkZSBxdWUgcXVpZXJlIGJvcnJhciBlc3RlIMOhbGJ1bT9cIlxuICAgICAgICAgICAgICAgIDogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgYWxidW0/XCI7XG4gICAgICAgIGlmICghY29uZmlybShjb25maXJtRGVsZXRlKSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIFJlbW92ZSByb3cgYW5kIGFsYnVtIGZyb20gbGlicmFyeVxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGB0cltkYXRhLWlkPSR7aWR9XWApO1xuXG4gICAgICAgIGNvbnRlbnRzLnJlbW92ZUNoaWxkKHJvdyk7XG4gICAgICAgIG11c2ljTGlicmFyeS5kZWxldGVBbGJ1bShpZCk7XG4gICAgICAgIF9jb2xsYXBzZUV4dHJhSW5mbygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJBbGJ1bShhbGJ1bSkge1xuICAgICAgICAvLyBBcHBseSBmaWx0ZXIuIElmIGZhbHNlIGRvIG5vdCByZW5kZXJcbiAgICAgICAgaWYgKCF0YWJsZUNvbnRyb2xsZXIuZmlsdGVyQWxidW0oYWxidW0pKSByZXR1cm47XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHJvdyBmb3IgdGhlIGFsYnVtXG4gICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICAgICAgLy8gU2V0IGFsYnVtIGF0dHJpYnV0ZSBhcyB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHJvd1xuICAgICAgICByb3cuY2xhc3NMaXN0LmFkZChcImFsYnVtLXJvd1wiKTtcbiAgICAgICAgcm93LnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgYWxidW0uaWQpO1xuXG4gICAgICAgIC8vIEFkZCBhbGJ1bSBvcHRpb25zIGljb24gKHRocmVlIGRvdHMpXG4gICAgICAgIGNvbnN0IG9wdGlvbnNCdXR0b24gPSBfYXBwZW5kT3B0aW9uc0J1dHRvbihyb3cpO1xuICAgICAgICByb3cuYXBwZW5kKG9wdGlvbnNCdXR0b24pO1xuICAgICAgICBvcHRpb25zQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIG9wdGlvbnNNb2RhbC5vcGVuKGUueCwgZS55LCBhbGJ1bSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCBhbGJ1bSBpbmZvXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXG4gICAgICAgICAgICBcInRpdGxlXCIsXG4gICAgICAgICAgICBcImFydGlzdFwiLFxuICAgICAgICAgICAgXCJyZWxlYXNlX3llYXJcIixcbiAgICAgICAgICAgIFwib3duZWRcIixcbiAgICAgICAgICAgIFwiZmF2b3JpdGVcIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wIG9mIGNvbHVtbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuXG4gICAgICAgICAgICBsZXQgaWNvblBhdGggPSB7XG4gICAgICAgICAgICAgICAgb3duZWQ6IHsgdHJ1ZTogXCJjaGVjay5zdmdcIiwgZmFsc2U6IFwiY2xvc2UtcmVkLnN2Z1wiIH0sXG4gICAgICAgICAgICAgICAgZmF2b3JpdGU6IHsgdHJ1ZTogXCJoZWFydC5zdmdcIiwgZmFsc2U6IFwiYmxhbmsuc3ZnXCIgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBwYXRoO1xuICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm93bmVkXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImZhdm9yaXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIC8vIFRyYW5zbGF0ZSBcInRydWVcIiBvciBcImZhbHNlXCIgdG8gaWNvbiByZXByLiBhY2NvcmRpbmdseVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKFwiY2VsbC1pY29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSBcImZhdm9yaXRlXCIpIGljb24uY2xhc3NMaXN0LmFkZChcImZhdi1pY29uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBpY29uUGF0aFtwcm9wXVthbGJ1bVtwcm9wXV07XG4gICAgICAgICAgICAgICAgICAgIGljb24uc3JjID0gXCIuLi9pbWFnZXMvXCIgKyBwYXRoO1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGFDZWxsLmFwcGVuZENoaWxkKGljb24pO1xuXG4gICAgICAgICAgICAgICAgICAgIGljb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbXVzaWNMaWJyYXJ5LmVkaXRBbGJ1bURldGFpbHMoYWxidW0uaWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcHJvcF06ICFhbGJ1bVtwcm9wXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgZGF0YUNlbGwudGV4dENvbnRlbnQgPSBhbGJ1bVtwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoZGF0YUNlbGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwZW5kIG5ldyByb3dcbiAgICAgICAgY29udGVudHMuYXBwZW5kQ2hpbGQocm93KTtcblxuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRSb3cgPSByb3cubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgIF9jb2xsYXBzZUV4dHJhSW5mbygpO1xuICAgICAgICAgICAgLy8gQ2xvc2UgYW55IG9wZW5lZCBleHRyYS1pbmZvIHBhbmVsc1xuICAgICAgICAgICAgLy8gSWYgdGhlIHJvdyBoYWQgYW4gZXh0cmEtaW5mbyBwYW5lbCB0aGVuXG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIChlZmZlY3RpdmVseSBjbG9zaW5nIGl0KVxuICAgICAgICAgICAgaWYgKG5leHRSb3cgJiYgbmV4dFJvdy5jbGFzc0xpc3QuY29udGFpbnMoXCJleHRyYS1pbmZvXCIpKSByZXR1cm47XG4gICAgICAgICAgICBfcmVuZGVyRXh0cmFJbmZvKGFsYnVtLCByb3cpO1xuICAgICAgICB9KTtcblxuICAgICAgICBldmVudHMuZW1pdChcInJvd0FkZGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jb2xsYXBzZUV4dHJhSW5mbygpIHtcbiAgICAgICAgY29uc3QgZXh0cmFSb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5leHRyYS1pbmZvXCIpO1xuXG4gICAgICAgIGV4dHJhUm93cy5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgICAgIHJvdy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHJvdyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJFeHRyYUluZm8oYWxidW0sIHJvdykge1xuICAgICAgICBjb25zdCBleHRyYUluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgIGV4dHJhSW5mby5jbGFzc0xpc3QuYWRkKFwiZXh0cmEtaW5mb1wiKTtcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIGRhdGFDZWxsLnNldEF0dHJpYnV0ZShcImNvbHNwYW5cIiwgNSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJpbmZvLWNvbnRhaW5lclwiKTtcblxuICAgICAgICBjb25zdCBhbGJ1bUphY2tldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIGFsYnVtSmFja2V0LnNldEF0dHJpYnV0ZShcInNyY1wiLCBhbGJ1bS5qYWNrZXQpO1xuICAgICAgICBhbGJ1bUphY2tldC5jbGFzc0xpc3QuYWRkKFwiamFja2V0XCIpO1xuXG4gICAgICAgIGNvbnN0IGdlbmVyYWxJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZ2VuZXJhbEluZm8uY2xhc3NMaXN0LmFkZChcImdlbmVyYWwtaW5mb1wiKTtcbiAgICAgICAgX3JlbmRlckdlbmVyYWxJbmZvKGdlbmVyYWxJbmZvLCBhbGJ1bSk7XG5cbiAgICAgICAgY29uc3QgcmVjb3JkSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHJlY29yZEluZm8uY2xhc3NMaXN0LmFkZChcInJlY29yZC1pbmZvXCIpO1xuICAgICAgICBpZiAoYWxidW0ub3duZWQpIF9yZW5kZXJSZWNvcmRJbmZvKHJlY29yZEluZm8sIGFsYnVtKTtcblxuICAgICAgICBjb250YWluZXIuYXBwZW5kKGFsYnVtSmFja2V0KTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChnZW5lcmFsSW5mbyk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQocmVjb3JkSW5mbyk7XG5cbiAgICAgICAgZGF0YUNlbGwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICAgZXh0cmFJbmZvLmFwcGVuZENoaWxkKGRhdGFDZWxsKTtcblxuICAgICAgICAvLyBJbnNlcnQgYWZ0ZXJcbiAgICAgICAgcm93LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGV4dHJhSW5mbywgcm93Lm5leHRTaWJsaW5nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyR2VuZXJhbEluZm8oY29udGFpbmVyLCBhbGJ1bSkge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImdlbnJlXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiR8OpbmVyb1wiIDogXCJHZW5yZVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJ0b3BSUzFcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUb3A1MDAgKFJTMSlcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwidG9wUlMzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVG9wNTAwIChSUzMpXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgdXJscyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiZGlzY29nc1wiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRpc2NvZ3NcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwid2lraXBlZGlhXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiV2lraXBlZGlhXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgZmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke2ZpZWxkLmxhYmVsfTwvc3Ryb25nPjogJHtcbiAgICAgICAgICAgICAgICBhbGJ1bVtmaWVsZC5rZXldXG4gICAgICAgICAgICB9YDtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB1cmxzLmZvckVhY2goKHVybCkgPT4ge1xuICAgICAgICAgICAgbGV0IGhyZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgIGhyZWYuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBhbGJ1bVt1cmwua2V5XSk7XG4gICAgICAgICAgICBocmVmLmlubmVySFRNTCA9IGA8c3Ryb25nPiR7dXJsLmxhYmVsfTwvc3Ryb25nPmA7XG4gICAgICAgICAgICBocmVmLnNldEF0dHJpYnV0ZShcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhyZWYpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVuZGVyUmVjb3JkSW5mbyhjb250YWluZXIsIGFsYnVtKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiY2F0YWxvZ19udW1cIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJOwrogQ2F0w6Fsb2dvXCIgOiBcIkNhdGFsb2cgI1wiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJyZWNvcmRfbGFiZWxcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJTZWxsb1wiIDogXCJMYWJlbFwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiUGHDrXNcIiA6IFwiQ291bnRyeVwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJlZGl0aW9uX3llYXJcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJBw7FvIEVkaWNpw7NuXCIgOiBcIkVkaXRpb25cIixcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwibWF0cml4XCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiTWF0cml6XCIgOiBcIk1hdHJpeFwiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjb25kaXRpb25cIixcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFuZyA9PT0gXCJlc1wiID8gXCJFc3RhZG9cIiA6IFwiQ29uZGl0aW9uXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcIm5vdGVzXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGxhbmcgPT09IFwiZXNcIiA/IFwiT2JzLlwiIDogXCJOb3Rlc1wiLFxuICAgICAgICAgICAgICAgIGljb246IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIGxldCBmb3JtYXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgY29uc3QgZm9ybWF0TGFiZWwgPSBsYW5nID09PSBcImVzXCIgPyBcIkZvcm1hdG9cIiA6IFwiRm9ybWF0XCI7XG4gICAgICAgIGZvcm1hdC5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke2Zvcm1hdExhYmVsfTwvc3Ryb25nPjogJHthbGJ1bS5yZWNvcmRfZm9ybWF0fSAoJHthbGJ1bS5hbGJ1bV9mb3JtYXR9KWA7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmb3JtYXQpO1xuXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHRleHQuaW5uZXJIVE1MID0gYDxzdHJvbmc+JHtmaWVsZC5sYWJlbH08L3N0cm9uZz46ICR7XG4gICAgICAgICAgICAgICAgYWxidW1bZmllbGQua2V5XVxuICAgICAgICAgICAgfWA7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FwcGVuZE9wdGlvbnNCdXR0b24ocm93KSB7XG4gICAgICAgIC8vIENyZWF0ZSB0cmFzaGNhbiBidXR0b24gYW5kIGFwcGVuZCBpdCB0byByb3dcbiAgICAgICAgY29uc3QgZGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cbiAgICAgICAgZGF0YUNlbGwuY2xhc3NMaXN0LmFkZChcImFsYnVtLW9wdGlvbnNcIik7XG5cbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4uL2ltYWdlcy9kb3RzLXZlcnRpY2FsLnN2Z1wiKTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjZWxsLWljb25cIik7XG4gICAgICAgIGJ1dHRvbi50aXRsZSA9IGxhbmcgPT09IFwiZXNcIiA/IFwiT3BjaW9uZXNcIiA6IFwiQWxidW0gT3B0aW9uc1wiO1xuICAgICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cbiAgICAgICAgZGF0YUNlbGwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgICAgICAvLyBDb25uZWN0IG5ldyByb3cgc28gdGhhdCByZW1vdmUtaWNvbiBvbmx5IGFwcGVhcnMgb24gaG92ZXJcbiAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIH0pO1xuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGF0YUNlbGw7XG4gICAgfVxufSkoKTtcblxudmFyIHRhYmxlQ29udHJvbGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY29udGVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGFibGUgPiB0Ym9keVwiKSxcbiAgICAgICAgc29ydGFibGVIZWFkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRhYmxlIHRoLnNvcnRhYmxlXCIpO1xuICAgIHZhciBjdXJyU29ydGluZyA9IHsgYnk6IFwidGl0bGVcIiwgb3JkOiBcImFzY1wiIH07XG5cbiAgICBzb3J0YWJsZUhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX3NvcnRUYWJsZSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBfc29ydFRhYmxlKGUpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBuZXdTb3J0QnkgPSBoZWFkZXIuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgICAgIGNvbnN0IHsgYnk6IHNvcnRCeSwgb3JkOiBzb3J0T3JkIH0gPSBjdXJyU29ydGluZztcblxuICAgICAgICAvLyBJZiBzb3J0aW5nIG5ldyByb3cgZmxpcCByb3cgb3JkZXIsIGVsc2Ugcm93IG9yZGVyIGFzIGFzYyBhcyBkZWZhdWx0XG4gICAgICAgIGlmIChuZXdTb3J0QnkgPT09IHNvcnRCeSkge1xuICAgICAgICAgICAgY3VyclNvcnRpbmcub3JkID0gc29ydE9yZCA9PT0gXCJhc2NcIiA/IFwiZGVzY1wiIDogXCJhc2NcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJTb3J0aW5nLmJ5ID0gbmV3U29ydEJ5O1xuICAgICAgICAgICAgY3VyclNvcnRpbmcub3JkID0gXCJhc2NcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvcnQgbGlicmFyeSBhbGJ1bXM7XG4gICAgICAgIG11c2ljTGlicmFyeS5zb3J0KGN1cnJTb3J0aW5nKTtcblxuICAgICAgICAvLyBSZW1vdmUgYWxsIHNvcnRpbmcgYXJyb3dzIGFuZCBkaXNwbGF5IHRoZSBjb3JyZXNwb25kaW5nIG9uZVxuICAgICAgICBfaGlkZVNvcnRpbmdBcnJvd3MoKTtcbiAgICAgICAgX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW5kZXJTb3J0aW5nQXJyb3coaGVhZGVyKSB7XG4gICAgICAgIC8qIEFkZCBzb3J0aW5nIGFycm93cyB3aXRoIHRoZSBjb3JyZXBzb25kaW5nIG9yZGVyIGluIHRoZSBjbGlja2VkIGhlYWRlciAqL1xuICAgICAgICBjb25zdCBzb3J0QXJyb3cgPSBoZWFkZXIucXVlcnlTZWxlY3RvcihcIi5zb3J0LWFycm93XCIpO1xuXG4gICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QuYWRkKGN1cnJTb3J0aW5nLm9yZCk7XG4gICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9oaWRlU29ydGluZ0Fycm93cygpIHtcbiAgICAgICAgLyogUmVtb3ZlIGFsbCBzb3J0aW5nIGFycm93cyBmb3JtIGFsbCBoZWFkZXJzICovXG4gICAgICAgIHNvcnRhYmxlSGVhZGVycy5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRBcnJvdyA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwiLnNvcnQtYXJyb3dcIik7XG5cbiAgICAgICAgICAgIHNvcnRBcnJvdy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgc29ydEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NcIik7XG4gICAgICAgICAgICBzb3J0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZShcImRlc2NcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZXNldFNvcnRpbmcoKSB7XG4gICAgICAgIGN1cnJTb3J0aW5nID0geyBieTogXCJ0aXRsZVwiLCBvcmQ6IFwiYXNjXCIgfTtcblxuICAgICAgICBfaGlkZVNvcnRpbmdBcnJvd3MoKTtcbiAgICAgICAgX3JlbmRlclNvcnRpbmdBcnJvdyhoZWFkZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckFsYnVtKGFsYnVtKSB7XG4gICAgICAgIHZhciBjdXJyRmlsdGVyID0gZmlsdGVyQ29udHJvbGxlci5nZXRDdXJyZW50RmlsdGVyKCk7XG4gICAgICAgIHZhciB7IHR5cGU6IGZpbHRlclR5cGUsIHZhbHVlOiBmaWx0ZXJWYWx1ZSB9ID0gY3VyckZpbHRlcjtcblxuICAgICAgICAvLyBSZXNldCBkaXNwbGF5IGlmIG5vIGZpbHRlciBhcHBseSAoaW5wdXQgZW1wdHkpIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKGZpbHRlclZhbHVlID09PSBcIlwiKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBzd2l0Y2ggKGZpbHRlclR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcInRpdGxlXCJdXG4gICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgIC5pbmNsdWRlcyhmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIGNhc2UgXCJhcnRpc3RcIjpcbiAgICAgICAgICAgICAgICAvLyBNYXRjaCBhbnkgb2YgdGhlIGNvbW1hIHNlcGFyYXRlZCBtYXRjaGVzXG4gICAgICAgICAgICAgICAgY29uc3QgYXJ0aXN0TGlzdCA9IGZpbHRlclZhbHVlLnNwbGl0KC9cXHMqWyw7XVxccyovKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJ0aXN0TGlzdC5zb21lKChhcnRpc3QpID0+XG4gICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiYXJ0aXN0XCJdLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoYXJ0aXN0LnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWxlYXNlX3llYXJcIjpcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2ggPSAocmVnZXgpID0+IGZpbHRlclZhbHVlLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgICAgICAvLyBSZWdleCBmb3IgeWVhciBmb3IgZGlmZmVyZW50IHJlbGVhc2UgeWVhciBmaWx0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleEVxID0gL15cXHMqKFxcZCspXFxzKiQvLCAvLyBTaW5nbGUgeWVhciB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICByZWdleEd0ID0gLyg/Ol4+XFxzPyhcXGQrKSQpLywgLy8gR3JlYXRlciB0aGFuXG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4THQgPSAvKD86XjxcXHM/KFxcZCspJCkvLCAvLyBMb3dlciB0aGFuXG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4QnR3ID0gLyg/Ol4oXFxkKylcXHM/Wy0sLztdXFxzPyhcXGQrKSQpLzsgLy9Ud28gdmFsdWVzIGludGVydmFsXG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gocmVnZXhFcSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID09IG1hdGNoKHJlZ2V4RXEpWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2gocmVnZXhHdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdID49IG1hdGNoKHJlZ2V4R3QpWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2gocmVnZXhMdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdIDw9IG1hdGNoKHJlZ2V4THQpWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2gocmVnZXhCdHcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bVtcInJlbGVhc2VfeWVhclwiXSA+PSBtYXRjaChyZWdleEJ0dylbMV0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wicmVsZWFzZV95ZWFyXCJdIDw9IG1hdGNoKHJlZ2V4QnR3KVsyXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgXCJvd25lZFwiOlxuICAgICAgICAgICAgICAgIC8vIEFsbG93IHRoZSB1c2Ugb2YgZGlmZmVyZW50IHdvcmRzIGZvciB0cnVlIGFuZCBmYWxzZVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSBpblxuICAgICAgICAgICAgICAgICAgICBbXCIxXCIsIFwieWVzXCIsIFwidHJ1ZVwiLCBcIm93blwiLCBcInPDrVwiLCBcInNpXCIsIFwiYWRxXCIsIFwiYWRxdWlyaWRvXCJdXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGJ1bVtcIm93bmVkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbHVlLnRvTG93ZXJDYXNlKCkgaW5cbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmYWxzZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIhb3duZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwid2FudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIhYWRxXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiFhZHF1aXJpZG9cIixcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWFsYnVtW1wib3duZWRcIl07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcImZvcm1hdFwiOlxuICAgICAgICAgICAgICAgIC8vIEluIHRoaXMgZmlsdGVyIFwiK1wiID0gXCJhbmRcIiBhbmQgXCJbLDsvXVwiID0gXCJvclwiXG4gICAgICAgICAgICAgICAgbGV0IGZvcm1hdExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyVmFsdWUuaW5jbHVkZXMoXCIrXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdExpc3QgPSBmaWx0ZXJWYWx1ZS5zcGxpdCgvXFxzKlxcK1xccyovKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdExpc3QuZXZlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAoZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtW1wiZm9ybWF0XCJdLmZpbmRJbmRleChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbC50b0xvd2VyQ2FzZSgpID09PSBmb3JtYXQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXRMaXN0ID0gZmlsdGVyVmFsdWUuc3BsaXQoL1xccypbLDsvXVxccyovKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdExpc3Quc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChmb3JtYXQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1bXCJmb3JtYXRcIl0uZmluZEluZGV4KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gRWxzZSBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBmaWx0ZXJBbGJ1bSxcbiAgICB9O1xufSkoKTtcblxudmFyIG9wdGlvbnNNb2RhbCA9IChmdW5jdGlvbiAoYWxidW0pIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9ucy1tb2RhbFwiKTtcblxuICAgIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIGNsb3NlKTtcblxuICAgIGZ1bmN0aW9uIG9wZW4oeCwgeSwgYWxidW0pIHtcbiAgICAgICAgY29uc3QgZWRpdEFsYnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LWFsYnVtXCIpLFxuICAgICAgICAgICAgZGVsQWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1hbGJ1bVwiKTtcblxuICAgICAgICBfcmVuZGVyKHgsIHkpO1xuICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG4gICAgICAgIGVkaXRBbGJ1bS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgZXZlbnRzLmVtaXQoXCJlZGl0QWxidW1cIiwgYWxidW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZWxBbGJ1bS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgZXZlbnRzLmVtaXQoXCJyZW1vdmVSb3dcIiwgYWxidW0uaWQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgY29uc3QgZWRpdEFsYnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LWFsYnVtXCIpLFxuICAgICAgICAgICAgZGVsQWxidW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1hbGJ1bVwiKTtcblxuICAgICAgICBlZGl0QWxidW0ucmVwbGFjZVdpdGgoZWRpdEFsYnVtLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIGRlbEFsYnVtLnJlcGxhY2VXaXRoKGRlbEFsYnVtLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlbmRlcih4LCB5KSB7XG4gICAgICAgIG1vZGFsLnN0eWxlLmxlZnQgPSB4IC0gNSArIFwicHhcIjtcbiAgICAgICAgbW9kYWwuc3R5bGUudG9wID0geSAtIDUgKyBcInB4XCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgb3BlbixcbiAgICB9O1xufSkoKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi90YWJsZS5qc1wiXG5pbXBvcnQgXCIuL2ZpbHRlci5qc1wiXG5pbXBvcnQgXCIuL21vZGFsLmpzXCJcbmltcG9ydCBcIi4vbG9hZGVyLmpzXCJcblxuaW1wb3J0IG11c2ljTGlicmFyeSBmcm9tIFwiLi9saWJyYXJ5LmpzXCI7XG5pbXBvcnQgQWxidW0gZnJvbSBcIi4vYWxidW0uanNcIjtcblxudmFyIHNhbXBsZSA9IHJlcXVpcmUoXCIuLi9hbGJ1bV9zYW1wbGUuanNvblwiKVxuXG5mb3IgKGNvbnN0IGtleSBpbiBzYW1wbGUpIHtcbiAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoc2FtcGxlLCBrZXkpKSB7XG4gICAgICAgIHZhciBuZXdBbGJ1bSA9IEFsYnVtKHNhbXBsZVtrZXldKTtcbiAgICAgICAgbXVzaWNMaWJyYXJ5LmFkZEFsYnVtKG5ld0FsYnVtKTtcbiAgICB9XG59XG5cbmNvbnNvbGUubG9nKHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2Uuc2xpY2UoMCwgMikpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=