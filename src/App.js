import React, {
  Component
} from 'react';
import GraphView from "./GraphView/GraphView"
import UserDataClient from "./UserDataClient/UserDataClient"
import SpreadSheet from "./SpreadSheet/SpreadSheet"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host:'http://localhost:5000',
      userdata:{}, //list of contents and points
      contentdata:{} //graph data, nodes and edge
    };
    this.userClientRef = React.createRef();
    this.spreadSheetRef = React.createRef();
    this.graphRef = React.createRef();
    this.getUserDataFromUser = this.getUserDataFromUser.bind(this);
    this.getUserDataFromSpreadsheet = this.getUserDataFromSpreadsheet.bind(this);
    this.getGraphData = this.getGraphData.bind(this);
  };

  // used by child component to get data
  getUserDataFromUser(data){
    this.setState({
      userdata: data
    })
    console.log('getuserdata from user client', this.state.userdata)

    this.spreadSheetRef.current.setUserData(this.state.userdata['data'])
  }

  // used by child component to get data
  getUserDataFromSpreadsheet(data){
    this.setState({
      userdata: data
    })
    console.log('getuserdata from spreadhsheet', this.state.userdata)
    this.userClientRef.current.setUserData(this.state.userdata['data'])
  }

  // used by child component to get data
  getGraphData(data){
    this.setState({
      contentdata: data
    })
    console.log('getcontentdata', this.state.contentdata)
    this.graphRef.current.setGraphData(this.state.contentdata)
  }

  // todo pass state of parameter for visulize graph from /to graph to/to userclient
  
  render() {  
    return ( 
      <div>
        <GraphView
          ref={this.graphRef} 
        />
        <UserDataClient
          host={this.state.host}
          getUserData={this.getUserDataFromUser}
          ref={this.userClientRef}
        />
        <SpreadSheet
          host={this.state.host}
          getUserData={this.getUserDataFromSpreadsheet}
          getGraphData={this.getGraphData}
          ref={this.spreadSheetRef}
        />
      </div>
    );
  }
}


export default App;