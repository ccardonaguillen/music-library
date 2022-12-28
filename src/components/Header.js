import React, { useEffect, useState } from 'react';
import {
    signIn,
    signOutUser,
    initFirebaseAuth,
    getProfilePicUrl,
    getUserName,
    isUserSignedIn,
} from './utils/firebaseAuth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCompactDisc, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../styles/Header.css';

library.add(faGithub, faCompactDisc, faCircleUser);

function Header() {
    const [userLoggedIn, setUserLoggedIn] = useState(true);

    function initFirebaseAuth() {
        // Listen to auth state changes.
        onAuthStateChanged(getAuth(), () => setUserLoggedIn(isUserSignedIn));
    }

    useEffect(() => {
        initFirebaseAuth();
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
                    {userLoggedIn ? (
                        <>
                            <p onClick={signOutUser}>SIGN OUT</p>
                            <img alt="Avatar" src={'#'} />
                            <p>placeholder</p>
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
