/**
 * Created by Blazers on 2015/11/23.
 */
import React from 'react';
import CharacterActions from '../actions/CharacterActions';
import CharacterStore from '../stores/CharacterStore';

class Character extends React.Component {
    constructor(props) {
        super(props);
        this.state = CharacterStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        CharacterStore.listen(this.onChange);
        CharacterActions.getCharacter(this.props.params.id); // 根据URL来查找id

        /**
         * Note
         I haven't had any success with using ref="magnificPopup" to initialize the plugin, that's why I left it as is. This might not be the best way, but it works.
         * */
        $('.magnific-popup').magnificPopup({
            type: 'image',
            mainClass: 'mfp-zoom-in',
            closeOnContentClick: true,
            midClick: true,
            zoom: {
                enabled: true,
                duration: 300
            }
        });
    }

    componentWillUnmount() {
        CharacterStore.unlisten(this.onChange);
        $(document.body).removeClass(); // 移除class属性 恢复原有的样式  *现样式为全屏幕
    }

    componentDidUpdate(prevProps) {
        // 当从一个Profile页面移动至另一个Profile页面的时候 组件并不会重新mount
        if (prevProps.params.id !== this.props.params.id) {
            CharacterActions.getCharacter(this.props.params.id);
        }
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        return (
            <div className='container'>
                <div className='profile-img'>
                    <a className='magnific-popup' href={'https://image.eveonline.com/Character/' + this.state.characterId + '_1024.jpg' }>
                        <img src={'https://image.eveonline.com/Character/' + this.state.characterId + '_256.jpg'}/>
                    </a>
                </div>
                <div className='profile-info clearfix'>
                    <h2><strong>{this.state.name}</strong></h2>
                    <h4 className='lead'>Race: <strong>{this.state.race}</strong></h4>
                    <h4 className='lead'>Bloodline: <strong>{this.state.bloodline}</strong></h4>
                    <h4 className='lead'>Gender: <strong>{this.state.gender}</strong></h4>
                    <button className='btn btn-transparent' onClick={CharacterActions.report.bind(this, this.state.characterId)} disabled={this.state.isReported}>
                        {this.state.isReported ? 'Reported' : 'Report Character'}
                    </button>
                </div>
                <div className='profile-stats clearfix'>
                    <ul>
                        <li><span className='stats-number'>{this.state.winLossRatio}</span>Winning Percentage</li>
                        <li><span className='stats-number'>{this.state.wins}</span> Wins</li>
                        <li><span className='stats-number'>{this.state.losses}</span> Losses</li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Character;
