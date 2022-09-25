import events from "./events.js"

var musicLibrary = (function () {
    var albumList = [];

    function getAlbumList() {
        return albumList;
    }

    function addAlbum(newAlbum) {
        /* If the albums exists log error message. If not add at the start */
        if (albumList.every((album) => newAlbum.id !== album.id)) {
            albumList.unshift(newAlbum);
        } else {
            alert("This album already exists.");
            console.log("Album ID: " + newAlbum.id)
        }

        events.emit("albumAdded", newAlbum);
    };

    function deleteAlbum(id) {
        /* Delete album with a given ID */
        albumList = albumList.filter((album) => album.id !== id);

        events.emit("albumDeleted", id);
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

        events.emit("librarySorted");
    }

    return {
        getAlbumList,
        addAlbum,
        deleteAlbum,
        sort
    }
})();

export default musicLibrary

