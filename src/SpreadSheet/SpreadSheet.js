import React, { Component } from "react";
import axios from "axios";

import MaterialTable, { MTableToolbar } from 'material-table';
import { Button } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DataEdit from "../DataEdit/DataEdit"
import ErrorOutline from '@material-ui/icons/ErrorOutline';
// import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
// import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { red, green } from '@material-ui/core/colors';

export default class SpreadSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Title", field: "title", width: '100px',
          cellStyle: {
            width: '100px',
            // maxWidth: '50px',
            padding: '0px'
          },
          headerStyle: {
            width: '100px',
            // maxWidth: '50px',
            padding: '0px'
          }
        },
        { title: "Point", field: "point", initialEditValue: 0, width: '50px',
          cellStyle: {
            width: '50px',
            // maxWidth: '10px',
            padding: '0px'
          },
          headerStyle: {
            width: '50px',
            // maxWidth: '10px',
            padding: '0px'
          }
        },
        { title: "Status", field: "status", initialEditValue: 0, width: '20px', editable: 'never',
          cellStyle: {
            width: '20px',
            // maxWidth: '10px',
            padding: '0px'
          },
          headerStyle: {
            width: '20px',
            // maxWidth: '10px',
            padding: '0px'
          },
          render: rowData => {
              // console.log(rowData)
              var body;
              if(rowData.status){
                body = <TripOriginIcon style={{ color: green[500] }}/>
              }else{
                body = <ErrorOutline style={{ color: red[500] }}/>
              }
              return body
            }
        },
        {
          title: "", field: "wiki", editable: 'never',
          cellStyle: {
            // width: '0px',
            // maxWidth: '100px',
            padding: '0px'
          },
          headerStyle: {
            // width: '0px',
            // maxWidth: '100px',
            padding: '0px'
          },
          render: rowData => {
            return (
              <Button variant="outlined" size='small' 
                onClick={(e) => {this.handleCheckWikiOpen(e, rowData)}}>
                Check Wiki
              </Button>
            );
          }
        }
      ],
      data: [],
      graph: {},
      checkWikiOpen: false,
      editConfirmOpen: false,
    };
    this.axiosContents = axios.create({
      baseURL: this.props.host + "/contents/",
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "json"
    });
    this.axiosGraph = axios.create({
      baseURL: this.props.host + "/contents/",
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "json"
    });

    this.editingData = {};
    this.oldData = {};
    this.setUserData = this.setUserData.bind(this);
    this.checkDataExist = this.checkDataExist.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.handleCheckWikiOpen = this.handleCheckWikiOpen.bind(this);
    this.handleCheckWikiClose = this.handleCheckWikiClose.bind(this);
  }

  async setUserData(data) {
    console.log("setuser", data);
    var new_data = [];
    for (var key in data) {
      var tableData = {checked: data[key]['checked'] ? true : false }
      await this.checkDataExist(key).then(exist => {
        var row = { title: key, id: data[key]['id'], point: data[key]['point'], tableData:tableData, status: exist };
        new_data.push(row);
      })
    }
    this.setState({
      data: new_data
    });
    // console.log(new_data)
  }

  updateUserData(data) {
    if(this.props.getUserData){
      var output_data = {}
      for (var i in data ){
        // console.log(data[i])
        var new_data = { point:data[i]['point'], id:data[i]['id'], checked:data[i]['tableData']['checked']}
        output_data[data[i]['title']] = new_data
      }
      this.props.getUserData(output_data)
    }
  }

  onCheck(e, props) {
    console.log("onCheck", e.target.checked);
    var temp = this.state.data;
    temp[props.row][0]["checked"] = e.target.checked;
    this.setState({
      data: temp
    });
  }

  handleCheckWikiOpen(e, rowData) {
    if(typeof rowData !== 'undefined' && rowData['title']!==''){
      this.editingData = rowData
      this.oldData = rowData
      this.setState({checkWikiOpen:true})
    }
  }

  async handleCheckWikiClose() {
    if('title' in this.editingData){
      const data = this.state.data;
      await this.checkDataExist(this.editingData['title']).then(exist => {
        var newData = this.editingData
        newData['status'] = exist
        if('id' in this.oldData){
          const index = data.indexOf(this.oldData);
          newData['id'] = this.oldData['id'] //temp
          newData['tableData'] = this.oldData['tableData']
          newData['title'] = newData['title'].trim()
          delete newData['tableData']['editing']
          data[index] = newData;
        }else{
          newData['id'] = -1 //temp
          newData['tableData'] = {
            checked: true
          }
          newData['point'] = parseFloat(newData['point'])
          newData['title'] = newData['title'].trim()
          data.push(newData);
        }
        this.updateUserData(data);
        this.setState({ data });
      })
    }
    this.editingData={}
    this.oldData={}

    this.setState({checkWikiOpen:false})
  }

  async checkDataExist(title){
    var exist = false
    try {
      const res = await this.axiosContents.get(title)
      exist = true
      // console.log('getcontents', res.data)
    } catch (error) {
      exist = false
      // console.log(error)
    }
    return exist
  }

  render() {
    return (
      <div style={{ maxWidth: "100%", maxHeight: "100%" }}>
        <MaterialTable
          title=""
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                this.checkDataExist(newData['title']).then( exist => {
                  newData['status'] =exist
                  setTimeout(() => {
                    if(exist){ 
                      const data = this.state.data;
                      newData['id'] = -1 //temp
                      newData['tableData'] = {
                        checked: true
                      }
                      newData['point'] = parseFloat(newData['point'])
                      newData['title'] = newData['title'].trim()
                      data.push(newData);
                      this.updateUserData(data);
                      this.setState({ data }, () => resolve());
                    }else{
                      newData['title'] = newData['title'].trim()
                      this.editingData = newData
                      this.oldData = {}
                      this.setState({
                        editConfirmOpen:true
                      })
                    }
                    resolve();
                  }, 1000);  
                })
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                this.checkDataExist(newData['title']).then( exist => {
                  newData['status'] =exist
                  setTimeout(() => {
                    if(exist){
                      const data = this.state.data;
                      const index = data.indexOf(oldData);

                      //data which is not aupdate by input
                      newData['id'] = oldData['id'] //temp
                      newData['tableData'] = oldData['tableData']
                      newData['title'] = newData['title'].trim()
                      delete newData['tableData']['editing']
                      data[index] = newData;
                      
                      // console.log(oldData, newData)
                      this.updateUserData(data);
                      this.setState({ data }, () => resolve());
                    }else{
                      newData['title'] = newData['title'].trim()
                      this.editingData = newData
                      this.oldData = oldData
                      this.setState({
                        editConfirmOpen:true
                      })
                    }
                    resolve();
                  }, 1000);
                })
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    let data = this.state.data;
                    const index = data.indexOf(oldData);
                    data.splice(index, 1);
                    this.updateUserData(data);
                    this.setState({ data }, () => resolve());
                  }
                  resolve();
                }, 1000);
              })
          }}
          components={{
              // Toolbar: props => (
              //     <div style={{ backgroundColor: '#e8eaf5' }}>
              //         <MTableToolbar {...props } />
              //     </div>
              // )
          }}
          onSelectionChange={
            (rows) => {
              // console.log(this.state.data)
              this.updateUserData(this.state.data) 
            }
          }
          options={{
            padding: 'dense',
            addRowPosition: 'first',
            showTextRowsSelected: false,
            howSelectAllCheckbox: false,
            searchFieldAlignment: 'left',
            // toolbarButtonAlignment: 'left',
            actionsColumnIndex: -1,
            // exportButton: true,
            selection: true,
            selectionProps: rowData => ({
              disabled: rowData.name === "Mehmet",
              color: "primary"
            })
          }}
          actions={[
            {
              tooltip: 'Add',
              icon: 'add',
              onClick: (evt, data) => {
                const rowData = this.state.data;
                var newData = {}
                newData['id'] = -1 //temp
                newData['tableData'] = {
                  checked: false
                }
                newData['point'] = 0
                newData['title'] = ''
                newData['status'] = false
                rowData.push(newData);
                this.updateUserData(rowData);
                this.setState({ data: rowData });
              }
            }
          ]}
        />
        <Dialog
          open={this.state.editConfirmOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"No \""+this.editingData['title']+'\" data found. Edit?'}</DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={(e)=>{this.setState({editConfirmOpen:false})}} color="primary">
              No
            </Button>
            <Button onClick={(e)=>{
              this.setState({
                editConfirmOpen: false,
                checkWikiOpen: true
              })
              }} 
              color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.checkWikiOpen}
          onClose={this.handleCheckWikiClose}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullScreen
          >
          <DialogTitle >Subscribe</DialogTitle>
          <AppBar >
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleCheckWikiClose} aria-label="close">
                <CloseIcon />
              </IconButton> Close 
            </Toolbar>
          </AppBar>
           <DialogContent >
            <DataEdit 
              title = {this.editingData['title']}
              host={this.props.host}
            />
           </DialogContent>
        </Dialog>
      </div>
    );
  }
}
