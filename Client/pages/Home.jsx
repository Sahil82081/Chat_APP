import React, { useContext, useEffect, useState, useRef } from 'react'
import Contact from '../components/Contact'
import Search from '../icon/Search'
import { useNavigate } from 'react-router-dom'
import { StateContext } from '../Provider/StateProvider'
import axios from 'axios'
import { get_users, search_user } from '../urls/url'
import { SocketContext } from '../Provider/SocketProvider'
import { WebRTCContext } from '../Provider/WebRTC'
import phonecall from '../Photo/phone.png'
function Home() {
    const navigate = useNavigate()
    const { token, SetIsPlay, isplay, users, username, UserID } = useContext(StateContext)
    const [searched, setSearched] = useState([])
    const [isUserSearch, setUserSearch] = useState(false)
    const [text, setText] = useState({
        search: ""
    })
    const { socket } = useContext(SocketContext)
    const { CreateOffer, AcceptAnswer, CreateAnswer, Peer, SendTracks, setRemotestream, remotestresam, disconnect } = useContext(WebRTCContext)

    const audioRef = useRef(null)
    const isPlayingRef = useRef(false)
    useEffect(() => {
        if (!token) {
            navigate('/signup')
        }
    }, [token])

    useEffect(() => {
        socket.emit("save-user", UserID)
    }, [UserID])


    useEffect(() => {
        socket.on("receive-msg", () => {
            get_users()
        })
        return () => (
            socket.off("receive-msg")
        )
    }, [])

    useEffect(() => {
        if (audioRef.current && remotestresam) {
            audioRef.current.srcObject = remotestresam
            audioRef.current.onloadedmetadata = () => {
                console.log('Audio metadata loaded')
                if (!isPlayingRef.current) {
                    isPlayingRef.current = true
                    audioRef.current.play().then(() => {
                        console.log('Audio playback started successfully');
                    }).catch(error => {
                        console.error('Error attempting to play:', error)
                        isPlayingRef.current = false
                    })
                }
            }
        }
    }, [remotestresam])

    const handleCalling = async (id) => {
        localStorage.setItem('callingid', id)
        const offer = await CreateOffer()
        socket.emit("Calling", { id, offer })
    }
    const handleIncomingCall = async (data) => {
        console.log("Incoming Call")
        const { offer, userid } = data
        const Ansoffer = await CreateAnswer(offer)
        socket.emit("InCall-Accepted", { Ansoffer, userid })
    }

    const handleAccepted = async (Ansoffer) => {
        console.log("Call Accepted")
        await AcceptAnswer(Ansoffer)
    }

    const handlestream = async () => {
        console.log("Connected")
        const Stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        SendTracks(Stream)
    }
    const negotiationhandle = () => {
        console.log("negotiationneeded : ")
        const callingid = localStorage.getItem('callingid')
        if (callingid) {
            handleCalling(callingid)
            localStorage.removeItem('callingid')
        }
    }
    const trackhandle = (ev) => {
        console.log("negotiationCompleted")
        const stream = ev.streams[0]
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length > 0) {
            console.log("Audio track received");
            setRemotestream(stream);
            console.log(isplay)
            SetIsPlay(true)
        } else {
            console.log("No audio track received");
        }
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setText((prev) => ({ ...prev, [name]: value }))
    }

    const hanldeSearch = async () => {
        if (text.search == "") {
            return
        }
        try {
            axios.post(`${search_user}`, text, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then((res) => {
                setUserSearch(true)
                setSearched(res.data.search_user)
            })
        } catch (error) {
        }
    }

    useEffect(() => {
        socket.on("Incomming-Calling", handleIncomingCall)
        socket.on("Call-Accepted", handleAccepted)
        return () => {
            socket.off("Incomming-Calling", handleIncomingCall)
            socket.off("Call-Accepted", handleAccepted)
        }
    }, [socket, handleIncomingCall, handleAccepted])

    useEffect(() => {
        if (text.search == "") {
            setUserSearch(false)
        }
    }, [text.search])



    useEffect(() => {
        Peer.addEventListener('signalingstatechange', handlestream)
        Peer.addEventListener('negotiationneeded', negotiationhandle)
        Peer.addEventListener('track', trackhandle)
        return () => {
            Peer.removeEventListener('signalingstatechange', handlestream)
            Peer.removeEventListener('negotiationneeded', negotiationhandle)
            Peer.removeEventListener('track', trackhandle)
        }
    }, [Peer, handlestream, negotiationhandle, trackhandle])

    return (
        <div className='overflow-auto h-full'>
            <div className='bg-yellow-100 p-4 hidden lg:block'>
                <h1 className='text-xl font-bold'>Chats</h1>
            </div>
            <div className='sm:flex align-middle justify-center'>
                <div className='flex gap-2 p-2 flex-1'>
                    <input type="text"
                        placeholder='Search'
                        className='border flex-1 p-1 px-4 border-black rounded-2xl'
                        name='search'
                        value={text.search}
                        onChange={handleChange} />
                    <Search func={hanldeSearch} />
                </div>
                {isplay ?
                    <div className='flex gap-3' style={{ alignItems: "center", justifyContent: "center" }}>
                        <audio ref={audioRef} autoPlay controls className=''></audio>
                        <img src={phonecall} alt="" className='h-8 w-8' onClick={() => {
                            disconnect()
                            SetIsPlay(false)
                        }} />
                    </div>
                    : ''}
            </div>
            {
                isUserSearch
                    ?
                    <div className='flex flex-col gap-1 h-full '>
                        <div className='text-sm text-gray-400 flex justify-center align-middle'>
                            <p>Users Related to {text.search}</p>
                        </div>
                        {searched.length == 0 ?
                            <div className='flex justify-center h-full' style={{ alignItems: "center" }}>
                                No User is Here
                            </div>
                            :
                            searched.map((user) => (
                                <Contact user={user} key={user._id} func={handleCalling} />
                            ))
                        }
                        <hr className='border-gray-400' />
                    </div>
                    :
                    <>
                        <div className='flex justify-center align-middle text-lg p-2'>
                            <p>Hello, {username}</p>
                        </div>
                        <hr className='border-gray-400' />
                        <div className='flex flex-col gap-1 h-full'>
                            {users.length == 0 ?
                                <div className=' flex justify-center items-center text-lg h-full'>
                                    No Chat Here
                                </div>
                                :
                                users.map((user) => (
                                    <Contact user={user} key={user._id} func={handleCalling} />
                                ))
                            }
                        </div>
                    </>
            }
        </div>
    )
}
export default Home