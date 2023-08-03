import { useState } from "react";
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
} from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

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

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

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
      });
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "400px" }}>
        <MainContainer>
          <Modal
            show={openResponseModal}
            handleClose={() => setOpenResponseModal(false)}
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
                        <Message key={i} model={message} />
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
              attachButton={false}
              sendButton={false}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
