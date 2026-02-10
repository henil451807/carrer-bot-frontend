import React from "react";
import "./LanguageToggle.scss";

interface LanguageToggleProps {
  language: "English" | "Hindi";
  onToggle: () => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onToggle,
}) => {
  return (
    <div className="language-toggle-container">
      <div className="language-info">
        <svg
          className="language-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="language-text">
          Language: <strong>{language}</strong>
        </span>
      </div>
      <button type="button" className="language-switch-btn" onClick={onToggle}>
        {language === "English" ? "Hindi" : "English"}
      </button>
    </div>
  );
};

export default LanguageToggle;
