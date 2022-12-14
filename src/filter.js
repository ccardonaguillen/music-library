import events from "./events.js";
import musicLibrary from "./library.js";

const lang = window.navigator.language.slice(0, 2);

var summaryView = (function () {
    const summary = document.getElementById("entries-count"),
        tableContents = document.querySelector("table > tbody");

    events.on("filterApplied", _render);
    events.on("rowAdded", _render);
    events.on("rowDeleted", _render);

    function _render() {
        const totalEntries = musicLibrary.getAlbumList().length, // Length of library list
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
        events.emit("filterApplied", currFilter);
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

export { filterController };
