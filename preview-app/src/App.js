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
      preview: undefined,
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

  // Websocket interop.
  onSocketMessage(e) {
    const buf = new Uint8Array(e.data);
    let pkt = proto.Packet.deserializeBinary(buf);

    if (pkt.hasMessage()) {
      this.log(pkt.getMessage())
    } else if (pkt.hasError()) {
      this.error(pkt.getMessage())
    } else if (pkt.hasPreview()) {
      let p = pkt.getPreview();
      this.setState({ preview: p });
    } else {
      console.log("unhandled proto packet", pkt);
    }
  }

  // UI interaction.
  toolbarNext() {
    axios.get("http://localhost:18899/api/next_op");
  }

  // App render.
  buildPreview() {
    const p = this.state.preview;
    if (p === undefined) return;

    const name = p.getName();
    const data = p.getData();

    const tensor_defs = p.getTensorsList().map((tensor, i) => {
      return (
        <div key={i} className="App-tensor-def">
          <div>Name:  {tensor.getName()}</div>
          <div>Type:  {tensor.getType()}</div>
          <div>Shape: {""+tensor.getShapeList() || "Unknown"}</div>
          <div>{tensor.getData_asB64()}</div>
        </div>
      )
    });

    return (
      <div>
        <h4>{ name }</h4>
        <pre>{ data }</pre>
        { tensor_defs }
        <hr />
      </div>
    )
  }

  render() {
    // Create the list of divs that will make up the logs.
    const logs = this.state.logs.map((item, i) => {
      return <div className="App-log-line">{item.message}</div>
    });

    // TODO: Optimize this w/ a dumb cache.
    const preview = this.buildPreview();

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

        <div className="App-preview">
          { preview }
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
