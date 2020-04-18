import React, {
  Component
} from 'react';
import Graph from "react-graph-vis";
import { Button, ButtonGroup, TextField } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

// import "./styles.css";
// need to import the vis network css in order to show tooltip
import 'vis-network/dist/vis-network.css'

import axios from "axios";

const COLORS = [
  'rgb(201, 203, 207)', //grey
  // 'rgb(255, 255, 255)', //white
  'rgb(255, 99, 132)', //red
  'rgb(255, 159, 64)', //orange
  'rgb(255, 205, 86)', //yellow
  'rgb(75, 192, 192)', //green
  'rgb(54, 162, 235)', //blue
  'rgb(153, 102, 255)',//purple
];
const SHAPES = [
  'box',
  'box'
]
var COLOR_PATTERN = {
  'attribute': COLORS[0],
}
var SHAPE_PATTERN = {
  'attribute': SHAPES[0],
  'program': SHAPES[1]
}

class GraphView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph : {
        nodes: [],
        edges: []
      },
      options : {
        autoResize: true,
        width: '100%',
        height: '100%',
        nodes:{
          scaling: {
            min: 10,
            max: 50,
            label: {
              enabled: true,
              min: 10,
              max: 50,
              maxVisible: 30,
              drawThreshold: 5
            },
          }
        },
        layout: {
          hierarchical: false
        },
        edges: {
          color: "#000000",
          arrows: {
            to: {
              enabled: false
            },
            from: {
              enabled: false
            }
          }
        },
        physics:{
          enabled: true,
          forceAtlas2Based: {
            gravitationalConstant: -30,
            centralGravity: 0.01,
            springConstant: 0.8,
            springLength: 1,
            damping: 1.0,
            avoidOverlap: 1.0
          },
          adaptiveTimestep: true
        },
        configure: {
          enabled: true,
          showButton: true,
          filter: 'physics',
        }
      },
      params:{
        hide_dead_sink: false,
        threshold: 0.0
      },
      network: null,
    };
    this.graph_orig = {
        nodes: [],
        edges: []
    }
    this.network_orig = null
    this.color_id = 1
    this.axios = axios.create({
      baseURL: this.props.host + '/graph/get_from_data', 
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json'  
    });

    this.events = this.events.bind(this)
    this.updateGraph = this.updateGraph.bind(this)
    this.applyParam = this.applyParam.bind(this)
    this.threshChange = this.threshChange.bind(this)
    this.showHideConfig = this.showHideConfig.bind(this)
    this.showHideDeadSink = this.showHideDeadSink.bind(this)
    this.setUserData = this.setUserData.bind(this);
  };

  events(event) {
    console.log(event)
    var { nodes, edges } = event;
    console.log(nodes, edges)
  };

  setUserData(data) {
    console.log("setuser", data);
    this.setState({data});
    // var new_data = [];
    // for (var key in data) {
    //   var row = { title: key, point: data[key] };
    //   new_data.push(row);
    // }
  }

  showHideConfig(){
    var new_options = this.state.options
    new_options.configure.enabled = !new_options.configure.enabled
    console.log(this.state.options)
    this.setState({
      options: new_options,
      graph: this.state.graph
    })
  }

  showHideDeadSink(){
    var new_params = this.state.params
    new_params.hide_dead_sink = !this.state.params.hide_dead_sink
    this.setState({
      params: new_params
    })
    this.applyParam()
  }

  threshChange(event){
    var new_params = this.state.params
    new_params.threshold = event.target.value
    console.log(this.state.params)
    this.setState({
      params: new_params
    })
    this.applyParam()
  }

  applyParam(){
    var output_nodes = this.graph_orig.nodes.slice()
    var output_edges = this.graph_orig.edges.slice()

    var point_sum = 0
    var i = output_nodes.length
    while(i--){
        const nodeid = output_nodes[i]['id']
        const point = output_nodes[i]['value']
        const genre = output_nodes[i]['genre']

        //remove dead sink
        if(this.state.params.hide_dead_sink){
          // const edges = this.state.network.getConnectedEdges(nodeid)
          // console.log(this.network_orig)
          const edges = this.network_orig.getConnectedEdges(nodeid)
          if(edges.length <= 1){
            output_nodes.splice(i, 1);
            // output_nodes[i]['hidden'] = true
            // output_nodes[i]['mass'] = 0.01
            console.log('remove dead sink', nodeid)
            continue
            // output_edges.pop() //todo
          }
          else{
            // output_nodes[i]['hidden'] = false
            // output_nodes[i]['mass'] = output_nodes[i]['value'] 
          }
        }

        //remove by point threshold
        if( point < this.state.params.threshold && genre=='attribute' ){
          output_nodes.splice(i, 1);
          // output_nodes[i]['hidden'] = true
          // output_nodes[i]['mass'] = 0.01
          console.log('removed by point', nodeid)  
          continue
        }
        else{
          // output_nodes[i]['hidden'] = false
          // output_nodes[i]['mass'] = output_nodes[i]['value'] 
        }

        if(genre=='attribute'){
          point_sum += parseFloat(point)
        }
        // console.log(point, point_sum)
    }

    //update non attribute node value
    const ave = point_sum/output_nodes.length
    console.log(point_sum, output_nodes.length)
    for(var i in output_nodes){
      const genre = output_nodes[i]['genre']
      if(genre!='attribute'){
        output_nodes[i]['value'] =  10//ave*2
        // output_nodes[i]['mass'] = ave*2
        console.log(output_nodes[i]['label'], output_nodes[i]['value'])
        // output_nodes[i]['value'] = this.state.params.threshold
      }
    }

    this.setState({
      graph: {nodes: output_nodes, edges: output_edges} //res['data']['graph']
    })

    // console.log(this.state.graph.nodes)
    console.log(this.state.network)
  }

  updateGraph(){
    this.axios.post('',{
        data: this.state.data
      }).then(res => {
        console.log('update graph')
        var input_nodes = res['data']['graph']['nodes']
        var input_edges = res['data']['graph']['edges']
        var output_nodes = []
        var output_edges = []
        
        var color_id = 1
        for(var key in input_nodes){

          // if input_nodes[key]['genre'] == 'attribute':
          const genre = input_nodes[key]['genre']
          if( !(genre in COLOR_PATTERN) ){
            console.log('add genre: '+ input_nodes[key]['genre'])
            COLOR_PATTERN[genre] = COLORS[this.color_id]
            if(this.color_id >= COLORS.length){
              this.color_id = 1
            }
            else{
              this.color_id += 1
            }
          }

          var shape = SHAPE_PATTERN['attribute']
          var value = input_nodes[key]['point']
          if(genre!='attribute'){
              shape = SHAPE_PATTERN['program']            
              // value = this.state.params.threshold
          }
          var mass = value
          // if(genre!='attribute'){
          //     mass = 10
          // }

          console.log(key, value)

          var n = {
            id: key, 
            label: key, 
            value: value, 
            title: key + ' : \n' + 'point:' + input_nodes[key]['point']  + '\n genre:' + genre,
            shape: shape, 
            genre: genre,
            color: COLOR_PATTERN[genre],
            // hidden: false
          }
          output_nodes.push(n)
          color_id += 1
        }

        for(var i in input_edges){
          var e = {from: input_edges[i][0], to: input_edges[i][1]}
          output_edges.push(e)
        }

        this.graph_orig = {nodes: output_nodes.slice(), edges: output_edges.slice()} 
        this.setState({
          graph: {nodes: output_nodes, edges: output_edges} //res['data']['graph']
        })

        this.network_orig = Object.assign(
          Object.create(Object.getPrototypeOf(this.state.network)),
          this.state.network
        );

        this.applyParam()

    }).catch(error => {
      alert('Failed to update graph')
      console.log(error)
    }); 
  } 

  render() {  
    return ( 
      <div style={{ maxWidth: "100%", maxHeight: "60%", height: "100%" }}>
         <Button variant="contained" color="primary" onClick={this.updateGraph} style={{width: "100%"}}>Update</Button>

         <FormControl component="fieldset"  >
          <FormGroup orientation="horizontal">
            <FormControlLabel
              control={<Checkbox checked={this.state.params.hide_dead_sink} onChange={this.showHideDeadSink} />}
              label="Hide Dead Sink"
            />
            {/*
            <FormControlLabel
              control={<Checkbox checked={this.state.options.configure.enabled} onChange={this.showHideConfig} />}
              label="Show Config"
            />
            */}
          </FormGroup>
         </FormControl>
        <TextField label="point threshold" variant="filled" type='number' inputProps={{ min: "0" , step: "0.1" }} 
          value = { this.state.params.threshold } onChange = { this.threshChange }
        />

         <Graph
          graph={this.state.graph}
          options={this.state.options}
          events={this.events}
          getNetwork={network => {
            this.state.network = network
            //  if you want access to vis.js network api you can set the state in a parent component using this property
          }}
          ref={this.graphRef} 
        />
      </div>
    );
  }
}


export default GraphView;