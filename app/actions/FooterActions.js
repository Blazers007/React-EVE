import alt from '../alt';

class FooterActions {
    constructor() {
        /**
          猜测：当使用Alt实例去创建Actions时 会将该object继承 某父类 随后在调用父类的generateActions方法 
          随后根据字符串来 利用反射创建 function 并放入actions内部 最后便于其他操作来调用
        */
        this.generateActions(
            'getTopCharactersSuccess',
            'getTopCharactersFail'
        );
    }

    /*  等价于
      getTopCharactersSuccess(payload) {
        this.dispatch(payload);
      }

      getTopCharactersFail(payload) {
        this.dispatch(payload);
      }

    */

    getTopCharacters() {
        $.ajax({
                url: '/api/characters/top'
            })
            .done((data) => {
                this.actions.getTopCharactersSuccess(data)
            })
            .fail((jqXhr) => {
                this.actions.getTopCharactersFail(jqXhr)
            });
    }
}

export default alt.createActions(FooterActions); //创建Actions
