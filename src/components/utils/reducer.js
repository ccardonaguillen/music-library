import Album from '../Album';
import { filterAlbum } from './libraryFilter';

function libraryReducer(library, action) {
    const { type, id, info, entries, filter } = action;

    switch (type) {
        case 'reset':
            return [];
        case 'added':
            return [Album(info), ...library];
        case 'removed':
            return library.filter((album) => album.id !== id);
        case 'edited':
            return library.map((album) => (id === album.id ? { ...album, ...info } : album));
        case 'filter':
            return library.filter((album) => filterAlbum(album, filter));

        default:
            return library;
    }
}

function addAlbum(info) {}

export { libraryReducer };
