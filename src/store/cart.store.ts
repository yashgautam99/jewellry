import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // The variant/product ID
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedMaterial?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, material?: string) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    size?: string,
    material?: string,
  ) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Check if item with same ID, size, and material already exists
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.selectedSize === newItem.selectedSize &&
              item.selectedMaterial === newItem.selectedMaterial,
          );

          if (existingItemIndex > -1) {
            // If exists, just increment quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          // Otherwise, add new item
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (id, size, material) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.id === id &&
                item.selectedSize === size &&
                item.selectedMaterial === material
              ),
          ),
        }));
      },

      updateQuantity: (id, quantity, size, material) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.id === id &&
              item.selectedSize === size &&
              item.selectedMaterial === material
            ) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "lumiere-cart-storage", // name of item in the storage (must be unique)
    },
  ),
);
