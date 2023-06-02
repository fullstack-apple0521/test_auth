import React, { createContext, useContext, useEffect, useState } from "react";
import { app, db, auth } from '../../firebase.config';
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext({}); 

export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
    children: React.ReactNode,
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
        if(user) {
            setUser(user);
        } else {
            setUser(null);
        }
        setIsLoading(false);
    });

    useEffect( () => {
        unsubscribe();
    }, [] );

    return (
        <AuthContext.Provider value={{ user }}>
            {
                isLoading ? (
                    <div className="">
                        Loading...
                    </div>
                ) : (
                    children
                )
            }
        </AuthContext.Provider>
    )
}