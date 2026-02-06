import React, { useState } from 'react';

function SellTicket({ user, onNavigate }) {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    ticketType: '',
    price: '',
    faceValue: '',
    section: '',
    isTransferable: false,
    transferMethod: '',
    description: ''
  });
  const [validationStatus, setValidationStatus] = useState({
    transferable: null,
    dateCheck: null,
    priceCheck: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const checkValidation = React.useCallback(() => {
    const status = {
      transferable: formData.isTransferable,
      dateCheck: null,
      priceCheck: null
    };

    if (formData.eventDate) {
      const eventDateTime = new Date(formData.eventDate);
      const now = new Date();
      const hoursUntilEvent = (eventDateTime - now) / (1000 * 60 * 60);
      status.dateCheck = hoursUntilEvent >= 72;
    }

    if (formData.price && formData.faceValue) {
      const price = parseFloat(formData.price);
      const faceValue = parseFloat(formData.faceValue);
      status.priceCheck = price <= faceValue * 1.2;
    }

    setValidationStatus(status);
    return status;
  }, [formData.isTransferable, formData.eventDate, formData.price, formData.faceValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const validation = checkValidation();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      setSuccess(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (formData.eventDate || formData.price || formData.faceValue) {
      checkValidation();
    }
  }, [formData.eventDate, formData.price, formData.faceValue, formData.isTransferable, checkValidation]);

  const allChecksPass = validationStatus.transferable && 
                        validationStatus.dateCheck && 
                        validationStatus.priceCheck;

  return (
    <div className="container page-content">
      <div className="sell-ticket-page">
        <h1>Sell Your Ticket</h1>
        <p className="page-subtitle">
          List your ticket for resale. We'll verify it meets our resale requirements.
        </p>

        {success && (
          <div className="success-message">
            ✓ Listing created successfully! Redirecting to dashboard...
          </div>
        )}

        <div className="sell-content">
          <div className="sell-form-container">
            <form onSubmit={handleSubmit} className="sell-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="eventName">Event Name *</label>
                <input
                  type="text"
                  id="eventName"
                  value={formData.eventName}
                  onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                  placeholder="e.g., Taylor Swift - Eras Tour"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventDate">Event Date & Time *</label>
                <input
                  type="datetime-local"
                  id="eventDate"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ticketType">Ticket Type *</label>
                  <input
                    type="text"
                    id="ticketType"
                    value={formData.ticketType}
                    onChange={(e) => setFormData({...formData, ticketType: e.target.value})}
                    placeholder="e.g., General Admission"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="section">Section/Seat</label>
                  <input
                    type="text"
                    id="section"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    placeholder="e.g., Section 101, Row A"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="faceValue">Original Face Value ($) *</label>
                  <input
                    type="number"
                    id="faceValue"
                    value={formData.faceValue}
                    onChange={(e) => setFormData({...formData, faceValue: e.target.value})}
                    placeholder="100.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Your Selling Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="120.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isTransferable}
                    onChange={(e) => setFormData({...formData, isTransferable: e.target.checked})}
                  />
                  <span>This ticket is transferable (via email, mobile app, etc.)</span>
                </label>
              </div>

              {formData.isTransferable && (
                <div className="form-group">
                  <label htmlFor="transferMethod">Transfer Method *</label>
                  <select
                    id="transferMethod"
                    value={formData.transferMethod}
                    onChange={(e) => setFormData({...formData, transferMethod: e.target.value})}
                    required
                  >
                    <option value="">Select method...</option>
                    <option value="email">Email Transfer</option>
                    <option value="ticketmaster">Ticketmaster App</option>
                    <option value="axs">AXS App</option>
                    <option value="seatgeek">SeatGeek App</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="description">Additional Details</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Any additional information about your ticket..."
                  rows="4"
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Creating Listing...' : 'List Ticket for Sale'}
              </button>
            </form>
          </div>

          <div className="validation-panel">
            <h3>Resale Eligibility Check</h3>
            <p className="validation-subtitle">
              Your ticket must meet these requirements to be listed:
            </p>

            <div className="validation-checks">
              <div className={`validation-item ${
                validationStatus.transferable === null ? '' : 
                validationStatus.transferable ? 'valid' : 'invalid'
              }`}>
                <span className="validation-icon">
                  {validationStatus.transferable === null ? '○' : 
                   validationStatus.transferable ? '✓' : '✗'}
                </span>
                <div className="validation-text">
                  <strong>Transferable Ticket</strong>
                  <p>Can be transferred via email, app, or other method</p>
                </div>
              </div>

              <div className={`validation-item ${
                validationStatus.dateCheck === null ? '' : 
                validationStatus.dateCheck ? 'valid' : 'invalid'
              }`}>
                <span className="validation-icon">
                  {validationStatus.dateCheck === null ? '○' : 
                   validationStatus.dateCheck ? '✓' : '✗'}
                </span>
                <div className="validation-text">
                  <strong>72-Hour Minimum</strong>
                  <p>Event must be at least 72 hours away</p>
                </div>
              </div>

              <div className={`validation-item ${
                validationStatus.priceCheck === null ? '' : 
                validationStatus.priceCheck ? 'valid' : 'invalid'
              }`}>
                <span className="validation-icon">
                  {validationStatus.priceCheck === null ? '○' : 
                   validationStatus.priceCheck ? '✓' : '✗'}
                </span>
                <div className="validation-text">
                  <strong>Fair Price Cap</strong>
                  <p>Price must be ≤ 120% of face value (max ${formData.faceValue ? (parseFloat(formData.faceValue) * 1.2).toFixed(2) : '0.00'})</p>
                </div>
              </div>
            </div>

            {allChecksPass && (
              <div className="eligibility-result success">
                ✓ Your ticket is eligible for listing!
              </div>
            )}

            {!allChecksPass && (validationStatus.transferable !== null || 
                                 validationStatus.dateCheck !== null || 
                                 validationStatus.priceCheck !== null) && (
              <div className="eligibility-result warning">
                ⚠ Your ticket may not meet all requirements
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellTicket;
