import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.scss';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleTryIt = () => {
        navigate('/chat');
    };

    return (
        <div className="landing-page">
            {/* Navigation Header */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="nav-left">
                        <div className="logo">
                            <span className="logo-icon">🤖</span>
                            <span className="logo-text">Career Bot</span>
                        </div>
                    </div>
                    <div className="nav-right">
                        {/* <a href="#solution" className="nav-link">Solution</a>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#about" className="nav-link">About</a> */}
                        <button className="try-it-nav" onClick={handleTryIt}>
                            Try it
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        {/* Badge */}
                        <div className="hero-badge">
                            <span className="badge-icon">🎯</span>
                            <span className="badge-text">
                                AI-Powered Career Guidance Platform
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="hero-title">
                            Smarter career guidance<br />
                            <span className="title-highlight">begins with AI</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="hero-description">
                            Join thousands of students and professionals leveraging<br />
                            AI-native Career Guidance System to discover the perfect career path,<br />
                            including technology, business, healthcare, and more.
                        </p>

                        {/* CTA Button */}
                        <button className="cta-button" onClick={handleTryIt}>
                            Try it
                            <span className="arrow-icon">→</span>
                        </button>
                    </div>

                    {/* Mockup Image */}
                    <div className="hero-image">
                        <img
                            src="/brain/7ec53426-6e60-4040-a32c-5c6374e4a6ad/career_bot_mockup_1768150822560.png"
                            alt="Career Bot Interface"
                            className="mockup-img"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
