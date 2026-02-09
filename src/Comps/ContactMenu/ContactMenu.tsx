import { useState } from "react";
import "./ContactMenu.scss";

const ContactMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="contact-menu-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 1. Question Mark Icon Button */}
      <button className="contact-menu-btn" aria-label="Help">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>

      {/* 2. The Tooltip Box */}
      {isOpen && (
        <div className="tooltip-box">
          {/* Yellow Envelope Icon */}
          <svg
            width="50"
            height="40"
            viewBox="0 0 64 64"
            style={{ marginBottom: "16px" }}
          >
            <rect
              x="8"
              y="16"
              width="48"
              height="32"
              rx="2"
              fill="#FFC107"
              stroke="#333"
              strokeWidth="2"
            />
            <path
              d="M8 16L32 34L56 16"
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            <circle
              cx="48"
              cy="42"
              r="7"
              fill="#fff"
              stroke="#333"
              strokeWidth="2"
            />
            <path
              d="M48 45V39M45 42L48 39L51 42"
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
          </svg>

          {/* Facing Difficulties Section */}
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                color: "#5f6368",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Jyoti : Your digital MargDarshak
            </div>
            <a
              href="mailto:jobshipz@flaunch.io"
              style={{
                color: "#1a73e8",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Contact <br /> jobshipz@flaunch.io
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMenu;
