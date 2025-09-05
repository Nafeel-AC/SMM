import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

class FirebaseDatabaseService {
  // Get all staff profiles
  async getAllStaff() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'profiles'));
      const staff = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'staff' || data.role === 'admin') {
          staff.push({ id: doc.id, ...data });
        }
      });
      return { data: staff, error: null };
    } catch (error) {
      console.error('Error getting all staff:', error);
      return { data: null, error };
    }
  }
  // Generic method to get all documents in a collection
  async getAllDocuments(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return { data: documents, error: null };
    } catch (error) {
      console.error(`Error getting all documents from ${collectionName}:`, error);
      return { data: null, error };
    }
  }
  constructor() {
    this.db = db;
  }

  // Generic method to get a document by ID
  async getDocument(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: docSnap.data(), error: null };
      } else {
        return { data: null, error: { code: 'not-found', message: 'Document not found' } };
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      return { data: null, error };
    }
  }

  // Generic method to get documents by field
  async getDocumentsByField(collectionName, field, value, orderByField = null, limitCount = null) {
    try {
      let q = query(collection(this.db, collectionName), where(field, '==', value));
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { data: documents, error: null };
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      return { data: null, error };
    }
  }

  // Generic method to create or update a document
  async upsertDocument(collectionName, docId, data) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      const dataWithTimestamp = {
        ...data,
        updated_at: serverTimestamp()
      };
      
      if (docSnap.exists()) {
        await updateDoc(docRef, dataWithTimestamp);
      } else {
        await setDoc(docRef, {
          ...dataWithTimestamp,
          created_at: serverTimestamp()
        });
      }
      
      return { data: { id: docId, ...data }, error: null };
    } catch (error) {
      console.error(`Error upserting document in ${collectionName}:`, error);
      return { data: null, error };
    }
  }

  // Generic method to add a new document
  async addDocument(collectionName, data) {
    try {
      const dataWithTimestamp = {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(this.db, collectionName), dataWithTimestamp);
      return { data: { id: docRef.id, ...data }, error: null };
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      return { data: null, error };
    }
  }

  // Generic method to update a document
  async updateDocument(collectionName, docId, updates) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const dataWithTimestamp = {
        ...updates,
        updated_at: serverTimestamp()
      };
      
      await updateDoc(docRef, dataWithTimestamp);
      return { data: { id: docId, ...updates }, error: null };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      return { data: null, error };
    }
  }

  // Generic method to delete a document
  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await deleteDoc(docRef);
      return { data: { id: docId }, error: null };
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      return { data: null, error };
    }
  }

  // Profile-specific methods
  async getProfile(userId) {
    return this.getDocument('profiles', userId);
  }

  async updateProfile(userId, updates) {
    return this.updateDocument('profiles', userId, updates);
  }

  async createProfile(userId, profileData) {
    return this.upsertDocument('profiles', userId, profileData);
  }

  // Instagram account-specific methods
  async getInstagramAccount(userId) {
    try {
      const q = query(
        collection(this.db, 'instagram_accounts'), 
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by connected_at in memory to avoid index requirement
      documents.sort((a, b) => {
        const aTime = a.connected_at ? new Date(a.connected_at).getTime() : 0;
        const bTime = b.connected_at ? new Date(b.connected_at).getTime() : 0;
        return bTime - aTime; // Most recent first
      });
      
      return { 
        data: documents.length > 0 ? documents[0] : null, 
        error: null 
      };
    } catch (error) {
      console.error('Error getting Instagram account:', error);
      return { data: null, error };
    }
  }

  async saveInstagramAccount(accountData) {
    return this.addDocument('instagram_accounts', accountData);
  }

  async updateInstagramAccount(accountId, updates) {
    return this.updateDocument('instagram_accounts', accountId, updates);
  }

  // Instagram insights-specific methods
  async getInstagramInsights(userId) {
    try {
      const q = query(
        collection(this.db, 'instagram_insights'), 
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by last_updated in memory to avoid index requirement
      documents.sort((a, b) => {
        const aTime = a.last_updated ? new Date(a.last_updated).getTime() : 0;
        const bTime = b.last_updated ? new Date(b.last_updated).getTime() : 0;
        return bTime - aTime; // Most recent first
      });
      
      return { 
        data: documents.length > 0 ? documents[0] : null, 
        error: null 
      };
    } catch (error) {
      console.error('Error getting Instagram insights:', error);
      return { data: null, error };
    }
  }

  async saveInstagramInsights(insightsData) {
    return this.addDocument('instagram_insights', insightsData);
  }

  async updateInstagramInsights(insightsId, updates) {
    return this.updateDocument('instagram_insights', insightsId, updates);
  }

  // User requirements-specific methods
  async getUserRequirements(userId) {
    try {
      const q = query(
        collection(this.db, 'user_requirements'), 
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by created_at in memory to avoid index requirement
      documents.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at.seconds * 1000).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at.seconds * 1000).getTime() : 0;
        return bTime - aTime; // Most recent first
      });
      
      return { 
        data: documents.length > 0 ? documents[0] : null, 
        error: null 
      };
    } catch (error) {
      console.error('Error getting user requirements:', error);
      return { data: null, error };
    }
  }

  async saveUserRequirements(requirementsData) {
    // Add 'order_completed' field as false when saving user requirements
    const dataWithOrderCompleted = {
      ...requirementsData,
      order_completed: false
    };
    return this.addDocument('user_requirements', dataWithOrderCompleted);
  }

  async updateUserRequirements(requirementsId, updates) {
    return this.updateDocument('user_requirements', requirementsId, updates);
  }

  // Payments-specific methods
  async getPayments(userId) {
    try {
      const q = query(
        collection(this.db, 'payments'), 
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by created_at in memory to avoid index requirement
      documents.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at.seconds * 1000).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at.seconds * 1000).getTime() : 0;
        return bTime - aTime; // Most recent first
      });
      
      return { data: documents, error: null };
    } catch (error) {
      console.error('Error getting payments:', error);
      return { data: null, error };
    }
  }

  async savePayment(paymentData) {
    return this.addDocument('payments', paymentData);
  }

  async updatePayment(paymentId, updates) {
    return this.updateDocument('payments', paymentId, updates);
  }

  // Staff assignments-specific methods
  async getStaffAssignments(staffId) {
    try {
      const q = query(
        collection(this.db, 'staff_assignments'), 
        where('staff_id', '==', staffId)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by assigned_at in memory to avoid index requirement
      documents.sort((a, b) => {
        const aTime = a.assigned_at ? new Date(a.assigned_at.seconds * 1000).getTime() : 0;
        const bTime = b.assigned_at ? new Date(b.assigned_at.seconds * 1000).getTime() : 0;
        return bTime - aTime; // Most recent first
      });
      
      return { data: documents, error: null };
    } catch (error) {
      console.error('Error getting staff assignments:', error);
      return { data: null, error };
    }
  }

  async getAssignedUsers(staffId) {
    const result = await this.getStaffAssignments(staffId);
    if (result.error) return result;
    
    // Get user profiles for assigned users
    const userIds = result.data.map(assignment => assignment.user_id);
    const userProfiles = [];
    
    for (const userId of userIds) {
      const profileResult = await this.getProfile(userId);
      if (profileResult.data) {
        userProfiles.push(profileResult.data);
      }
    }
    
    return { data: userProfiles, error: null };
  }

  async createStaffAssignment(assignmentData) {
    return this.addDocument('staff_assignments', assignmentData);
  }

  async removeStaffAssignment(assignmentId) {
    return this.deleteDocument('staff_assignments', assignmentId);
  }

  // Dashboard targets-specific methods
  async getDashboardTargets(userId) {
    try {
      const q = query(
        collection(this.db, 'dashboard_targets'), 
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by created_at in memory to avoid index requirement
      documents.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at.seconds * 1000).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at.seconds * 1000).getTime() : 0;
        return bTime - aTime; // Most recent first
      });
      
      return { 
        data: documents.length > 0 ? documents[0] : null, 
        error: null 
      };
    } catch (error) {
      console.error('Error getting dashboard targets:', error);
      return { data: null, error };
    }
  }

  async saveDashboardTargets(targetsData) {
    return this.addDocument('dashboard_targets', targetsData);
  }

  async updateDashboardTargets(targetsId, updates) {
    return this.updateDocument('dashboard_targets', targetsId, updates);
  }

  // Support chats-specific methods
  async getSupportChats(userId) {
    try {
      const q = query(
        collection(this.db, 'support_chats'), 
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by created_at in memory to avoid index requirement
      documents.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at.seconds * 1000).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at.seconds * 1000).getTime() : 0;
        return bTime - aTime; // Most recent first
      });
      
      return { data: documents, error: null };
    } catch (error) {
      console.error('Error getting support chats:', error);
      return { data: null, error };
    }
  }

  async getStaffSupportChats(staffId) {
    try {
      const q = query(
        collection(this.db, 'support_chats'), 
        where('staff_id', '==', staffId)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by created_at in memory to avoid index requirement
      documents.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at.seconds * 1000).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at.seconds * 1000).getTime() : 0;
        return bTime - aTime; // Most recent first
      });
      
      return { data: documents, error: null };
    } catch (error) {
      console.error('Error getting staff support chats:', error);
      return { data: null, error };
    }
  }

  async saveSupportMessage(messageData) {
    return this.addDocument('support_chats', messageData);
  }

  async markMessageAsRead(messageId) {
    return this.updateDocument('support_chats', messageId, { is_read: true });
  }

  // Admin methods
  async getAllUsers() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'profiles'));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return { data: users, error: null };
    } catch (error) {
      console.error('Error getting all users:', error);
      return { data: null, error };
    }
  }

  async getAllPayments() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'payments'));
      const payments = [];
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      return { data: payments, error: null };
    } catch (error) {
      console.error('Error getting all payments:', error);
      return { data: null, error };
    }
  }

  async getAllSupportChats() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'support_chats'));
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      return { data: chats, error: null };
    } catch (error) {
      console.error('Error getting all support chats:', error);
      return { data: null, error };
    }
  }

  // Real-time listener for a document
  subscribeToDocument(collectionName, docId, callback) {
    const docRef = doc(this.db, collectionName, docId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ data: { id: doc.id, ...doc.data() }, error: null });
      } else {
        callback({ data: null, error: { code: 'not-found', message: 'Document not found' } });
      }
    });
  }

  // Real-time listener for a collection query
  subscribeToCollection(collectionName, field, value, callback) {
    const q = query(collection(this.db, collectionName), where(field, '==', value));
    return onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback({ data: documents, error: null });
    });
  }
}

export const firebaseDb = new FirebaseDatabaseService();
