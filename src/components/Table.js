import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signIn } from './utils/firebaseAuth';
import { CurrentUserContext } from './App';
import '../styles/Table.css';

import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import {
    faHeart,
    faStar,
    faCheck,
    faXmark,
    faArrowUpAZ,
    faArrowDownAZ,
    faArrowUp19,
    faArrowDown19,
    faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import {
    faHeart as faHeartOutline,
    faStar as faStartOutline,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

fontLibrary.add(
    faHeart,
    faStar,
    faHeartOutline,
    faStartOutline,
    faCheck,
    faXmark,
    faArrowUpAZ,
    faArrowDownAZ,
    faArrowUp19,
    faArrowDown19,
    faEllipsisVertical
);

function Table(props) {
    const { content, onOptionsModalOpened, onToggleProp, onLibraryUploaded } = props;
    const [contentDisplay, setContentDisplay] = useState([]);
    const [sorting, setSorting] = useState({ by: 'released', order: 'asc' });
    const [showExtraInfo, setShowExtraInfo] = useState({});
    const { currentUser } = useContext(CurrentUserContext);
    const { t } = useTranslation();

    useEffect(() => {
        collapseExtraInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setContentDisplay(content);
        sortContent(sorting);
    }, [content, sorting]);

    function sortContent({ by, order }) {
        let sortOrder = order === 'asc' ? 1 : -1;

        if (['title', 'artist'].includes(by)) {
            setContentDisplay((prevDisplay) =>
                [...prevDisplay].sort((a, b) => a[by].localeCompare(b[by]) * sortOrder)
            );
        } else if (by === 'released') {
            setContentDisplay((prevDisplay) =>
                [...prevDisplay].sort((a, b) => (a[by] - b[by]) * sortOrder)
            );
        }
    }

    function handleChangeSorting(by) {
        collapseExtraInfo();
        setSorting((prevSorting) => ({ by, order: prevSorting.order === 'asc' ? 'desc' : 'asc' }));
    }

    function handleToggleExtraInfo(id) {
        const currState = showExtraInfo[id];

        collapseExtraInfo();
        setShowExtraInfo((prevShow) => ({ ...prevShow, [id]: !currState }));
    }

    function collapseExtraInfo() {
        setShowExtraInfo(content.reduce((acc, album) => ({ ...acc, [album.id]: false }), {}));
    }

    function handleSignIn(e) {
        e.preventDefault();
        signIn();
    }

    function handleClickUpload(e) {
        e.stopPropagation();
        const fileInput = e.currentTarget.firstChild;
        fileInput.click();
    }

    if (currentUser === null)
        return (
            <p id="not-signed-in-message">
                {t('table.notLogged.part1')}
                <span
                    id="text-clickable"
                    onClick={handleSignIn}
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                    {t('table.notLogged.action')}
                </span>{' '}
                {t('table.notLogged.part2')}
            </p>
        );

    return (
        <div id="table-container">
            <table id="music-library">
                <thead className="library-header">
                    <tr>
                        <TableHeader className="album-options" />
                        <TableHeader
                            title={t('fields.title')}
                            className="sortable"
                            value="title"
                            type="alph"
                            sorting={sorting}
                            onClick={handleChangeSorting}
                        />
                        <TableHeader
                            title={t('fields.artist')}
                            className="sortable"
                            value="artist"
                            type="alph"
                            sorting={sorting}
                            onClick={handleChangeSorting}
                        />
                        <TableHeader
                            title={t('fields.released.short')}
                            className="sortable"
                            value="released"
                            type="num"
                            sorting={sorting}
                            onClick={handleChangeSorting}
                        />
                        <TableHeader title={t('fields.owned')} />
                        <TableHeader title={t('fields.favorite')} />
                    </tr>
                </thead>
                {content.length === 0 ? (
                    <tr>
                        <td colSpan={6}>
                            {t('table.noAlbums.part1')}
                            <span
                                id="text-clickable"
                                onClick={handleClickUpload}
                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                <input
                                    type="file"
                                    id="upload"
                                    name="upload"
                                    accept=".json"
                                    onChange={onLibraryUploaded}
                                    style={{ display: 'none' }}
                                />
                                {t('table.noAlbums.action')}
                            </span>{' '}
                            {t('table.noAlbums.part2')}
                        </td>
                    </tr>
                ) : (
                    <tbody>
                        {contentDisplay.map((album) => (
                            <AlbumRow
                                key={album.id}
                                album={album}
                                displayExtraInfo={showExtraInfo[album.id]}
                                onClick={handleToggleExtraInfo}
                                onOptionsModalOpened={onOptionsModalOpened}
                                onToggleProp={onToggleProp}
                            />
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    );
}

function AlbumRow(props) {
    const { album, displayExtraInfo, onClick, onOptionsModalOpened, onToggleProp } = props;
    const { title, artist, released, owned, favorite } = album;

    const [optionsVisibility, setOptionsVisibility] = useState('hidden');

    function handleToggleOwned(e) {
        e.stopPropagation();
        onToggleProp({ id: album.id, info: { owned: album.owned ? false : true } });
    }

    function handleToggleFav(e) {
        e.stopPropagation();
        onToggleProp({ id: album.id, info: { favorite: album.favorite ? false : true } });
    }

    function handleOpenOptionsModal(e) {
        e.stopPropagation();
        onOptionsModalOpened({ event: e, album });
    }

    return (
        <React.Fragment>
            <tr
                onMouseEnter={() => setOptionsVisibility('visible')}
                onMouseLeave={() => setOptionsVisibility('hidden')}
                onClick={() => onClick(album.id)}
            >
                <td>
                    <FontAwesomeIcon
                        icon="ellipsis-vertical"
                        className="album-options clickable"
                        onClick={handleOpenOptionsModal}
                        style={{ visibility: optionsVisibility }}
                    />
                </td>
                <td>{title}</td>
                <td>{artist}</td>
                <td>{released}</td>
                <td>
                    <FontAwesomeIcon
                        icon={owned ? 'check' : 'xmark'}
                        className="clickable icon-disp"
                        style={{ color: owned ? '1cba14' : 'c50808' }} //
                        onClick={handleToggleOwned}
                    />
                </td>
                <td>
                    <FontAwesomeIcon
                        icon={favorite ? 'star' : ['far', 'star']}
                        className="clickable  icon-disp"
                        style={{ color: 'f5af00' }} // heart --> c50808
                        onClick={handleToggleFav}
                    />
                </td>
            </tr>
            {displayExtraInfo && <ExtraInfoRow album={album} />}
        </React.Fragment>
    );
}

function TableHeader(props) {
    const { title, className, type, value, sorting, onClick } = props;

    switch (className) {
        case 'album-options':
            return <th className={className}></th>;
        case 'sortable':
            const renderIcon = className === 'sortable' && value === sorting.by;
            const icon = `arrow-${sorting.order === 'asc' ? 'down' : 'up'}-${
                type === 'alph' ? 'a-z' : '1-9'
            }`;

            return (
                <th className={className} value={value} onClick={() => onClick(value)}>
                    <div>
                        <p>
                            {title} {renderIcon && <FontAwesomeIcon icon={icon} />}
                        </p>
                    </div>
                </th>
            );
        default:
            return (
                <th>
                    <p>{title}</p>
                </th>
            );
    }
}

function ExtraInfoRow(props) {
    const { album } = props;
    const { t } = useTranslation();
    const generalInfo = [
        { key: 'genre', label: t('fields.genre'), icon: '', type: 'text' },
        { key: 'topRS1', label: 'Top500 (RS1)', icon: '', type: 'text' },
        { key: 'topRS3', label: 'Top500 (RS3)', icon: '', type: 'text' },
        { key: 'discogs', label: 'Discogs', icon: '', type: 'url' },
        { key: 'wikipedia', label: 'Wikipedia', icon: '', type: 'url' },
    ];

    const recordInfo = [
        { key: 'catalog_num', label: t('fields.released.short'), icon: '' },
        { key: 'record_label', label: t('fields.label'), icon: '' },
        { key: 'country', label: t('fields.country'), icon: '' },
        { key: 'edition', label: t('fields.edition.short'), icon: '' },
        { key: 'matrix', label: t('fields.matrix'), icon: '' },
        { key: 'condition', label: t('fields.condition'), icon: '' },
        { key: 'notes', label: t('fields.notes'), icon: '' },
    ];

    return (
        <tr className="extra-info">
            <td colSpan="6">
                <div>
                    <img alt={t('fields.jacket')} src={album.jacket} className="album-jacket" />
                    <div className="album-info general-info">
                        {generalInfo.map((field) =>
                            field.type === 'text' ? (
                                <p>
                                    <strong>{field.label}:</strong> {album[field.key] || 'NA'}
                                </p>
                            ) : (
                                <a href={album[field.key]} target="_blank" rel="noreferrer">
                                    <strong>{field.label}</strong>
                                </a>
                            )
                        )}
                    </div>
                    <div className="album-info record-info">
                        <p>
                            <strong>{t('fields.format')}:</strong>
                            {album.record_format} ({album.album_format})
                        </p>
                        {recordInfo.map((field) => (
                            <p>
                                <strong>{field.label}:</strong> {album[field.key]}
                            </p>
                        ))}
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default Table;
