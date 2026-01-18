import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.scss';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat');

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

            {/* Trust Section */}
            <section className="trust-section">
                <div className="trust-container">
                    <p className="trust-title">Trusted by students and professionals worldwide</p>
                    <div className="trust-logos">
                        <div className="trust-logo">Universities</div>
                        <div className="trust-logo">Career Centers</div>
                        <div className="trust-logo">Students</div>
                        <div className="trust-logo">Professionals</div>
                    </div>
                </div>
            </section>

            {/* Feature Section 1 - Empower */}
            <section className="feature-section light-purple">
                <div className="feature-container">
                    <div className="feature-content">
                        <h2>Empower your career journey with AI. From exploration to success.</h2>
                        <p>
                            Whether you're a student exploring options or a professional seeking change,
                            we've got you covered. Career Bot provides personalized guidance tailored to
                            your unique goals and aspirations.
                        </p>
                        <a href="#" className="feature-link" onClick={(e) => { e.preventDefault(); handleTryIt(); }}>
                            Get started →
                        </a>
                    </div>
                    <div className="feature-image">
                        <img
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80"
                            alt="Career Exploration Interface"
                            style={{ borderRadius: '12px', boxShadow: '0 10px 40px rgba(113, 78, 245, 0.3)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Feature Section 2 - AI Agents */}
            <section className="feature-section">
                <div className="feature-container reverse">
                    <div className="feature-content">
                        <h2>AI Agents turn any question into personalized guidance. Instantly.</h2>
                        <p>
                            Engage with our AI 24/7 through natural conversation. Ask about career paths,
                            skills needed, salary expectations, or industry trends - get instant, accurate
                            answers tailored to your situation.
                        </p>
                        <a href="#" className="feature-link" onClick={(e) => { e.preventDefault(); handleTryIt(); }}>
                            Try the AI assistant →
                        </a>
                    </div>
                    <div className="feature-image">
                        <img
                            src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop&q=80"
                            alt="AI Chat Interface"
                            style={{ borderRadius: '12px', boxShadow: '0 10px 40px rgba(113, 78, 245, 0.3)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Feature Section 3 - Analysis */}
            <section className="feature-section dark">
                <div className="feature-container">
                    <div className="feature-content">
                        <h2>AI-powered <span className="highlight">career analysis.</span></h2>
                        <p>
                            Get comprehensive insights into career paths, required skills, market demand,
                            and growth potential. Our AI analyzes thousands of data points to provide
                            you with accurate, actionable recommendations.
                        </p>
                        <a href="#" className="feature-link" onClick={(e) => { e.preventDefault(); handleTryIt(); }}>
                            Explore careers →
                        </a>
                    </div>
                    <div className="feature-image">
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80"
                            alt="Career Analysis Dashboard"
                            style={{ borderRadius: '12px', boxShadow: '0 10px 40px rgba(113, 78, 245, 0.3)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Feature Section 4 - GenAI */}
            <section className="feature-section light-purple">
                <div className="feature-container reverse">
                    <div className="feature-content">
                        <h2>GenAI at your service.</h2>
                        <p>
                            Generate personalized career roadmaps, skill development plans, and resume
                            suggestions. Our AI creates customized content to help you achieve your
                            career goals faster.
                        </p>
                        <a href="#" className="feature-link" onClick={(e) => { e.preventDefault(); handleTryIt(); }}>
                            Generate your roadmap →
                        </a>
                    </div>
                    <div className="feature-image">
                        <img
                            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&q=80"
                            alt="Career Roadmap Generator"
                            style={{ borderRadius: '12px', boxShadow: '0 10px 40px rgba(113, 78, 245, 0.3)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="demo-section">
                <div className="demo-container">
                    <div className="demo-header">
                        <h2>All the career guidance capabilities, <span className="highlight">out of the box.</span></h2>
                        <p>
                            Skip the endless research and get instant answers. Career Bot is ready to help
                            you from day one with comprehensive career guidance across all industries and roles.
                        </p>
                    </div>
                    <div className="demo-showcase">
                        <div className="demo-tabs">
                            <button
                                className={`demo-tab ${activeTab === 'chat' ? 'active' : ''}`}
                                onClick={() => setActiveTab('chat')}
                            >
                                AI Chat
                            </button>
                            <button
                                className={`demo-tab ${activeTab === 'analysis' ? 'active' : ''}`}
                                onClick={() => setActiveTab('analysis')}
                            >
                                Career Analysis
                            </button>
                            <button
                                className={`demo-tab ${activeTab === 'roadmap' ? 'active' : ''}`}
                                onClick={() => setActiveTab('roadmap')}
                            >
                                Roadmap Generator
                            </button>
                            <button
                                className={`demo-tab ${activeTab === 'skills' ? 'active' : ''}`}
                                onClick={() => setActiveTab('skills')}
                            >
                                Skills Assessment
                            </button>
                        </div>
                        <div className="demo-content">
                            {activeTab === 'chat' && (
                                <img
                                    src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=900&h=500&fit=crop&q=80"
                                    alt="AI Chat Demo"
                                    style={{ borderRadius: '8px' }}
                                />
                            )}
                            {activeTab === 'analysis' && (
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=500&fit=crop&q=80"
                                    alt="Career Analysis Demo"
                                    style={{ borderRadius: '8px' }}
                                />
                            )}
                            {activeTab === 'roadmap' && (
                                <img
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&h=500&fit=crop&q=80"
                                    alt="Roadmap Generator Demo"
                                    style={{ borderRadius: '8px' }}
                                />
                            )}
                            {activeTab === 'skills' && (
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=500&fit=crop&q=80"
                                    alt="Skills Assessment Demo"
                                    style={{ borderRadius: '8px' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-section">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="logo">
                                <span className="logo-icon">🤖</span>
                                <span className="logo-text">Career Bot</span>
                            </div>
                            <p>
                                Empowering students and professionals with AI-driven career guidance
                                to make informed decisions about their future.
                            </p>
                        </div>
                        <div className="footer-column">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="#">Career Guides</a></li>
                                <li><a href="#">Industry Insights</a></li>
                                <li><a href="#">Success Stories</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Get Started</h4>
                            <ul>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); handleTryIt(); }}>Try Career Bot</a></li>
                                <li><a href="#">Sign Up</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Support</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 Career Bot. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
