import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble/MessageBubble';
import ChatInput from './ChatInput/ChatInput';
import TypingIndicator from './TypingIndicator/TypingIndicator';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import type { Message } from '../../types/chat.types';
import { sendMessage } from '../../services/api';
import './ChatBot.scss';

const initialMessages: Message[] = [
    {
        id: '1',
        text: "Welcome to Career Bot! I'm here to help you navigate your career journey. I can assist you with career guidance, education paths, skill development, and job opportunities.",
        sender: 'bot',
        timestamp: new Date(),
    },
    {
        id: '2',
        text: "To get started, feel free to ask me anything about careers, education, or professional development. What would you like to know?",
        sender: 'bot',
        timestamp: new Date(),
    },
];

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (text: string) => {
        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setError(null);

        try {
            // Call backend API
            const response = await sendMessage(text);

            // Add bot response only if there is a response (skip for thank you messages)
            if (response.response !== null && response.response !== undefined) {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: response.response,
                    sender: 'bot',
                    timestamp: new Date(response.timestamp),
                };

                setMessages((prev) => [...prev, botResponse]);
            }
        } catch (err) {
            // Handle error
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running and try again.",
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
            setError('Failed to get response from server');
            console.error('Error sending message:', err);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="chatbot-container">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <Header onMenuClick={toggleSidebar} />

            <div className="chat-messages">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
    );
};

export default ChatBot;
