import React from 'react';
import './index.scss';

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        let localStore = localStorage.getItem('instamojoGame');
        if(localStore){
            this.state = (JSON.parse(localStore));
        }
        else{
            this.state = ({
                currentState: null, 
                input: null,
                steps: [],
                stepsIndex: -1
            });            
        }
    }

    render() {
        localStorage.setItem('instamojoGame', JSON.stringify(this.state));
        let inputAttr = {
            type: "text",
            placeholder: "Give a number",
            onChange: this.changeInput.bind(this),
            className: 'padding-medium no-border'
        }
        if(this.state.input == 0 || this.state.input){
            inputAttr.value = this.state.input;
        }
        return (
            <div className="p-fixed-center game white-bg-color">
                <input {...inputAttr}/>
                {this.getUITable()}
                {this.getBottomToolbar()}
            </div>
        )
    }

    getUITable(){
        if(!(this.state.input > 0)){
            return null;
        }
        let table = [...Array(Number(this.state.input))];
        return(
            <div className='padding-large'>
            <table className="table margin-center">
                <tbody>
                {table.map((item, index) => {
                    return (
                        <tr key={index} className="table-row">
                            {table.map((item2, index2) => {
                                let field = this.getAttrAndLabel(`${index}-${index2}`);
                                return (
                                    <td key={index2} {...field.attr}></td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
        )
    }

    getBottomToolbar(){
        let rewindAttr = {className: 'icon fa fa-arrow-left '};
        let forwardAttr = {className: 'icon fa fa-arrow-right '};
        if(!(this.state.input > 0)){
            return null;
        }

        if(this.state.stepsIndex <= 0){
            rewindAttr.className += 'disable ';
        }
        else{
            rewindAttr.onClick = this.rewind.bind(this, 1);
        }
        if((this.state.steps.length - 1) == this.state.stepsIndex){
            forwardAttr.className += 'disable ';
        }
        else{
            forwardAttr.onClick = this.forward.bind(this, 1);
        }
        return(
            <div className="full-width bottom-toolbar">
                <span {...rewindAttr}></span>
                <span {...forwardAttr}></span>
            </div>
        )
    }

    rewind(steps){
        this.setState({
            stepsIndex: this.state.stepsIndex - steps 
        });
        this.visitedBox(this.state.steps[this.state.stepsIndex - steps], true);
    }

    forward(steps){
        this.setState({
            stepsIndex: this.state.stepsIndex + steps 
        });
        this.visitedBox(this.state.steps[this.state.stepsIndex + steps], true);
    }
        
    changeInput(event) {
        let state = {};
        state.input = (event.target.value)? event.target.value : null;
        if (event.target.value > 1) {
            state.currentState = '0-0';
        }
        state.steps = ['0-0'];
        state.stepsIndex = 0;
        this.setState(state);
    }

    getAttrAndLabel(index) {
        let some = {
            attr: {
                className: 'table-col display-inline cursor-pointer '
            }
        };
        if(this.state.stepsIndex == (this.state.steps.length - 1)){
            some.attr.onClick = this.visitedBox.bind(this, index, false)
        }
        if (index == this.state.currentState) {
            some.attr.className += 'active';
        }
        return some;
    }

    visitedBox(index, rewindForwardPart = false) {
        let data = this.getIndexedArray(this.state.currentState, index);
        let i = 0;
        if(data.length > 0){
            let interval = setInterval(()=>{
                this.setState({
                    currentState: data[i++]
                });
                if(data.length == i){
                    clearInterval(interval);
                }
            }, 50);
            if(!rewindForwardPart){
                this.setState({
                    steps: [...this.state.steps, index],
                    stepsIndex: (this.state.stepsIndex + 1)
                });
            }
        }
    }

    getIndex(index){
        let splitIndex = index.split('-');
        let indexing = Number(splitIndex[0]) * Number(this.state.input) - 1;
        if(splitIndex[0]%2){
            indexing += Number(this.state.input) - Number(splitIndex[1]);
        }
        else{
            indexing += Number(splitIndex[1]) + 1;
        }
        return indexing;
    }

    getIndexedArray(fIndex, tIndex){
        let cIndex = this.getIndex(fIndex);
        let dIndex = this.getIndex(tIndex);
        let data = [];

        if(cIndex < dIndex){
            return this.getIndexArrayDownwards(fIndex, tIndex);
        }
        else if(cIndex > dIndex){
            return this.getIndexArrayUpwards(fIndex, tIndex);            
        }
        return data;
    }

    getIndexArrayDownwards(start, end, data = []){
        data.push(start);
        if(start == end){
            return data;
        }
        let splitIndex = start.split('-');
        if(splitIndex[0]%2){
            if(splitIndex[1] == 0){
                return this.getIndexArrayDownwards(`${Number(splitIndex[0])+1}-${splitIndex[1]}`, end, data);
            }
            else{
                return this.getIndexArrayDownwards(`${splitIndex[0]}-${Number(splitIndex[1])-1}`, end, data);
            }
        }
        else{
            if((Number(splitIndex[1])) + 1 == this.state.input){
                return this.getIndexArrayDownwards(`${Number(splitIndex[0])+1}-${splitIndex[1]}`, end, data);
            }
            else{
                return this.getIndexArrayDownwards(`${splitIndex[0]}-${Number(splitIndex[1])+1}`, end, data);
            }
        }
    }

    getIndexArrayUpwards(start, end, data = []){
        data.push(start);
        if(start == end){
            return data;
        }
        let splitIndex = start.split('-');
        if(Number(splitIndex[0])%2){
            if((Number(splitIndex[1])+1) == this.state.input){
                return this.getIndexArrayUpwards(`${Number(splitIndex[0])-1}-${splitIndex[1]}`, end, data);
            }
            else{
                return this.getIndexArrayUpwards(`${splitIndex[0]}-${Number(splitIndex[1])+1}`, end, data);
            }
        }
        else{
            if(Number(splitIndex[1]) == 0){
                return this.getIndexArrayUpwards(`${Number(splitIndex[0])-1}-${splitIndex[1]}`, end, data);
            }
            else{
                return this.getIndexArrayUpwards(`${splitIndex[0]}-${Number(splitIndex[1])-1}`, end, data);
            }
        }     
    }
}