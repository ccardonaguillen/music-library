import React, { useState } from 'react';
import '../styles/Filter.css';

function Filter(props) {
    const [placeholder, setPlaceholder] = useState('e.g. "zeppelin", "beatles, rolling"');

    const placeholderList = {
        title: '"submarine"',
        artist: '"zeppelin", "beatles, rolling"',
        release_year: '"1990", "1-2000", ">1900", "<1980"',
        owned: '"true", "no", "not owned"',
        format: '"Vynil", "cd+casette", "vynil/CD"',
    };

    function handleSelectChange(e) {
        const value = e.target.value;

        setPlaceholder('e.g. ' + placeholderList[value]);
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
                    <label htmlFor="filter-value"> Filter by </label>
                    <select
                        name="by"
                        id="filter"
                        defaultValue="artist"
                        onChange={handleSelectChange}
                    >
                        <option value="title">Title</option>
                        <option value="artist">Artist</option>
                        <option value="release_year">Release</option>
                        <option value="owned">Owned</option>
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
                    Apply filter
                </button>
            </form>
        </div>
    );
}

export default Filter;
