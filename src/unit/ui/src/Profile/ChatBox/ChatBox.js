import React, { useEffect, useState } from 'react';
import uImage from '../../images/unit.png';
import moment from 'moment';
import { receivedCodes, sentCodes } from '../../codes'
import './ChatBox.css'

function ChatBox({allMsgs}) {
    // TODO pass stored recievedMsgs of array of json
    const [msgs, setMsgs] = useState(null)

    useEffect(() => {
        setMsgs(allMsgs)
        if (!allMsgs || !allMsgs.length) {
            window.$('.chat-container').css('overflow-y', 'hidden')
        } else {
            window.$('.chat-container').css('overflow-y', 'scroll')
            var element = document.querySelector(".chat-container");
            if(element) element.scrollTop = element.scrollHeight;
        }
        return
    },[allMsgs])

    return (
        <div className="content-wrapper">
            <div className="chat-container">
                {msgs && msgs.length ?
                    <ul className="chat-box chatContainerScroll">
                        {msgs.map((msg, _) => {
                            return <>
                                {msg.sent ?
                                    <li className="chat-right">
                                        {/* <div className="chat-hour"> {moment.unix(msg.time).format('hh:mm')} </div> */}
                                        <div className="chat-text"> {sentCodes[msg.Body]} </div>
                                        <div className="chat-avatar">
                                            <img className="unit-item-profile-image" alt="unit" src={uImage}></img>
                                            <div className="chat-name"> Me </div>
                                        </div>
                                    </li> :
                                    <li className="chat-left">
                                        <div className="chat-avatar">
                                            <img className="unit-item-profile-image" alt="unit" src={uImage}></img>
                                            <div className="chat-name"> {"Command Center"} </div>
                                        </div>
                                        <div className="chat-text"> {receivedCodes[msg.Body]} </div>
                                        {/* <div className="chat-hour"> {moment.unix(msg.time).format('hh:mm')} </div> */}
                                    </li>
                                }
                            </>
                        })}
                    </ul> :
                    <div className="no-data-chat-msg">
                        <p> No data to be previewed </p>
                    </div>}
            </div>
        </div>
    )

} export default ChatBox;