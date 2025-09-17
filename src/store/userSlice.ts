import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
	monthlyIncome: number; // dollars per month
	compoundRate: number; // annual percentage, e.g., 5 means 5%
};

const initialState: UserState = {
	monthlyIncome: 0,
	compoundRate: 5,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setMonthlyIncome: (state, action: PayloadAction<number>) => {
			state.monthlyIncome = action.payload;
		},
		setCompoundRate: (state, action: PayloadAction<number>) => {
			state.compoundRate = action.payload;
		},
	},
});

export const { setMonthlyIncome, setCompoundRate } = userSlice.actions;
export default userSlice.reducer;
