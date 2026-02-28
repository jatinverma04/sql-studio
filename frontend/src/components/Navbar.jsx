import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="container navbar__inner">
                {/* Logo */}
                <Link to="/" className="navbar__logo" id="nav-logo">
                    <div className="navbar__logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="5" width="20" height="3" rx="1" fill="#f0883e" />
                            <rect x="2" y="11" width="15" height="2" rx="1" fill="#f0883e" opacity="0.7" />
                            <rect x="2" y="16" width="18" height="2" rx="1" fill="#f0883e" opacity="0.4" />
                            <circle cx="19" cy="17" r="4" fill="#3fb950" opacity="0.9" />
                            <path d="M17 17l1.5 1.5L21 15" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="navbar__logo-text">
                        <span className="navbar__logo-name">CipherSQL</span>
                        <span className="navbar__logo-tag">Studio</span>
                    </div>
                </Link>

                {/* Center — Breadcrumb on attempt pages */}
                {!isHome && (
                    <div className="navbar__breadcrumb">
                        <Link to="/" className="navbar__breadcrumb-link">Assignments</Link>
                        <span className="navbar__breadcrumb-sep">/</span>
                        <span className="navbar__breadcrumb-current">Attempt</span>
                    </div>
                )}

                {/* Right */}
                <div className="navbar__right">
                    <a
                        href="https://cipherschools.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="navbar__badge"
                    >
                        CipherSchools
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
