const config = {
    apiKey: 'AIzaSyDXBVmrqTY1xg0gHJTBMOJ9Fa8MF9vcnCQ',
    authDomain: 'music-library-b9cfa.firebaseapp.com',
    projectId: 'music-library-b9cfa',
    storageBucket: 'music-library-b9cfa.appspot.com',
    messagingSenderId: '576287994893',
    appId: '1:576287994893:web:4835ebad5493c0306d9144',
};

export function getFirebaseConfig() {
    if (!config || !config.apiKey) {
        throw new Error(
            'No Firebase configuration object provided.' +
                '\n' +
                "Add your web app's configuration object to firebase-config.js"
        );
    } else {
        return config;
    }
}
