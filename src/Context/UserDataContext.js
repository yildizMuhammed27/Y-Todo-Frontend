import React from "react";
import { createContext } from "react";

export const UserDataContext = createContext()

export function UserDataProvider (props) { 

    const [userName, setUserName] = React.useState("muhammed@outlook.de")

    return (
        <UserDataContext.Provider value={{userName, setUserName}}>
            {props.children}
        </UserDataContext.Provider>
    );
 }