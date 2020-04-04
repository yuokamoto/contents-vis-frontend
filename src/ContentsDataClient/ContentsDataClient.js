import React from "react";
import axios from "axios";

export default class ContentsDataClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{}
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    axios({
      method: "post",
      url: "http://localhost:5000/todos/",
      data: {
          task: {
            tasks: "sssstring",
            test: "sssstringgg"
          }
        }
    }).then((response) => {
      console.log('got POST response', response)
    });

    axios({
      method: "get",
      url: "http://localhost:5000/todos/",
    }).then((response) => {
      console.log('got GET response', response)
    });

  }


  render() {
      return (
        <div>
          <button onClick={this.onSubmit}>送信</button>
        </div>
      );
  }
}