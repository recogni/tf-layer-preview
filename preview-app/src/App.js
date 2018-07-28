import React, {Component} from "react";
import {FaArrowRight}     from "react-icons/lib/fa";
import axios              from "axios";

import "./App.css";
import Websocket from "./components/Websocket";
import proto     from "./proto/preview_pb";

class App extends Component {

  constructor(props) {
    super(props);

    this.onSocketMessage = this.onSocketMessage.bind(this);
    this.toolbarNext     = this.toolbarNext.bind(this);

    this.debug = {}

    this.state = {
      message: "Loading last argument(s) ...",
      error:   "",
    };
  }

  onSocketMessage(e) {
    const msg = e.data || "Error";
    let buf = new TextEncoder().encode(msg)
    let pkt = proto.Packet.deserializeBinary(buf);
    console.log(msg);
    console.log(buf);
    console.log(pkt.toObject())
    this.debug = pkt;

    if (pkt.hasMessage()) {
      this.setState({ message: pkt.getMessage() });
    } else if (pkt.hasError()) {
      this.setState({ error: pkt.getError() });
    } else {
      console.log("unhandled proto packet", pkt);
    }
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
