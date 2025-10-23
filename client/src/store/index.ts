import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserReducer";

const store = configureStore({
    reducer: {
        //@ts-ignore
        userInfo: userReducer,
    },
});

export default store;