import React, {
  Component
} from 'react';
import Graph from "react-graph-vis";

// import "./styles.css";
// need to import the vis network css in order to show tooltip
import 'vis-network/dist/vis-network.css'

class GraphView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph : {
        nodes: [
          { id: 1, label: "Node 1", title: "node 1 tootip text", color:"red", shape: "box",
            value: 1, 
            // size: 1,
            // font: {
            //   size: 1
            // },
          },
          { id: 2, label: "Node 2", title: "node 2 tootip text", value: 1 },
          { id: 3, label: "Node 3", title: "node 3 tootip text", value: 1 },
          { id: 4, label: "Node 4", title: "node 4 tootip text", value: 1 },
          { id: 5, label: "Node 5", title: "node 5 tootip text", value: 1 }
        ],
        edges: [
          { from: 1, to: 2, label: "test" },
          { from: 1, to: 3 },
          { from: 2, to: 4 },
          { from: 2, to: 5 }
        ]
      },
      options : {
        autoResize: false,
        nodes:{
          scaling: {
            min: 14,
            max: 30,
            label: {
              enabled: true,
              min: 14,
              max: 30,
              maxVisible: 30,
              drawThreshold: 5
            },
          }
        },
        layout: {
          hierarchical: false
        },
        edges: {
          color: "#000000"
        },
        height: "500px"
      }
    };

    this.events = {
      select: function(event) {
        console.log(event)
        var { nodes, edges } = event;
        console.log(nodes, edges)

      }
    };

    this.update = this.update.bind(this)

  };
  
  update(){
    this.setState({
      graph: {
        nodes: [
          { id: 1, label: "ノード", title: "node 1 tootip text", color:"red", value: 30,
          },
          { id: 2, label: "Node 2", title: "node 2 tootip text", value: 50},
          { id: 3, label: "Node 3", title: "node 3 tootip text", value: 10 },
          { id: 4, label: "Node 4", title: "node 4 tootip text", value: 10 },
          { id: 5, label: "Node 5", title: "node 5 tootip text", value: 10 },
          { id: 6, label: "Node 5", title: "node 5 tootip text", value: 10 }
        ],
        edges: [
          { from: 1, to: 2, label: "test" },
          { from: 1, to: 3 },
          { from: 2, to: 4 },
          { from: 2, to: 5 },
          { from: 6, to: 1 },
          { from: 6, to: 2 },
          { from: 6, to: 3 },
          { from: 6, to: 4 },
        ]
      }
    })
  }  

  render() {  
    return ( 
      <div>
         <Graph
          graph={this.state.graph}
          options={this.state.options}
          events={this.events}
          getNetwork={network => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
          }}
        />
        <button onClick = { this.update } >
          test btn 
        </button> 
      </div>
    );
  }
}


export default GraphView;