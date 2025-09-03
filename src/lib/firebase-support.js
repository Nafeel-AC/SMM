import { firebaseDb } from './firebase-db';

class FirebaseSupportService {
  constructor() {
    // Support chat service
  }

  // Send a support message
  async sendMessage(userId, message, sentBy, staffId = null) {
    try {
      const messageData = {
        user_id: userId,
        staff_id: staffId,
        message: message,
        sent_by: sentBy, // 'user', 'staff', or 'admin'
        is_read: false,
        created_at: new Date().toISOString()
      };

      const result = await firebaseDb.saveSupportMessage(messageData);
      return result;
    } catch (error) {
      console.error('Error sending support message:', error);
      throw error;
    }
  }

  // Get user's support chat history
  async getUserSupportChats(userId) {
    try {
      const result = await firebaseDb.getSupportChats(userId);
      return result;
    } catch (error) {
      console.error('Error getting user support chats:', error);
      throw error;
    }
  }

  // Get staff's support chats
  async getStaffSupportChats(staffId) {
    try {
      const result = await firebaseDb.getStaffSupportChats(staffId);
      return result;
    } catch (error) {
      console.error('Error getting staff support chats:', error);
      throw error;
    }
  }

  // Get all support chats (admin only)
  async getAllSupportChats() {
    try {
      const result = await firebaseDb.getAllSupportChats();
      return result;
    } catch (error) {
      console.error('Error getting all support chats:', error);
      throw error;
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId) {
    try {
      const result = await firebaseDb.markMessageAsRead(messageId);
      return result;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Get unread message count for user
  async getUnreadMessageCount(userId) {
    try {
      const result = await firebaseDb.getSupportChats(userId);
      if (result.error) throw result.error;

      const unreadCount = result.data.filter(chat => 
        !chat.is_read && chat.sent_by !== 'user'
      ).length;

      return { data: unreadCount, error: null };
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return { data: 0, error };
    }
  }

  // Get unread message count for staff
  async getStaffUnreadMessageCount(staffId) {
    try {
      const result = await firebaseDb.getStaffSupportChats(staffId);
      if (result.error) throw result.error;

      const unreadCount = result.data.filter(chat => 
        !chat.is_read && chat.sent_by === 'user'
      ).length;

      return { data: unreadCount, error: null };
    } catch (error) {
      console.error('Error getting staff unread message count:', error);
      return { data: 0, error };
    }
  }

  // Get support chat statistics
  async getSupportStats() {
    try {
      const result = await firebaseDb.getAllSupportChats();
      if (result.error) throw result.error;

      const chats = result.data;
      const stats = {
        total_messages: chats.length,
        user_messages: chats.filter(c => c.sent_by === 'user').length,
        staff_messages: chats.filter(c => c.sent_by === 'staff').length,
        admin_messages: chats.filter(c => c.sent_by === 'admin').length,
        unread_messages: chats.filter(c => !c.is_read).length,
        unique_users: [...new Set(chats.map(c => c.user_id))].length
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting support stats:', error);
      return { data: null, error };
    }
  }

  // Get recent support conversations
  async getRecentConversations(limit = 10) {
    try {
      const result = await firebaseDb.getAllSupportChats();
      if (result.error) throw result.error;

      // Group messages by user_id and get the most recent message for each user
      const userMessages = {};
      result.data.forEach(chat => {
        if (!userMessages[chat.user_id] || 
            new Date(chat.created_at) > new Date(userMessages[chat.user_id].created_at)) {
          userMessages[chat.user_id] = chat;
        }
      });

      // Convert to array and sort by most recent
      const conversations = Object.values(userMessages)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);

      return { data: conversations, error: null };
    } catch (error) {
      console.error('Error getting recent conversations:', error);
      return { data: null, error };
    }
  }

  // Get conversation thread between user and staff
  async getConversationThread(userId, staffId = null) {
    try {
      const result = await firebaseDb.getSupportChats(userId);
      if (result.error) throw result.error;

      let filteredChats = result.data;
      
      // If staffId is provided, filter for that specific staff member
      if (staffId) {
        filteredChats = result.data.filter(chat => 
          chat.staff_id === staffId || chat.sent_by === 'user'
        );
      }

      // Sort by creation time
      filteredChats.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      return { data: filteredChats, error: null };
    } catch (error) {
      console.error('Error getting conversation thread:', error);
      return { data: null, error };
    }
  }

  // Auto-assign support chat to available staff
  async autoAssignSupportChat(userId) {
    try {
      // Get all staff members
      const staffResult = await firebaseDb.getAllUsers();
      if (staffResult.error) throw staffResult.error;

      const staffMembers = staffResult.data.filter(user => 
        user.role === 'staff' || user.role === 'admin'
      );

      if (staffMembers.length === 0) {
        return { data: null, error: 'No staff members available' };
      }

      // Find staff member with least assigned users
      let selectedStaff = null;
      let minAssignments = Infinity;

      for (const staff of staffMembers) {
        const assignmentsResult = await firebaseDb.getStaffAssignments(staff.id);
        if (assignmentsResult.error) continue;

        const assignmentCount = assignmentsResult.data.length;
        if (assignmentCount < minAssignments) {
          minAssignments = assignmentCount;
          selectedStaff = staff;
        }
      }

      if (selectedStaff) {
        // Assign user to selected staff
        const assignmentData = {
          staff_id: selectedStaff.id,
          user_id: userId,
          assigned_by: 'system',
          assigned_at: new Date().toISOString()
        };

        await firebaseDb.createStaffAssignment(assignmentData);
        return { data: selectedStaff, error: null };
      }

      return { data: null, error: 'No staff available for assignment' };
    } catch (error) {
      console.error('Error auto-assigning support chat:', error);
      return { data: null, error };
    }
  }
}

export const firebaseSupportService = new FirebaseSupportService();
