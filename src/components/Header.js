import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../styles/Header.css';

library.add(faGithub, faCompactDisc);

function Header() {
    return (
        <header>
            <div className="container">
                <a href="https://ccardonaguillen.github.io/music-library/" target="">
                    <FontAwesomeIcon icon="compact-disc" alt="Music Library" id="hero-logo" />
                    <h1>Music Library</h1>
                </a>
                <a
                    href="https://github.com/ccardonaguillen/music-library/"
                    target="_blank"
                    rel="noreferrer"
                    title="Github Code"
                >
                    <FontAwesomeIcon icon={['fab', 'github']} alt="Github" id="github-hero" />
                </a>
            </div>
        </header>
    );
}

export default Header;
