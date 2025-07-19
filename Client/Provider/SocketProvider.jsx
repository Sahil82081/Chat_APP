import { createContext, useMemo, useState } from "react";
import { io } from 'socket.io-client'
export const SocketContext = createContext(null)

export const SocketProvider = (props) => {

    const [onUser, SetOnUser] = useState([])
    const socket = useMemo(
        () => io("http://localhost:8000/"),
        []
    );

    socket.on("online-users", (data) => {
        SetOnUser(data)
    })

    return (
        <SocketContext.Provider value={{ socket, onUser }}>
            {props.children}
        </SocketContext.Provider>
    )
}