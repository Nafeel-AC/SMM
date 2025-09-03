import { firebaseDb } from './firebase-db';

class FirebaseStaffService {
  constructor() {
    // Staff management service
  }

  // Assign user to staff member
  async assignUserToStaff(staffId, userId, assignedBy) {
    try {
      const assignmentData = {
        staff_id: staffId,
        user_id: userId,
        assigned_by: assignedBy,
        assigned_at: new Date().toISOString()
      };

      const result = await firebaseDb.createStaffAssignment(assignmentData);
      return result;
    } catch (error) {
      console.error('Error assigning user to staff:', error);
      throw error;
    }
  }

  // Remove user assignment from staff
  async removeUserAssignment(staffId, userId) {
    try {
      const assignmentId = `${staffId}_${userId}`;
      const result = await firebaseDb.removeStaffAssignment(assignmentId);
      return result;
    } catch (error) {
      console.error('Error removing user assignment:', error);
      throw error;
    }
  }

  // Get staff assignments for a staff member
  async getStaffAssignments(staffId) {
    try {
      const result = await firebaseDb.getStaffAssignments(staffId);
      return result;
    } catch (error) {
      console.error('Error getting staff assignments:', error);
      throw error;
    }
  }

  // Get assigned users for a staff member
  async getAssignedUsers(staffId) {
    try {
      const result = await firebaseDb.getAssignedUsers(staffId);
      return result;
    } catch (error) {
      console.error('Error getting assigned users:', error);
      throw error;
    }
  }

  // Get all staff members
  async getAllStaff() {
    try {
      const result = await firebaseDb.getAllUsers();
      if (result.error) throw result.error;

      const staff = result.data.filter(user => user.role === 'staff' || user.role === 'admin');
      return { data: staff, error: null };
    } catch (error) {
      console.error('Error getting all staff:', error);
      return { data: null, error };
    }
  }

  // Get staff member details with assignments
  async getStaffDetails(staffId) {
    try {
      // Get staff profile
      const profileResult = await firebaseDb.getProfile(staffId);
      if (profileResult.error) throw profileResult.error;

      // Get assigned users
      const assignedUsersResult = await this.getAssignedUsers(staffId);
      if (assignedUsersResult.error) throw assignedUsersResult.error;

      const staffDetails = {
        ...profileResult.data,
        assigned_users: assignedUsersResult.data,
        assignment_count: assignedUsersResult.data.length
      };

      return { data: staffDetails, error: null };
    } catch (error) {
      console.error('Error getting staff details:', error);
      return { data: null, error };
    }
  }

  // Get user's assigned staff member
  async getUserStaff(userId) {
    try {
      const allStaffResult = await this.getAllStaff();
      if (allStaffResult.error) throw allStaffResult.error;

      for (const staff of allStaffResult.data) {
        const assignmentsResult = await this.getStaffAssignments(staff.id);
        if (assignmentsResult.error) continue;

        const isAssigned = assignmentsResult.data.some(assignment => assignment.user_id === userId);
        if (isAssigned) {
          return { data: staff, error: null };
        }
      }

      return { data: null, error: null };
    } catch (error) {
      console.error('Error getting user staff:', error);
      return { data: null, error };
    }
  }

  // Get staff performance metrics
  async getStaffPerformance(staffId) {
    try {
      // Get assigned users
      const assignedUsersResult = await this.getAssignedUsers(staffId);
      if (assignedUsersResult.error) throw assignedUsersResult.error;

      const assignedUsers = assignedUsersResult.data;
      let totalUsers = assignedUsers.length;
      let completedOnboarding = 0;
      let instagramConnected = 0;
      let requirementsCompleted = 0;

      assignedUsers.forEach(user => {
        if (user.instagram_connected) instagramConnected++;
        if (user.requirements_completed) requirementsCompleted++;
        if (user.instagram_connected && user.requirements_completed) completedOnboarding++;
      });

      const performance = {
        total_assigned_users: totalUsers,
        completed_onboarding: completedOnboarding,
        instagram_connected: instagramConnected,
        requirements_completed: requirementsCompleted,
        completion_rate: totalUsers > 0 ? (completedOnboarding / totalUsers * 100).toFixed(2) : 0
      };

      return { data: performance, error: null };
    } catch (error) {
      console.error('Error getting staff performance:', error);
      return { data: null, error };
    }
  }

  // Bulk assign users to staff
  async bulkAssignUsers(staffId, userIds, assignedBy) {
    try {
      const results = [];
      
      for (const userId of userIds) {
        try {
          const result = await this.assignUserToStaff(staffId, userId, assignedBy);
          results.push({ userId, success: true, data: result.data });
        } catch (error) {
          results.push({ userId, success: false, error: error.message });
        }
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Error in bulk assign users:', error);
      return { data: null, error };
    }
  }

  // Get staff workload distribution
  async getStaffWorkload() {
    try {
      const allStaffResult = await this.getAllStaff();
      if (allStaffResult.error) throw allStaffResult.error;

      const workload = [];
      
      for (const staff of allStaffResult.data) {
        const performanceResult = await this.getStaffPerformance(staff.id);
        if (performanceResult.error) continue;

        workload.push({
          staff_id: staff.id,
          staff_name: staff.full_name,
          staff_email: staff.email,
          ...performanceResult.data
        });
      }

      // Sort by assignment count (descending)
      workload.sort((a, b) => b.total_assigned_users - a.total_assigned_users);

      return { data: workload, error: null };
    } catch (error) {
      console.error('Error getting staff workload:', error);
      return { data: null, error };
    }
  }
}

export const firebaseStaffService = new FirebaseStaffService();
