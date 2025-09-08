import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    verificationEmail: null,

    clearError: () => set({ error: null }),

    signUp: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/auth/signup", data);
            set({ verificationEmail: data.email, isLoading: false });
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Sign up failed";
            set({ error: errorMessage, isLoading: false });
        }
    },

    signIn: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/signin", credentials);
            
            await AsyncStorage.setItem("accessToken", response.data.token);
            
            set({ user: response.data.user, token: response.data.token, isLoading: false });   
            return false;
        } catch (error) {
            let needVerification = undefined;

            if (error.response && error.response.status === 403) {
                set({ verificationEmail: credentials.email });
                needVerification = true;
            }

            const errorMessage = error.response.data.message;
            set({ error: errorMessage, isLoading: false });
            return needVerification;
        }
    },

    signOut: async () => {
        await AsyncStorage.removeItem("accessToken");
        set({ token: null, user: null });
    },

    verifyEmail: async (code) => {
        const { verificationEmail } = get();
        if (!verificationEmail) {
            set({ error: "No email found for verification" });
            return false;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/verify-email", {
                email: verificationEmail,
                code
            });
            set({
                user: response.data.user,
                token: response.data.token,
                verificationEmail: null,
                isLoading: false
            });

            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Verification failed";
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
            const token = await AsyncStorage.getItem("accessToken");
			const response = await api.get("/auth/check", {
                headers: { Authorization: `Bearer ${token}` }
            });
			set({ user: response.data.user, isCheckingAuth: false, token });
		} catch (error) {
			await get().signOut();
		} finally {
            set({ isCheckingAuth: false });
        }
	}
}));