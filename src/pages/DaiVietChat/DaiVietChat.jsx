import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import './DaiVietChat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faThumbsUp, faThumbsDown, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { ToggleButton } from "../../components/buttons";
import downloadAll from "../../services/downloader.js";
import Video from "../../components/Video/Video.jsx";
import { AuthContext } from "../../context/authContext.js";
import axios from "axios";
import config from "../../config.js"
import user_image from '../../assets/user.jpg'
const serverUrl = "http://localhost:3005";


function removeAccentsAndSpaces(str) {
    // Xóa dấu
    const withoutAccents = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Xóa khoảng trắng
    const withoutSpaces = withoutAccents.replace(/\s/g, "");

    return withoutSpaces;
}

const DaiVietChat = () => {
    const location = useLocation();
    const character_chat = location.state?.character;
    const { id } = useParams();
    const [character, setCharacter] = useState({});
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [messageRespone, setMessageRespone] = useState({})
    const [clickedButtons, setClickedButtons] = useState({});
    const inputRef = useRef()
    const { currentUser } = useContext(AuthContext);
    useEffect(() => {
        console.log("Character Chat: ", character_chat);
    }, [character_chat]);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/characters/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                const data = await response.json();
                setCharacter(data);
                setMessages([
                    {
                        text: `Xin chào, tôi là ${data.name}, tôi có thể giúp gì cho bạn?`,
                        sentTime: '2024-01-01T12:00:00.000Z',
                        sender: 'Chat Bot',
                    }
                ]);
            } catch (error) {
                console.log("error", error);
            }
        }

        fetchCharacter();
    }, [id]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    }

    const handleSend = async () => {
        if (!inputMessage) return;
       
            const newMessage = {
                text: inputMessage,
                sentTime: '2024-01-01T12:00:00.000Z',
                sender: 'me',
            };
            setMessages([...messages, newMessage]);
            setInputMessage('');
            fetchMessage([...messages, newMessage], newMessage);
       
    }

    const fetchMessage = async (chatMessages, newMessage) => {
        const skeletonMessage = {
            text: '...',
            sentTime: '2024-01-01T12:00:00.000Z',
            sender: 'Chat Bot'
        };
        setMessages([...chatMessages, skeletonMessage]);
        const payload = {

            // text: newMessage.text, // Assuming newMessage has a 'text' field
            // name: newMessage.name || 'DefaultName' // Use a default name if not provided
            character_id: character_chat.id,
            question: newMessage.text

        };
        console.log("payload", payload)
        const response = await axios.post(
            `${config.API_BASE_URL}/api/v1/chat`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${currentUser.access_token}`
                },
                // Nếu bạn cần gửi cookie hoặc thông tin xác thực
            }
        );

        const data = await response.data;
        const newMessageReply = {
            text: data.answer,
            sentTime: new Date().toISOString(), // Use current time for the reply message
            sender: 'Chat Bot',
            respone_id: data.log_id
        };
        console.log(data.log_id)
        setMessages([...chatMessages, newMessageReply]);

        //  textToSpeech(data.answer);
    }

    const handleFeedback = async (responeId, feedbackType) => {
        console.log("đây là id của tin nhắn phản hồi: ", responeId)
        try {
            const payload = {
                id: responeId,
                feedback: feedbackType,
            };

            const response = await axios.put(
                `${config.API_BASE_URL}/api/v1/log/feedback`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${currentUser.access_token}` // Sử dụng token từ context
                    },
                }
            );

            console.log("Feedback sent successfully:", response.data);
            // setClickedButtons((prevState) => ({
            //     ...prevState,
            //     [responeId]: feedbackType, // Cập nhật trạng thái của nút cho tin nhắn cụ thể
            //   }));
            setClickedButtons((prevState) => {
                // Kiểm tra xem nút đã được click hay chưa, nếu đã thì hủy trạng thái (trả về null)
                if (prevState[responeId] === feedbackType) {
                    const newState = { ...prevState };
                    delete newState[responeId]; // Xóa trạng thái của nút nếu đã được chọn lại
                    return newState;
                }
                // Nếu nút chưa được chọn hoặc đang chọn nút khác, cập nhật trạng thái
                return { ...prevState, [responeId]: feedbackType };
            });

        } catch (error) {
            console.error("Error sending feedback:", error);

        }
    };

    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setInputMessage(text);
        }
        setIsRecording(true);
        recognition.start();
        recognition.onend = () => {
            setIsRecording(false);
        }
    }

    // require video

    // const handleSend2 = () => {
    //     if (!inputMessage) return;
    //     const newMessage = {
    //         text: inputMessage,
    //         sentTime: '2024-01-01T12:00:00.000Z',
    //         sender: 'me',
    //     };
    //     setMessages([...messages, newMessage]);
    //     setInputMessage('');
    //     fetchVideo([...messages, newMessage], newMessage);
    // }

    // const fetchVideo = async (chatMessages, newMessage) => {
    //     const skeletonMessage = {
    //         text: '...',
    //         sentTime: '2024-01-01T12:00:00.000Z',
    //         sender: 'Chat Bot'
    //     };
    //     setMessages([...chatMessages, skeletonMessage]);
    //     const payload = {
    //         text: newMessage.text, // Assuming newMessage has a 'text' field
    //         name: newMessage.name || 'DefaultName' // Use a default name if not provided
    //     };
    //     console.log(payload);
    //     const videoUrls = await downloadAll(newMessage.text);
    //     const newMessageReply = {
    //         text: "video",
    //         videoUrls: videoUrls,
    //         sentTime: new Date().toISOString(), // Use current time for the reply message
    //         sender: 'Chat Bot'
    //     };
    //     setMessages([...chatMessages, newMessageReply]);
    // }

    return (
        <div className="chatBox">
            <div className="chatBox-video">
                {


                    <img src={character_chat.profile_image} alt="background" width={'100%'} />

                }
            </div>
            <div className="chatBox-main">
                <div className="chatBox-header">
                    <div className="chatBox-header-title">
                        <h3>Nhân vật {character_chat.name}</h3>
                    </div>
                    {/* <div className="chatBox-header-close">
                        <i>X</i>
                    </div> */}
                </div>
                <div className="chatBox-body">
                    <div className="chatBox-body-content">
                        {messages.map((message, index) => {
                            return (
                                message.sender === 'Chat Bot' ? (
                                    <div className="chatBox-body-content-message chatBox-message__incoming" key={index}>
                                        <div className="chatBox-body-content-message-item">
                                            <div className="chatBox-body-content-message-item-avatar">
                                                <img src={character_chat.profile_image} alt="avatar" />
                                            </div>
                                            {
                                                // (message.text === '...') ? (
                                                //     <div className="chatBox-body-content-message-item-content">
                                                //         <div className="chatBox-body-content-message-item-content">
                                                //             <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>
                                                //             <dotlottie-player src="" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>
                                                //         </div>
                                                //     </div>
                                                // ) : (
                                                <div className="chatBox-body-content-message-item-content">
                                                    {
                                                        message.text === "video" ? (
                                                            <Video videoUrls={message.videoUrls} />
                                                        ) : (
                                                            <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                                                        )
                                                    }
                                                    <div className="chatBox-message-buttons">
                                                        <button title="Like" onClick={() => handleFeedback(message.respone_id, "like")} className={`feedback-button like-button ${clickedButtons[message.respone_id] === "like" ? "clicked" : ""
                                                            }`} >
                                                            <FontAwesomeIcon icon={faThumbsUp} />

                                                        </button>
                                                        <button title="Dislike" onClick={() => handleFeedback(message.respone_id, "dislike")}
                                                            className={`feedback-button dislike-button ${clickedButtons[message.respone_id] === "dislike" ? "clicked" : ""
                                                                }`}>
                                                            <FontAwesomeIcon icon={faThumbsDown} />
                                                        </button>
                                                        <button title="Copy">
                                                            <FontAwesomeIcon icon={faClipboard} />
                                                        </button>

                                                    </div>
                                                </div>

                                                //)
                                            }
                                        </div>
                                    </div>) : (
                                    <div className="chatBox-body-content-message chatBox-message__outgoing" key={index}>
                                        <div className="chatBox-body-content-message-item">
                                            <div className="chatBox-body-content-message-item-avatar">
                                                <img src={user_image} alt="avatar" />
                                            </div>
                                            <div className="chatBox-body-content-message-item-content">
                                                <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        })}
                    </div>
                </div>
                <div className="chatBox-body-input">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {/* <ToggleButton ref={inputRef} /> */}
                    <button
                        style={{ backgroundColor: isRecording && 'white' }}
                        onClick={() => handleRecord()}
                    >
                        {
                            isRecording ? (
                                <FontAwesomeIcon icon={faCircle} color="red" />
                            ) : (
                                <FontAwesomeIcon icon={faMicrophone} color="white" />
                            )
                        }
                    </button>
                    <button onClick={() => handleSend()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DaiVietChat;