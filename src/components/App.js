import React, { createContext, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import Sidebar from './Sidebar';

import libraryReducer from './utils/reducer';
import { filterAlbum } from './utils/libraryFilter';
import { loadLibrary, addAlbum, deleteAlbum, updateAlbum } from './utils/firebaseDatabase';
import AlertPopUp from './AlertPopUp';
import { parseCollection } from './utils/csvLoader';

const CurrentUserContext = createContext(null);

const App = () => {
    const [filter, setFilter] = useState({ by: '', value: '' });
    const [library, updateLibrary] = useReducer(libraryReducer, []);
    const [libraryDisplay, setLibraryDisplay] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [albumModalMode, setAlbumModalMode] = useState({ name: 'new' });
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [optionsModalPos, setOptionsModalPos] = useState({ x: 0, y: 0 });
    const [optionsModalAlbum, setOptionsModalAlbum] = useState('');
    const [showAlertPopUp, setShowAlertPopUp] = useState(false);
    const [alertMessage, setAlertContent] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t } = useTranslation();

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
        reader.readAsText(fileInput.files[0], 'utf-8');
    }

    function handleClearLibrary() {
        library.forEach(({ id }) => handleDeleteAlbum(id));
    }

    function uploadLibrary(e) {
        const fileContent = e.target.result;
        const collection = parseCollection(fileContent);
        // const albums = Object.values(JSON.parse(fileContent));

        collection.forEach((info) => handleAddAlbum(info));
    }

    async function handleAddAlbum(info) {
        const status = await addAlbum(info);
        let alert = '';

        if (status.successful) {
            alert = t('alerts.added.success', { title: info.title });
        } else {
            alert =
                status.error === 'duplicated'
                    ? t('alerts.added.duplicated')
                    : t('alerts.added.error');
        }

        displayAlertPopUp(alert);
    }

    function handleDeleteAlbum(id) {
        deleteAlbum(id);
        setIsOptionsModalOpen(false);
        displayAlertPopUp(t('alerts.removed'));
    }

    function handleEditAlbum({ id, info }) {
        updateAlbum(id, info);
        displayAlertPopUp(t('alerts.edited'));
    }

    function handleChangeFilter(newFilter) {
        setFilter(newFilter);
    }

    function openAlbumModal(mode) {
        setAlbumModalMode(mode);
        setIsAlbumModalOpen(true);
    }

    function closeAlbumModal(e) {
        setIsAlbumModalOpen(false);
    }

    function openOptionsModal({ event, album }) {
        const x = event.pageX;
        const y = event.pageY;
        setOptionsModalPos({ x, y });
        setOptionsModalAlbum(album);
        setIsOptionsModalOpen(true);
    }

    function closeOptionsModal(e) {
        setIsOptionsModalOpen(false);
    }

    function displayAlertPopUp(content) {
        clearTimeout(alertTimeoutID);

        setAlertContent(content);
        setShowAlertPopUp(true);

        alertTimeoutID = setTimeout(() => {
            setShowAlertPopUp(false);
        }, '3500');
    }

    function openSidebar() {
        setIsSidebarOpen(true);
    }

    function closeSidebar() {
        setIsSidebarOpen(false);
    }

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            <div id="App">
                <Header />
                {isSidebarOpen && <Sidebar />}
                <main>
                    <div className="controls-container">
                        <Summary total={library.length} displayed={libraryDisplay.length} />
                        {/* <button onClick={openSidebar}>Open</button>
                        <button onClick={closeSidebar}>Close</button> */}
                        <div className="controls">
                            <Filter onFilterChange={handleChangeFilter} />
                            <button
                                className="interactive dark"
                                id="open-modal"
                                onClick={() => openAlbumModal({ name: 'new' })}
                            >
                                <div>
                                    <FontAwesomeIcon icon={faPlus} />
                                    <p>{t('controls.newAlbum')}</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* <input
                        type="file"
                        accept=".csv"
                        name="file-loader"
                        id="file-loader"
                        onChange={handleUploadLibrary}
                    />
                    <button onClick={handleClearLibrary}>Clear Library</button> */}
                    <Table
                        content={libraryDisplay}
                        onOptionsModalOpened={openOptionsModal}
                        onToggleProp={handleEditAlbum}
                        onLibraryUploaded={handleUploadLibrary}
                    />
                </main>
                <Credits project="music-library" />

                <AlbumModal
                    show={isAlbumModalOpen}
                    mode={albumModalMode}
                    library={library}
                    onModalClosed={closeAlbumModal}
                    onAlbumAdded={handleAddAlbum}
                    onAlbumEdited={handleEditAlbum}
                />
                {isOptionsModalOpen && (
                    <OptionsModal
                        show={isOptionsModalOpen}
                        pos={optionsModalPos}
                        album={optionsModalAlbum}
                        onModalClosed={closeOptionsModal}
                        onAlbumDeleted={handleDeleteAlbum}
                        onAlbumEdited={openAlbumModal}
                    />
                )}
                {showAlertPopUp && <AlertPopUp message={alertMessage} />}
            </div>
        </CurrentUserContext.Provider>
    );
};

export default App;
export { CurrentUserContext };
