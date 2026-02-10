import React from "react";
import {
  IoClose,
  IoChatbubbleEllipsesOutline,
  IoBookOutline,
  IoSettingsOutline,
  IoPersonOutline,
  IoInformationCircleOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import "./Sidebar.scss";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: <IoChatbubbleEllipsesOutline />, label: "New Chat", active: true },
    { icon: <IoBookOutline />, label: "Chat History", active: false },
    { icon: <IoPersonOutline />, label: "Profile", active: false },
    { icon: <IoSettingsOutline />, label: "Settings", active: false },
    { icon: <IoInformationCircleOutline />, label: "About", active: false },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-title">
            <span className="bot-icon">🤖</span>
            <h2>Jyoti</h2>
          </div>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <IoClose />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="sidebar-content">
          {/* Menu Items */}
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`nav-item ${item.active ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Divider */}
          <div className="sidebar-divider" />

          {/* User Section */}
          <div className="sidebar-user">
            <div className="user-info">
              <div className="user-avatar">
                <span>👤</span>
              </div>
              <div className="user-details">
                <p className="user-name">Guest User</p>
                <p className="user-status">Active</p>
              </div>
            </div>
            <button className="logout-button">
              <IoLogOutOutline />
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <p className="version">Version 1.0.0</p>
          <p className="copyright">© 2026 Career Jyoti</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
