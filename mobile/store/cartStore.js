import { create } from "zustand";
import api from "../utils/api.js";

export const useCartStore = create((set, get) => ({
    cart: [],
    // total: 0,
    // subtotal: 0,
    // TODO: coupons
    
    getCartItems: async (token) => {
        try {
            const response = await api.get("/cart", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            set({ cart: response.data });
        } catch (error) {
            set({ cart: [] });
            console.log(error);
        }
    },

    addToCart: async (product, token) => {
        try {
            await api.post("/cart", { productId: product._id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem 
                    ? prevState.cart.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
                    : [...prevState.cart, { ...product, quantity: 1 }];

                return { cart: newCart }
            });
            // TODO: calculate totals
        } catch (error) {
            console.log(error);
        }
    },

    removeFromCart: async (productId, token) => {
        await api.delete("/cart", {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: { productId }
        });
        set((prevState) => ({
            cart: prevState.cart.filter((item) => item._id !== productId)
        }));
        // TODO: calculate totals
    },

    updateQuantity: async (productId, quantity, token) => {
        if (quantity === 0) {
            get().removeFromCart(productId, token);
            return;
        }

        await api.patch(`/cart/${productId}`, { quantity }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        set((prevState) => ({
            cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item))
        }));
        // TODO: calculate totals
    }
}));