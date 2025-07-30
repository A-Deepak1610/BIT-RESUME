import { create } from "zustand";
const useAuth = create((set) => ({
  user: null,
  loading: true,
  rollno:null,
  fetchUser: async () => {
    try {
      const res = await fetch("http://localhost:6001/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.user) {
        set({ user: data.user, loading: false });
        set({ rollno: data.user.rollNo });
      } else {
        set({ user: null, loading: false });
      }
    }  catch (err){
      set({ user: null, loading: false });
    }
  }, 
  logout: async () => {
    try {
      await fetch("http://localhost:6001/api/auth/logout", {
        credentials: "include",
      });
      set({ user: null });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  },
}));

export default useAuth;
