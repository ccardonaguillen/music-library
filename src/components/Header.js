import React, { useContext, useEffect } from 'react';
import { signIn, signOutUser, initFirebaseAuth } from './utils/firebaseAuth';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCompactDisc, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CurrentUserContext } from './App';

import { useTranslation } from 'react-i18next';
import i18n from './utils/i18n';

import '../styles/Header.css';

library.add(faGithub, faCompactDisc, faCircleUser);

const lngs = {
    en: { nativeName: 'English' },
    es: { nativeName: 'Español' },
};

function Header() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { t } = useTranslation();

    useEffect(() => {
        initFirebaseAuth(setCurrentUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <header>
            <div className="container">
                <a href="https://ccardonaguillen.github.io/music-library/" target="">
                    <FontAwesomeIcon icon="compact-disc" alt="Music Library" id="hero-logo" />
                    <h1>{t('header.title')}</h1>
                </a>
                <div>
                    {Object.keys(lngs).map((lng) => (
                        <button
                            key={lng}
                            style={{
                                fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal',
                            }}
                            type="submit"
                            onClick={() => i18n.changeLanguage(lng)}
                        >
                            {lngs[lng].nativeName}
                        </button>
                    ))}
                </div>
                <div id="nav-user">
                    {currentUser !== null ? (
                        <>
                            <p onClick={signOutUser}>SIGN OUT</p>
                            <img id="user-avatar" alt="Avatar" src={currentUser.photoURL} />
                            {/* <p>{currentUser.displayName}</p> */}
                        </>
                    ) : (
                        <>
                            <p onClick={signIn}>SIGN IN WITH GOOGLE</p>
                            <FontAwesomeIcon icon="circle-user" id="user-avatar" />
                        </>
                    )}
                </div>

                {/* <a
                    href="https://github.com/ccardonaguillen/music-library/"
                    target="_blank"
                    rel="noreferrer"
                    title="Github Code"
                >
                    <FontAwesomeIcon icon={['fab', 'github']} alt="Github" id="github-hero" />
                </a> */}
            </div>
        </header>
    );
}

export default Header;
