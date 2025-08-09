import {create} from "zustand";
const AutoFill=create((set)=>({
    certificationType: null,
    setCertificationType: (type) => set({ certificationType: type }),
}));
export default AutoFill;