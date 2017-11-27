import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyBx0sD9fOYehun0Kq2hCbzlg4hF4_HO0qo",
    authDomain: "pontual-9763c.firebaseapp.com",
    databaseURL: "https://pontual-9763c.firebaseio.com",
    projectId: "pontual-9763c",
    storageBucket: "pontual-9763c.appspot.com",
    messagingSenderId: "388856072581"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;