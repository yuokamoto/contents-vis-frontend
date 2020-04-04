import React, {
  Component
} from "react";
import axios from "axios";

import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

export default class SpreadSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      graph:{},
      grid: [
        [{value:  1, checked: true}, {value:  3}],
        [{value:  2, checked: false}, {value:  4}]
      ]

    };
    this.axiosContents = axios.create({
      baseURL: this.props.host + '/contents/', 
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json'  
    });
    this.axiosGraph = axios.create({
      baseURL: this.props.host + '/contents/', 
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json'  
    });

    this.setUserData = this.setUserData.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.checkWiki = this.checkWiki.bind(this);
  }

  setUserData(data) {
    this.setState({
      data: data
    })
    console.log('setuser', data)
    var grid = []
    for(var key in data){
      var row = [{value: key, checked: true}, {value: data[key]}]
      grid.push(row)
    } 
    this.setState({
      grid: grid
    })
  }

  rowRenderer(props){
    return (
            <tr>
                <td className='action-cell'>
                    <input 
                        type='checkbox' 
                        checked={props.cells[0]['checked']} 
                        onChange={ (e) => {this.onCheck(e, props)} }
                    />
                </td>
                {props.children}
                <td className='action-cell'>
                  <button onClick={this.checkWiki}>
                    Check Wiki
                  </button>
                </td>

            </tr>
          )
  }

  onCheck(e, props){
    console.log("onCheck", e.target.checked)
    var temp= this.state.grid
    temp[props.row][0]['checked']=e.target.checked
    this.setState({
      grid: temp
    })
  }
  
  checkWiki(){
    console.log("todo: check Wiki")
  }

  render() {
    return (
      <div>
        <ReactDataSheet
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          rowRenderer={this.rowRenderer}
        />
      </div>
    );
  }
}
