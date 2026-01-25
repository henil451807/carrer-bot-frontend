import "./SupportMenu.scss";

const SupportMenu = () => {
  return (
    <div className="menu-container">
      {/* Item 1: Privacy Policy */}
      <button type="button" className="menu-item">
        <svg
          className="menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        <span className="menu-text">Privacy policy</span>
      </button>

      {/* Item 2: Get Support */}
      <button type="button" className="menu-item">
        <svg
          className="menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span className="menu-text">Get support</span>
      </button>

      {/* Item 3: Seeing a blank screen? */}
      <button type="button" className="menu-item">
        <svg
          className="menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </svg>
        <span className="menu-text">Seeing a blank screen?</span>
      </button>
    </div>
  );
};

export default SupportMenu;
