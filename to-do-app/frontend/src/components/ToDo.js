import React from 'react'

const ToDo = ({text, updateMode, deleteToDo}) => {
    return (
        <div className="todo">
            <div className="text">{text}</div>
            <div className="icons">
                <BiEdit className='icon' onClick={updateMode} />
                <AifillDelete className='icon' onClick={deleteToDo} />
            </div>
        </div>
    )
}

export default ToDo