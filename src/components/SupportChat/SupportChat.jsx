import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './SupportChat.css';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, profile } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_chats')
        .select(`
          *,
          profiles!support_chats_staff_id_fkey (
            full_name
          )
        `)
        .eq('user_id', user.id)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('support_chats')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_chats',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('support_chats')
        .insert([
          {
            user_id: user.id,
            message: newMessage.trim(),
            sent_by: 'user'
          }
        ]);

      if (error) throw error;

      setNewMessage('');
      
      // Send email notification to admin
      await sendEmailNotification(newMessage.trim());
      
    } catch (error) {
      setError('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailNotification = async (message) => {
    try {
      // In a real implementation, you would call your email service
      // For now, we'll just log it
      console.log('Email notification sent to admin:', {
        user: user.email,
        message: message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSenderName = (message) => {
    if (message.sent_by === 'user') {
      return profile?.full_name || 'You';
    } else if (message.sent_by === 'staff') {
      return message.profiles?.full_name || 'Staff Member';
    } else if (message.sent_by === 'admin') {
      return 'Admin';
    }
    return 'Unknown';
  };

  const getMessageClass = (message) => {
    if (message.sent_by === 'user') {
      return 'message user-message';
    } else {
      return 'message staff-message';
    }
  };

  if (!isOpen) {
    return (
      <div className="support-chat-toggle">
        <button 
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Open Support Chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
          </svg>
          <span>Support</span>
        </button>
      </div>
    );
  }

  return (
    <div className="support-chat">
      <div className="chat-header">
        <div className="chat-title">
          <h3>Support Chat</h3>
          <p>We're here to help!</p>
        </div>
        <button 
          className="close-btn"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>
      </div>

      <div className="chat-messages">
        {loading && messages.length === 0 ? (
          <div className="loading-messages">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={getMessageClass(message)}>
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{getSenderName(message)}</span>
                  <span className="message-time">{formatTime(message.sent_at)}</span>
                </div>
                <div className="message-text">{message.message}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="chat-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="input-group">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={loading || !newMessage.trim()}
            className="send-btn"
          >
            {loading ? (
              <div className="spinner small"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportChat;
