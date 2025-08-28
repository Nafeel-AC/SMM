import React, { useState } from 'react';
import './DashboardCards.css';

const NotificationBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  const handleClose = () => {
    setShowBanner(false);
  };

  const handleAllowNotification = () => {
    // Request notification permission
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          setShowBanner(false);
        }
      });
    } else {
      setShowBanner(false);
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="row align-items-end firebase-notify" id="firebase-app">
      <div>
        <div className="col-lg-12">
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            <div className="d-flex align-items-center">
              <h4 className="text-primary mb-0 mr-3">
                <i className="fa-light fa-bullhorn text-warning"></i>
              </h4>
              <div className="fire-base d-flex align-items-center">
                <p className="mb-0 ms-2">
                  Please allow your browser to receive instant push notifications. Enable it in your notification settings.
                </p>
                <button 
                  type="button" 
                  className="cmn-btn rounded-1 ml-auto ms-2" 
                  id="allow-notification"
                  onClick={handleAllowNotification}
                >
                  Allow 
                </button>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="alert" 
              aria-label="Close"
              onClick={handleClose}
            >
              <i className="fal fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
