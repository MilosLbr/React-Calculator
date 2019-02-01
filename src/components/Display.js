import React from 'react';

export const Display = ({displayText, className}) => {
    return(
        <div className={className} >
            {displayText}
        </div>
    )
}