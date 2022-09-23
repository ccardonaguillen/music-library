var Album = ({ title, artist, release_year, owned, format = [] }) => {
    return {
        id: title.toLowerCase().replaceAll(/\W/g, "") +
            artist.toLowerCase().replaceAll(/\W/g, ""),
        title,
        artist,
        release_year,
        owned: Boolean(owned),
        format
    }
};