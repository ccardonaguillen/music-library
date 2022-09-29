import events from "./events.js";
import Album from "./album.js";
import musicLibrary from "./library.js";

var modalController = (function () {
    const overlay = document.querySelector(".modal-overlay"), 
        openButton = document.getElementById("open-modal"),
        closeButton = document.getElementById("close-modal"),
        modal = document.querySelector(".modal"),
        header = modal.querySelector("h2"),
        resetButton = document.querySelector('button[type="reset"]');

    openButton.addEventListener("click", () => _open("new"));
    closeButton.addEventListener("click", close);

    events.on("editButtonClicked", album => _open("edit", album));

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
        const newAlbum = Album(_processNewAlbumForm());

        const mode = modal.getAttribute("data-mode");
        const id = modal.getAttribute("data-album-id");

        if (mode === "new") {
            musicLibrary.addAlbum(newAlbum);
        } else {
            musicLibrary.editAlbum(id, newAlbum);
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


