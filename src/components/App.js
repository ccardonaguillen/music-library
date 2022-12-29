import React, { createContext, useEffect, useReducer, useState } from 'react';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../styles/App.css';
// import sample from '../assets/album_sample.json';

import Credits from './Credits';
import Filter from './Filter';
import Header from './Header';
import Summary from './Summary';
import Table from './Table';
import AlbumModal from './AlbumModal';
import OptionsModal from './OptionsModal';

import libraryReducer from './utils/reducer';
import { filterAlbum } from './utils/libraryFilter';
import {
    loadLibrary,
    findAlbum,
    addAlbum,
    deleteAlbum,
    updateAlbum,
} from './utils/firebaseDatabase';

fontLibrary.add(faPlus);

const CurrentUserContext = createContext(null);

const App = () => {
    const [filter, setFilter] = useState({ by: '', value: '' });
    const [library, updateLibrary] = useReducer(libraryReducer, []);
    const [libraryDisplay, setLibraryDisplay] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [albumModalMode, setAlbumModalMode] = useState({ name: 'new' });
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [optionsModalPos, setOptionsModalPos] = useState({ x: 0, y: 0 });
    const [optionsModalAlbum, setOptionsModalAlbum] = useState('');

    useEffect(() => {
        if (currentUser !== null) loadLibrary(updateLibrary);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLibraryDisplay(
            filter.value === '' ? library : library.filter((album) => filterAlbum(album, filter))
        );
    }, [library, filter]);

    useEffect(() => {
        if (currentUser !== null) {
            loadLibrary(updateLibrary);
        } else {
            updateLibrary({ type: 'reset', payload: {} });
        }
    }, [currentUser]);

    function handleUploadLibrary(e) {
        const fileInput = e.target;

        let reader = new FileReader();
        reader.onload = uploadLibrary;
        reader.readAsText(fileInput.files[0]);
    }

    function uploadLibrary(e) {
        const fileContent = e.target.result;
        const albums = Object.values(JSON.parse(fileContent));

        albums.forEach((info) => handleAddAlbum(info));
    }

    async function handleAddAlbum(info) {
        const match = await findAlbum(info);
        const isInLibrary = match.length > 0;

        if (!isInLibrary) addAlbum(info);
    }

    function handleDeleteAlbum(id) {
        deleteAlbum(id);
        setShowOptionsModal(false);
    }

    function handleEditAlbum({ id, info }) {
        updateAlbum(id, info);
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
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
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
                            onLibraryUploaded={handleUploadLibrary}
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
        </CurrentUserContext.Provider>
    );
};

export default App;
export { CurrentUserContext };
