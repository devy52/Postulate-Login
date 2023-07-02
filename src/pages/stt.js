import "./stt.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import React, { useState, useEffect } from "react";

const STT = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    SpeechRecognition.startListening();
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  useEffect(() => {
    if (transcript !== "") {
      setTextToCopy((prevText) => prevText + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleInputChange = (e) => {
    setTextToCopy(e.target.value);
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <>
      <div className="container">
        <textarea
          className="main-content"
          value={textToCopy + transcript}
          onChange={handleInputChange}
        ></textarea>
        <div className="btn-style">
          <button onClick={startListening}>Start Listening</button>
          <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
        </div>
      </div>
    </>
  );
};

export default STT;
