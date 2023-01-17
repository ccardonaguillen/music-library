let Album = ({
    id,
    title,
    artist,
    released,
    owned,
    favorite,
    genre,
    topRS1,
    topRS3,
    discogs,
    wikipedia,
    record_format,
    album_format,
    catalog_num,
    edition,
    country,
    record_label,
    matrix,
    condition,
    notes,
    jacket,
}) => {
    return {
        // id:
        //     title.toLowerCase().replaceAll(/\W/g, '') +
        //     artist.toLowerCase().replaceAll(/\W/g, '') +
        //     release_year,
        id,
        title,
        artist,
        released,
        owned: Boolean(owned),
        favorite: Boolean(favorite),
        genre: genre || '',
        topRS1: topRS1 || '',
        topRS3: topRS3 || '',
        discogs: discogs || '',
        wikipedia: wikipedia || '',
        record_format: typeof record_format === 'string' ? Array(record_format) : record_format,
        album_format: album_format || '',
        catalog_num: catalog_num || '',
        edition: edition || '',
        country: country || '',
        record_label: record_label || '',
        matrix: matrix || '',
        condition: condition || '',
        notes: notes || 'None',
        jacket: jacket || '',
    };
};

export default Album;
