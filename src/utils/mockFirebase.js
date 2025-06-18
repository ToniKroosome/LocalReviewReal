// MOCK USER DATA
const mockUser = {
    uid: 'mock-google-user-123',
    displayName: 'Demo User',
    photoURL: 'https://placehold.co/100x100/8e44ad/ffffff?text=DU'
};

// Mock Firebase for preview environment
const mockAuth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
        const user = mockAuth.currentUser;
        setTimeout(() => callback(user), 100);
        return () => {};
    },
    // SIMULATE Google Sign-In
    signInWithGoogle: () => {
        mockAuth.currentUser = mockUser;
        return Promise.resolve({ user: mockAuth.currentUser });
    },
    signOut: () => {
        mockAuth.currentUser = null;
        return Promise.resolve();
    }
};

const mockFirestore = {
    collection: (path) => ({
        query: () => ({
            onSnapshot: (callback) => {
                setTimeout(() => {
                    callback({
                        docs: initialSampleReviews.map((item) => ({
                            id: item.id,
                            data: () => item
                        }))
                    });
                }, 100);
                return () => {};
            }
        })
    }),
    addDoc: (collectionRef, data) => {
        console.log("Mock Firestore: addDoc called with", data);
        return Promise.resolve({ id: `mock-doc-${Date.now()}` });
    },
    setDoc: (docRef, data) => {
        console.log("Mock Firestore: setDoc called for", docRef.id, "with", data);
        return Promise.resolve();
    },
    getDocs: (q) => Promise.resolve({ docs: initialSampleReviews.map((item) => ({ id: item.id, data: () => item })) }),
    doc: (collectionRef, id) => ({ id })
};

export const auth = mockAuth;
export const db = mockFirestore;
export const collection = (path) => mockFirestore.collection(path);
export const query = (collectionRef) => collectionRef.query();
export const onSnapshot = (queryRef, callback) => queryRef.onSnapshot(callback);
export const doc = (collectionRef, id) => mockFirestore.doc(collectionRef, id);
export const setDoc = mockFirestore.setDoc;
export const addDoc = mockFirestore.addDoc;
export const getDocs = (queryRef) => mockFirestore.getDocs(queryRef);
export const onAuthStateChanged = (authInstance, callback) => mockAuth.onAuthStateChanged(callback);
export const signInWithGoogle = mockAuth.signInWithGoogle;
export const signOut = mockAuth.signOut;
