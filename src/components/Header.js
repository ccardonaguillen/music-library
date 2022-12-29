import React, { useContext, useEffect } from 'react';
import { signIn, signOutUser, initFirebaseAuth } from './utils/firebaseAuth';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCompactDisc, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CurrentUserContext } from './App';

import '../styles/Header.css';

library.add(faGithub, faCompactDisc, faCircleUser);

function Header() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        initFirebaseAuth(setCurrentUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <header>
            <div className="container">
                <a href="https://ccardonaguillen.github.io/music-library/" target="">
                    <FontAwesomeIcon icon="compact-disc" alt="Music Library" id="hero-logo" />
                    <h1>Music Library</h1>
                </a>
                {/* <ul>
                    <li>Top 500 (RS1)</li>
                    <li>Top 500 (RS3)</li>
                </ul> */}
                <div id="nav-user">
                    {currentUser !== null ? (
                        <>
                            <p onClick={signOutUser}>SIGN OUT</p>
                            <img id="user-avatar" alt="Avatar" src={currentUser.photoURL} />
                            <p>{currentUser.displayName}</p>
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
