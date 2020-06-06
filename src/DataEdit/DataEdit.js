import React, {
  Component
} from "react";
import { Button, ButtonGroup, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from "axios";
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import "./DataEdit.css";

export default class DataEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      wikiUrl: 'https://ja.wikipedia.org/wiki/'+this.props.title,
      data:[
        [{value:'', className:'value'}, {value: '', className:'value'},{value: '', className:'value'}],
        [{value:'', className:'value'}, {value: '', className:'value'},{value: '', className:'value'}],
        [{value:'', className:'value'}, {value: '', className:'value'},{value: '', className:'value'}],
      ],
      parseConfirmOpen: false,
      saveConfirmOpen: false,
      progressOpen: false,
    };

    this.selected = {
      start:{},
      end:{}
    }

    this.axios_contents = axios.create({
      baseURL: this.props.host + '/contents/', 
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json'  
    });

    this.axios_wiki = axios.create({
      baseURL: this.props.host + '/wiki/', 
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json'  
    });

    this.setData = this.setData.bind(this);
    this.saveData = this.saveData.bind(this);
    this.parseData = this.parseData.bind(this);
    this.addRow = this.addRow.bind(this);
    this.addCol = this.addCol.bind(this);
    this.delSelected = this.delSelected.bind(this);
    this.pageTitleChange = this.pageTitleChange.bind(this);
  }
  
  componentDidMount() {
    //get data from elastic
    this.axios_contents.get(this.state.title).then(res => {
        console.log('getcontents', res.data)
        this.setData(res.data['data'])
      }).catch(error => {
        alert(this.state.title+' is not exist yet. Parsed from wiki.')
        this.setData([])
        this.parseData()
        // console.log(error)
    }); 
  }

  setData(data) {
    console.log('setdata', data)
    var max_col = 1
    for(var key in data){
      if(key !== 'name'){
        if(data[key].length > max_col){
          max_col = data[key].length
        }
      }
    }

    var new_data = []
    for(var key in data){
      if(key !== 'name'){
        var row = Array(max_col+1).fill({value:'', className:'value'}) 
        row[0] = {value: key, className:'key'}
        for(var i in data[key]){
          row[parseFloat(i)+1] = ({value: data[key][i], className:'value'})
        }
        new_data.push(row)
      }
    } 
    this.setState({
      data:new_data
    })
  }

  // parse data from wikipedia
  parseData(){
    this.setState({
      progressOpen:true,
      parseConfirmOpen:false
    })
    this.axios_wiki.post('',
      {
        name: this.state.title,
      }
      ).then(res => {
        // this.setState({
        //   userId: res['data']['_id']
        // })
        // alert(this.state.userId+' is saved')
        this.setData(res.data)
        console.log(res)
        this.setState({progressOpen:false})
      }).catch(error => {
        alert('Failed to parse '+this.state.title)
        console.log(error)
        this.setState({progressOpen:false})
    }); 
  }

  saveData(){
    this.setState({
      progressOpen:true,
      saveConfirmOpen:false
    })
    var res_data = {}
    for(var i in this.state.data){
      var values = []
      for(var j in this.state.data[i]){
        if(j > 0 && this.state.data[i][j]['value'] !== '') {
          values.push(this.state.data[i][j]['value'])
        } 
      }
      res_data[this.state.data[i][0]['value']] = values
    }
    // console.log(res_data)
    this.axios_contents.put(this.state.title, 
      {
        name: this.state.title,
        data: res_data
      }
      ).then(res => {
        // this.setState({
        //   userId: res['data']['_id']
        // })
        // alert(this.state.userId+' is saved')
        console.log(res)
        this.setState({progressOpen:false})
      }).catch(error => {
        alert('Failed to save '+this.state.title)
        console.log(error)
        this.setState({progressOpen:false})
    }); 
  } 

  addRow(){
    const webpagehtml = document.getElementById('wikiPage')
    console.log(webpagehtml.contentWindow)
    console.log(webpagehtml.attributes)
    // console.log(webpagehtml.getElementsByTagName('header'))
    var new_data = this.state.data.slice()
    var row = Array(new_data[0].length).fill({value:'', className:'value'})
    row[0] = {value: '', className:'key'}
    new_data.push(row)
    this.setState({
      data:new_data
    })
  }

  addCol(){
    var new_data = this.state.data.slice()
    for(var i in new_data){
      new_data[i].push({value:'', className:'value'})
    }
    this.setState({
      data:new_data
    })
  }
  
  delSelected(){
    // console.log(this.selected)
    var new_data = this.state.data.slice()
    const orig_len = new_data[0].length
    const len = this.selected.end.j-this.selected.start.j+1
    for(var i=this.selected.end.i; i>=this.selected.start.i; i--){
      if(len === orig_len){
        new_data.splice(i, 1)
      }
      else{
        for(var j=this.selected.end.j; j>=this.selected.start.j; j--){
          // console.log(i,j,new_data[i][j])
          new_data[i].splice(j, 1)
        }
        const fill = Array(len).fill({value:'', className:'value'})
        new_data[i] = new_data[i].concat(fill)
        new_data[i][0]['className'] = 'key'
      }
    }
    this.setState({
      data:new_data
    })
  }

  pageTitleChange(event) {
    this.setState({
      title: event.target.value,
      wikiUrl: 'https://ja.wikipedia.org/wiki/'+event.target.value
    });
  }


  render() {
      return (
        <div className="container">
          {/* left shows wikipage */}
          <div>
            <TextField label="Page Title" variant="filled" 
              value = { this.state.title } onChange = { this.pageTitleChange }
            />
            
            <Button variant="outlined" onClick={(e)=>{this.setState({parseConfirmOpen:true})}} >
              Parse data from wikipedia
            </Button>
            <Dialog
              open={this.state.parseConfirmOpen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Parse Data from \""+this.state.title+'\" wikipedia?'}</DialogTitle>
              <DialogContent>
              </DialogContent>
              <DialogActions>
                <Button onClick={(e)=>{this.setState({parseConfirmOpen:false})}} color="primary">
                  No
                </Button>
                <Button onClick={this.parseData} color="primary" autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <iframe width='100%' height='100%' id='wikiPage' src={this.state.wikiUrl} ></iframe>
          </div>

          {/* right: show/edit parsed data */}
          <div className="sheet-container">
            <ButtonGroup orientation="horizontal">
              <Button variant="outlined" onClick={(e)=>{this.setState({saveConfirmOpen:true})}} > Save editted data</Button>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={this.addRow} >Row</Button>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={this.addCol} >Column</Button>
              <Button variant="outlined" startIcon={<HighlightOffIcon />} onClick={this.delSelected} >Selected</Button>
            </ButtonGroup>
            <Dialog
              open={this.state.saveConfirmOpen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Save Data as \""+this.state.title+'\" from spreadsheet?'}</DialogTitle>
              <DialogContent>
              </DialogContent>
              <DialogActions>
                <Button onClick={(e)=>{this.setState({saveConfirmOpen:false})}} color="primary">
                  No
                </Button>
                <Button onClick={this.saveData} color="primary" autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
            
            <ReactDataSheet
              data={this.state.data}
              valueRenderer={(cell) => cell.value}
              onCellsChanged={changes => {
                const data = this.state.data.map(row => [...row])
                changes.forEach(({cell, row, col, value}) => {
                  data[row][col] = {...data[row][col], value}
                })
                this.setState({data:data})
              }}
              onSelect={(selected) => {
                this.selected = selected
              }}
            />
          </div>

          <Backdrop className="backdrop" open={this.state.progressOpen} >
            <CircularProgress color="inherit" />
          </Backdrop>

        </div>
      );
  }
}
