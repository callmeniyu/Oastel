const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  bookingData: any;
  metadata?: Record<string, string>;
}

export interface CartPaymentIntentRequest {
  amount: number;
  currency?: string;
  cartData: any;
  contactInfo: any;
  metadata?: Record<string, string>;
}

export interface PaymentConfirmRequest {
  paymentIntentId: string;
  bookingData: any;
}

export interface PaymentApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class PaymentApi {
  // Create payment intent for single booking
  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentApiResponse> {
    try {
      console.log('[PAYMENT_API] Creating payment intent:', request);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('[PAYMENT_API] Failed to create payment intent:', result);
        throw new Error(result.error || 'Failed to create payment intent');
      }

      console.log('[PAYMENT_API] Payment intent created successfully:', result.data);
      return result;
    } catch (error: any) {
      console.error('[PAYMENT_API] Error creating payment intent:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment intent'
      };
    }
  }

  // Create payment intent for cart booking
  async createCartPaymentIntent(request: CartPaymentIntentRequest): Promise<PaymentApiResponse> {
    try {
      console.log('[PAYMENT_API] Creating cart payment intent:', request);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/create-cart-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('[PAYMENT_API] Failed to create cart payment intent:', result);
        throw new Error(result.error || 'Failed to create cart payment intent');
      }

      console.log('[PAYMENT_API] Cart payment intent created successfully:', result.data);
      return result;
    } catch (error: any) {
      console.error('[PAYMENT_API] Error creating cart payment intent:', error);
      return {
        success: false,
        error: error.message || 'Failed to create cart payment intent'
      };
    }
  }

  // Confirm payment and create booking
  async confirmPayment(request: PaymentConfirmRequest): Promise<PaymentApiResponse> {
    try {
      console.log('[PAYMENT_API] Confirming payment:', request);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('[PAYMENT_API] Failed to confirm payment:', result);
        throw new Error(result.error || 'Failed to confirm payment');
      }

      console.log('[PAYMENT_API] Payment confirmed successfully:', result.data);
      return result;
    } catch (error: any) {
      console.error('[PAYMENT_API] Error confirming payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to confirm payment'
      };
    }
  }

  // Cancel payment intent to avoid incomplete status
  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentApiResponse> {
    try {
      console.log('[PAYMENT_API] Canceling payment intent:', paymentIntentId);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/cancel-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('[PAYMENT_API] Failed to cancel payment intent:', result);
        throw new Error(result.error || 'Failed to cancel payment intent');
      }

      console.log('[PAYMENT_API] Payment intent canceled successfully:', result.data);
      return result;
    } catch (error: any) {
      console.error('[PAYMENT_API] Error canceling payment intent:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel payment intent'
      };
    }
  }

  // Get payment status
  async getPaymentStatus(paymentIntentId: string): Promise<PaymentApiResponse> {
    try {
      console.log('[PAYMENT_API] Checking payment status:', paymentIntentId);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/status/${paymentIntentId}`);
      const result = await response.json();
      
      if (!response.ok) {
        console.error('[PAYMENT_API] Failed to get payment status:', result);
        throw new Error(result.error || 'Failed to get payment status');
      }

      console.log('[PAYMENT_API] Payment status retrieved:', result.data);
      return result;
    } catch (error: any) {
      console.error('[PAYMENT_API] Error getting payment status:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment status'
      };
    }
  }
}

export const paymentApi = new PaymentApi();
