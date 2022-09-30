import events from "./events.js";
import musicLibrary from "./library.js";
import { filterController } from "./filter.js";

const lang = window.navigator.language.slice(0, 2);

var tableView = (function () {
    const contents = document.querySelector("table > tbody");

    events.on("albumAdded", _update);
    events.on("albumEdited", _update);
    events.on("librarySorted", _update);
    events.on("filterApplied", _update);
    events.on("removeRow", _removeRow);

    function _update() {
        _clear();
        _render();
    }

    function _render() {
        // Apply current filter to album list
        musicLibrary.getAlbumList().forEach((album) => {
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
        musicLibrary.deleteAlbum(id);
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
                        musicLibrary.editAlbumDetails(album.id, {
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

        events.emit("rowAdded");
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
        musicLibrary.sort(currSorting);
    
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
        var currFilter = filterController.getCurrentFilter();
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
            events.emit("editAlbum", album);
        })

        delAlbum.addEventListener("click", () => {
            events.emit("removeRow", album.id);
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