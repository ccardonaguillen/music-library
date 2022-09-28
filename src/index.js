import "./table.js"
import "./filter.js"
import "./modal.js"
import "./loader.js"

import musicLibrary from "./library.js";
import Album from "./album.js";

var sample = require("../album_sample.json")

for (const key in sample) {
    if (Object.hasOwnProperty.call(sample, key)) {
        var newAlbum = Album(sample[key]);
        musicLibrary.addAlbum(newAlbum);
    }
}
