import { apiCache } from "./cache";

export interface CartItem {
  id?: string;
  packageType: "tour" | "transfer";
  packageId: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  pickupLocation: string;
  packageDetails?: {
    title: string;
    image: string;
    price: number;
    duration?: string;
    vehicle?: string;
    slug: string;
  };
}

export interface Cart {
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export const cartApi = {
  // Get cart for a specific user
  async getCart(userId: string): Promise<CartItem[]> {
    const cacheKey = `user-cart-${userId}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`/api/cart/${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const cartItems = data.data?.items || [];
      
      apiCache.set(cacheKey, cartItems);
      return cartItems;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return [];
    }
  },

  // Get cart with package details populated
  async getCartWithDetails(userId: string): Promise<CartItem[]> {
    const cacheKey = `user-cart-details-${userId}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    try {
      const cartItems = await this.getCart(userId);
      
      // Fetch package details for each cart item
      const cartWithDetails = await Promise.all(
        cartItems.map(async (item: any) => {
          try {
            let packageDetails = null;
            
            if (item.packageType === 'tour') {
              const tourResponse = await fetch(`/api/tours/${item.packageId}`);
              if (tourResponse.ok) {
                const tourData = await tourResponse.json();
                packageDetails = {
                  title: tourData.tour.title,
                  image: tourData.tour.images?.[0] || '/images/default-tour.jpg',
                  slug: tourData.tour.slug,
                  price: tourData.tour.price,
                  duration: tourData.tour.duration,
                };
              }
            } else if (item.packageType === 'transfer') {
              const transferResponse = await fetch(`/api/transfers/${item.packageId}`);
              if (transferResponse.ok) {
                const transferData = await transferResponse.json();
                packageDetails = {
                  title: transferData.transfer.title,
                  image: transferData.transfer.images?.[0] || '/images/default-transfer.jpg',
                  slug: transferData.transfer.slug,
                  price: transferData.transfer.price,
                  vehicle: transferData.transfer.vehicle,
                };
              }
            }

            return {
              ...item,
              packageDetails,
            };
          } catch (error) {
            console.error(`Error fetching package details for ${item.packageType} ${item.packageId}:`, error);
            return item;
          }
        })
      );

      apiCache.set(cacheKey, cartWithDetails);
      return cartWithDetails;
    } catch (error) {
      console.error("Error fetching cart with details:", error);
      return [];
    }
  },

  // Add item to cart
  async addToCart(item: Omit<CartItem, 'id'>): Promise<boolean> {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear cache after successful add
      if (item.packageType) {
        // Assuming userId is available from session or context
        apiCache.clear();
      }

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  },

  // Remove item from cart
  async removeFromCart(userId: string, itemIndex: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/cart/${encodeURIComponent(userId)}?itemIndex=${itemIndex}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear cache after successful removal
      apiCache.clear();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  },

  // Clear cart cache (useful after updates)
  clearCache(): void {
    apiCache.clear();
  },
};
