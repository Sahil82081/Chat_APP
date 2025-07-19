import React from 'react'

function InputField({ filed, p_holder, filed_name, func, val }) {
    return (
        <div>
            <span className='flex flex-col gap-1 text-xl'>
                <p>{filed}</p>
                <input type="text" placeholder={p_holder} name={filed_name}
                    autoComplete='off'
                    className='px-2 py-1 rounded-lg'
                    onChange={func}
                    value={val} />
            </span>
        </div>
    )
}

export default InputField