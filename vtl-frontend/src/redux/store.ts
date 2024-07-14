import { configureStore } from "@reduxjs/toolkit";
import profileSlice from "./profile/profileSlice";
import cartSlice from "./cart/cartSlice";
import lishDishesSlice from "./dishes/dishesSlice";
export const store = configureStore({
  reducer: {
    profile: profileSlice,
    cart: cartSlice,
    listDishes: lishDishesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
