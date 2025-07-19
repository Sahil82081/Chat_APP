import React, { useContext, useEffect, useRef, useState } from 'react'
import { StateContext } from '../Provider/StateProvider';
import axios from 'axios';
import { uploadstatus } from '../urls/url';
import Loader from '../components/Loader';

function Add_Stories() {
    const [fileupload, setFileUpload] = useState(null)
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [caption, setCaption] = useState("")
    const { SetIsPosting, token,setIsLoading  } = useContext(StateContext)
    const statusref = useRef(null)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileUpload(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleCloseAddPost = (e) => {
        if (statusref.current == e.target) {
            SetIsPosting(false)
        }
    }
    const handleSubmission = async () => {
        if (!fileupload) {
            return
        }
        setIsLoading(true)
        const formData = new FormData();
        formData.append('fileupload', fileupload);
        formData.append('caption', caption)
        const header = {
            "Content-Type": 'multipart/form-data',
            "Authorization": token
        }
        try {
            await axios.post(`${uploadstatus}`, formData, {
                headers: header
            })
                .then((res) => {
                    if (res.status == 200) {
                        setIsLoading(false)
                        setSelectedPhoto(null)
                        setCaption('')
                        SetIsPosting(false)
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div
            className='h-screen w-screen flex justify-center items-center z-2 absolute top-0 '
            ref={statusref}
            onClick={handleCloseAddPost}
            style={{ backgroundColor: "#000000c9" }} >
            <div className='bg-yellow-100 flex flex-col justify-center items-center border rounded-xl '>
                <div className='h-60 flex justify-center items-center border-dashed '>
                    <div className='post_photo border rounded-xl h-fit'>
                        {selectedPhoto ?
                            <img src={selectedPhoto} className='h-56' alt="" />
                            :
                            <label htmlFor="post" className='text-lg bg-yellow-300 px-3 py-2 '>Choose photo</label>}
                        <input
                            type="file"
                            id='post'
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className='flex flex-col p-4 gap-3 items-center'>
                    <input type="text"
                        className='p-1 text-lg rounded-xl'
                        placeholder='Caption'
                        name='caption'
                        onChange={(e) => setCaption(e.target.value)}
                        value={caption} />
                    <button className='text-lg bg-yellow-300 h-fit px-3 rounded-xl py-2'
                        onClick={handleSubmission}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Add_Stories