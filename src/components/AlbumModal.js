import React, { createRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fetchRelease } from './utils/discogs';

import '../styles/AlbumModal.css';

function AlbumModal(props) {
    const { t } = useTranslation();

    const { mode, show, library, onModalClosed, onAlbumAdded, onAlbumEdited } = props;
    const modalTitle = mode.name === 'new' ? t('albumModal.title.new') : t('albumModal.title.edit');
    const resetButtonLabel =
        mode.name === 'new' ? t('albumModal.buttons.reset') : t('albumModal.buttons.cancel');

    const [showRecordInfo, setShowRecordInfo] = useState(false);
    const formRef = createRef();

    useEffect(() => {
        if (mode.name === 'edit') populateAlbumForm(mode.album);
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

    function populateAlbumForm(info) {
        for (let prop in info) {
            switch (prop) {
                case 'owned':
                case 'favorite':
                case 'album_format':
                    const radioButtons = document.querySelectorAll(
                        `input[type=radio][name=${prop}]`
                    );

                    for (let button of radioButtons) {
                        if (String(info[prop]) === button.value) {
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
                        if (info[prop].some((format) => format === box.value)) {
                            box.click();
                        }
                    }
                    break;

                default:
                    const input = document.querySelector(`input[name="${prop}"]`);

                    if (input && info[prop] !== '') {
                        input.value = info[prop];
                    }
                    break;
            }
        }

        setShowRecordInfo(info.owned);
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

    async function handleLoadFromDiscogs(e) {
        e.preventDefault();

        const release_id = document.getElementById('discogs_id').value;
        const albumInfo = await fetchRelease(release_id);

        populateAlbumForm(albumInfo);
    }

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{modalTitle}</h2>
                <FontAwesomeIcon
                    icon={faXmark}
                    id="close-modal"
                    alt={t('albumModal.buttons.close')}
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
                        {mode.name === 'new' && (
                            <div id="modal-hero">
                                <p>{t('albumModal.hero')}</p>
                                <form onSubmit={handleLoadFromDiscogs}>
                                    <label htmlFor="discogs_id">Discogs ID</label>
                                    <input
                                        id="discogs_id"
                                        type="text"
                                        placeholder="Release ID"
                                    ></input>
                                    <button className="interactive light">
                                        {t('albumModal.buttons.load')}
                                    </button>
                                </form>
                            </div>
                        )}

                        <fieldset>
                            <legend>{t('albumModal.fieldsets.general')}</legend>
                            <InputField
                                id="title"
                                type="text"
                                label={t('fields.title')}
                                placeholder={t('common.exampleAbbr') + 'Revolver'}
                            />
                            <InputFieldWithSuggestions
                                id="artist"
                                type="text"
                                label={t('fields.artist')}
                                placeholder={t('common.exampleAbbr') + 'The Beatles'}
                                library={library}
                            />

                            <InputField
                                id="released"
                                type="number"
                                label={t('fields.released.long')}
                                placeholder={t('common.exampleAbbr') + '1966'}
                            />
                            <InputSelect
                                id="genre"
                                title={t('fields.genre')}
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
                                    title={t('albumModal.labels.owned')}
                                    containerClass="radio-container"
                                    onChange={handleOwnedChange}
                                    options={[
                                        { id: 'owned', value: true, label: t('common.yes') },
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
                                    title={t('albumModal.labels.favorite')}
                                    containerClass="radio-container"
                                    options={[
                                        { id: 'fav', value: 'true', label: t('common.yes') },
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
                                label={t('albumModal.labels.wikipedia')}
                                placeholder="es.wikipedia.org/wiki/..."
                            />
                            <InputField
                                id="discogs"
                                type="url"
                                label={t('albumModal.labels.discogs')}
                                placeholder="www.discogs.com/release/..."
                            />
                            <InputField id="jacket" type="url" label={t('fields.jacket')} />
                        </fieldset>
                        {showRecordInfo && (
                            <fieldset id="record-info-fs" disabled={!showRecordInfo}>
                                <legend>{t('albumModal.fieldsets.record')}</legend>
                                <InputOptions
                                    id="record_format"
                                    type="checkbox"
                                    title={t('albumModal.labels.record')}
                                    containerClass="checkbox-container"
                                    options={[
                                        {
                                            id: 'vinyl',
                                            value: 'Vinyl',
                                            label: t('fields.recordFormat.vynil'),
                                        },
                                        { id: 'cd', value: 'CD', label: 'CD' },
                                        { id: 'casette', value: 'Casette', label: 'Casette' },
                                        {
                                            id: 'other',
                                            value: 'Other',
                                            label: t('fields.recordFormat.other'),
                                        },
                                    ]}
                                />
                                <InputOptions
                                    id="album_format"
                                    type="radio"
                                    title={t('albumModal.labels.album')}
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
                                    label={t('fields.catalog.long')}
                                    placeholder={t('common.exampleAbbr') + '1 C 072-04 097'}
                                />
                                <InputFieldWithSuggestions
                                    id="record_label"
                                    type="text"
                                    label={t('fields.label')}
                                    placeholder={t('common.exampleAbbr') + 'Apple Records'}
                                    library={library}
                                />
                                <InputFieldWithSuggestions
                                    id="country"
                                    type="text"
                                    label={t('fields.country')}
                                    placeholder={t('common.exampleAbbr') + 'Germany'}
                                    library={library}
                                />
                                <InputField
                                    id="edition"
                                    type="number"
                                    label={t('fields.edition.long')}
                                    placeholder={t('common.exampleAbbr') + '1977'}
                                />
                                <InputField
                                    id="matrix"
                                    type="text"
                                    label={t('fields.matrix')}
                                    placeholder={
                                        t('common.exampleAbbr') + '04097-A-2 SHZE 186 A - X2'
                                    }
                                />

                                <div className="input-container">
                                    <InputField
                                        id="condition"
                                        type="number"
                                        label={t('fields.condition')}
                                        // max="10"
                                        placeholder="1&ndash;10"
                                    />
                                    <InputField
                                        id="ndisks"
                                        type="number"
                                        label={t('fields.ndisk')}
                                        // value="1"
                                        //     min="1"
                                        placeholder=">1"
                                    />
                                </div>
                                <InputField
                                    id="notes"
                                    type="text"
                                    label={t('fields.notes')}
                                    placeholder="Here goes any other info related to the record"
                                />
                            </fieldset>
                        )}
                    </div>
                    <div className="button-container">
                        <button className="interactive dark" type="submit">
                            {t('albumModal.buttons.submit')}
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
    const [displaySuggs, setDisplaySuggs] = useState(false);

    function handleInputChange(e) {
        const newValue = e.target.value;
        setValue(newValue);
        setDisplaySuggs(true);
    }

    function handleClickSuggestion(e) {
        console.log('click');
        e.preventDefault();
        const newValue = e.currentTarget.textContent;
        setValue(newValue);
        setDisplaySuggs(false);
    }

    function handleFocusLost() {
        setDisplaySuggs(false);
    }

    function handleFocusAdq() {
        setDisplaySuggs(true);
    }

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                name={id}
                value={value}
                id={id}
                placeholder={placeholder}
                onChange={handleInputChange}
                onBlur={handleFocusLost}
                onFocus={handleFocusAdq}
            />
            <InputSuggestions
                show={displaySuggs}
                input={value}
                suggestions={library.map((album) => album[id])}
                onSuggestionClicked={handleClickSuggestion}
            />
        </div>
    );
}

function InputSuggestions(props) {
    const { show, input, suggestions, onSuggestionClicked } = props;
    const filteredSuggs = filterSuggestions(suggestions);
    const regex = new RegExp(`(.*)(${input})(.*)`, 'i');
    const isEmpty = input === '' || filteredSuggs.length === 0;

    function filterSuggestions(suggestions) {
        return suggestions.reduce((acc, curr) => {
            // Find matches
            if (curr !== '' && curr.toLowerCase().includes(input.toLowerCase())) {
                // Avoid duplicates
                if (acc.indexOf(curr) === -1) acc.push(curr);
            }
            return acc;
        }, []);
    }

    if (!show || isEmpty) return null;

    return (
        <div className="suggestions">
            <ul>
                {filteredSuggs.map((sugg) => {
                    const match = sugg.match(regex);

                    return (
                        <li key={sugg} onMouseDown={onSuggestionClicked}>
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
