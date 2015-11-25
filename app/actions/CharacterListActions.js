/**
 * Created by Blazers on 2015/11/24.
 */
import alt from '../alt';

class CharacterListActions {
    constructor() {
        this.generateActions(
            'getCharactersSuccess',
            'getCharactersFail'
        );
    }

    getCharacters(payload) {
        let url = '/api/characters/top'; // base url  页面跳转放入AJAX进行处理 不直接在Router内部处理
        let params = {
            race: payload.race,
            bloodline: payload.bloodline
        };

        if (payload.category === 'female') {
            params.gender = 'female';
        } else if (payload.category === 'male') {
            params.gender = 'male';
        }

        if (payload.category === 'shame') {
            url = '/api/characters/shame';
        }

        $.ajax({url: url, data: params})
            .done((data) => {
                this.actions.getCharactersSuccess(data);
            })
            .fail((jqXhr) => {
                this.actions.getCharactersFail(jqXhr);
            });
    }
}

export default alt.createActions(CharacterListActions);