import React, { Component } from 'react';
import '../../assets/css/chat-room.css';

class Message extends Component {
    render () {
        return (
            <div className="message-body p-1" style={{ display: 'block', overflow: 'auto' }}>
                <div className={"col-sm-12 message-main-" + this.props.classType}>
                    <div className={this.props.classType}>
                        { 
                            this.props.classType == "sender" && 
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={() => {this.props.removeMsg(this.props.msgId)}}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        }
                        <div className="message-text">
                        {
                            this.props.text.split("<br/>").map((row, i) => {
                                return  <span key={i}>{row}<br/></span>;
                            })
                        }
                        </div>
                        <span className="message-time pull-right">{this.props.date_sent}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Message;