import React, { createRef, useEffect, useState } from 'react';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

import '../styles/AlbumModal.css';

fontLibrary.add(faXmark);

function AlbumModal(props) {
    const { mode, show, library, onModalClosed, onAlbumAdded, onAlbumEdited } = props;
    const modalTitle = mode.name === 'new' ? 'New Album' : 'Edit Album';
    const resetButtonLabel = mode.name === 'new' ? 'Reset' : 'Cancel';

    const [showRecordInfo, setShowRecordInfo] = useState(false);
    const formRef = createRef();

    useEffect(() => {
        if (mode.name === 'edit') populateAlbumForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    function parseAlbumForm() {
        let formData = new FormData(formRef.current);

        let formContent = Object.fromEntries(formData.entries());

        formContent['owned'] = formContent['owned'] === 'true' ? true : false;
        formContent['favorite'] = formContent['favorite'] === 'true' ? true : false;
        formContent['format'] = formData.getAll('format');

        return formContent;
    }

    function populateAlbumForm() {
        const { album } = mode;

        for (let prop in album) {
            switch (prop) {
                case 'owned':
                case 'favorite':
                case 'album_format':
                    const radioButtons = document.querySelectorAll(
                        `input[type=radio][name=${prop}]`
                    );

                    for (let button of radioButtons) {
                        if (String(album[prop]) === button.value) {
                            button.click();
                            break;
                        }
                    }
                    break;

                case 'record_format':
                    const checkBoxes = document.querySelectorAll(
                        `input[type=checkbox][name=${prop}]`
                    );

                    for (let box of checkBoxes) {
                        if (album[prop].some((format) => format === box.value)) {
                            box.click();
                        }
                    }
                    break;

                default:
                    const input = document.querySelector(`input[name="${prop}"]`);

                    if (input && album[prop] !== '') {
                        input.value = album[prop];
                    }
                    break;
            }
        }

        setShowRecordInfo(album.owned);
    }

    async function submitNewAlbum(e) {
        e.preventDefault();

        const info = parseAlbumForm();
        // console.log(info);
        mode.name === 'new' ? onAlbumAdded(info) : onAlbumEdited({ id: mode.album.id, info });

        onModalClosed();
    }

    function handleCloseEditModal(e) {
        if (mode.name === 'edit') onModalClosed();
    }

    function handleOwnedChange(e) {
        setShowRecordInfo(e.target.value === 'true');
    }

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{modalTitle}</h2>
                <FontAwesomeIcon
                    icon="xmark"
                    id="close-modal"
                    alt="Close Modal"
                    className="clickable"
                    onClick={onModalClosed}
                />

                <form
                    name="add-album"
                    id="add-album"
                    ref={formRef}
                    autoComplete="off"
                    onSubmit={submitNewAlbum}
                >
                    <div className="form-content">
                        <fieldset>
                            <legend>General Info</legend>
                            <InputField
                                id="title"
                                type="text"
                                label="Title"
                                placeholder="e.g. Revolver"
                            />
                            <InputFieldWithSuggestions
                                id="artist"
                                type="text"
                                label="Artist"
                                placeholder="e.g. The Beatles"
                                library={library}
                            />

                            <InputField
                                id="release_year"
                                type="number"
                                label="Release Year"
                                placeholder="e.g. 1966"
                            />
                            <InputSelect
                                id="genre"
                                title="Genre"
                                defaultValue=""
                                options={[
                                    { value: '', label: 'Choose a genre...', disabled: true },
                                    { value: 'rock', label: 'Rock' },
                                    { value: 'electronic', label: 'Electronic' },
                                    { value: 'pop', label: 'Pop' },
                                    { value: 'folk', label: 'Folk & Country' },
                                    { value: 'jazz', label: 'Jazz' },
                                    { value: 'funk', label: 'Funk / Soul' },
                                    { value: 'classical', label: 'Classical' },
                                    { value: 'hip-hop', label: 'Hip Hop' },
                                    { value: 'latin', label: 'Latin' },
                                    { value: 'stage', label: 'Stage & Screen' },
                                    { value: 'reggae', label: 'Reggae' },
                                    { value: 'non-music', label: 'Non-Music' },
                                    { value: 'children', label: "Children's" },
                                    { value: 'military', label: 'Brass & Military' },
                                ]}
                            />
                            <div className="input-container">
                                <InputOptions
                                    name="owned"
                                    type="radio"
                                    title="Do you own a copy?"
                                    containerClass="radio-container"
                                    onChange={handleOwnedChange}
                                    options={[
                                        { id: 'owned', value: true, label: 'Yes' },
                                        {
                                            id: 'not-owned',
                                            value: false,
                                            label: 'No',
                                            checked: true,
                                        },
                                    ]}
                                />
                                <InputOptions
                                    name="favorite"
                                    type="radio"
                                    title="Mark as favorite?"
                                    containerClass="radio-container"
                                    options={[
                                        { id: 'fav', value: 'true', label: 'Yes' },
                                        {
                                            id: 'not-fav',
                                            value: 'false',
                                            label: 'No',
                                            checked: true,
                                        },
                                    ]}
                                />
                            </div>
                            <div className="input-container">
                                <InputField
                                    id="topRS1"
                                    type="number"
                                    label="Top 500 (RS1)"
                                    // max="500"

                                    placeholder="1&ndash;500"
                                />
                                <InputField
                                    id="topRS3"
                                    type="number"
                                    label="Top 500 (RS3)"
                                    // max="500"

                                    placeholder="1&ndash;500"
                                />
                            </div>
                            <InputField
                                id="wikipedia"
                                type="url"
                                label="Wikipedia Page"
                                placeholder="es.wikipedia.org/wiki/..."
                            />
                            <InputField
                                id="discogs"
                                type="url"
                                label="Discogs Link"
                                placeholder="www.discogs.com/release/..."
                            />
                            <InputField id="jacket" type="url" label="Album Jacket" />
                        </fieldset>
                        {showRecordInfo && (
                            <fieldset id="record-info-fs" disabled={!showRecordInfo}>
                                <legend>Record Info</legend>
                                <InputOptions
                                    id="record_format"
                                    type="checkbox"
                                    title="Record format(s)"
                                    containerClass="checkbox-container"
                                    options={[
                                        { id: 'vinyl', value: 'Vinyl', label: 'Vinyl' },
                                        { id: 'cd', value: 'CD', label: 'CD' },
                                        { id: 'casette', value: 'Casette', label: 'Casette' },
                                        { id: 'other', value: 'Other', label: 'Other' },
                                    ]}
                                />
                                <InputOptions
                                    id="album_format"
                                    type="radio"
                                    title="Album format"
                                    containerClass="album-format-container"
                                    options={[
                                        { id: 'ep', value: 'EP', label: 'EP (Extended Play)' },
                                        { id: 'lp', value: 'LP', label: 'LP (Long Play)' },
                                        { id: 'single', value: 'Single', label: 'Single' },
                                    ]}
                                />
                                <InputField
                                    id="catalog"
                                    type="text"
                                    label="Catalog Number"
                                    placeholder="e.g. 1 C 072-04 097"
                                />
                                <InputField
                                    id="label"
                                    type="text"
                                    label="Label"
                                    placeholder="e.g. Apple Records"
                                />
                                <InputField
                                    id="country"
                                    type="text"
                                    label="Country"
                                    placeholder="e.g. Germany"
                                />
                                <InputField
                                    id="edition-year"
                                    type="number"
                                    label="Edition Year"
                                    placeholder="e.g. 1977"
                                />
                                <InputField
                                    id="matrix"
                                    type="text"
                                    label="Matrix"
                                    placeholder="e.g. 04097-A-2 SHZE 186 A - X2"
                                />

                                <div className="input-container">
                                    <InputField
                                        id="Condition"
                                        type="number"
                                        label="Condition"
                                        // max="10"
                                        placeholder="1&ndash;10"
                                    />
                                    <InputField
                                        id="ndisks"
                                        type="number"
                                        label="Disks"
                                        // value="1"
                                        //     min="1"
                                        placeholder=">1"
                                    />
                                </div>
                                <InputField
                                    id="notes"
                                    type="text"
                                    label="Notes"
                                    placeholder="Here goes any other info related to the record"
                                />
                            </fieldset>
                        )}
                    </div>
                    <div className="button-container">
                        <button className="interactive dark" type="submit">
                            Submit
                        </button>
                        <button
                            className="interactive light"
                            type="reset"
                            onClick={handleCloseEditModal}
                        >
                            {resetButtonLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AlbumModal;

function InputField(props) {
    const { id, type, label, placeholder, includeSuggestions, library } = props;
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input type={type} name={id} id={id} placeholder={placeholder} />
            {includeSuggestions && <InputSuggestions suggestions={library[id]} />}
        </div>
    );
}

function InputFieldWithSuggestions(props) {
    const { id, type, label, placeholder, library } = props;
    const [value, setValue] = useState('');

    function handleInputChange(e) {
        const newValue = e.target.value;
        setValue(newValue);
    }

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                name={id}
                id={id}
                placeholder={placeholder}
                onChange={handleInputChange}
            />
            <InputSuggestions input={value} suggestions={library.map((album) => album[id])} />
        </div>
    );
}

function InputSuggestions(props) {
    const { suggestions, input } = props;
    const filteredSuggs = filterSuggestions(suggestions);
    const regex = new RegExp(`(.*)(${input})(.*)`, 'i');
    const isEmpty = input === '' || filteredSuggs.length === 0;

    function filterSuggestions(suggestions) {
        return suggestions.reduce((acc, curr) => {
            // Find matches
            if (curr.toLowerCase().includes(input.toLowerCase())) {
                // Avoid duplicates
                if (acc.indexOf(curr) === -1) acc.push(curr);
            }
            return acc;
        }, []);
    }

    if (isEmpty) return null;

    return (
        <div className="suggestions">
            <ul>
                {filteredSuggs.map((sugg) => {
                    const match = sugg.match(regex);

                    return (
                        <li key={sugg}>
                            {match[1]}
                            <strong>{match[2]}</strong>
                            {match[3]}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function InputOptions(props) {
    const { name, type, title, containerClass, options, onChange } = props;
    return (
        <div>
            <p>{title}</p>
            <div className={containerClass}>
                {options.map(({ id, value, label, checked }) => (
                    <div key={id} className="option-box-container">
                        <input
                            type={type}
                            name={name}
                            id={id}
                            value={value}
                            defaultChecked={checked}
                            onChange={onChange}
                        />
                        <label htmlFor={id}>{label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

function InputSelect(props) {
    const { id, title, defaultValue, options } = props;

    return (
        <div>
            <label htmlFor={id}>{title}</label>
            <select name={id} id={id} defaultValue={defaultValue}>
                {options.map(({ value, label, disabled }) => (
                    <option key={value} value={value} disabled={disabled}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}

// const generalInfo = [
//     { id: 'title', type: 'text', label: 'Title', placeholder: 'e.g. Revolver' },
//     { id: 'artist', type: 'text', label: 'Artist', placeholder: 'e.g. The Beatles' },
//     { id: 'release-year', type: 'number', label: 'Release Year', placeholder: 'e.g. 1966' },
//     { id: 'topRS1', type: 'number', label: 'Top 500 (RS1)', placeholder: '1&ndash;500' },
//     { id: 'topRS3', type: 'number', label: 'Top 500 (RS3)', placeholder: '1&ndash;500' },
//     {
//         id: 'wikipedia',
//         type: 'url',
//         label: 'Wikipedia Page',
//         placeholder: 'es.wikipedia.org/wiki/...',
//     },
//     {
//         id: 'discogs',
//         type: 'url',
//         label: 'Discogs Link',
//         placeholder: 'www.discogs.com/release/...',
//     },
//     { id: 'jacket', type: 'url', label: 'Album Jacket' },
// ];
