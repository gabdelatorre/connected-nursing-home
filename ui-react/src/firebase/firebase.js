import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyCuSej-5sos-Ci7gCF5F8mY71gd0vzh84U",
    authDomain: "connected-nursing-home.firebaseapp.com",
    databaseURL: "https://connected-nursing-home.firebaseio.com",
    projectId: "connected-nursing-home",
    storageBucket: "connected-nursing-home.appspot.com",
    messagingSenderId: "669820416245"
};

class Firebase {
    constructor() {
        console.log("Firebase initialized");
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.firestore();

        const settings = {
            timestampsInSnapshots: true
        }

        this.db.settings(settings)
    }

    // ============================================================================
    // == Firebase Authentication API
    // ============================================================================
    doCreateUserWithEmailAndPassword = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () =>
    this.auth.signOut();

    // ============================================================================
    // == Firestore API
    // ============================================================================

    // == Users Document == //
    user = uid => this.db.doc("users/" + uid)
    users = () => this.db.collection("users")

    // == Patients Document == //

}

export default Firebase;