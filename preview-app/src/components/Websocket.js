import React from "react";

////////////////////////////////////////////////////////////////////////////////
/*

    Websocket component.

    Props:
        [fn] onOpen         = function to call when the socket opens.
        [fn] onClose        = function to call when the socket closes.
        [fn] onMessage      = function to call when the socket gets data.

*/
////////////////////////////////////////////////////////////////////////////////

class Websocket extends React.Component {

    constructor(props) {
        super(props);
        this.socket = new WebSocket(this.props.url);
        this.socket.binaryType = "arraybuffer";
    }

    componentDidMount() {
        // Setup function redirects if the specified methods are provided
        // to the property list for this instance.
        let ws = this.socket;
        ws.onopen = () => {
            console.log("socket::open");
            if (typeof this.props.onOpen === "function") this.props.onOpen();
        }
        ws.onmessage = (e) => {
            console.log("socket::msg");
            if (typeof this.props.onMessage === "function") this.props.onMessage(e);
        }
        ws.onclose = () => {
            console.log("socket::close");
            if (typeof this.props.onClose === "function") this.props.onClose();
        }
    }

    componentWillUnmount() {
        let ws = this.socket;
        ws.close();
    }

    render() {
        return (
            <div>
            </div>
        );
    }

}

////////////////////////////////////////////////////////////////////////////////

export default Websocket;

////////////////////////////////////////////////////////////////////////////////
