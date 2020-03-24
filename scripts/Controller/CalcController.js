 
class CalcController {

    constructor() {
        // this._displayCalc = "0" 
        this._audio = new Audio('click.mp3')
        this._audioOnOff = false;  
        this._lastOperator = '';
        this._lastNumber = ''
        this._operation = [];
        this._locale = 'pt-BR'
        this._displayCalEl = document.querySelector('#display');
        this._timeEl = document.querySelector('#hora');
        this._dataEl = document.querySelector('#data');
        this._currentDate;
        this.initialize();
        this.initButtonsEvent();
        this.initKeyBoard();


    }

    copyToClipBoard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;

        document.body.appendChild(input)
        input.select()
        document.execCommand('Copy')
    }

    pasteFromClipBoard(){

        document.addEventListener('paste',e=>{
            let text = e.clipboardData.getData('text')

            this.displayCalc = parseFloat(text)
            console.log(text)
        })

    }

    initialize() {
        // displayCalEl.innerHTML = '2 + 2'
        // this._timeEl.innerHTML = '2h';
        // this._dataEl.innerHTML = '21/12/2020';

        this.setDisplayTime()
        this.pasteFromClipBoard()

        setInterval(() => {

            this.setDisplayTime();

        }, 1000);

        this.setLastNumberOnDisplay()

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick',e=>{
                this.toggleAudio()
            })
        })

    }
    toggleAudio(){

        this._audioOnOff = !this._audioOnOff; //better way, if true will be false and so on
        // this._audioOnOff = (this._audioOnOff) ?false :  true;

    //     if(this._audioOnOff){
    //         this._audioOnOff = false
    //     }else{
    //         this._audioOnOff = true;
    //     }
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0
            this._audio.play()
        }
    }    

    initKeyBoard(){
        document.addEventListener('keyup',e=>{
            this.playAudio();
            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc()
                    break;
    
                case '.':
                case ',':
                    this.addDot('.');
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipBoard()

                    break;
            }
        })

    }
    

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        })

    }

    clearAll() {

        this._operation = []; //clear all
        this._lastNumber = '';
        this._lastOperator=''
        this.setLastNumberOnDisplay()
        

    }
    clearEntry() {

        this._operation.pop(); //remove the last digit

    }

    setLastOperator(value) {

        this._operation[this._operation.length - 1] = value

    }
    isOperator(value) {

        return (['+', '-', '*', '/', '%'].indexOf(value) > -1) //verify if has in the array the operator(value)

    }

    pushOperation(value) {

        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult() {
        try{
            return eval(this._operation.join(''));
        }catch(e){
            setTimeout(() => {
                this.setError()
            },1);
        }      
    }
    calc() {

        let last = '';
        this._lastOperator = this.getLastItem()

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {   

            last = this._operation.pop()
            this._lastNumber = this.getResult()

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false)

        }

        // console.log('lastOperator', this._lastOperator)
        // console.log('lastNumber', this._lastNumber)

        let result = this.getResult()

        if (last == '%') {

            result /= 100;
            this._operation = [result];

        } else {
            this._operation = [result];
            if (last) this._operation.push(last)

        }
        this.setLastNumberOnDisplay()

    }


    addDot(){
        let lastOperation = this.getLastOperation()
        
        if(typeof lastOperation==='string' && lastOperation.split('').indexOf('.') > -1) return

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.')
        }else{
            this.setLastOperator(lastOperation.toString() + '.')
        }
        this.setLastNumberOnDisplay()

        

    }

    getLastItem(isOperator = true) {
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }
        return lastItem
    }
    // }else{
    //     if (!this.isOperator(this._operation[i])) {
    //         lastItem = this._operation[i];
    //         break;
    //     }
    // }


    setLastNumberOnDisplay() {

        let lastNumber = this.getLastItem(false);
        // for (let i = this._operation.length - 1; i >= 0; i--) {
        //     if (!this.isOperator(this._operation[i])) {
        //         lastNumber = this._operation[i];
        //         break;
        //     }
        // }

        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }
    addOperation(value) {

        // console.log('A:',value,isNaN(this.getLastOperation()));
        if (isNaN(this.getLastOperation())) { //if the last operation before the value is number so the logic dont pass here

            //in this case:STRING
            if (this.isOperator(value)) {
                //change the operator
                this.setLastOperator(value);

            // } else
            // if (isNaN(value)) {
            //     //cai no ponto
            //     console.log('outra coisa', value);
            } else {
                this.pushOperation(value);
                this.setLastNumberOnDisplay()

            }

        } else {
            //in this case:NUMBER
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperator(newValue)  ;

                //mostrar na tela
                this.setLastNumberOnDisplay()
            }
        }
    }

    getLastOperation() {

        return this._operation[this._operation.length - 1];

    }
    setError() {

        this.displayCalc = 'Error';
    }

    execBtn(value) {
        this.playAudio()
        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc()
                break;

            case 'ponto':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));

                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvent() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => { //a new addEvent for more than one event
                let textBtn = btn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn)
            })

            this.addEventListenerAll(btn, 'mouseover mousedown mouseup', (e) => {
                btn.style.cursor = 'pointer';
            })
        })
    }


    setDisplayTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {

        this._timeEl.innerHTML = value;

    }

    get displayDate() {

        return this._dataEl.innerHTML;

    }

    set displayDate(value) {

        this._dataEl.innerHTML = value;

    }

    get displayCalc() {
        // return this._displayCalc; antes
        return this._displayCalEl.innerHTML;

    }

    set displayCalc(value) {
        // this._displayCalc = value;
        if(value.toString().length > 10) {
            this.setError();
            return false;   
        }
            
        this._displayCalEl.innerHTML = value;

    }

    get currentDate() {
        // return this._currentDate;
        return new Date();

    }

    set currentDate(value) {

        this._currentDate = value;

    }

}

