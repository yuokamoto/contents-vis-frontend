import React, {
  Component
} from 'react';
import Grid from '@material-ui/core/Grid';
import GraphView from "./GraphView/GraphView"
import UserDataClient from "./UserDataClient/UserDataClient"
import SpreadSheet from "./SpreadSheet/SpreadSheet"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: window._env_.REACT_APP_BACKEND_URL,
      userdata:{
        userId: '', //'cMQfg3EB-7gpRzDLaIes',
        data: {
                "30minutes": {point: 0.33, checked: true}, 
                "オサレもん": {point: 0.5, checked: false},
              }
      }, //user id and list of contents and points 
      contentdata:{} //graph data, nodes and edge
    };
    this.userClientRef = React.createRef();
    this.spreadSheetRef = React.createRef();
    this.graphRef = React.createRef();
    this.getUserDataFromUser = this.getUserDataFromUser.bind(this);
    this.getUserDataFromSpreadsheet = this.getUserDataFromSpreadsheet.bind(this);

  };

  componentDidMount() {
    console.log('Server IP:'+this.state.host)
    this.userClientRef.current.setUserId(this.state.userdata['userId'])
    this.userClientRef.current.setUserData(this.state.userdata['data'])
    this.spreadSheetRef.current.setUserData(this.state.userdata['data'])
    this.graphRef.current.setUserData(this.state.userdata['data'])
  }

  // used by child component to get data
  getUserDataFromUser(data){
    this.setState({
      userdata: data
    })
    console.log('getuserdata from user client', this.state.userdata)

    this.spreadSheetRef.current.setUserData(this.state.userdata['data'])
    this.graphRef.current.setUserData(this.state.userdata['data'])
  }

  // used by child component to get data
  getUserDataFromSpreadsheet(data){
    var new_data = this.state.userdata
    new_data['data'] = data
    this.setState({
      userdata: new_data
    })
    console.log('getuserdata from spreadhsheet', this.state.userdata)
    this.userClientRef.current.setUserData(this.state.userdata['data'])
    this.graphRef.current.setUserData(this.state.userdata['data'])
  }

  // todo pass state of parameter for visulize graph from /to graph to/to userclient
  
  render() {  
    return ( 
      <div  className="fullheight">
        <Grid container justify="center" style={{height:"100%"}}>

          <Grid item xs={4}>
            <Grid container justify="center" spacing={2}>

              <Grid item xs={12}>
                <UserDataClient
                  host={this.state.host}
                  getUserData={this.getUserDataFromUser}
                  ref={this.userClientRef}
                />
              </Grid>

              <Grid item xs={12}>
                <SpreadSheet
                  host={this.state.host}
                  getUserData={this.getUserDataFromSpreadsheet}
                  ref={this.spreadSheetRef}
                />
              </Grid>

            </Grid>
          </Grid>

          <Grid item xs={8} >
            <GraphView
                host={this.state.host}
                ref={this.graphRef} 
              />
          </Grid>

        </Grid>
      </div>
    );
  }
}


export default App;

