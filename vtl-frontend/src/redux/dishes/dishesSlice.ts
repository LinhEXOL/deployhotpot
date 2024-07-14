import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Dish = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: number;
  isSelect: boolean;
};

interface DishState {
  listDishes: Dish[];
}

const initialState: DishState = {
  listDishes: [],
};

const listDishesSlice = createSlice({
  name: "listDishes",
  initialState: initialState,
  reducers: {
    insertLishDishes: (state, action: PayloadAction<Array<Dish>>) => {
      if (action.payload) {
        state.listDishes = action.payload;
      }
    },
    clearLish: (state) => {
      state.listDishes = [];
    },
    insertDish: (state, action: PayloadAction<Dish>) => {
      state.listDishes.push(action.payload);
    },
    updateDish: (state, action: PayloadAction<Dish>) => {
      const index = state.listDishes.findIndex(
        (dish) => dish.id === action.payload.id
      );
      if (index !== -1) {
        state.listDishes[index] = action.payload;
      }
    },
    deleteDish: (state, action: PayloadAction<number>) => {
      state.listDishes = state.listDishes.filter(
        (dish) => dish.id !== action.payload
      );
    },
  },
});

export const {
  insertLishDishes,
  insertDish,
  clearLish,
  updateDish,
  deleteDish,
} = listDishesSlice.actions;

export default listDishesSlice.reducer;
