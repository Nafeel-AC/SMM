import React, { useState, useEffect } from 'react';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import './AccountsSection.css';

const AccountsSection = ({ 
  initialAccounts = [
    { id: 1, account: '@@payalsharmanyc' },
    { id: 2, account: '@Wealthywomansecrets' },
    { id: 3, account: '@Female' },
    { id: 4, account: '@@bossbabeclubs' }
  ],
  initialBulkAccounts = '@@payalsharmanyc @Wealthywomansecrets @Female @Female.focuses @@bossbabeclubs @Facelessmarketingcollective @travelmorewithsimon',
  userId
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState(initialAccounts);
  const [newAccount, setNewAccount] = useState('');
  const [bulkAccounts, setBulkAccounts] = useState(initialBulkAccounts);

  // Update selected accounts when initial data changes
  useEffect(() => {
    setSelectedAccounts(initialAccounts);
    setBulkAccounts(initialBulkAccounts);
  }, [initialAccounts, initialBulkAccounts]);

  const handleAddAccount = async (account) => {
    let accountText = account.trim();
    
    // Ensure account starts with @
    if (!accountText.startsWith('@')) {
      accountText = '@' + accountText;
    }
    
    // Check if account is already selected
    if (selectedAccounts.some(item => item.account === accountText)) {
      return;
    }

    const newAccountItem = {
      id: Date.now(),
      account: accountText
    };

    const updatedAccounts = [...selectedAccounts, newAccountItem];
    setSelectedAccounts(updatedAccounts);

    // Save to database
    if (userId) {
      try {
        await dashboardDataService.updateAccounts(userId, updatedAccounts);
      } catch (error) {
        console.error('Error saving accounts:', error);
      }
    }
  };

  const handleRemoveAccount = async (id) => {
    const updatedAccounts = selectedAccounts.filter(item => item.id !== id);
    setSelectedAccounts(updatedAccounts);

    // Save to database
    if (userId) {
      try {
        await dashboardDataService.updateAccounts(userId, updatedAccounts);
      } catch (error) {
        console.error('Error saving accounts:', error);
      }
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (newAccount.trim()) {
      handleAddAccount(newAccount.trim());
      setNewAccount('');
    }
  };

  const handleBulkAccountsChange = (e) => {
    setBulkAccounts(e.target.value);
  };

  const handleBulkAccountsSubmit = async () => {
    // Parse bulk accounts and add them
    const accounts = bulkAccounts
      .split(/[\s,]+/)
      .map(acc => acc.trim())
      .filter(acc => acc.length > 0);
    
    const newAccounts = [];
    for (const account of accounts) {
      if (account) {
        let accountText = account.trim();
        if (!accountText.startsWith('@')) {
          accountText = '@' + accountText;
        }
        
        // Check if account is already selected
        if (!selectedAccounts.some(item => item.account === accountText)) {
          newAccounts.push({
            id: Date.now() + Math.random(),
            account: accountText
          });
        }
      }
    }

    if (newAccounts.length > 0) {
      const updatedAccounts = [...selectedAccounts, ...newAccounts];
      setSelectedAccounts(updatedAccounts);

      // Save to database
      if (userId) {
        try {
          await dashboardDataService.updateAccounts(userId, updatedAccounts);
        } catch (error) {
          console.error('Error saving accounts:', error);
        }
      }
    }
  };

  return (
    <div className="accounts-section">
      <div className="accounts-header">
        <div className="accounts-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Accounts</h3>
      </div>

      {/* Selected Accounts List */}
      <div className="selected-accounts">
        {selectedAccounts.map((item) => (
          <div key={item.id} className="selected-account-item">
            <div className="account-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
            </div>
            <div className="account-content">
              <div className="account-name">{item.account}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsSection;
