import React from 'react';
import style from './clientlibs/notfound.scss'

function NotFound() {
    return (
        <div className={style.notFoundWrapper}>
            <p>File not Found</p>
        </div>
    );
}

export default NotFound;
