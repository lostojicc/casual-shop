import { create } from "zustand";
import api from "../utils/api.js";

export const useCartStore = create((set, get) => ({
    cart: [],
    total: 0,
    subtotal: 0,
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
            calculateTotals();
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
        calculateTotals();
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
        calculateTotals();
    },

    calculateTotals: () => {
		const { cart } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		// if (coupon) {
		// 	const discount = subtotal * (coupon.discountPercentage / 100);
		// 	total = subtotal - discount;
		// }

		set({ subtotal, total });
	},

    clearCart: () => {
		set({ cart: [], total: 0, subtotal: 0 });
	},
}));