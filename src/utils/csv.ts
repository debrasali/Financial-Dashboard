import Papa from 'papaparse';
import type { Transaction } from '../store/transactionsSlice';

export type ParsedCsvRow = {
	year: number;
	month?: number; // optional; default to current month if absent
	category: string;
	amount: number;
	description: string;
};

export function parseTransactionsCSV(file: File): Promise<ParsedCsvRow[]> {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			complete: (results) => {
				try {
					const rows = (results.data as any[]).map((r) => ({
						year: Number(r.Year ?? r.year),
						month: r.Month ? Number(r.Month) : undefined,
						category: String(r.Category ?? r.category ?? ''),
						amount: Number(r.Amount ?? r.amount),
						description: String(r.Description ?? r.description ?? ''),
					}));
					resolve(rows);
				} catch (e) {
					reject(e);
				}
			},
			error: (err) => reject(err),
		});
	});
}

export function exportTransactionsCSV(transactions: Transaction[]): string {
	const rows = transactions.map((t) => ({
		Year: t.year,
		Month: t.month,
		Category: t.category,
		Amount: t.amount,
		Description: t.description,
	}));
	return Papa.unparse(rows);
}

export function downloadCSV(content: string, filename: string) {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
