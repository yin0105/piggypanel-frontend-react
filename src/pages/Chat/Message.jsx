import React, { Component } from 'react';
import '../../assets/css/chat-room.css';

class Message extends Component {
    render () {
        return (
            <div className="message-body p-1" style={{ display: 'block', overflow: 'auto' }}>
                <div className={"col-sm-12 message-main-" + this.props.classType}>
                    <div className={this.props.classType}>
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