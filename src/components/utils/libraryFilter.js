function filterAlbum(album, filter) {
    const { by, value } = filter;
    switch (by) {
        case 'title':
            return album['title'].toLowerCase().includes(value.toLowerCase());
        case 'artist':
            // Match any of the comma separated matches
            const artistList = value.split(/\s*[,;]\s*/);
            return artistList.some((artist) =>
                album['artist'].toLowerCase().includes(artist.toLowerCase())
            );
        case 'released':
            let match = (regex) => value.match(regex);
            // Regex for year for different release year filter
            const regexEq = /^\s*(\d+)\s*$/, // Single year value
                regexGt = /(?:^>\s?(\d+)$)/, // Greater than
                regexLt = /(?:^<\s?(\d+)$)/, // Lower than
                regexBtw = /(?:^(\d+)\s?[-,/;]\s?(\d+)$)/; //Two values interval

            if (match(regexEq)) {
                return album['released'] === match(regexEq)[1];
            } else if (match(regexGt)) {
                return album['released'] >= match(regexGt)[1];
            } else if (match(regexLt)) {
                return album['released'] <= match(regexLt)[1];
            } else if (match(regexBtw)) {
                return (
                    album['released'] >= match(regexBtw)[1] &&
                    album['released'] <= match(regexBtw)[2]
                );
            } else {
                return false;
            }

        case 'owned':
            // Allow the use of different words for true and false
            if (
                value.toLowerCase() in ['1', 'yes', 'true', 'own', 'sí', 'si', 'adq', 'adquirido']
            ) {
                return album['owned'];
            } else if (
                value.toLowerCase() in
                ['0', 'no', 'not', 'false', '!owned', 'want', '!adq', '!adquirido']
            ) {
                return !album['owned'];
            } else {
                return true;
            }
        case 'format':
            // In this filter "+" = "and" and "[,;/]" = "or"
            let formatList = [];
            if (value.includes('+')) {
                formatList = value.split(/\s*\+\s*/);
                return formatList.every(
                    (format) =>
                        album['format'].findIndex(
                            (val) => val.toLowerCase() === format.toLowerCase()
                        ) !== -1
                );
            } else {
                formatList = value.split(/\s*[,;/]\s*/);
                return formatList.some(
                    (format) =>
                        album['format'].findIndex(
                            (val) => val.toLowerCase() === format.toLowerCase()
                        ) !== -1
                );
            }
        default:
            // Else do nothing
            return true;
    }
}

export { filterAlbum };
