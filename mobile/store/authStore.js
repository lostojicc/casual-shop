import { create } from "zustand";
import api from "../utils/api";

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    verificationEmail: null,

    signUp: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/signup", data);
            
            if (response.data.success) {
                set({ verificationEmail: userData.email, isLoading: false });
                return true;
            }
        
            set({ error: response.data.message, isLoading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Sign up failed";
            set({ error: errorMessage, isLoading: false });
        }
    },

    signIn: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/signin", credentials);
            
            if (response.data.success) {
                set({ user: response.data.user, isAuthenticated: true });
                console.log(user);
            }
                
            else if (response.status == 403) {
                set({ verificationEmail: credentials.email, isLoading: false });
                return true;
            } else 
                set({ error: response.data.message });
            
            set({ isLoading: false });
        } catch (error) {
            // Handle different error scenarios
            const errorMessage = error.response?.data?.message;
            set({ error: errorMessage, isLoading: false });
        }
    },

    // Sign Out Action
    signOut: async () => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/auth/signout");
        } catch (error) {
            // Even if the API call fails, we should still sign out locally
            const errorMessage = error.response?.data?.message;
            set({ error: errorMessage, isLoading: false });
        } finally {
            get().reset();
        }
    },

    // Verify Email Action
    // verifyEmail: async (code) => {
    //     const { verificationEmail } = get();
    //     if (!verificationEmail) {
    //         set({ error: "No email found for verification" });
    //         return { success: false, error: "No email found for verification" };
    //     }

    //     set({ isLoading: true, error: null });
    //     try {
    //         const response = await api.post("/auth/verify-email", {
    //             email: verificationEmail,
    //             code
    //         });

    //         if (response.data.success) {
    //             set({
    //                 user: { email: verificationEmail },
    //                 isAuthenticated: true,
    //                 verificationEmail: null,
    //                 isLoading: false,
    //                 message: response.data.message
    //             });
    //             return { success: true };
    //         }
    //     } catch (error) {
    //         const errorMessage = error.response?.data?.message || "Verification failed";
    //         set({ error: errorMessage, isLoading: false });
    //         return { success: false, error: errorMessage };
    //     }
    // },

    // Check Authentication Status
    checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await api.get("/auth/check");
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},

    // // Reset store state
    reset: () => set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        isCheckingAuth: true,
        message: null,
        verificationEmail: null
    })
}));