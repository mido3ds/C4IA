import React, { useRef, useEffect, useState } from 'react';
import uImage from '../../images/unit.png';
import { getMsgs } from '../../Api/Api'
import { messages } from '../../messages'
import moment from 'moment';
import './ChatBox.css'

function ChatBox({ unit }) {
    const [msgs, setMsgs] = useState(null)

    useEffect(() => {
        //setMsgs(getMsgs(unit.ip))
        setMsgs(messages);
        console.log(messages)
        var element = document.querySelector(".chat-container");
        element.scrollTop = element.scrollHeight;
    })


    return (
        <div className="content-wrapper">
            <div className="chat-container">
                <ul className="chat-box chatContainerScroll">
                    {messages.map((msg, index) => {
                        return <>
                            {msg.sent ?
                                <li className="chat-right">
                                    <div className="chat-hour"> {moment.unix(msg.time).format('hh:mm')} </div>
                                    <div className="chat-text"> {msg.code} </div>
                                    <div className="chat-avatar">
                                        <img className="unit-item-profile-image" alt="unit" src={uImage}></img>
                                        <div className="chat-name"> Me </div>
                                    </div>
                                </li> :
                                <li className="chat-left">
                                    <div className="chat-avatar">
                                        <img className="unit-item-profile-image" alt="unit" src={uImage}></img>
                                        <div className="chat-name"> {unit.name.substr(0,unit.name.indexOf(' '))} </div>
                                    </div>
                                    <div className="chat-text"> {msg.code} </div>
                                    <div className="chat-hour"> {moment.unix(msg.time).format('hh:mm')} </div>
                                </li>
                            }
                        </>
                    })}
                </ul>
            </div>
        </div>
    )

} export default ChatBox;