import React from 'react';
import { IoMenu, IoHelpCircleOutline } from 'react-icons/io5';
import './Header.scss';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="chat-header">
            <div className="header-left">
                <button className="menu-button" onClick={onMenuClick} aria-label="Menu">
                    <IoMenu />
                </button>
                <div className="header-title">
                    <span className="bot-icon">🤖</span>
                    <h1>Career Bot</h1>
                </div>
            </div>
            <div className="header-right">
                <button className="help-button" aria-label="Help">
                    <IoHelpCircleOutline />
                </button>
            </div>
        </header>
    );
};

export default Header;
