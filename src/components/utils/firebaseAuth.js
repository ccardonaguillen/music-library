import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config.js';
import { initUserLibrary } from './firebaseDatabase.js';

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

async function signIn() {
    var provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account',
    });

    await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
    // Sign out of Firebase.
    signOut(getAuth());
    // console.log(getAuth().currentUser);
}

function initFirebaseAuth(authStateObserver) {
    // Listen to auth state changes.
    onAuthStateChanged(getAuth(), authStateObserver);
}

function getProfilePicUrl() {
    return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
    return getAuth().currentUser.displayName;
}

function getUserID() {
    return getAuth().currentUser.uid;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
    return !!getAuth().currentUser;
}

export {
    signIn,
    signOutUser,
    initFirebaseAuth,
    getUserID,
    getProfilePicUrl,
    getUserName,
    isUserSignedIn,
};
