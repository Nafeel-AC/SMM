import { firebaseDb } from './firebase-db';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

class RoleAuthService {
  constructor() {
    this.db = firebaseDb;
  }

  // Create admin user
  async createAdmin(email, password, adminData) {
    try {
      console.log('🔐 Creating admin user:', email);
      
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create admin profile
      const adminProfile = {
        uid: user.uid,
        email: email,
        role: 'admin',
        display_name: adminData.displayName || 'Admin',
        created_at: new Date().toISOString(),
        permissions: ['manage_users', 'manage_staff', 'view_all_data', 'create_staff']
      };

      // Save admin profile
      await this.db.createProfile(user.uid, adminProfile);
      
      console.log('✅ Admin user created successfully');
      return { success: true, user: adminProfile };
    } catch (error) {
      console.error('❌ Error creating admin user:', error);
      return { success: false, error: error.message };
    }
  }

  // Create staff user
  async createStaff(email, password, staffData) {
    try {
      console.log('👥 Creating staff user:', email);
      
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create staff profile
      const staffProfile = {
        uid: user.uid,
        email: email,
        role: 'staff',
        display_name: staffData.displayName || 'Staff Member',
        created_by: staffData.createdBy, // Admin who created this staff
        assigned_users: [], // Will be assigned by admin
        created_at: new Date().toISOString(),
        permissions: ['view_assigned_users', 'edit_assigned_users']
      };

      // Save staff profile
      await this.db.createProfile(user.uid, staffProfile);
      
      console.log('✅ Staff user created successfully');
      return { success: true, user: staffProfile };
    } catch (error) {
      console.error('❌ Error creating staff user:', error);
      return { success: false, error: error.message };
    }
  }

  // Login with role checking
  async loginWithRole(email, password) {
    try {
      console.log('🔐 Logging in user:', email);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile to check role
      const profileResult = await this.db.getProfile(user.uid);
      
      if (profileResult.error || !profileResult.data) {
        throw new Error('User profile not found');
      }

      const profile = profileResult.data;
      console.log('✅ User logged in successfully with role:', profile.role);
      
      return { 
        success: true, 
        user: {
          uid: user.uid,
          email: user.email,
          ...profile
        }
      };
    } catch (error) {
      console.error('❌ Error logging in user:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
      console.log('✅ User logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error logging out:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const result = await this.db.getAllUsers();
      if (result.error) {
        throw new Error(result.error);
      }

      // Filter by role
      const regularUsers = result.data.filter(user => user.role === 'user' || !user.role);
      return { success: true, users: regularUsers };
    } catch (error) {
      console.error('❌ Error getting all users:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all staff (admin only)
  async getAllStaff() {
    try {
      const result = await this.db.getAllUsers();
      if (result.error) {
        throw new Error(result.error);
      }

      // Filter by role
      const staff = result.data.filter(user => user.role === 'staff');
      return { success: true, staff };
    } catch (error) {
      console.error('❌ Error getting all staff:', error);
      return { success: false, error: error.message };
    }
  }

  // Assign users to staff
  async assignUsersToStaff(staffId, userIds) {
    try {
      console.log('👥 Assigning users to staff:', staffId, userIds);
      
      // Update staff profile with assigned users
      const updates = {
        assigned_users: userIds,
        updated_at: new Date().toISOString()
      };

      const result = await this.db.updateProfile(staffId, updates);
      
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('✅ Users assigned to staff successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error assigning users to staff:', error);
      return { success: false, error: error.message };
    }
  }

  // Get assigned users for staff
  async getAssignedUsers(staffId) {
    try {
      const profileResult = await this.db.getProfile(staffId);
      
      if (profileResult.error || !profileResult.data) {
        throw new Error('Staff profile not found');
      }

      const staff = profileResult.data;
      const assignedUserIds = staff.assigned_users || [];

      // Get profiles for assigned users
      const assignedUsers = [];
      for (const userId of assignedUserIds) {
        const userResult = await this.db.getProfile(userId);
        if (userResult.data) {
          assignedUsers.push(userResult.data);
        }
      }

      return { success: true, users: assignedUsers };
    } catch (error) {
      console.error('❌ Error getting assigned users:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile (admin/staff can edit)
  async updateUserProfile(userId, updates) {
    try {
      console.log('📝 Updating user profile:', userId);
      
      const result = await this.db.updateProfile(userId, {
        ...updates,
        updated_at: new Date().toISOString()
      });

      if (result.error) {
        throw new Error(result.error);
      }

      console.log('✅ User profile updated successfully');
      return { success: true, user: result.data };
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete user (admin only)
  async deleteUser(userId) {
    try {
      console.log('🗑️ Deleting user:', userId);
      
      // Note: In a real app, you'd also delete the Firebase Auth user
      // For now, we'll just mark as deleted
      const result = await this.db.updateProfile(userId, {
        deleted: true,
        deleted_at: new Date().toISOString()
      });

      if (result.error) {
        throw new Error(result.error);
      }

      console.log('✅ User deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete staff (admin only)
  async deleteStaff(staffId) {
    try {
      console.log('🗑️ Deleting staff:', staffId);
      
      const result = await this.db.updateProfile(staffId, {
        deleted: true,
        deleted_at: new Date().toISOString()
      });

      if (result.error) {
        throw new Error(result.error);
      }

      console.log('✅ Staff deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting staff:', error);
      return { success: false, error: error.message };
    }
  }
}

export const roleAuthService = new RoleAuthService();
