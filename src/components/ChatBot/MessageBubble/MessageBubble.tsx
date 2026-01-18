import React from 'react';
import type { Message } from '../../../types/chat.types.ts';
import './MessageBubble.scss';

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { text, sender, timestamp } = message;

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className={`message-bubble-wrapper ${sender}`}>
            {sender === 'bot' && (
                <div className="avatar bot-avatar">
                    <span>🤖</span>
                </div>
            )}

            <div className="message-content">
                <div className={`message-bubble ${sender}`}>
                    {text}
                </div>
                <div className="message-timestamp">
                    {formatTime(timestamp)}
                </div>
            </div>

            {sender === 'user' && (
                <div className="avatar user-avatar">
                    <span>👤</span>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
