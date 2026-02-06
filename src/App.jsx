import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import SellTicket from './pages/SellTicket';
import ListingDetail from './pages/ListingDetail';

function App() {
  const [currentPage, setCurrentPage] = useState('marketplace');
  const [user, setUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    // Check for stored token
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('marketplace');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('marketplace');
  };

  const handleViewListing = (listingId) => {
    setSelectedListing(listingId);
    setCurrentPage('listing-detail');
  };

  return (
    <div className="app">
      <Header 
        user={user} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout}
      />
      
      <main className="main-content">
        {currentPage === 'login' && !user && (
          <Login 
            onLogin={handleLogin} 
            onNavigate={setCurrentPage}
          />
        )}
        
        {currentPage === 'signup' && !user && (
          <Signup 
            onSignup={handleLogin} 
            onNavigate={setCurrentPage}
          />
        )}
        
        {currentPage === 'marketplace' && (
          <Marketplace 
            user={user}
            onViewListing={handleViewListing}
            onNavigate={setCurrentPage}
          />
        )}
        
        {currentPage === 'sell' && user && (
          <SellTicket 
            user={user}
            onNavigate={setCurrentPage}
          />
        )}
        
        {currentPage === 'dashboard' && user && (
          <Dashboard 
            user={user}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'listing-detail' && selectedListing && (
          <ListingDetail 
            listingId={selectedListing}
            user={user}
            onNavigate={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
