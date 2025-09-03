import { firebaseDb } from './firebase-db';

class FirebasePaymentService {
  constructor() {
    // Payment service for handling Stripe payments
  }

  // Create a new payment record
  async createPayment(userId, paymentData) {
    try {
      const paymentRecord = {
        user_id: userId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        status: 'pending',
        payment_method: paymentData.payment_method,
        stripe_payment_intent_id: paymentData.stripe_payment_intent_id,
        created_at: new Date().toISOString()
      };

      const result = await firebaseDb.savePayment(paymentRecord);
      return result;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(paymentId, status, additionalData = {}) {
    try {
      const updates = {
        status,
        ...additionalData
      };

      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const result = await firebaseDb.updatePayment(paymentId, updates);
      return result;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Get user payments
  async getUserPayments(userId) {
    try {
      const result = await firebaseDb.getPayments(userId);
      return result;
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  }

  // Get all payments (admin only)
  async getAllPayments() {
    try {
      const result = await firebaseDb.getAllPayments();
      return result;
    } catch (error) {
      console.error('Error getting all payments:', error);
      throw error;
    }
  }

  // Process successful payment
  async processSuccessfulPayment(paymentIntentId, userId) {
    try {
      // Find payment by Stripe payment intent ID
      const paymentsResult = await firebaseDb.getPayments(userId);
      if (paymentsResult.error) throw paymentsResult.error;

      const payment = paymentsResult.data.find(p => p.stripe_payment_intent_id === paymentIntentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Update payment status to completed
      const updateResult = await this.updatePaymentStatus(payment.id, 'completed');
      if (updateResult.error) throw updateResult.error;

      // Update user profile to mark payment as completed
      await firebaseDb.updateProfile(userId, { payment_completed: true });

      return { success: true, payment: updateResult.data };
    } catch (error) {
      console.error('Error processing successful payment:', error);
      throw error;
    }
  }

  // Process failed payment
  async processFailedPayment(paymentIntentId, userId, errorMessage) {
    try {
      // Find payment by Stripe payment intent ID
      const paymentsResult = await firebaseDb.getPayments(userId);
      if (paymentsResult.error) throw paymentsResult.error;

      const payment = paymentsResult.data.find(p => p.stripe_payment_intent_id === paymentIntentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Update payment status to failed
      const updateResult = await this.updatePaymentStatus(payment.id, 'failed', {
        error_message: errorMessage
      });

      return { success: true, payment: updateResult.data };
    } catch (error) {
      console.error('Error processing failed payment:', error);
      throw error;
    }
  }

  // Get payment statistics (admin only)
  async getPaymentStats() {
    try {
      const result = await firebaseDb.getAllPayments();
      if (result.error) throw result.error;

      const payments = result.data;
      const stats = {
        total: payments.length,
        completed: payments.filter(p => p.status === 'completed').length,
        pending: payments.filter(p => p.status === 'pending').length,
        failed: payments.filter(p => p.status === 'failed').length,
        refunded: payments.filter(p => p.status === 'refunded').length,
        totalRevenue: payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + (p.amount || 0), 0)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting payment stats:', error);
      return { data: null, error };
    }
  }
}

export const firebasePaymentService = new FirebasePaymentService();
