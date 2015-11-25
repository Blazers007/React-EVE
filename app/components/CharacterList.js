/**
 * Created by Blazers on 2015/11/24.
 */
import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';
import CharacterListActions from '../actions/CharacterListActions';
import CharacterListStore from '../stores/CharacterListStore';

class CharacterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = CharacterListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        CharacterListStore.listen(this.onChange);
        CharacterListActions.getCharacters(this.props.params);
    }

    componentWillUnmount() {
        CharacterListStore.unlisten(this.onChange);
    }

    componentDidUpdate(prevProps) {
        // 当从一个Profile页面移动至另一个Profile页面的时候 组件并不会重新mount
        if (!isEqual(prevProps.params, this.props.params)) {
            CharacterListActions.getCharacters(this.props.params);
        }
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        let charactersList = this.state.characters.map((character, index) => {
            return (
                <div key={character.characterId} className='list-group-item animated fadeIn'>
                    <div className='media'>
                        <span className='position pull-left'>{index + 1}</span>
                        <div className='pull-left thumb-lg'>
                            <Link to={'/characters/' + character.characterId}>
                                <img className='media-object' src={'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg'} />
                            </Link>
                        </div>
                        <div className='media-body'>
                            <h4 className='media-heading'>
                                <Link to={'/characters/' + character.characterId}>{character.name}</Link>
                            </h4>
                            <small>Race: <strong>{character.race}</strong></small>
                            <br />
                            <small>Bloodline: <strong>{character.bloodline}</strong></small>
                            <br />
                            <small>Wins: <strong>{character.wins}</strong> Losses: <strong>{character.losses}</strong></small>
                        </div>
                    </div>
                </div>
            );
        });
        //
        return (
            <div className='container'>
                <div className='list-group'>
                    {charactersList}
                </div>
            </div>
        )
    }
}

export default CharacterList;
