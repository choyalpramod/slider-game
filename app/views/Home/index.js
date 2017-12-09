import React from 'react';
import Game from '../../section/components/Game';

export default class Home extends React.Component {

    constructor(props){
        super(props);
    }

	render() {
        return(
            <div>
                <Game />
            </div>
        )
    }
}