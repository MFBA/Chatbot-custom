import { useState, useEffect } from "react";
import "./App.css";
import "./styles.scss";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
  SendButton,
  AttachmentButton,
  Avatar,
  Sidebar,
} from "@chatscope/chat-ui-kit-react";
// import LinkPreview from "@ashwamegh/react-link-preview";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faChevronCircleUp,
  faChevronCircleDown,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";

import { ThumbsUp, ThumbsDown, ChatCircle } from "@phosphor-icons/react";
import "@ashwamegh/react-link-preview/dist/index.css";

import Modal from "./Modal";
import { faFaceSmile, faFileImage } from "@fortawesome/free-regular-svg-icons";

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content: "Normal ChatGPT",
};

const WordByWordText = ({ text, delay, setShowSideBox }) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    {
      text.message.match(/(https?:\/\/[^\s]+)/g)
        ? setShowSideBox(true)
        : setShowSideBox(false);
    }
    const textArray = text.message.split(" ");
    setWords(textArray);
  }, [text.message]);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(
        () => setCurrentIndex((prevIndex) => prevIndex + 1),
        delay
      );
      return () => clearTimeout(timer);
    }
  }, [currentIndex, words.length, delay]);

  return (
    <div className="cs-message__content">
      {words.slice(0, currentIndex).join(" ")}
      {/* <Message style={{ visibility: "hidden" }} message={} /> */}
    </div>
  );
};

function App() {
  const [linkPreview, setLinkPreview] = useState({});
  const [messages, setMessages] = useState([
    {
      message: "Hi! How can I help",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openChat, setOpenChat] = useState(true);
  const [showSideBox, setShowSideBox] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",

      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      })
      .catch((err) => {
        console.log(err);
        setIsTyping(false);
        setOpenErrorModal(true);
      });
  }
  const [daysOfWeek, setDaysOfWeek] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);

  useEffect(() => {
    getLinkPreview(
      "https://www.workday.com/en-us/customer-stories.html"
    ).then((data) => setLinkPreview(data));
  }, [showSideBox]);

  return (
    <div className="App">
      {/* div to create a button to open widget button for chat  */}

      <div style={{ position: "relative", height: "800px", width: "400px" }}>
        {!openChat ? (
          <div
            style={{
              position: "absolute",
              bottom: "0em",
              // right: "12em",
              right: "0em",
              zIndex: "100",
            }}
            onClick={() => setOpenChat(true)}
          >
            <button
              style={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "50%",
                padding: "0px",
                height: "50px",
                width: "50px",
                color: "white",

                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <ChatCircle size={32} weight="fill" color="#502D3C" />
            </button>
          </div>
        ) : (
          <div>
            {showSideBox ? (
              <div
                style={{
                  height: "300px",
                  overflow: "hidden",
                  position: "absolute",
                  left: "100%",
                  bottom: "0%",
                }}
              >
                <Sidebar
                  style={{
                    height: "auto",
                    width: "200px",
                    backgroundColor: "#F9EDEA",
                    borderRadius: "10px",
                    display: "flex",
                    padding: "10px",
                    border: "1.5px solid rgb(255 132 102)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {/* <div
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#F6765E",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "20%",
                      }}
                    >
                      <FontAwesomeIcon icon={faFileImage} size={"1x"} />
                    </div> */}

                    <div style={{ width: "200px" }}>
                      <img
                        src={
                          linkPreview &&
                          linkPreview.images &&
                          linkPreview?.images[0]
                        }
                        style={{ width: "100%", height: "auto" }}
                      />
                      <p style={{ color: "black" }}>{linkPreview?.title}</p>
                      {/* <p style={{ margin: "0px" }}>
                        {linkPreview?.description}
                      </p> */}
                    </div>
                  </div>
                </Sidebar>
              </div>
            ) : null}
            <div
              style={{ position: "relative", height: "800px", width: "400px" }}
              // className={openChat && "chat-widget"}
            >
              {/* <LinkPreview url="https://reactjs.org" /> */}
              <MainContainer>
                <Modal
                  show={openErrorModal}
                  handleClose={() => setOpenErrorModal(false)}
                >
                  <div className="modal-content">
                    <p style={{ color: "black" }}>
                      Sorry, there was an error with the server. Please try
                      again later.
                    </p>
                  </div>
                </Modal>

                <Modal
                  show={openResponseModal}
                  handleClose={() => setOpenResponseModal(false)}
                  submitbtn={true}
                >
                  <div className="modal-content">
                    <p style={{ color: "black" }}>
                      Please provide your feedback
                    </p>
                    <textarea
                      style={{
                        borderRadius: "10px",
                        width: "30vw",
                        height: "8em",
                        padding: "0.5em",
                        background: "white",
                        color: "black",
                      }}
                      placeholder="Type your feedback here..."
                    />
                  </div>
                </Modal>
                <ChatContainer>
                  <ConversationHeader className="conversation-header">
                    <ConversationHeader.Back
                      onClick={() => setOpenChat(false)}
                    />

                    <Avatar src="https://picsum.photos/200" />
                    <ConversationHeader.Content
                      userName="Ippling Assistant"
                      info=""
                    />
                  </ConversationHeader>

                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={
                      isTyping ? (
                        <div>
                          <Avatar src="https://picsum.photos/200" />
                          <TypingIndicator />
                        </div>
                      ) : null
                    }
                  >
                    {messages.map((message, i) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.8em",
                            justifyContent:
                              message.sender === "ChatGPT" ? "left" : "right",
                            marginLeft:
                              message.sender === !"ChatGPT" ? "18vw" : "0px",
                          }}
                          className="message-avatar fadein-animation"
                        >
                          {message.sender === "ChatGPT" ? (
                            <Avatar src="https://picsum.photos/200" />
                          ) : null}
                          {message.sender === "ChatGPT" ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                width: "70%",
                              }}
                            >
                              <Avatar
                                className="message-logo"
                                src="https://picsum.photos/200"
                              />
                              {message.message ? (
                                <WordByWordText
                                  text={message}
                                  delay={100}
                                  setShowSideBox={setShowSideBox}
                                />
                              ) : null}

                              {/* <Message key={i} model={message} /> */}
                              <div style={{ display: "flex" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "5px",
                                    marginTop: "5px",
                                    marginLeft: "5px",
                                  }}
                                >
                                  <ThumbsUp
                                    size={16}
                                    onClick={() => setOpenResponseModal(true)}
                                  />
                                  <ThumbsDown
                                    size={16}
                                    onClick={() => setOpenResponseModal(true)}
                                  />
                                </div>
                                <p
                                  style={{
                                    margin: "0px",
                                    marginTop: "4px",
                                    marginLeft: "20px",

                                    fontSize: "0.7em",
                                    color: "grey",
                                  }}
                                >
                                  {daysOfWeek[new Date().getDay()] +
                                    " " +
                                    new Date().toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <Message key={i} model={message} />
                              <p
                                style={{
                                  margin: "0px",
                                  marginTop: "4px",
                                  marginLeft: "20px",

                                  fontSize: "0.7em",
                                  color: "grey",
                                  textAlign: "right",
                                }}
                              >
                                {daysOfWeek[new Date().getDay()] +
                                  " " +
                                  new Date().toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </MessageList>

                  <MessageInput
                    placeholder="Type message here"
                    onSend={handleSend}
                    sendButton={false}
                    attachButton={false}
                  />
                </ChatContainer>
                <div
                  style={{
                    position: "absolute",
                    bottom: "1em",
                    right: "0",
                    margin: "1em",
                    zIndex: "100",
                    display: "flex",
                    gap: "0.8em",
                    color: "grey",
                  }}
                >
                  <FontAwesomeIcon icon={faFileImage} size={"md"} />
                  <FontAwesomeIcon icon={faFaceSmile} size={"md"} />
                  <FontAwesomeIcon icon={faPaperclip} size={"md"} />
                </div>
                {/* <div style="position: relative; width: 0; height: 0"> */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    marginBottom: "10px",
                    left: "11em",
                    // textDecoration: "underline",

                    textAlign: "center",
                    fontSize: "0.7em",
                    // margin: "1em",

                    zIndex: "90",
                    display: "flex",
                    gap: "0.8em",
                    color: "grey",
                    // backgroundColor: "transparent",
                    // boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
                  }}
                >
                  <a
                    style={{ color: "grey", backgroundColor: "transparent" }}
                    href="https://www.google.com"
                  >
                    Privacy policy and disclaimer
                  </a>
                </div>
                {/* <div
            style={{
              width: "100%",
              height: "21px",
              boxShadow: "rgba(0, 0, 0, 0.15) 0px 14px 8px inset",
              position: "absolute",
              bottom: "0",
              backgroundColor: "transparent",
              //rotate
              transform: "rotate(180deg)",
              zIndex: "100",
            }}
          ></div> */}
                {/* </div> */}
              </MainContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
