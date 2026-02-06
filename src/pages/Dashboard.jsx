import React, { useState, useEffect } from 'react';

function Dashboard({ user, onNavigate }) {
  const [myListings, setMyListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [listingsResponse, transactionsResponse] = await Promise.all([
        fetch('/api/listings/user/my-listings', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/checkout/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const listingsData = await listingsResponse.json();
      const transactionsData = await transactionsResponse.json();

      setMyListings(listingsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/checkout/confirm-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ transactionId }),
      });

      if (response.ok) {
        alert('Receipt confirmed! Funds will be released to the seller.');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to confirm receipt:', error);
    }
  };

  return (
    <div className="container page-content">
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings
          </button>
          <button 
            className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'listings' && (
              <div className="dashboard-content">
                <div className="section-header">
                  <h2>Your Ticket Listings</h2>
                  <button 
                    className="btn-primary"
                    onClick={() => onNavigate('sell')}
                  >
                    + Sell New Ticket
                  </button>
                </div>

                {myListings.length === 0 ? (
                  <div className="empty-state">
                    <p>You haven't listed any tickets yet.</p>
                    <button 
                      className="btn-primary"
                      onClick={() => onNavigate('sell')}
                    >
                      List Your First Ticket
                    </button>
                  </div>
                ) : (
                  <div className="listings-table">
                    {myListings.map(listing => (
                      <div key={listing.id} className="listing-row">
                        <div className="listing-row-content">
                          <div className="listing-row-main">
                            <h3>{listing.eventName}</h3>
                            <p className="listing-date">
                              {new Date(listing.eventDate).toLocaleDateString()} - {listing.ticketType}
                            </p>
                          </div>
                          <div className="listing-row-details">
                            <span className="listing-price">${listing.price.toFixed(2)}</span>
                            <span className={`status-badge status-${listing.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {listing.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="dashboard-content">
                <h2>Transaction History</h2>

                {transactions.length === 0 ? (
                  <div className="empty-state">
                    <p>No transactions yet.</p>
                    <button 
                      className="btn-primary"
                      onClick={() => onNavigate('marketplace')}
                    >
                      Browse Tickets
                    </button>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {transactions.map(transaction => {
                      const isBuyer = transaction.buyerId === user.id;
                      const listing = myListings.find(l => l.id === transaction.listingId);
                      
                      return (
                        <div key={transaction.id} className="transaction-card">
                          <div className="transaction-header">
                            <span className="transaction-type">
                              {isBuyer ? '🛒 Purchase' : '💰 Sale'}
                            </span>
                            <span className={`transaction-status status-${transaction.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {transaction.status}
                            </span>
                          </div>

                          <div className="transaction-details">
                            <div className="transaction-info">
                              <p className="transaction-listing">
                                Listing ID: {transaction.listingId}
                              </p>
                              <p className="transaction-amount">
                                Amount: ${transaction.amount.toFixed(2)}
                              </p>
                              <p className="transaction-date">
                                {new Date(transaction.createdAt).toLocaleString()}
                              </p>
                            </div>

                            {isBuyer && transaction.status === 'Pending Transfer' && (
                              <button 
                                className="btn-primary"
                                onClick={() => handleConfirmReceipt(transaction.id)}
                              >
                                Confirm Receipt
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
