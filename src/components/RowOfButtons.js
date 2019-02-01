import React from 'react';
import { CalculatorButton } from './CalculatorButton.js';

export const RowOfButtons = ({buttonTexts, handleButtonClick}) => {
    
    const buttons = buttonTexts.map((btText, idx) => <CalculatorButton key={idx} text={btText} handleButtonClick = {handleButtonClick}/>);

    return(
        <div className = 'calculatorRow'>
            { buttons }
        </div>
    )
}