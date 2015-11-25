import alt            from '../alt';
import FooterActions  from '../actions/FooterActions';

class FooterStore {
    constructor() {
        // 绑定action 这样 action就可以通过 actions的处理结果来调用store相应函数
        this.bindActions(FooterActions);
        // 凡是Store里面的属性 均直接等同于 Component 内的 state 通过 getState()函数返回所有property
        this.characters = [];
    }

    // 内部所有方法被调用的时候 均会触发 该Store Listen的Component的onChange方法
    onGetTopCharactersSuccess(data) {
        this.characters = data.slice(0, 5); //截取 0-4 5个元素
    }

    onGetTopCharactersFail(jqXhr) {
        // Handle multiple response formats, fallback to HTTP status code number.
        toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}

export default alt.createStore(FooterStore);
