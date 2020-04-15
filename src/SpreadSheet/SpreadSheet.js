import React, { Component } from "react";
import axios from "axios";

import MaterialTable from "material-table";
import { Button } from "@material-ui/core";

export default class SpreadSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Title", field: "title" },
        { title: "Point", field: "point", initialEditValue: "0" },
        // { title: "WikiId", field: "id" }, //done by check wiki
        {
          title: "",
          field: "wiki",
          editable: 'never',
          render: rowData => {
            return <Button variant="outlined" size='small' onClick={(e) => {this.checkWiki(e, rowData)}}>Check Wiki</Button>;
          }
        }
      ],
      data: [
              { title: "30minutes", point: 0.33, id:-1, tableData:{checked: true}}, 
              { title: "あらびき団", point: 0.5, id:-1, tableData:{checked: false}}
            ],
      graph: {}
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

    this.setUserData = this.setUserData.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.checkWiki = this.checkWiki.bind(this);
  }

  setUserData(data) {
    console.log("setuser", data);
    var new_data = [];
    for (var key in data) {
      var tableData = {checked: data[key]['checked'] ? true : false }
      var row = { title: key, id: data[key]['id'], point: data[key]['point'], tableData:tableData };
      new_data.push(row);
    }
    this.setState({
      data: new_data
    });
    console.log(new_data)
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

  checkWiki(e, rowData) {
    console.log("todo: check Wiki",rowData['title']);
  }

  render() {
    return (
      <div style={{ maxWidth: "100%", maxHeight: "100%" }}>
        <MaterialTable
          title=""
          options={{ paging: false }}
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    newData['id'] = -1 //temp
                    newData['tableData'] = {
                      checked: true
                    }
                    data.push(newData);
                    this.updateUserData(data);
                    this.setState({ data }, () => resolve());
                  }
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    const index = data.indexOf(oldData);

                    //data which is not aupdate by input
                    newData['id'] = oldData['id'] //temp
                    newData['tableData'] = oldData['tableData']
                    delete newData['tableData']['editing']
                    data[index] = newData;
                    
                    console.log(oldData, newData)
                    this.updateUserData(data);
                    this.setState({ data }, () => resolve());
                  }
                  resolve();
                }, 1000);
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
          onSelectionChange={
            (rows) => {
              console.log(this.state.data)
              this.updateUserData(this.state.data) 
            }
          }
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
            selection: true,
            selectionProps: rowData => ({
              disabled: rowData.name === "Mehmet",
              color: "primary"
            })
          }}
        />
      </div>
    );
  }
}
