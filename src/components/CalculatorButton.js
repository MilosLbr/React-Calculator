import React from 'react';

export  const CalculatorButton = ({text, handleButtonClick, className}) => {
    const digitCSSclass = text.toString().match(/[\d±\.,]/);
    const operationCssClass = text.toString().match(/[\/*+-]/);

    const allClasses = "btn " + (className? className : '') +  (digitCSSclass? 'btnDigit ':'') + (operationCssClass ? 'btnOperation ': '');
    
    return(
        <button className={allClasses} onClick={() => handleButtonClick(text)}>{text}</button>
    )
}