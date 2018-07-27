import React, { Component } from "react";
import "./App.css";
import Websocket from "./components/Websocket";
import {FaArrowRight} from "react-icons/lib/fa";
import axios from "axios";

class App extends Component {

  constructor(props) {
    super(props);

    this.onSocketMessage = this.onSocketMessage.bind(this);
    this.toolbarNext     = this.toolbarNext.bind(this);

    this.state = {
      message: "Loading last argument(s) ...",
    };
  }

  onSocketMessage(e) {
    console.log("Got socket message:");
    console.log(e);

    const msg = e.data || "Error";
    this.setState({ message: msg }, function() {
      console.log("State update done");
    });
  }

  toolbarNext() {
    axios.get("http://localhost:18899/api")
      .then(res => {
        console.log("Done");
        console.log(res);
      });
  }

  render() {
    return (
      <div className="App">
        <Websocket
          onMessage={this.onSocketMessage}
          url="ws://localhost:18899/ws">
        </Websocket>
        <header className="App-header">
          <h1 className="App-title">Tensorflow layer preview</h1>
        </header>
        <div className="App-toolbar">
          <FaArrowRight size={30} onClick={this.toolbarNext}/>
        </div>
        <hr />
        <pre>{this.state.message}</pre>
      </div>
    );
  }
}

export default App;
