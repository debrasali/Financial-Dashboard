import { configureStore, combineReducers } from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';
import goalsReducer from './goalsSlice';
import userReducer from './userSlice';

const PERSIST_KEY = 'financial_planner_store_v1';

const rootReducer = combineReducers({
	transactions: transactionsReducer,
	goals: goalsReducer,
	user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

function loadState(): RootState | undefined {
	try {
		const serialized = localStorage.getItem(PERSIST_KEY);
		if (!serialized) return undefined;
		return JSON.parse(serialized) as RootState;
	} catch (err) {
		console.error('Failed to load state', err);
		return undefined;
	}
}

function saveState(state: RootState) {
	try {
		localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
	} catch (err) {
		console.error('Failed to save state', err);
	}
}

export const store = configureStore({
	reducer: rootReducer,
	preloadedState: loadState(),
});

store.subscribe(() => {
	saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
