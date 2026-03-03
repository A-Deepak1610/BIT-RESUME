import { create } from "zustand";
const useAuth = create((set) => ({
  user: null,
  email: null,
  loading: true,
  rollno:null,
  name: null,
  role:null,
  fetchUser: async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data)
      if (data?.user) {
        set({ user: data.user, loading: false });
        set({ rollno: data.user.rollNo });
        set({ email: data.user.email });
        set({ role: data.user.role });
        set({ name: data.user.user_name});
      } else {
        set({ user: null, loading: false });
      }
    }  catch (err){
      set({ user: null, loading: false });
    }
  }, 
  logout: async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        credentials: "include",
      });
      set({ user: null });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  },
}));

export default useAuth;
