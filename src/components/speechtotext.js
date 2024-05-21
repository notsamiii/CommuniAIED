import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import axios from 'axios';

const SpeechToText = () => {
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [textToCopy, setTextToCopy] = useState('');
    const [isCopied, setCopied] = useClipboard(textToCopy, { successDuration: 1000 });
    const [isListening, setIsListening] = useState(false);
    const [errors, setErrors] = useState([]);
    const { resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        setTextToCopy(transcript);
    }, [transcript]);

    const toggleListening = () => {
        if (isListening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        }
        setIsListening(!isListening);
    };

    const handleTextChange = (e) => {
        setTextToCopy(e.target.value);
    };

    const handleReset = () => {
        setTextToCopy('');
        resetTranscript();
        setErrors([]);
    };

    const handleGrammarCheck = async () => {
        try {
            const response = await axios.post('http://localhost:5000/proxy', {
                text: textToCopy,
                language: 'en-US'
            });
            const { matches } = response.data;
            setErrors(matches);
            applyCorrections(matches);
        } catch (error) {
            console.error('Error checking grammar:', error);
        }
    };

    const applyCorrections = (matches) => {
        let correctedText = textToCopy;
        let offsetAdjustment = 0;

        matches.forEach(match => {
            const { offset, length, replacements } = match;
            if (replacements.length > 0) {
                const replacement = replacements[0].value;
                correctedText = correctedText.slice(0, offset + offsetAdjustment) + replacement + correctedText.slice(offset + length + offsetAdjustment);
                offsetAdjustment += replacement.length - length;
            }
        });

        setTextToCopy(correctedText);
    };

    const renderErrors = () => {
        return errors.map((error, index) => (
            <p key={index} style={{ color: 'red' }}>
                {error.message} (at position {error.offset})
            </p>
        ));
    };

    if (!browserSupportsSpeechRecognition) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    return (
        <div>
            <textarea
                className="main-content"
                value={textToCopy}
                onChange={handleTextChange}
            ></textarea>
            
            <div className="btn-style">
                <button onClick={toggleListening}>
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </button>
                <button onClick={setCopied}>
                    {isCopied ? 'Copied!' : 'Copy to clipboard'}
                </button>
                <button onClick={handleReset}>Clear text</button>
                <button onClick={handleGrammarCheck}>Check Grammar</button>
            </div>

            <div className="errors">
                {renderErrors()} 
            </div>
        </div>
    );
};

export default SpeechToText;

    