import Album from '../Album';

function libraryReducer(library, action) {
    const { id, info } = action.payload;

    switch (action.type) {
        case 'reset':
            return [];
        case 'added':
            return [Album({ id, ...info }), ...library];
        case 'removed':
            return library.filter((album) => album.id !== id);
        case 'modified':
            return library.map((album) => (id === album.id ? { ...album, ...info } : album));
        default:
            return library;
    }
}

export default libraryReducer;
