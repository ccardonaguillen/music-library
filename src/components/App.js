import React, { useEffect, useReducer, useState } from 'react';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../styles/App.css';
import sample from '../assets/album_sample.json';

import Credits from './Credits';
import Filter from './Filter';
import Header from './Header';
import Summary from './Summary';
import Table from './Table';
import AlbumModal from './AlbumModal';
import OptionsModal from './OptionsModal';
import Album from './Album';

fontLibrary.add(faPlus);

function libraryReducer(library, action) {
    const { type, id, info } = action;

    switch (type) {
        case 'added':
            const newAlbum = Album(info);
            if (library.every((album) => newAlbum.id !== album.id)) {
                return [newAlbum, ...library];
            } else {
                // If the album exist log error message
                // alert('This album already exists.');
                console.log('Repeated ID: ' + id);

                return library;
            }

        case 'deleted':
            return library.filter((album) => album.id !== id);

        case 'edited':
            return library.map((album) => (id === album.id ? { ...album, ...info } : album));

        default:
            return library;
    }
}

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
        case 'release_year':
            let match = (regex) => value.match(regex);
            // Regex for year for different release year filter
            const regexEq = /^\s*(\d+)\s*$/, // Single year value
                regexGt = /(?:^>\s?(\d+)$)/, // Greater than
                regexLt = /(?:^<\s?(\d+)$)/, // Lower than
                regexBtw = /(?:^(\d+)\s?[-,/;]\s?(\d+)$)/; //Two values interval

            if (match(regexEq)) {
                return album['release_year'] === match(regexEq)[1];
            } else if (match(regexGt)) {
                return album['release_year'] >= match(regexGt)[1];
            } else if (match(regexLt)) {
                return album['release_year'] <= match(regexLt)[1];
            } else if (match(regexBtw)) {
                return (
                    album['release_year'] >= match(regexBtw)[1] &&
                    album['release_year'] <= match(regexBtw)[2]
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

const App = () => {
    const [filter, setFilter] = useState({ by: '', value: '' });
    const [library, updateLibrary] = useReducer(
        libraryReducer,
        Object.values(sample).map((album) => Album(album))
    );
    const [libraryDisplay, setLibraryDisplay] = useState([]);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [albumModalMode, setAlbumModalMode] = useState({ name: 'new' });
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [optionsModalPos, setOptionsModalPos] = useState({ x: 0, y: 0 });
    const [optionsModalAlbum, setOptionsModalAlbum] = useState('');

    useEffect(() => {
        setLibraryDisplay(
            filter.value === '' ? library : library.filter((album) => filterAlbum(album, filter))
        );
    }, [library, filter]);

    function handleAddAlbum(info) {
        updateLibrary({ type: 'added', info });
    }

    function handleDeleteAlbum(id) {
        updateLibrary({ type: 'deleted', id });
        setShowOptionsModal(false);
    }

    function handleEditAlbum({ id, info }) {
        updateLibrary({ type: 'edited', id, info });
    }

    function handleChangeFilter(newFilter) {
        setFilter(newFilter);
    }

    function displayAlbumModal(mode) {
        setAlbumModalMode(mode);
        setShowAlbumModal(true);
    }

    function hideAlbumModal(e) {
        setShowAlbumModal(false);
    }

    function displayOptionsModal({ event, album }) {
        const x = event.pageX;
        const y = event.pageY;
        setOptionsModalPos({ x, y });
        setOptionsModalAlbum(album);
        setShowOptionsModal(true);
    }

    function hideOptionsModal(e) {
        setShowOptionsModal(false);
    }

    return (
        <div id="App">
            <Header />
            <main>
                <div className="container">
                    <div className="controls-container">
                        <Summary total={library.length} displayed={libraryDisplay.length} />
                        <div className="controls">
                            <Filter onFilterChange={handleChangeFilter} />
                            <button
                                className="interactive dark"
                                id="open-modal"
                                onClick={() => displayAlbumModal({ name: 'new' })}
                            >
                                <FontAwesomeIcon icon="plus" />
                                <p>New album</p>
                            </button>
                        </div>
                    </div>
                    {/* <input type="file" name="file-loader" id="file-loader" className="hidden" /> */}
                    <Table
                        content={libraryDisplay}
                        filter={filter}
                        onOptionsModalOpened={displayOptionsModal}
                        onToggleProp={handleEditAlbum}
                    />
                </div>
            </main>
            <Credits project="music-library" />

            <AlbumModal
                show={showAlbumModal}
                mode={albumModalMode}
                library={library}
                onModalClosed={hideAlbumModal}
                onAlbumAdded={handleAddAlbum}
                onAlbumEdited={handleEditAlbum}
            />
            <OptionsModal
                show={showOptionsModal}
                pos={optionsModalPos}
                album={optionsModalAlbum}
                onModalClosed={hideOptionsModal}
                onAlbumDeleted={handleDeleteAlbum}
                onAlbumEdited={displayAlbumModal}
            />
        </div>
    );
};

export default App;
