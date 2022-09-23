var summaryView = (function () {
    const summary = document.getElementById("entries-count"),
        tableContents = document.querySelector("table > tbody");

    events.on("filterApplied", _render);
    events.on("albumAdded", _render);
    events.on("albumDeleted", _render);

    function _render() {
        const totalEntries = musicLibrary.getAlbumList().length, // Length of library list
            shownEntries = tableContents.childElementCount; // Number of rows in table

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

    filterSelect.addEventListener("change", _renderPlaceholder);
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
        events.emit("filterApplied", currFilter);
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

    function _resetFilter() {
        /* Reset filter when the input box is empty and apply empty filter */
        if (filterValue.value === "") {
            _renderPlaceholder();
            _applyFilter();
        }
    
        return false;
    }    

    return {
        getCurrentFilter,
    }
})();

/*
filterForm = document.getElementById("filter-by"),
    filterSelect = document.getElementById("filter"),
    filterValue = document.getElementById("filter-value"),
    entriesCount = document.getElementById("entries-count");

filterForm.addEventListener("submit", applyFilter);
filterSelect.addEventListener("change", selectFilter);
filterValue.addEventListener("input", resetFilter);


function filterAlbums(album) {
    let { type: filterType, value: filterValue } = currFilter;

    // Reset display if no filter apply (input empty) do nothing
    if (filterValue === "") return true;

    switch (filterType) {
        case "title":
            return album["title"].toLowerCase().includes(filterValue);
        case "artist":
            // Match any of the comma separated matches
            const artistList = filterValue.replaceAll(" ", "").split(/[,;]/);
            return artistList.some((artist) =>
                album["artist"].toLowerCase().includes(artist)
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
                formatList = filterValue.replaceAll(" ", "").split("+");
                return formatList.every(
                    (format) =>
                        album["format"].findIndex(
                            (val) => val.toLowerCase() === format.toLowerCase()
                        ) != -1
                );
            } else {
                formatList = filterValue.replaceAll(" ", "").split(/[,;/]/);
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


function applyFilter(e = null) {
    // Prevent default submit behaviour
    if (e) e.preventDefault();

    // Update current filter with values from the filter form
    currFilter["type"] = filterSelect.value;
    currFilter["value"] = document.getElementById("filter-value").value;

    // Update table
    updateDisplay();
}

function selectFilter() {
    // Update placeholder message according to the selected option 
    const filter = filterSelect.value;
    let placeholder = "";

    switch (filter) {
        case "title":
            placeholder = 'e.g. "submarine"';
            break;
        case "artist":
            placeholder = 'e.g. "zeppelin", "beatles, rolling"';
            break;
        case "release_year":
            placeholder = 'e.g. "1990", "1-2000", ">1900", "<1980"';
            break;
        case "owned":
            placeholder = 'e.g. "true", "no", "not owned"';
            break;
        case "format":
            placeholder = 'e.g. "Vynil", "cd+casette", "vynil/CD"';
    }

    filterValue.setAttribute("placeholder", placeholder);
}

function resetFilter() {
    // Reset filter when the input box is empty and apply empty filter 
    const inputText = this.value;

    if (inputText === "") {
        selectFilter();
        applyFilter();
    }

    return false;
}

*/