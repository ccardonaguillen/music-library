import React from 'react';

function Summary(props) {
    const { total, displayed } = props;

    return (
        <div id="entries-count">
            {total === 0
                ? 'No albums in the library. Add one by clicking the button'
                : `Showing ${displayed} out of ${total} albums`}
        </div>
    );
}

export default Summary;
