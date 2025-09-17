import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type Transaction = {
	id: string;
	year: number;
	month: number; // 1-12
	category: string;
	amount: number;
	description: string;
};

export type TransactionsState = {
	items: Transaction[];
};

const initialState: TransactionsState = {
	items: [],
};

const transactionsSlice = createSlice({
	name: 'transactions',
	initialState,
	reducers: {
		addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
			state.items.push({ id: nanoid(), ...action.payload });
		},
		addManyTransactions: (state, action: PayloadAction<Omit<Transaction, 'id'>[]>) => {
			for (const t of action.payload) {
				state.items.push({ id: nanoid(), ...t });
			}
		},
		updateTransaction: (state, action: PayloadAction<Transaction>) => {
			const idx = state.items.findIndex(t => t.id === action.payload.id);
			if (idx !== -1) state.items[idx] = action.payload;
		},
		deleteTransaction: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(t => t.id !== action.payload);
		},
		clearAllTransactions: (state) => {
			state.items = [];
		},
	},
});

export const { addTransaction, addManyTransactions, updateTransaction, deleteTransaction, clearAllTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
