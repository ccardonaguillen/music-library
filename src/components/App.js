import React, { createContext, useEffect, useReducer, useState } from 'react';
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
import AlertPopUp from './AlertPopUp';

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
    const [showAlertPopUp, setShowAlertPopUp] = useState(false);
    const [alertContent, setAlertContent] = useState('');

    let alertTimeoutID;

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

        if (!isInLibrary) {
            addAlbum(info);
            displayAlertPopUp('Album added to library: ' + info.title);
        } else {
            displayAlertPopUp('Album already exists in library');
        }
    }

    function handleDeleteAlbum(id) {
        deleteAlbum(id);
        setShowOptionsModal(false);
        displayAlertPopUp('Album removed');
    }

    function handleEditAlbum({ id, info }) {
        updateAlbum(id, info);
        displayAlertPopUp('Album edited');
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

    function displayAlertPopUp(content) {
        clearTimeout(alertTimeoutID);

        setAlertContent(content);
        setShowAlertPopUp(true);

        alertTimeoutID = setTimeout(() => {
            setShowAlertPopUp(false);
        }, '3500');
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
                                    <div>
                                        <FontAwesomeIcon icon={faPlus} />
                                        <p>New album</p>
                                    </div>
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
                <AlertPopUp show={showAlertPopUp} content={alertContent} />
            </div>
        </CurrentUserContext.Provider>
    );
};

export default App;
export { CurrentUserContext };
