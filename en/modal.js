var modal = (function () {
    const overlay = document.querySelector(".modal-overlay"), 
        openButton = document.getElementById("open-modal"),
        closeButton = document.getElementById("close-modal");

    openButton.addEventListener("click", _open);
    closeButton.addEventListener("click", _close);

    events.on("newAlbumFormSubmitted", _close);

    function _open() {
        /* Display form modal over main window and focus on first input */
        overlay.classList.remove("hidden");
        document.getElementById("new-title").focus();
    }
    
    function _close() {
        /* Hide modal */
        overlay.classList.add("hidden");
        events.emit("modalClosed");
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

    events.on("modalClosed", _reset);

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
        events.emit("newAlbumFormSubmitted");
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


