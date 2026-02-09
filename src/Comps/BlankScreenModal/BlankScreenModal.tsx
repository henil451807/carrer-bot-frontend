import React from "react";
import { createPortal } from "react-dom";
import "./BlankScreenModal.scss";

interface BlankScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlankScreenModal: React.FC<BlankScreenModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content blank-screen-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">
          <h2 className="modal-title">
            If you see blank screen, then please try the following steps to fix
            it:
          </h2>

          <ul className="steps-list">
            <li>Try clearing the browser cache.</li>
            <li>Try changing the network.</li>
            <li>Try accessing the chatbot on a different browser.</li>
            <li>Try accessing the chatbot on a different device.</li>
            <li>Try disabling VPN if you are using any.</li>
            <li>
              If you are using an ad blocker, please turn it off for this
              application or attempt the test in Incognito mode.
            </li>
            <li>
              Please make sure that the email address you're using is the same
              as the one you used to register
            </li>
          </ul>

          <div className="browsers-section">
            <p className="section-subtitle">
              Following browsers are supported:
            </p>
            <ul className="browser-list">
              <li>Google chrome</li>
              <li>Microsoft Edge</li>
              <li>Mozilla Firefox</li>
              <li>Safari</li>
            </ul>
          </div>

          <div className="browsers-section">
            <p className="section-subtitle">
              Following browsers are not supported:
            </p>
            <ul className="browser-list">
              <li>Internet Explorer</li>
              <li>Edge - Below version 80</li>
              <li>Brave</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="okay-button" onClick={onClose}>
            Okay
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BlankScreenModal;
