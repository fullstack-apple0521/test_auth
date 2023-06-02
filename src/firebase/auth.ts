import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    sendPasswordResetEmail, 
    confirmPasswordReset, 
    signOut ,
} from "firebase/auth";
import {
    query, collection, getDocs, where, addDoc,
} from 'firebase/firestore';

export const signInWithGoogle = async (auth: any, db: any) => {
    try {
        const goolgeProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, goolgeProvider);
        const user = result.user;
        const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
        const docs = await getDocs(q);
        if(docs.docs.length === 0) {
            await addDoc(collection(db, 'users'), {
                uid: user?.uid,
                name: user?.displayName,
                authProvider: "google",
                email: user?.email,
                photoURL: user?.photoURL || "",
            });
        }
        return {
            status: true, message: "Successfully signed in!"
        }
    } catch (err: any) {
        return {
            status: false, message: "Failed!"
        }
    }
}

export const registerWithEmailAndPassword = async (auth: any, db: any, name: string, email: string, password: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await addDoc(collection(db, 'users'), {
            uid: user?.uid,
            name: name,
            authProvider: "local",
            email: user?.email,
            photoURL: user?.photoURL || ""
        });
        return { status: true, message: "Successfully signed up!" }
    } catch (err: any) {
        if (err.code === "auth/email-already-in-use") return {
            status: false, message: "Email already exist!"
        }
        else if(err.code === "auth/invalid-email") return {
            status: false, message: "Invalid email!"
        }
        else if(err.code === "auth/weak-password") return {
            status: false, message: "Weak Password!"
        }
        else return {
            status: false, message: "Failed!"
        }
    }
}

export const loginWithEmailAndPassword = async (auth: any, email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return {
            status: true, message: "Successfully signed in."
        }
    } catch (err: any) {
        if(err.code === "auth/invalid-email") return {
            status: false, message: "Invalid email!"
        } 
        else if(err.code === "auth/user-not-found") return {
            status: false, message: "User not found!"
        }
        else if(err.code === "auth/wrong-password") return {
            status: false, message: "Password is not correct!"
        }
        else return {
            status: false, message: "Failed sign in!"
        }
    }
}

export const sendPasswordReset = async (auth:any, db: any, email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);       
        return {
            status: true, message: "Password Changing request successfully accepted!"
        }
    } catch (err: any) {
        console.log(err.code);
        if (err.code === "auth/user-not-found") return {
            status: false, message: "User not exist!"
        }
        else if (err.code === "auth/invalid-email") return {
            status: false, message: "Invalid email!"
        }
        else return {
            status: false, message: "Failed!"
        }
    }
}

export const resetPasswordByLink = async (auth:any, code: string, newPassword: string) => {
    try {
        await confirmPasswordReset(auth, code, newPassword)
            .then(()=>{
                return {
                    status: true, message: "Password successfully changed!"
                }
            })
            .catch((err)=>{
                return {
                    status: false, error: err, message: "Failed changing password!"
                }
            })
    } catch (err) {
        return {
            status: false, error: err
        }
    }
}

export const logOut = async (auth: any) => {
    signOut(auth);
    return {
        status: true, message: "Successfully loged out!"
    }
}