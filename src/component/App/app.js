import React, { Component } from 'react';
import './app.css';
import firebase from '../Firebase/firebase.js';
class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        currentItem: '',
        userNote: '',
        items: [],
        edit: false,
        editItem: null,
        editText: '',
      }
  }
  componentDidMount(){
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        // console.log(item);
        newState.push({
          id: item,
          title: items[item].title,
          notes: items[item].notes
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  handelChange = (event)=>{
      this.setState({
        [event.target.name]: event.target.value
      });
      console.log(this.state.editText);
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  handleSubmit =(event)=>{
      event.preventDefault();
      const itemsRef = firebase.database().ref('items');
      const item = {
        title: this.state.currentItem,
        notes: this.state.userNote
      }
      itemsRef.push(item);
      this.setState({
        currentItem: '',
        userNote: ''
      });
  }
  handelEdit = (itemId) =>{
      this.setState({edit: true, editItem: itemId});
  }
  editDone = (itemId)=>{
     
      const target = firebase.database().ref('items');
      console.log(target);
      const updateItem = {
        notes: this.state.editText,
      }
      if(updateItem.notes !== ''){
        target.child(itemId).update(updateItem);
        this.setState({edit: false, editText: ''});
      }
      else{
        this.setState({edit:false});
      }
      
  }
  render() {
    let {edit} = this.state;
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Todo list with ReactJS and Firebase</h1>
            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="userNote" placeholder="New Event" onChange = {this.handelChange} value={this.state.userNote}/>
                <input type="text" name="currentItem" placeholder="Add Notes or Attachment" onChange = {this.handelChange} value={this.state.currentItem}/>
                <button>Add Item</button>
              </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
                  { edit?
                      this.state.items.map((item) => {
                        return (item.id === this.state.editItem?
                                <li key={item.id}>
                                    <h3>{item.title}</h3>
                                    <input type='text' name='editText' className='editInput' placeholder='Edit Here' onChange={this.handelChange} value={this.state.editText}/>
                                    <div className='buttonSet'>
                                      <button onClick = {()=>this.editDone(item.id)}>Done</button>
                                    </div>
                                </li>
                                :
                                <li key={item.id}>
                                <h3>{item.title}</h3>
                                <p>{item.notes}</p>
                                <div className='buttonSet'>
                                  <button onClick={() => this.handelEdit(item.id)}>Edit item</button>
                                  <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                                </div>
                                </li>
                                )}
                         
                      )
                      :this.state.items.map((item) => {
                        // console.log(item);
                        return (
                                <li key={item.id}>
                                    <h3>{item.title}</h3>
                                    <p>{item.notes}</p>
                                    <div className='buttonSet'>
                                      <button onClick={() => this.handelEdit(item.id)}>Edit item</button>
                                      <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                                    </div>
                                </li>
                                )})
                  }
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;