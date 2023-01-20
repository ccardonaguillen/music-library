import React, { useEffect, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileCircleXmark, faFilePen } from '@fortawesome/free-solid-svg-icons';

import '../styles/OptionsModal.css';

library.add(faFilePen, faFileCircleXmark);

function OptionsModal(props) {
    const { show, pos, album, onModalClosed, onAlbumEdited, onAlbumDeleted } = props;
    const modalRef = createRef();

    function forceClose(e) {
        console.log('click');
        const modal = document.getElementById('options-modal');
        if (!modal?.contains(e.target)) {
            onModalClosed();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', forceClose);

        return () => {
            document.removeEventListener('mousedown', forceClose);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!show) return null;
    return (
        <div
            id="options-modal"
            style={{ left: pos.x - 5, top: pos.y - 5 }}
            onMouseLeave={onModalClosed}
            ref={modalRef}
        >
            <ul>
                <li>
                    <div id="edit-album" onClick={() => onAlbumEdited({ name: 'edit', album })}>
                        <FontAwesomeIcon icon="file-pen" alt="Edit" />
                        <p>Edit Album</p>
                    </div>
                </li>
                <li>
                    <div id="delete-album" onClick={() => onAlbumDeleted(album.id)}>
                        <FontAwesomeIcon icon="file-circle-xmark" alt="Delete" />
                        <p>Delete Album</p>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default OptionsModal;
