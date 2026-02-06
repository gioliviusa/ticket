import React, { useState, useEffect } from 'react';

function Marketplace({ user, onViewListing, onNavigate }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    event: '',
    minPrice: '',
    maxPrice: '',
    status: 'Approved'
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.event) params.append('event', filters.event);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`/api/listings?${params}`);
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marketplace-page">
      <div className="marketplace-hero">
        <div className="container">
          <h1>Find Your Perfect Ticket</h1>
          <p>Browse verified tickets from trusted sellers</p>
          
          {!user && (
            <div className="hero-cta">
              <button 
                className="btn-primary"
                onClick={() => onNavigate('signup')}
              >
                Join TicketSwap
              </button>
              <button 
                className="btn-secondary"
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="marketplace-content">
          <aside className="filters-sidebar">
            <h3>Filter Tickets</h3>
            
            <div className="filter-group">
              <label>Search Event</label>
              <input
                type="text"
                placeholder="Event name..."
                value={filters.event}
                onChange={(e) => setFilters({...filters, event: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Verification">Pending</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
            </div>

            <button 
              className="btn-secondary btn-full"
              onClick={() => setFilters({event: '', minPrice: '', maxPrice: '', status: 'Approved'})}
            >
              Clear Filters
            </button>
          </aside>

          <div className="listings-grid">
            {loading ? (
              <div className="loading">Loading tickets...</div>
            ) : listings.length === 0 ? (
              <div className="no-listings">
                <p>No tickets found matching your criteria.</p>
                {user && (
                  <button 
                    className="btn-primary"
                    onClick={() => onNavigate('sell')}
                  >
                    Sell Your Ticket
                  </button>
                )}
              </div>
            ) : (
              listings.map(listing => (
                <div key={listing.id} className="listing-card">
                  <div className="listing-header">
                    <h3>{listing.eventName}</h3>
                    <span className={`status-badge status-${listing.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {listing.status}
                    </span>
                  </div>
                  
                  <div className="listing-details">
                    <div className="detail-row">
                      <span className="detail-label">📅 Date:</span>
                      <span>{new Date(listing.eventDate).toLocaleDateString()} at {new Date(listing.eventDate).toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">🎫 Type:</span>
                      <span>{listing.ticketType}</span>
                    </div>
                    
                    {listing.section && (
                      <div className="detail-row">
                        <span className="detail-label">📍 Section:</span>
                        <span>{listing.section}</span>
                      </div>
                    )}
                    
                    <div className="detail-row">
                      <span className="detail-label">💰 Face Value:</span>
                      <span>${listing.faceValue.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="listing-footer">
                    <div className="price">${listing.price.toFixed(2)}</div>
                    <button 
                      className="btn-primary"
                      onClick={() => onViewListing(listing.id)}
                      disabled={listing.status !== 'Approved'}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
