import React from 'react';

function Header({ user, onNavigate, onLogout }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => onNavigate('marketplace')}>
            <span className="logo-icon">🎫</span>
            <span className="logo-text">TicketSwap</span>
          </div>
          
          <nav className="nav">
            <button 
              className="nav-link" 
              onClick={() => onNavigate('marketplace')}
            >
              Browse Tickets
            </button>
            
            {user ? (
              <>
                <button 
                  className="nav-link" 
                  onClick={() => onNavigate('sell')}
                >
                  Sell Ticket
                </button>
                <button 
                  className="nav-link" 
                  onClick={() => onNavigate('dashboard')}
                >
                  Dashboard
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={onLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="nav-link" 
                  onClick={() => onNavigate('login')}
                >
                  Login
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => onNavigate('signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
