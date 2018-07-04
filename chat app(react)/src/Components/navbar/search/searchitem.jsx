import React from 'react';

const Item = ({photo,username,email,userid}) => {
        return (
            <div className="form-inline mb-1">
                <img src={photo} width="50px" height="50px" alt="searchresult"/><span>{username} <br></br>{email} </span>
            </div>
        )
}

export default Item;