import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Credits.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faGithub);

export default function Credits(props) {
    const { t } = useTranslation();

    return (
        <div id="credits">
            <p>{t('credits')}</p>
            <a href={'https://github.com/ccardonaguillen/' + props.project}>
                <FontAwesomeIcon icon={['fab', 'github']} id="github-logo" alt="Github" />
            </a>
            <a href="https://github.com/ccardonaguillen">Carlos Cardona</a>
        </div>
    );
}
