import React, { useState, useEffect } from 'react';

function ListingDetail({ listingId, user, onNavigate }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}`);
      const data = await response.json();
      setListing(data);
    } catch (error) {
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    setPurchasing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Create Stripe checkout session (mock)
      const sessionResponse = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listingId: listing.id }),
      });

      const sessionData = await sessionResponse.json();

      if (!sessionResponse.ok) {
        throw new Error(sessionData.error || 'Failed to create checkout session');
      }

      // Complete purchase (mock)
      const purchaseResponse = await fetch('/api/checkout/complete-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          listingId: listing.id,
          sessionId: sessionData.id
        }),
      });

      const purchaseData = await purchaseResponse.json();

      if (!purchaseResponse.ok) {
        throw new Error(purchaseData.error || 'Failed to complete purchase');
      }

      alert('Purchase successful! Check your dashboard for transfer details.');
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return <div className="container page-content loading">Loading...</div>;
  }

  if (error && !listing) {
    return <div className="container page-content error-message">{error}</div>;
  }

  return (
    <div className="container page-content">
      <div className="listing-detail-page">
        <button 
          className="back-button"
          onClick={() => onNavigate('marketplace')}
        >
          ← Back to Marketplace
        </button>

        <div className="listing-detail-content">
          <div className="listing-main">
            <div className="listing-detail-header">
              <h1>{listing.eventName}</h1>
              <span className={`status-badge status-${listing.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {listing.status}
              </span>
            </div>

            <div className="listing-info-grid">
              <div className="info-item">
                <span className="info-label">📅 Event Date & Time</span>
                <span className="info-value">
                  {new Date(listing.eventDate).toLocaleDateString()} at {new Date(listing.eventDate).toLocaleTimeString()}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">🎫 Ticket Type</span>
                <span className="info-value">{listing.ticketType}</span>
              </div>

              {listing.section && (
                <div className="info-item">
                  <span className="info-label">📍 Section/Seat</span>
                  <span className="info-value">{listing.section}</span>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">💰 Face Value</span>
                <span className="info-value">${listing.faceValue.toFixed(2)}</span>
              </div>

              <div className="info-item">
                <span className="info-label">🔄 Transfer Method</span>
                <span className="info-value">{listing.transferMethod || 'To be arranged'}</span>
              </div>

              <div className="info-item">
                <span className="info-label">✓ Transferable</span>
                <span className="info-value">{listing.isTransferable ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {listing.description && (
              <div className="listing-description">
                <h3>Additional Details</h3>
                <p>{listing.description}</p>
              </div>
            )}
          </div>

          <div className="purchase-panel">
            <div className="price-box">
              <span className="price-label">Ticket Price</span>
              <span className="price-amount">${listing.price.toFixed(2)}</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            {listing.status === 'Approved' && (
              <>
                <button 
                  className="btn-primary btn-full btn-large"
                  onClick={handleBuyNow}
                  disabled={purchasing}
                >
                  {purchasing ? 'Processing...' : '🛒 Buy Now with Stripe'}
                </button>

                <div className="purchase-info">
                  <h4>Secure Payment & Escrow</h4>
                  <ul>
                    <li>✓ Payment held securely by Stripe</li>
                    <li>✓ Funds released after transfer confirmation</li>
                    <li>✓ Buyer protection included</li>
                    <li>✓ SSL encrypted checkout</li>
                  </ul>
                </div>

                <div className="security-badges">
                  <div className="badge">🔒 SSL Secure</div>
                  <div className="badge">💳 Stripe</div>
                </div>
              </>
            )}

            {listing.status !== 'Approved' && (
              <div className="warning-message">
                This ticket is not currently available for purchase.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
