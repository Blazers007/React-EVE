import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
    constructor() {
        this.bindActions(NavbarActions);
        // 初始化State
        this.totalCharacters = 0;
        this.onlineUsers = 0;
        this.searchQuery = '';
        this.ajaxAnimationClass = '';
    }

    onFindCharacterSuccess(payload) {
        payload.history.pushState(null, '/characters/' + payload.characterId); // 采用新的history导航
    }

    onFindCharacterFail(payload) {
        payload.searchForm.classList.add('shake');
        setTimeout(() => {
            payload.searchForm.classList.remove('shake');
        }, 1000);
    }

    /**
     * 通过Component中监听的IO.Socket并发送人数更新Action给 Action 随后Action直接分发处理结果至Store Stroe再去更新？ 为何不直接更新state? => 分离逻辑符合Flux结构
     * */
    onUpdateOnlineUsers(data) {
        this.onlineUsers = data.onlineUsers;
    }

    /**
     * 添加 fadeIn fadeOut 动画效果
     * */
    onUpdateAjaxAnimation(className) {
        this.ajaxAnimationClass = className; //fadein or fadeout
    }

    /**
     * 由于Input的Value与state绑定 必须更改state才能更新Input的内容
     * */
    onUpdateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }

    onGetCharacterCountSuccess(data) {
        this.totalCharacters = data.count;
    }

    onGetCharacterCountFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }
}

export default alt.createStore(NavbarStore);