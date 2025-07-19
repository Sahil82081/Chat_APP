import React from 'react'

function Search() {
    return (
        <div className='overflow-auto h-full'>
            <div className='bg-yellow-100 p-4 hidden lg:block'>
                <h1 className='text-xl font-bold'>Chats</h1>
            </div>
            <div className='sm:flex align-middle justify-center'>
                <div className='flex gap-2 p-2 flex-1'>
                    <input type="text" placeholder='Search' className='border flex-1 p-1 px-4 border-black rounded-2xl' />
                    <Search />
                </div>
            </div>
        </div>
    )
}

export default Search