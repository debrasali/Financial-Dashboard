import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type Goal = {
	id: string;
	name: string;
	targetAmount: number;
	targetYear: number;
};

export type GoalsState = {
	items: Goal[];
};

const initialState: GoalsState = {
	items: [],
};

const goalsSlice = createSlice({
	name: 'goals',
	initialState,
	reducers: {
		addGoal: (state, action: PayloadAction<Omit<Goal, 'id'>>) => {
			state.items.push({ id: nanoid(), ...action.payload });
		},
		updateGoal: (state, action: PayloadAction<Goal>) => {
			const idx = state.items.findIndex(g => g.id === action.payload.id);
			if (idx !== -1) state.items[idx] = action.payload;
		},
		deleteGoal: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(g => g.id !== action.payload);
		},
	},
});

export const { addGoal, updateGoal, deleteGoal } = goalsSlice.actions;
export default goalsSlice.reducer;
