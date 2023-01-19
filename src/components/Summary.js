import React from 'react';
import { useTranslation } from 'react-i18next';

function Summary(props) {
    const { total, displayed } = props;
    const { t } = useTranslation();

    return (
        <div id="entries-count">
            {total === 0
                ? t('controls.entries.zero')
                : t('controls.entries.other', { displayed, total })}
        </div>
    );
}

export default Summary;
