import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addManyTransactions, addTransaction, Transaction } from '../store/transactionsSlice';
import { downloadCSV, exportTransactionsCSV, parseTransactionsCSV } from '../utils/csv';
import type { RootState } from '../store/store';
import Card from '../components/Card';
import Section from '../components/Section';
import { Button, SelectInput, TextInput } from '../components/inputs';
import './DataImportExport.css';

export default function DataImportExport() {
	const dispatch = useAppDispatch();
	const transactions = useAppSelector((s: RootState) => s.transactions.items);

	const [uploadBusy, setUploadBusy] = useState(false);
	const [year, setYear] = useState<number>(new Date().getFullYear());
	const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
	const [category, setCategory] = useState('General');
	const [amount, setAmount] = useState<number>(0);
	const [description, setDescription] = useState('');
	const [uploadInfo, setUploadInfo] = useState<string | null>(null);

	async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadBusy(true);
		setUploadInfo(null);
		try {
			const rows = await parseTransactionsCSV(file);
			dispatch(
				addManyTransactions(
					rows.map((r) => ({
						year: r.year,
						month: r.month ?? month,
						category: r.category,
						amount: r.amount,
						description: r.description,
					}))
				)
			);
			setUploadInfo(`Imported ${rows.length} transactions.`);
		} finally {
			setUploadBusy(false);
			e.target.value = '';
		}
	}

	function onSubmitManual(event: FormEvent) {
		event.preventDefault();
		dispatch(
			addTransaction({ year, month, category, amount, description })
		);
		setAmount(0);
		setDescription('');
	}

	function onExport() {
		const csv = exportTransactionsCSV(transactions as Transaction[]);
		downloadCSV(csv, 'transactions.csv');
	}

	return (
		<Section title="Add / Import / Export" subtitle="Add a transaction, Upload a CSV, or export all data.">
			<div className="data-grid">
				<Card title="Upload CSV">
					<input
						type="file"
						accept=".csv"
						disabled={uploadBusy}
						onChange={handleFile}
						className="file-input"
					/>
					<p className="help-text">Columns: Year, Month (optional), Category, Amount, Description.</p>
					{uploadInfo && <p className="success-message">{uploadInfo}</p>}
				</Card>

				<Card title="Add Transaction">
				<p className="help-text">Year, Month, Category, Amount, Description.</p>
					<form onSubmit={onSubmitManual} className="form-grid">
						<TextInput type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} placeholder="Year" required />
						<TextInput type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} placeholder="Month" required />
						<SelectInput value={category} onChange={(e) => setCategory(e.target.value)}>
							<option>General</option>
							<option>Housing</option>
							<option>Food</option>
							<option>Transport</option>
							<option>Utilities</option>
							<option>Entertainment</option>
							<option>Healthcare</option>
							<option>Other</option>
						</SelectInput>
						<TextInput type="number" step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" required />
						<TextInput type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="form-input-span-2" />
						<Button type="submit">Add</Button>
					</form>
				</Card>

				<Card title="Export Data" action={<Button onClick={onExport}>Download CSV</Button>}>
					<p className="help-text">Exports all transactions currently stored.</p>
				</Card>
			</div>
		</Section>
	);
}
