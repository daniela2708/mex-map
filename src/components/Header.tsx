import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src="/logos/wizeline.svg" alt="Wizeline" className="wizeline-logo" />
        <h1 className="header-title">Market Research Study</h1>
      </div>
    </header>
  );
};
