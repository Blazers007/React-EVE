import alt from '../alt';

class NewsActions {
	constructor() {
		this.generateActions(
			'loadMoreSuccess',
			'loadMoreFailed'
		);
	}

	loadMoreData() {
		// ajax
		setTimeout(()=>{
			this.actions.loadMoreSuccess();
		}, 3000);
	}
}

export default alt.createActions(NewsActions);