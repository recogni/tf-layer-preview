// 3rd party imports.
import React, {Component} from "react";
import {FaArrowRight, FaBan} from "react-icons/lib/fa";
import axios from "axios";

// Application imports.
import "./App.css";
import Websocket from "./components/Websocket";
import proto from "./proto/preview_pb";

// App class definition.
class App extends Component {

  constructor(props) {
    super(props);

    this.onSocketMessage = this.onSocketMessage.bind(this);
    this.toolbarNext     = this.toolbarNext.bind(this);
    this.clearLogs       = this.clearLogs.bind(this);

    this.state = {
      logs:    [],
      error:   "",
    };
  }

  // Logging "framework".
  _log(msg, type) {
    const nl  = {message: msg, type: type};
    this.setState({ logs: [...this.state.logs, nl] })
  }
  log(msg) {
    this._log(msg, "status");
  }
  warn(msg) {
    this._log(msg, "warning");
  }
  error(msg) {
    this._log(msg, "error")
  }
  clearLogs() {
    this.setState({ logs: [] });
  }

  onSocketMessage(e) {
    let buf = new TextEncoder().encode(e.data)
    let pkt = proto.Packet.deserializeBinary(buf);

    if (pkt.hasMessage()) {
      this.log(pkt.getMessage())
    } else if (pkt.hasError()) {
      this.error(pkt.getMessage())
    } else {
      console.log("unhandled proto packet", pkt);
    }
  }

  toolbarNext() {
    axios.get("http://localhost:18899/api/next_op");
  }

  render() {
    // Create the list of divs that will make up the logs.
    const logs = this.state.logs.map((item, i) => {
      return <div className="App-log-line">{item.message}</div>
    });

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
          <FaBan size={30} onClick={this.clearLogs} />
          <FaArrowRight size={30} onClick={this.toolbarNext} />
        </div>

        <div className="App-logs">
          { logs }
        </div>
      </div>
    );
  }
}

// Expose the `App`.
export default App;
