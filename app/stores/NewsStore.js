import alt from '../alt';
import NewsActions from '../actions/NewsActions';

class NewsStore {
	constructor() {
		this.bindActions(NewsActions);

		// 初始化测试state
		var array = [];
		for (let i = 0; i < 100 ; i ++) {
			array.push('element' + i);
		}
		this.elements = array;
		this.index = 100;
	}

	onLoadMoreSuccess() {
		for (let i = this.index; i < this.index+100 ; i ++) {
			this.elements.push('element' + i);
		}
		this.index += 100;
	}

	onLoadMoreFail() {
		this.errer = 'Loadmore Failed';
	}
}

export default alt.createStore(NewsStore);