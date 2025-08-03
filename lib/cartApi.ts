const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface CartItem {
  _id: string;
  packageId: string;
  packageType: 'tour' | 'transfer';
  packageTitle: string;
  packageImage: string;
  packagePrice: number;
  selectedDate: string;
  selectedTime: string;
  adults: number;
  children: number;
  pickupLocation: string;
  totalPrice: number;
  addedAt: string;
  packageDetails?: {
    title: string;
    image: string;
    price: number;
    slug: string;
    duration?: string;
    from?: string;
    to?: string;
  };
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export class CartAPI {
  // Get cart for user
  async getCart(userEmail: string): Promise<Cart | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  }

  // Add item to cart
  async addToCart(item: {
    userEmail: string;
    packageId: string;
    packageType: 'tour' | 'transfer';
    selectedDate: string;
    selectedTime: string;
    adults: number;
    children: number;
    pickupLocation?: string;
  }): Promise<Cart> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to add item to cart');
      }
      return data.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Update cart item
  async updateCartItem(
    userEmail: string,
    itemId: string,
    updates: {
      adults?: number;
      children?: number;
      selectedDate?: string;
      selectedTime?: string;
      pickupLocation?: string;
    }
  ): Promise<Cart> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/cart/${encodeURIComponent(userEmail)}/items/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update cart item');
      }
      return data.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(userEmail: string, itemId: string): Promise<Cart> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/cart/${encodeURIComponent(userEmail)}/items/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to remove item from cart');
      }
      return data.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Clear entire cart
  async clearCart(userEmail: string): Promise<Cart> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to clear cart');
      }
      return data.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Get cart item count
  async getCartItemCount(userEmail: string): Promise<number> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/cart/${encodeURIComponent(userEmail)}/count`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data.count : 0;
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return 0;
    }
  }
}

export const cartApi = new CartAPI();
