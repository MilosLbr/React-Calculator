import React , { Component } from 'react';
import { RowOfButtons } from  './RowOfButtons.js';
import { Display } from './Display.js';
import { CalculatorButton } from './CalculatorButton.js';


const mathOperationSymbol = /[\/*+-]/;

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            mathFormula: '',
            currentNumber: '0',
            lastClicked : '',
            isNumberToggled: 'positive'
        }
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.equalize = this.equalize.bind(this);
        this.clearEntry = this.clearEntry.bind(this);
        this.clear = this.clear.bind(this);
        this.backspace = this.backspace.bind(this);
        this.addDecimal = this.addDecimal.bind(this);
        this.handleKeyboardEvent = this.handleKeyboardEvent.bind(this);
        this.toggleNegation = this.toggleNegation.bind(this);

        this.containerDivRef = React.createRef();
    }

    componentDidMount(){
        console.log('component did mount');
        this.containerDivRef.current.focus();
    }

    handleButtonClick(buttonText){
        // this method handles clicking on a digit or on a math operation sign
        let clickedButton = buttonText.toString();

        this.setState(prevState => {
            let mathFormula = prevState.mathFormula.slice();
            let currentNumber = prevState.currentNumber.slice();
            let lastClicked = prevState.lastClicked.slice();

            if(lastClicked === '=' && clickedButton.match(/\d/)){ // if last operation is finished, begin new entry
                currentNumber = clickedButton;
                lastClicked = clickedButton;
                return{
                    currentNumber,
                    lastClicked
                }

            }
            else if(clickedButton.match(/\d/)){  // if any from 0-9 is clicked
                if(currentNumber === '0'){  // do not allow a number to begin with multiple zeros;
                    return{
                        currentNumber: clickedButton,
                        lastClicked: clickedButton,
                    }
                }else{
                    if(lastClicked.match(mathOperationSymbol)){
                        currentNumber = currentNumber.replace(mathOperationSymbol,''); // if last button clicked was a symbol, erase it from current number so that only one math operation is visible on display;

                        currentNumber += clickedButton;
                    }else{
                        currentNumber += clickedButton;
                    }
                    

                    return{
                        currentNumber: currentNumber,
                        lastClicked: clickedButton
                    }
                }
            }
            else if(clickedButton.match(mathOperationSymbol)){  // if + - / or * is clicked
                
                if(mathFormula.slice(-1).match(mathOperationSymbol) && !lastClicked.match(/\d|\.|toggle/)){
                    // if two or more operators are clicked consecutevely, only the last operator should be entered
                    mathFormula = mathFormula.replace(/.$/, clickedButton); // replaces last character of a string
                    
                }else{
                    mathFormula += currentNumber+clickedButton;
                    // later asigning of currentNumber to clickedButton leaves only the operation symbol in the lower display
                }
                return{
                    currentNumber:clickedButton,
                    lastClicked: clickedButton,
                    mathFormula: mathFormula
                }
            }
        });

        this.containerDivRef.current.focus();  // lose the clicked button focus so the keyboard event works again on a div
    }

    equalize(){
        this.setState(prevState => {
            let mathFormula = prevState.mathFormula;
            let currentNumber = prevState.currentNumber;
            let result;

            if(currentNumber.match(/\d/)){
                mathFormula += currentNumber;
                result = Math.round(eval(mathFormula)*1000000)/1000000; // rounding to 6 decimal places
                result = result.toString();
                
                
            }else{
                mathFormula = mathFormula.replace(/.$/, '');
                result = Math.round(eval(mathFormula)*1000000)/1000000;
                result = result.toString();
            }
            
            return{
                mathFormula: '',
                currentNumber: result,
                lastClicked: '='
            }
            
        });

        
        this.containerDivRef.current.focus();
    }

    clearEntry(){
        this.setState({
            currentNumber:'0'
        });
        
        this.containerDivRef.current.focus();
    }

    clear(){
        this.setState(
            {
                mathFormula: '',
                currentNumber: '0',
                lastClicked : '',
                isNumberToggled: 'positive'
            }
        );
        
        this.containerDivRef.current.focus();
    }

    backspace(){
        const lastClicked = 'backspace';

        this.setState(prevState => {
            let { currentNumber } = prevState;

            if(currentNumber === '0' ){
                currentNumber = '0';
            }else{
                currentNumber = currentNumber.replace(/.$/, ''); // removes last character of a string

                if(currentNumber === '' || currentNumber === ' -' || currentNumber === ' -0' || currentNumber === '-'){
                    currentNumber = '0';
                }
            }
            
            return{
                currentNumber,
                lastClicked
            }
        });
        
        this.containerDivRef.current.focus();
    }

    addDecimal(){

        this.setState(prevState => {
            let {currentNumber,lastClicked} = prevState;

            if(!currentNumber.match(/\./)){  // two dots .. in one number are not allowed
                if(lastClicked.match(mathOperationSymbol) ){
                    currentNumber = '0.';
                }else{
                    currentNumber += '.';
                }
            }
            return{
                currentNumber,
                lastClicked: '.'
            }
        });
        
        this.containerDivRef.current.focus();
    }

    toggleNegation(){
        const lastClicked = 'toggleNegation';

        this.setState(prevState => {
            let {currentNumber, isNumberToggled} = prevState;

            if(currentNumber.match(/\d/g)){
                if(currentNumber === '0'){
                    return prevState;
                }else if(currentNumber.startsWith(' -')){
                    currentNumber = currentNumber.replace(' -','');
                    isNumberToggled = 'positive';
                }else if(currentNumber.startsWith('-')){  // when we get a negative result after clicking = it starts with - without whitespace, this allows to manipulate the result
                    currentNumber = currentNumber.replace('-','');
                    isNumberToggled = 'positive';
                }
                else{
                    currentNumber = ' -' + currentNumber;
                    isNumberToggled = 'negative';
                }
                return{
                    currentNumber,
                    lastClicked,
                    isNumberToggled
                }
            }else{
                return prevState;
            }
        });
        
        this.containerDivRef.current.focus();
    }

    handleKeyboardEvent(e){
        const pressedKey = e.key;

        if(pressedKey.match(mathOperationSymbol)){
            this.handleButtonClick(pressedKey);
        }else if(pressedKey.match(/\.|,/)){
            this.addDecimal();
        }else if(pressedKey.match(/^\d/)){
            this.handleButtonClick(pressedKey);
        }else if(pressedKey.match('Backspace')){
            this.backspace();
        }else if(pressedKey.match('Enter')){
            this.equalize();
        }else if(pressedKey.match('Delete')){
            this.clear();
        }
    }

    render(){
        return (
        <div>
            <div className = "appContainer" tabIndex='0' onKeyDown = {this.handleKeyboardEvent} ref={this.containerDivRef}>
            <div className='displayContainer'>
                <Display displayText={this.state.mathFormula} className='display displayTop'/>
                <Display displayText ={this.state.currentNumber} className='display displayBottom'/>
            </div>
           
            
            {/* top row */}
            <div className='controlsContainer'>
                <div className="calculatorRow"> 
                    <CalculatorButton text="CE" handleButtonClick={this.clearEntry} className='btnDanger'/>
                    <CalculatorButton text="C" handleButtonClick={this.clear} className='btnDanger'/>
                    <CalculatorButton text="⇐" handleButtonClick={this.backspace} className='btnWarning'/>
                    <CalculatorButton text="/" handleButtonClick={this.handleButtonClick}/>
                </div>
                {/* top row */}

                <RowOfButtons buttonTexts={[7,8,9,'*']} handleButtonClick={this.handleButtonClick} />

                <RowOfButtons buttonTexts={[4,5,6,'-']} handleButtonClick={this.handleButtonClick} />

                <RowOfButtons buttonTexts={[1,2,3,'+']} handleButtonClick={this.handleButtonClick} />

                {/* bottom row */}
                <div className='calculatorRow'> 
                    <CalculatorButton text="±" handleButtonClick={this.toggleNegation}/>
                    <CalculatorButton text="0" handleButtonClick={this.handleButtonClick}/>
                    <CalculatorButton text="." handleButtonClick={this.addDecimal}/>
                    <CalculatorButton text="=" handleButtonClick={this.equalize} className='btnEqualize'/>
                </div>
                {/* bottom row */}

            </div>

            </div>
        </div>
        )        
    }
}

export default App;