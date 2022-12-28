import {
    collection,
    doc,
    query,
    getFirestore,
    addDoc,
    deleteDoc,
    getDocs,
    where,
    updateDoc,
} from 'firebase/firestore';

async function findAlbum(info) {
    const libraryRef = collection(getFirestore(), 'library');
    const q = query(
        libraryRef,
        where('title', '==', info.title),
        where('artist', '==', info.artist),
        where('release_year', '==', info.release_year)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc);
}

async function addAlbum(info) {
    try {
        await addDoc(collection(getFirestore(), 'library'), info);
    } catch (error) {
        console.error('Error writing new message to Firebase Database.', error);
    }
}

async function deleteAlbum(id) {
    const albumRef = doc(getFirestore(), 'library', id);
    await deleteDoc(albumRef);
}

async function updateAlbum(id, info) {
    const albumRef = doc(getFirestore(), 'library', id);
    await updateDoc(albumRef, info);
}

export { findAlbum, addAlbum, deleteAlbum, updateAlbum };
