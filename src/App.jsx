import React from 'react';
import Api from './Api';
import moment from 'moment';
import styles from './App.css';
import btnCheckNone from './assets/btn_check_n.png';
import btnCheck from './assets/btn_check_s.png';
import btnCheckAll from './assets/btn_check_all_s.png';
import btnCheckAllNone from './assets/btn_check_all_n.png';
import btnEdit from './assets/btn_edit_n.png';
import btnDelete from './assets/btn_close.png';

const BY_SEQ = 'SORT_BY_SEQUENCE';
const BY_CREATED = 'SORT_BY_CREATED';
const BY_CONTENT = 'SORT_BY_CONTENT';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [], // 
            inputValue: '',
            modifying: null,
            modifyInputValue: '',
            sort_by: BY_SEQ,
            toggleAll: false
        }

        this.inputEl = null;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        Api.list().then((data)=>{
            this.setState({
                list: data
            });
        });
    }

    addItem() {
        const {inputValue} = this.state;
        if (inputValue) {
            this.setState({inputValue: ''});
            Api.add(inputValue).then((data)=>{
                this.loadData();
            });
        }
    }

    handleEnter(e) {
        if (e.key == 'Enter') {
            this.addItem();
        }
    }

    onChangeInput(e) {
        this.setState({
            inputValue: e.target.value
        });
    }

    toggleItem(item) {
        const {list} = this.state;
        Api.toggle(item.id, item.done == true ? 0 : 1).then((data) => {
            let idx = list.indexOf(item);
            list[idx] = data;
            this.setState({list});
        });
    }


    onChangeModifyInput(e) {
        this.setState({
            modifyInputValue: e.target.value
        });
    }

    handleEnterModifyInput(e) {
        if (e.key == 'Enter') {
            this.modifyItem();
        }
    }

    modifyItem() {
        const {list, modifying, modifyInputValue} = this.state;
        let idx = list.findIndex((i) => i.id == modifying);

        Api.modifyContent(modifying, modifyInputValue).then(data =>{
            list[idx] = data;
            this.setState({ list: list, modifying: null });
        });
    }

    onModify(item, e) {
        e.stopPropagation();

        const {modifying} = this.state;
        this.setState({
            modifying: item.id,
            modifyInputValue: item.content
        }, () => {
            this.inputEl.focus();
        });
    }

    onRemove(item, e) {
        e.stopPropagation();

        const {list} = this.state;
        Api.remove(item.id).then((data)=>{
            let idx = list.indexOf(item);
            list.splice(idx, 1);
            this.setState({ list });
        });
    }

    onSortAsContent() {
        const {sort_by} = this.state;
        this.setState({
            sort_by: sort_by == BY_CONTENT ? BY_SEQ : BY_CONTENT
        });
        this.forceUpdate();
    }

    onSortAsCreated() {
        const {sort_by} = this.state;
        this.setState({
            sort_by: sort_by == BY_CREATED ? BY_SEQ : BY_CREATED
        });
        this.forceUpdate();
    }

    toggleAll() {
        const {list, toggleAll} = this.state;
        list.forEach(item => {
            Api.toggle(item.id, !toggleAll).then((data) => {
                let idx = list.indexOf(item);
                list[idx] = data;
                this.setState({list});
            });
        });
        this.setState({
            toggleAll: !toggleAll
        });
        
    }


    render() {
        const {list, inputValue, modifying, modifyInputValue, sort_by, toggleAll} = this.state;
        let remain = list.reduce((a, c) => !c.done ? a + 1 : a, 0);

        // Sorting
        list.sort((a,b) => {
            if (BY_SEQ == sort_by) {
                return a.seq - b.seq;
            } 
            else if (BY_CONTENT == sort_by) {
                var aa = a.content.toUpperCase();
                var bb = b.content.toUpperCase();
                if (aa < bb) {
                    return -1;
                }
                if (aa > bb) {
                    return 1;
                }
                return 0;
            } else if (BY_CREATED == sort_by) {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
        });
         
        return (
            <div className={styles.app}>
                <div className={styles.inputArea}>
                    <div className={styles.imgBox}><img src={toggleAll ? btnCheckAll : btnCheckAllNone} onClick={this.toggleAll.bind(this)}/></div>
                    <input value={inputValue} 
                    placeholder="What need to be done?"
                    onKeyDown={this.handleEnter.bind(this)} 
                    onChange={this.onChangeInput.bind(this)}/>
                </div>
                <ul className={styles.list}>
                    {list.map((item, i)=>{
                        let modify = modifying == item.id;
                        return (
                            <li className={item.done == true ? styles.done : ''} 
                                onClick={!modify ? this.toggleItem.bind(this, item) : undefined} 
                                key={'todo-item-'+i}>
                                <div className={styles.doneBox}>
                                    <img src={item.done == true ? btnCheck : btnCheckNone} />
                                </div>
                                <div className={styles.contentBox}>
                                    <div className={styles.content}>
                                        {modify 
                                        ? <input ref={ref => {this.inputEl = ref}} value={modifyInputValue} 
                                                onChange={this.onChangeModifyInput.bind(this)} 
                                                onKeyDown={this.handleEnterModifyInput.bind(this)}/> 
                                        : item.content}
                                        <div className={styles.time}>
                                        {moment(item.updatedAt).format('MM/DD hh:mm')}
                                        </div>
                                    </div>
                                    <div className={styles.buttons}>
                                        {!modify ? <a onClick={this.onModify.bind(this,item)}><img src={btnEdit}/></a> : undefined}
                                        {!modify ? <a onClick={this.onRemove.bind(this,item)}><img src={btnDelete}/></a> : undefined}
                                    </div>
                                </div>
                            </li>);
                    })}
                </ul>
                <div className={styles.footer}>
                    <div className={styles.left}>{remain} items left</div>
                    <div className={styles.right}>
                        <strong>Sort by </strong>&nbsp;
                        <button className={sort_by == BY_CONTENT ? styles.selected : ''} onClick={this.onSortAsContent.bind(this)}>Content</button>
                        <button className={sort_by == BY_CREATED ? styles.selected : ''} onClick={this.onSortAsCreated.bind(this)}>Created</button>
                    </div>
                </div>
            </div>
        );
    }
}


