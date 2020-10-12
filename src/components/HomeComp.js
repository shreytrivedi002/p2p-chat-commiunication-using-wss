import React, { Component } from "react";
import io from "socket.io-client";
import { Button, Modal } from "react-bootstrap";

const serverurl = "https://comm-server-api.herokuapp.com/";

class Home extends Component {
  constructor(props) {
    super(props);
    const socket = io(serverurl);
    this.state = {
      socket: socket,
      roomid: null,
      showIdModal: false,
      myName: "Anonymus",
      nameModalShow: true,
      chats: [],
      msginput: null,
    };
  }
  componentDidMount() {
    var socket = this.state.socket;

    socket.on("messages", (data) => {
      this.setState({
        chats: [...this.state.chats, data],
      });
      console.log(data);
    });
  }
  connect() {
    var socket = this.state.socket;
    socket.emit("joinRoom", this.state.roomid);
    this.setState({
      showIdModal: false,
    });
  }

  send(e) {
    e.preventDefault();
    var n = this.state.myName;
    var m = this.state.msginput;
    var socket = this.state.socket;
    socket.emit("messages", { name: n, msg: m });
    console.log(this.state.msginput);
    this.setState({
      msginput: "",
    });
  }
  createNameRoom() {
    var socket = this.state.socket;
    socket.emit("joinRoom", this.state.myName);
    this.setState({
      nameModalShow: false,
    });
  }
  join() {}

  renderChat() {
    var chat = (
      <ul>
        {this.state.chats.map((i, j) => (
          <li key={j}>
            {i.msg}
            {i.msg ? <span className="msgName">~{i.name}</span> : null}
          </li>
        ))}
      </ul>
    );
    return chat;
  }

  render() {
    return (
      <div className="bg-dark">
        <div className="header ">
          <div className="row justify-content-center btn-park">
            <span className="col-6 mb-1">Welcome {this.state.myName} !</span>
            <Button
              className="btn-success col-6 pt-0 ml-2 btns"
              onClick={() =>
                this.setState({
                  showIdModal: !this.state.showIdModal,
                })
              }
            >
              {this.state.roomid ? (
                <>ID:- {this.state.roomid} </>
              ) : (
                "Connect Someone"
              )}
            </Button>
          </div>
        </div>

        {/* {this.connect()} */}

        <br></br>

        <div className="container outer-chat">
          <h1>Lets Chat a Little</h1>
          <div className="chat-box col-lg-12 col-sm-12">
            <div className="chat-content">{this.renderChat()}</div>
          </div>
          <form onSubmit={(e) => this.send(e)}>
            <input
              className="col-lg-11"
              value={this.state.msginput}
              onChange={(e) =>
                this.setState({
                  msginput: e.target.value,
                })
              }
            />
            <button className="p-0 pl-2 pr-1 col-lg-1 btsn">Send</button>
          </form>
        </div>

        {/* modal  */}
        <>
          <Modal
            show={this.state.showIdModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            {/* <Modal.Header closeButton></Modal.Header> */}
            <Modal.Body>
              <h4>Enter Username to connect </h4>
              <p>
                <input
                  placeholder="enter id "
                  value={this.state.roomid}
                  onChange={(e) =>
                    this.setState({
                      roomid: e.target.value,
                    })
                  }
                />
                <br />
                <Button
                  className="btn-success p-0"
                  onClick={() => this.connect()}
                >
                  Connect
                </Button>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() =>
                  this.setState({
                    showIdModal: !this.state.showIdModal,
                  })
                }
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
        <>
          <Modal
            show={this.state.nameModalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="modal-90w"
            centered
          >
            {/* <Modal.Header closeButton></Modal.Header> */}
            <Modal.Body>
              <h4>Enter your unique name</h4>
              <p>
                <input
                  // placeholder=" "
                  value={this.state.myName}
                  onChange={(e) =>
                    this.setState({
                      myName: e.target.value,
                    })
                  }
                />
                <br />
                <Button
                  className="btn-success p-0"
                  onClick={() => this.createNameRoom()}
                >
                  Start
                </Button>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() =>
                  this.setState({
                    showIdModal: !this.state.showIdModal,
                  })
                }
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </div>
    );
  }
}

export default Home;
