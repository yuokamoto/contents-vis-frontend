import React, {
  Component
} from "react";
import { Button, ButtonGroup, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import axios from "axios";

export default class DataEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.axios = axios.create({
      baseURL: this.props.host + '/users/', 
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json'  
    });
    this.onClick = this.onClick.bind(this);
  }

  onClick(){
    
  }
  
  render() {
      return (
        <div style={{height: '100%'}}>
          <ButtonGroup orientation="horizontal">
            <Button variant="outlined" startIcon={<CloudDownloadIcon />} onClick={this.onClick} >Get list</Button>
            <Button variant="outlined" startIcon={<CloudUploadIcon />} > Save list </Button>           
          </ButtonGroup>

          <div style={{height: '100%', display: 'flex'}}>
            <iframe width='100%' height='100%' src="https://ja.wikipedia.org/wiki/ゴッドタン" ></iframe>
            <iframe width='100%' height='100%' src="https://ja.wikipedia.org/wiki/ゴッドタン" ></iframe>
          </div>

        </div>
      );
  }
}
