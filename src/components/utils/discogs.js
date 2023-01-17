async function fetchRelease(release_id) {
    const response = await fetch(`https://api.discogs.com/releases/${release_id}`);
    const json = await response.json();

    const albumInfo = retrieveAlbumInfo(json);
    return albumInfo;
}

function retrieveAlbumInfo(json) {
    const { id, title, artists, released, genres, formats, labels, year, country } = json;

    const albumInfo = {
        title,
        artist: artists[0].name,
        released: released.slice(0, 4),
        genre: genres[0],
        discogs: 'https://www.discogs.com/es/release/' + id,
        record_format: formats[0].descriptions.filter((f) => ['LP', 'EP', 'Single'].includes(f))[0],
        album_format: formats[0].name,
        catalog_num: labels[0].catno,
        edition: year,
        country,
        record_label: labels[0].name,
        // jacket,
    };

    return albumInfo;
}

export { fetchRelease };
