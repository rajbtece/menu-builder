import React from 'react'
import {Image, Table, Modal, Button, FormGroup, FormControl} from 'react-bootstrap'
import AddModal from './AddModal'
import EditModal from './EditModal'

//destructuring in the home
const MenuFetch = React.createClass({
  getInitialState(){
    return{
      restId: this.props.params.id,
      menu: [],
      restaurant: {},
      addShow: false
    }
  },
  updateMenu(newItem){
   let newMenu = this.state.menu.map(item =>{
    if(item.id === newItem.id){
      return newItem;
    } else {
      return item;
    }
   })
   this.setState({menu: newMenu})
  },
  deleteMenu(id) {
    fetch(`/api/menu/${id}`, {
      method: 'DELETE'
    })
    .then(Response => {
      return Response.json()
    })
    .then(data => {
      let newMenu = data.filter(val => val.resId === this.state.restId)
      this.setState({menu: newMenu})
    })
    .catch(err => {
      console.log("Could not delete menu ", err)
    })
  },
  onSubmit(item){
    this.setState({addShow: false})
    item.resId = this.state.restId
    let url = '/api/menu/'

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    .then(Response =>{
      return Response.json()
    })
    .then(data =>{
      let newMenu = data.filter(val => val.resId === this.state.restId)
      this.setState({menu: newMenu})
    })
    .catch(err =>{
      console.log('err:', err)
    })
  },
  close() {
    this.setState({addShow: false})
  },
  openAddModal(item){
    this.setState({addShow: true })
  },
  componentWillMount(){
     let url = '/api/menu'
     fetch(url)
      .then(Response => {
        return Response.json();
      })
      .then(data => {

        let newMenu = data.filter(data => this.props.params.id === data.resId)
        this.setState({menu: newMenu})

        return fetch(`/api/restaurant/${this.props.params.id}`)
      })
      .then(Response => {
        return Response.json();
      })
      .then(data => {
        this.setState({restaurant: data})
      })
      .catch(err => {
        console.log(err)
      })
  },
  render() {
    let smClose = () => this.setState({ addShow: false });
    if (this.state.restaurant.id){
    let resName = this.state.restaurant.name.toUpperCase();
      return (
        <div>
        <div className="row">
          <div className="col-xs-8">
          <h2>{resName} || {this.state.restaurant.location} || {this.state.restaurant.cuisine}</h2>
          </div>
          <div className="col-xs-4">
          <br />
          <Button onClick={this.openAddModal} className="btn-success fa fa-plus-square fa-sm"></Button>
          </div>
        </div>
        <Home menu={this.state.menu} update={this.updateMenu} delete={this.deleteMenu}/>
        <AddModal show={this.state.addShow} submit={this.onSubmit} onHide={this.close} add={this.state.addNew}/>
        </div>
        )
    }
    else
      return <h1>Loading...</h1>
  }
})

const Home = React.createClass({
  getInitialState(){
    return {
      menu: this.props.menu,
      smShow: false,
      editMenu: {}
    }
  },
  deleteMenu(item){
    this.props.delete(item.id);
  },
  showModal(item){
    this.setState({editMenu: item})
    this.setState({smShow: true })
  },
  close() {
    this.setState({smShow: false})
  },
  submit(newItem) {
    this.setState({smShow: false})
    let url = `/api/menu/${newItem.id}`;
    
    fetch(url, {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    })
    .then(Response =>{
      return Response.json()
    })
    .then(data =>{
      this.props.update(data)
    })
    .catch(err => {
      console.log('err:', err)
    })
  },
  render(){
   
    let smClose = () => this.setState({ smShow: false });
    let menuItems = this.props.menu.map(item =>
      ( 
        <tr key={item.id}>
          <td className="col-xs-2">{item.name}</td>
          <td className="col-xs-2">{item.type}</td>
          <td className="col-xs-1">{item.price}</td>
          <td className="col-xs-2"><Image src={item.picUrl} rounded responsive /></td>
          <td className="col-xs-1"><Button onClick={this.showModal.bind(null, item)} className="btn btn-info fa fa-pencil-square-o"></Button></td>
          <td className="col-xs-1"><Button onClick={this.deleteMenu.bind(null, item)} className="btn btn-danger fa fa-trash"></Button></td>
        </tr>
      )
    )

    return (
     <div>
             <Table className="container" hover={true}>
             <thead>
               <tr>
                 <th className="col-xs-2">Name</th>
                 <th className="col-xs-2">Type</th>
                 <th className="col-xs-1">Price $</th>
                 <th className="col-xs-2">Picture</th>
                 <th className="col-xs-1">Edit</th>
                 <th className="col-xs-1">Delete</th>
               </tr>
             </thead>
               <tbody>
                 {menuItems}
               </tbody>
             </Table>  
              <EditModal show={this.state.smShow} onSubmit={this.submit} onHide={this.close} menu={this.state.editMenu}/>
     </div>
    )
  }
})

export default MenuFetch;