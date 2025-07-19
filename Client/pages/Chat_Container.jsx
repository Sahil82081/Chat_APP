import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Backbtn from '../icon/Backbtn'
import profile from '../Photo/man.png'
import Chat from '../components/Chat'
import { useNavigate, useParams } from 'react-router-dom'
import { SocketContext } from '../Provider/SocketProvider'
import { get_all_info_of_chat, save_msg } from '../urls/url'
import axios from 'axios'
import { StateContext } from '../Provider/StateProvider'


function Chat_Container() {
    const navigate = useNavigate()
    const { id } = useParams()
    const Chat_Container_Ref = useRef(null)
    const screenview = useRef(null)
    const { socket, onUser } = useContext(SocketContext)
    const { token } = useContext(StateContext)
    const [allchats, SetAll_Chats] = useState([])
    const [name, SetName] = useState()
    const [ison, setIsOn] = useState(false)
    const [chat, setChat] = useState({
        text: ""
    })

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleSubmission = async () => {
        const { text } = chat
        const time = getCurrentTime()
        const msg = { text, id, time }
        SetAll_Chats((prev) => ([...prev, { fromself: true, text, time }]))
        socket.emit("msg-send", { id, text, time })
        try {
            await axios.post(`${save_msg}`, msg, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
                .then((res) => {
                    console.log(res.data)
                })
        } catch (error) {
            console.log(error)
        }
        setChat({ text: "" })
    }

    const ReciveMessage = ({ text, time }) => {
        SetAll_Chats((prev) => ([...prev, { fromself: false, text, time }]))
    }

    const handleChats = useCallback(({ chat, userid }) => {
        const chats = chat.map(({ message, time }) => (
            { fromself: message.from == userid ? true : false, text: message.text, time }
        ))
        SetAll_Chats(chats)
    }, [])

    const get_all_chtas = async () => {
        try {
            await axios.get(`${get_all_info_of_chat}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then((res) => {
                SetName(res.data.name)
                SetAll_Chats(res.data.chats)
                handleChats({ chat: res.data.chats, userid: res.data.id })
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_all_chtas()
    }, [])

    useEffect(() => {
        if (onUser.length == 1) {
            setIsOn(false)
        }
        onUser.map((onlineID) => {
            if (onlineID == id) {
                setIsOn(true)
                return
            }
        })
    }, [onUser])

    useEffect(() => {
        socket.on("receive-msg", ReciveMessage)
        return () => (
            socket.off("receive-msg", ReciveMessage)
        )
    }, [])

    useEffect(() => {
        Chat_Container_Ref.current.scrollTop = Chat_Container_Ref.current.scrollHeight
    }, [allchats])

    const preventWindowScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };


    const adjustChatContainerHeight = () => {
        const viewportHeight = window.visualViewport.height;
        screenview.current.style.height = `${viewportHeight}px`;
    }
    useEffect(() => {
        adjustChatContainerHeight()
        window.addEventListener('resize', adjustChatContainerHeight);
        window.addEventListener('load', adjustChatContainerHeight);
        return () => {
            window.removeEventListener('resize', adjustChatContainerHeight);
            window.removeEventListener('load', adjustChatContainerHeight);
        };
    }, [])

    return (
        <div className='flex flex-col h-screen' ref={screenview}>
            <div className='flex px-5 py-4 gap-6 items-center bg-yellow-300'>
                <Backbtn onclick_func={() => { navigate('/') }} />
                <div className='flex items-center gap-4 text-lg'>
                    <img src={profile} style={{ height: '50px', width: "50px" }} />
                    <div>
                        <p>{name}</p>
                        <p className={`text-sm ${ison ? 'text-green-600' : 'text-grey-600'}`}>{ison ? "online" : "offline"}</p>
                    </div>
                </div>
            </div>
            <div className='flex-1 bg-yellow-100 overflow-auto' ref={Chat_Container_Ref} >
                <div className='flex flex-col h-full'>
                    {allchats.length != 0 ? (
                        allchats.map((msg, index) => (
                            <Chat data={msg} key={index} />
                        ))
                    ) : <div className='h-full w-full flex justify-center items-center'>No Messages</div>}
                </div>
            </div>
            <div className='flex gap-4 p-3  bg-yellow-300'>
                <input type="text" placeholder='Enter Message Here' className='border flex-1 p-1 px-4 border-black 
                rounded-xl' value={chat.text} onChange={(e) => { setChat({ text: e.target.value }) }} />
                <button className='bg-yellow-100 px-4 py-1 rounded-xl' onClick={handleSubmission}>Send</button>
            </div>
        </div>
    )
}

export default Chat_Container