/**
 * Created by Blazers on 2015/11/23.
 */
import alt from '../alt';

class CharacterActions {
    constructor() {
        this.generateActions(
            'getCharacterSuccess',
            'getCharacterFail',
            'reportSuccess',
            'reportFail'
        );
    }

    getCharacter(characterId) {
        $.ajax({url: '/api/characters/' + characterId})
            .done((data)=>{
                this.actions.getCharacterSuccess(data);
            })
            .fail((jqXhr)=>{
                this.actions.getCharacterFail(jqXhr);
            });
    }

    report(characterId) {
        $.ajax({
            type: 'POST',
            url: '/api/report',
            data: {characterId: characterId}
        }).done((data)=>{
            this.actions.reportSuccess(data);
        }).fail((jqXhr)=>{
            this.actions.reportFail(jqXhr);
        });
    }
}

export default alt.createActions(CharacterActions);