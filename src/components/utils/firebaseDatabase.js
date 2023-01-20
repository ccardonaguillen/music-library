import {
    getFirestore,
    collection,
    doc,
    query,
    onSnapshot,
    addDoc,
    deleteDoc,
    getDocs,
    where,
    updateDoc,
} from 'firebase/firestore';
import { getUserID } from './firebaseAuth';

const getLibraryRef = () => collection(getFirestore(), getUserID());

async function loadLibrary(dispatch) {
    dispatch({ type: 'reset', payload: {} });
    const q = query(collection(getFirestore(), getUserID()));

    onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            dispatch({
                type: change.type,
                payload: { id: change.doc.id, info: change.doc.data() },
            });
        });
    });
}

async function findAlbum(info) {
    const q = query(
        getLibraryRef(),
        where('title', '==', info.title),
        where('artist', '==', info.artist),
        where('released', '==', info.released)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc);
}

async function addAlbum(info) {
    try {
        const match = await findAlbum(info);
        const isInLibrary = match?.length > 0;

        if (isInLibrary) {
            return { successful: false, error: 'duplicated' };
        } else {
            await addDoc(getLibraryRef(), info);
            return { successful: true };
        }
    } catch (error) {
        console.error('Error writing new message to Firebase Database.', error);
        return { successful: false, error: 'other' };
    }
}

async function deleteAlbum(id) {
    const albumRef = doc(getLibraryRef(), id);
    await deleteDoc(albumRef);
}

async function updateAlbum(id, info) {
    const albumRef = doc(getLibraryRef(), id);
    await updateDoc(albumRef, info);
}

export { loadLibrary, findAlbum, addAlbum, deleteAlbum, updateAlbum };
