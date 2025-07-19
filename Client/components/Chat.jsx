import React, { useEffect } from 'react'
import profile from '../Photo/man.png'
function Chat({ data }) {
    return (
        <div className='flex p-3 items-center gap-2' style={{
            justifyContent: data.fromself ? 'flex-end' : 'flex-start'
        }}>
            {data.fromself == true ? '' : (<img src={profile} style={{ height: '50px', width: "50px" }} />)}
            <div className='p-2 bg-yellow-300 border rounded-xl' style={{ maxWidth: "180px" }}>
                <p style={{ wordWrap: 'break-word' }} className='text-lg'>{data.text}</p>
                <div className='text-sm flex' style={{justifyContent:"end"}}>
                    {data.time}
                </div>
            </div>
            {data.fromself == true ? (<img src={profile} style={{ height: '50px', width: "50px" }} />) : ''}
        </div>
    )
}
export default Chat
