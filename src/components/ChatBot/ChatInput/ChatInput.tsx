import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import './ChatInput.scss';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !disabled) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form className="chat-input-container" onSubmit={handleSubmit}>
            <input
                type="text"
                className="chat-input"
                placeholder="Enter your message here"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled}
            />
            <button
                type="submit"
                className="send-button"
                disabled={disabled || !inputValue.trim()}
            >
                <IoSend />
            </button>
        </form>
    );
};

export default ChatInput;
