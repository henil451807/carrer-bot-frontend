import React from 'react';
import './TypingIndicator.scss';

const TypingIndicator: React.FC = () => {
    return (
        <div className="typing-indicator-wrapper">
            <div className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
    );
};

export default TypingIndicator;
