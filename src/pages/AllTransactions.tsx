import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteTransaction, Transaction, updateTransaction, clearAllTransactions } from '../store/transactionsSlice';
import Section from '../components/Section';
import Card from '../components/Card';
import { Button, SelectInput } from '../components/inputs';
import './AllTransactions.css';

export default function AllTransactions() {
	const dispatch = useAppDispatch();
	const items = useAppSelector((s) => s.transactions.items);

	const years = useMemo<number[]>(() => Array.from(new Set<number>(items.map((t: Transaction) => t.year))).sort((a: number, b: number) => a - b), [items]);
	const months = useMemo<number[]>(() => Array.from(new Set<number>(items.map((t: Transaction) => t.month))).sort((a: number, b: number) => a - b), [items]);
	const categories = useMemo<string[]>(() => Array.from(new Set<string>(items.map((t: Transaction) => t.category))).sort(), [items]);

	const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
	const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
	const [monthFilter, setMonthFilter] = useState<number | 'all'>('all');

	const filtered = items.filter((t: Transaction) => {
		return (yearFilter === 'all' || t.year === yearFilter)
			&& (monthFilter === 'all' || t.month === monthFilter)
			&& (categoryFilter === 'all' || t.category === categoryFilter);
	});

	function onDelete(id: string) {
		dispatch(deleteTransaction(id));
	}

	function onEdit(t: Transaction) {
		const year = Number(prompt('Year', String(t.year)) ?? t.year);
		const month = Number(prompt('Month (1-12)', String(t.month)) ?? t.month);
		const category = String(prompt('Category', t.category) ?? t.category);
		const amount = Number(prompt('Amount', String(t.amount)) ?? t.amount);
		const description = String(prompt('Description', t.description) ?? t.description);
		dispatch(updateTransaction({ ...t, year, month, category, amount, description }));
	}

	return (
		<Section title="All Transactions" subtitle="Filter, edit, or delete transactions.">
			<Card title="Filters">
				<div className="filters-container">
					<SelectInput value={yearFilter as any} onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
						<option value="all">All Years</option>
						{years.map((y: number) => (
							<option key={y} value={y}>{y}</option>
						))}
					</SelectInput>
					<SelectInput value={monthFilter as any} onChange={(e) => setMonthFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
						<option value="all">All Months</option>
						{months.map((m: number) => (
							<option key={m} value={m}>Month {m}</option>
						))}
					</SelectInput>
					<SelectInput value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as any)}>
						<option value="all">All Categories</option>
						{categories.map((c: string) => (
							<option key={c} value={c}>{c}</option>
						))}
					</SelectInput>
					<Button variant="secondary" onClick={() => { setYearFilter('all'); setMonthFilter('all'); setCategoryFilter('all'); }}>Clear Filters</Button>
					<Button variant="danger" onClick={() => dispatch(clearAllTransactions())}>Clear All Transactions</Button>
					<div className="results-count">{filtered.length} results</div>
				</div>
			</Card>

			<Card>
				{filtered.length === 0 ? (
					<div className="no-results">No transactions match your filters.</div>
				) : (
					<div className="table-container">
						<table className="transactions-table">
							<thead className="table-header">
								<tr>
									<th className="table-cell">Year</th>
									<th className="table-cell">Month</th>
									<th className="table-cell">Category</th>
									<th className="table-cell">Amount</th>
									<th className="table-cell">Description</th>
									<th className="table-cell">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((t: Transaction) => (
									<tr key={t.id} className="table-row">
										<td className="table-cell">{t.year}</td>
										<td className="table-cell">{t.month}</td>
										<td className="table-cell">{t.category}</td>
										<td className="table-cell">${t.amount.toFixed(2)}</td>
										<td className="table-cell">{t.description}</td>
										<td className="table-cell">
											<div className="table-actions">
												<Button onClick={() => onEdit(t)}>Edit</Button>
												<Button variant="danger" onClick={() => onDelete(t.id)}>Delete</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		</Section>
	);
}
