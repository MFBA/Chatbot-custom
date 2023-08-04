import { useState } from "react";
import "./App.css";
import "./styles.scss";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import EmojiPicker from "emoji-picker-react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faChevronCircleUp,
  faChevronCircleDown,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { faFaceSmile, faFileImage } from "@fortawesome/free-regular-svg-icons";

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content: "Normal ChatGPT",
};

function App() {
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

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "400px" }}>
        <div
          style={{
            height: "300px",
            overflow: "hidden",
          }}
        >
          <Sidebar
            style={{
              height: "120px",
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
              <div
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
              </div>
              <div
                style={{
                  color: "rgb(45 44 44)",
                  textAlign: "left",
                  paddingLeft: "0.5em",
                  margin: "0px",
                  fontSize: "0.8em",
                }}
              >
                <p
                  style={{
                    margin: "0px",
                    fontWeight: "bold",
                  }}
                >
                  Healthcare Comptitiveness ipsum
                </p>

                <p
                  style={{
                    margin: "0px",
                    fontWeight: "bold",
                    color: "#747474",
                  }}
                >
                  Last Updated:
                </p>
                <hr
                  style={{
                    border: "0.5px solid rgb(255 132 102)",
                  }}
                />
              </div>
            </div>
          </Sidebar>
        </div>
        <MainContainer>
          <Modal
            show={openErrorModal}
            handleClose={() => setOpenErrorModal(false)}
          >
            <div className="modal-content">
              <p style={{ color: "black" }}>
                Sorry, there was an error with the server. Please try again
                later.
              </p>
            </div>
          </Modal>

          <Modal
            show={openResponseModal}
            handleClose={() => setOpenResponseModal(false)}
            submitbtn={true}
          >
            <div className="modal-content">
              <p style={{ color: "black" }}>Please provide your feedback</p>
              <textarea
                style={{
                  borderRadius: "10px",
                  width: "15em",
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
              <ConversationHeader.Back />

              <Avatar src="https://picsum.photos/200" />
              <ConversationHeader.Content userName="Fin" info="Bot" />
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
              <p
                style={{ marginTop: "10px", fontSize: "0.8em", color: "grey" }}
              >
                {daysOfWeek[new Date().getDay()] +
                  " " +
                  new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
              </p>
              {messages.map((message, i) => {
                console.log("messae", message);
                return (
                  <div
                    style={{ display: "flex", gap: "0.8em" }}
                    className="message-avatar"
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
                        }}
                      >
                        <Avatar
                          className="message-logo"
                          src="https://picsum.photos/200"
                        />
                        <Message
                          className="typewriter-animation"
                          key={i}
                          model={message}
                        />

                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            marginTop: "5px",
                            marginLeft: "5px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faChevronCircleUp}
                            size={"sm"}
                            onClick={() => setOpenResponseModal(true)}
                          />

                          <FontAwesomeIcon
                            icon={faChevronCircleDown}
                            size={"sm"}
                            onClick={() => setOpenResponseModal(true)}
                          />
                        </div>
                      </div>
                    ) : (
                      <Message key={i} model={message} />
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
              bottom: "0.6em",
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
              textDecoration: "underline",

              textAlign: "center",
              fontSize: "0.7em",
              // margin: "1em",

              zIndex: "100",
              display: "flex",
              gap: "0.8em",
              color: "grey",
            }}
          >
            <a style={{ color: "grey" }} href="https://www.google.com">
              Privacy policy and disclaimer
            </a>
          </div>
          {/* </div> */}
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
