function parseCSV(string, delimiter = ',') {
    // Commented code in https://stackoverflow.com/questions/1293147/how-to-parse-csv-data
    const objPattern = new RegExp(
        '(\\' +
            delimiter +
            '|\\r?\\n|\\r|^)' + // Delimiters
            '(?:"([^"]*(?:""[^"]*)*)"|' + // Quoted fields
            '([^"\\' +
            delimiter +
            '\\r\\n]*))', // Standard fields
        'gi'
    );

    let arrData = [[]];
    let arrMatches = null;

    while ((arrMatches = objPattern.exec(string))) {
        const strMatchedDelimiter = arrMatches[1];

        if (strMatchedDelimiter.length && strMatchedDelimiter !== delimiter) {
            arrData.push([]);
        }

        let strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(/""/g, '"');
        } else {
            strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}

function csvToObject(csvContent) {
    const props = csvContent[0];

    return csvContent
        .slice(1)
        .map((row) => row.reduce((acc, curr, idx) => ({ ...acc, [props[idx]]: curr }), {}));
}

function parseCollection(fileContent) {
    const csv = parseCSV(fileContent, ';');
    const collection = csvToObject(csv);
    return mapCollectionProps(collection);
}

function mapCollectionProps(collection) {
    const propsMap = {
        title: 'Nombre',
        artist: 'Artista',
        released: 'Año lanzamiento',
        owned: 'Adquirido',
        favorite: 'Favoritos',
        topRS1: 'Top 500 (RS1)',
        topRS3: 'Top 500 (RS3)',
        discogs: 'Link Discogs',
        wikipedia: 'Link Wikipedia',
        record_format: 'Formato',
        album_format: 'Formato vinilo',
        catalog_num: 'Nº Serie',
        edition: 'Año edición',
        country: 'Pais Edicion',
        label: 'Discografica',
        matrix: 'Matriz',
        condition: 'Estado',
        notes: 'Observaciones',
        jacket: 'Caratula',
    };

    return collection.map((entry) =>
        Object.entries(propsMap).reduce((acc, [key, value]) => {
            let propValue;
            switch (key) {
                case 'released':
                case 'edition':
                    propValue = parseInt(entry[value]);
                    break;
                case 'owned':
                case 'favorite':
                    propValue = Boolean(parseInt(entry[value]));
                    break;
                default:
                    propValue = entry[value];
            }

            return { ...acc, [key]: propValue };
        }, {})
    );
}

export { parseCollection };
