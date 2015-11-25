/**
 * Created by Blazers on 2015/11/23.
 */
import alt from '../alt';
import CharacterActions from '../actions/CharacterActions'
import _ from 'underscore';

class CharacterStore {
    constructor() {
        this.bindActions(CharacterActions);
        // Init Vars
        this.characterId = 0;
        this.name = 'TBD';
        this.race = 'TBD';
        this.bloodline = 'TBD';
        this.gender = 'TBD';
        this.wins = 0;
        this.losses = 0;
        this.winLossRatio = 0;
        this.isReported = false;
    }

    onGetCharacterSuccess(data) {
        //console.log(data);
        _.assign(this, data); // data值copy至自己
        $(document.body).attr('class', 'profile ' + this.race.toLowerCase());
        let localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
        let reports = localData.reports || [];
        this.isReported = _.contains(reports, this.characterId);
        // 如果除以0 得到 NaN
        this.winLossRatio = ((this.wins / (this.wins + this.losses) * 100 ) || 0).toFixed(1);
    }

    onGetCharacterFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }

    onReportSuccess(data) {
        this.isReported = true;
        let localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
        localData.reports = localData.reports || [];
        localData.reports.push(this.characterId);
        localStorage.setItem('NEF', JSON.stringify(localData));
        toastr.warning('Character has been reported');
    }

    onReportFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }

}

export default alt.createStore(CharacterStore);