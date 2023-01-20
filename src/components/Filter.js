import React, { useState } from 'react';
import '../styles/Filter.css';
import { useTranslation } from 'react-i18next';

function Filter(props) {
    const { t } = useTranslation();
    const placeholderList = {
        title: '"submarine"',
        artist: '"zeppelin", "beatles, rolling"',
        released: '"1990", "1-2000", ">1900", "<1980"',
        owned: '"true", "no", "not owned"',
        format: '"Vynil", "cd+casette", "vynil/CD"',
    };

    const [placeholder, setPlaceholder] = useState(
        t('common.exampleAbbr') + placeholderList['artist']
    );

    function handleSelectChange(e) {
        const value = e.target.value;

        setPlaceholder(t('common.exampleAbbr') + placeholderList[value]);
    }

    function applyFilter(e = null) {
        if (e) e.preventDefault();

        const filter = e.target.elements;
        props.onFilterChange({
            by: filter.by.value,
            value: filter.value.value,
        });
    }

    function resetFilter(e) {
        if (e.type === 'input' && e.value !== '') return;

        props.onFilterChange({ by: '', value: '' });
    }

    return (
        <div id="filter">
            <form name="filter-by" id="filter-by" onSubmit={applyFilter}>
                <div id="select-container">
                    <label htmlFor="filter-value">{t('controls.filter.by')}</label>
                    <select
                        name="by"
                        id="filter"
                        defaultValue="artist"
                        onChange={handleSelectChange}
                    >
                        <option value="title">{t('fields.title')}</option>
                        <option value="artist">{t('fields.artist')}</option>
                        <option value="released">{t('fields.released.short')}</option>
                        <option value="owned">{t('fields.owned')}</option>
                    </select>
                </div>
                {/* <div className="semicolon">:</div> */}
                <input
                    type="text"
                    name="value"
                    id="filter-value"
                    placeholder={placeholder}
                    autoComplete="off"
                    onInput={resetFilter}
                />
                <button className="interactive light" type="submit">
                    {t('controls.filter.apply')}
                </button>
            </form>
        </div>
    );
}

export default Filter;
