// import { musicLibrary as library } from "./library.js"

let currFilter = { type: "", value: "" };

var tableView = (function () {
    const contents = document.querySelector("table > tbody");

    events.on("albumAdded", _renderAlbum);
    events.on("librarySorted", _update);

    function _update() {
        _clear();
        _render();

    }

    function _render() {
        // Apply current filter to album list
        const albumList = musicLibrary.getAlbumList()//.filter((album) => filterAlbums(album));
        // Display each entry of the album
        albumList.forEach((album) => {
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
                musicLibrary.deleteAlbum(id);
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

    events.on("albumDeleted", _removeRow);

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
})();
