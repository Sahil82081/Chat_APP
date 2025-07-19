import { createContext, useEffect, useState } from "react";
import { get_users } from "../urls/url"
import axios from "axios";
export const StateContext = createContext(null)

export const StateProvider = (props) => {
    const [UserID, SetUserid] = useState()
    const [slide_state, set_slide_state] = useState('wait')
    const [token, SetToken] = useState(localStorage.getItem('token' || null))
    const [calling_user_id, Set_calling_userid] = useState(null)
    const [isplay, SetIsPlay] = useState(false)
    const [isposting, SetIsPosting] = useState(false)
    const [isStatus, SetIsStatus] = useState(false)
    const [curr_status_user, Set_Curr_Status_User] = useState(null)
    const [isEditStatus, setEditStatus] = useState(false)
    const [users, setUsers] = useState([])
    const [username, setUserName] = useState("")
    const [userstatus, SetUserStatus] = useState({
        status: []
    })
    const [isloading, setIsLoading] = useState(false)


    const get_user = async () => {
        try {
            axios.get(`${get_users}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then((res) => {
                if (res.status == 404 || res.status == 500) {
                }
                else {
                    console.log(res)
                    setUsers(res.data.all_user)
                    setUserName(res.data.username.name)
                    SetUserid(res.data.id)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (token) {
            get_user();
        }
    }, [token])


    return (
        <StateContext.Provider value={{
            slide_state,
            set_slide_state,
            SetToken, token,
            calling_user_id,
            Set_calling_userid,
            SetIsPlay,
            isplay,
            users,
            username,
            UserID,
            SetIsPosting,
            isposting,
            SetIsStatus,
            isStatus,
            Set_Curr_Status_User,
            curr_status_user,
            setEditStatus,
            isEditStatus,
            SetUserStatus,
            userstatus,
            isloading, setIsLoading
        }}>
            {props.children}
        </StateContext.Provider>
    )
}