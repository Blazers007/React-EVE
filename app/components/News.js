import React from 'react';
import NewsStore from '../stores/NewsStore'
import NewsActions from '../actions/NewsActions';

class News extends React.Component {
	constructor(props) {
		super(props);
		this.state = NewsStore.getState();
		this.onChange = this.onChange.bind(this);
	}

	onChange(state) {
		this.setState(state);
	}

	componentDidMount() {
		NewsStore.listen(this.onChange);
		// 监听Scroll事件
		$(window).scroll(()=>{
			if($(document).height() - $(window).height() - $(document).scrollTop() < 10){
				console.log('Scroll to bottom');
				NewsActions.loadMoreData();
			}
		});
	}

	componentWillUnmount() {
		$(window).unbind('scroll');
		NewsStore.unlisten(this.onChange);
	}

	render() {
		var liList = this.state.elements.map((ele, index) => {
			return <li key={ele}>{ele}</li>;
		});

		return (
			<ul>
				{liList}
			</ul>
		)
	}
}

export default News;