import React, {
  Component
} from "react";
import { Button, ButtonGroup, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import axios from "axios";

export default class UserDataClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId:'',
      data:{},
    };
    this.axios = axios.create({
      baseURL: this.props.host + '/users/', 
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json'  
    });

    this.getUserData = this.getUserData.bind(this);
    this.setUserData = this.setUserData.bind(this);
    this.saveUserData = this.saveUserData.bind(this);
    this.createUserData = this.createUserData.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.userIdChange = this.userIdChange.bind(this);
  }

  getUserData(e) {
    this.axios.get(this.state.userId).then(res => {
        console.log('getuserdata', res.data)
        this.setState({data:res.data})
        if(this.props.getUserData){
          this.props.getUserData(res.data)
        }
      }).catch(error => {
        alert(this.state.userId+' is not exist')
        console.log(error)
    }); 
  }

  // used by outside of component
  setUserId(id) {
    console.log('setuser id')
    this.setState({
      userId: id
    })
  }
  // used by outside of component
  setUserData(data) {
    console.log('setuser data')
    this.setState({
      data: data
    })
  }

  saveUserData(e){
    if(this.state.userId==''){
      this.createUserData(e)
    }else{
      this.updateUserData(e)
    }

  }
  createUserData(e) {
    console.log('createuser')
    this.axios.post('', 
      {
        data: this.state.data
      }
      ).then(res => {
        this.setState({
          userId: res['data']['_id']
        })
        alert(this.state.userId+' is saved')
      }).catch(error => {
        alert(this.state.userId+' is not exist')
        console.log(error)
    }); 
  }
  updateUserData(e) {
    console.log('userdatauser')
    this.axios.put(this.state.userId, 
      {
        data: this.state.data
      }
      ).then(res => {
        this.setState({data:res.data})
        if(this.props.getUser){
          this.props.getUser(res.data)
        }
        alert(this.state.userId+' is saved')
      }).catch(error => {
        alert(this.state.userId+' is not exist. Please press again with empty input to save as new data.')
        console.log(error)
      }); 
  }

  userIdChange(event) {
    this.setState({
      userId: event.target.value
    });
  }
  
  // titleInputChange(event) {
  //   this.setState({
  //     titleInput: event.target.value
  //   });
  // }

  // addtitle(e) {

  // }
  
  render() {
      return (
        <div>
          User ID:
          <TextField id="outlined-basic" variant="outlined" value = { this.state.userId }
            onChange = { this.userIdChange } /> 
          <ButtonGroup orientation="horizontal">
            <Button variant="outlined" startIcon={<CloudDownloadIcon />} onClick={this.getUserData}  disabled={ (this.state.userId == '') ? true : false}>Get list</Button>
            <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={this.saveUserData }> Save list </Button>           
          </ButtonGroup>
        </div>
      );
  }
}


            // { (this.state.userId == '') ? 'Create' : 'Update'} 