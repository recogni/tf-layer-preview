import React, {Component} from "react";
import {FaArrowRight}     from "react-icons/lib/fa";
import axios              from "axios";

import "./App.css";
import Websocket from "./components/Websocket";


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
    const msg = e.data || "Error";
    this.setState({ message: msg });
  }

  toolbarNext() {
    axios.get("http://localhost:18899/api");
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
