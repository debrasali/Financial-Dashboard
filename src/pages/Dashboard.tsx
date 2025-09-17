import { useMemo, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import Card from '../components/Card';
import Section from '../components/Section';
import { Button } from '../components/inputs';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

function last12MonthLabels(): string[] {
	const labels: string[] = [];
	const now = new Date();
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
	}
	return labels;
}

export default function Dashboard() {
	const items = useAppSelector((s) => s.transactions.items);
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth() + 1;

	const [categoryRange, setCategoryRange] = useState<'month' | 'ytd' | 'last12'>('month');

	const byCategory = useMemo(() => {
		const map = new Map<string, number>();
		const last12 = last12MonthLabels();
		for (const t of items) {
			let include = false;
			if (categoryRange === 'month') {
				include = t.year === currentYear && t.month === currentMonth;
			} else if (categoryRange === 'ytd') {
				include = t.year === currentYear && t.month <= currentMonth;
			} else {
				const key = `${t.year}-${String(t.month).padStart(2, '0')}`;
				include = last12.includes(key);
			}
			if (include) {
				map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
			}
		}
		const labels = Array.from(map.keys());
		const data = labels.map((l) => map.get(l) ?? 0);
		return { labels, data };
	}, [items, currentYear, currentMonth, categoryRange]);

	const last12 = useMemo(() => {
		const labels = last12MonthLabels();
		const sums = new Array(labels.length).fill(0);
		for (const t of items) {
			const key = `${t.year}-${String(t.month).padStart(2, '0')}`;
			const idx = labels.indexOf(key);
			if (idx !== -1) sums[idx] += t.amount;
		}
		return { labels, sums };
	}, [items]);

	const totalYtd = useMemo(() => items.filter(t => t.year === currentYear).reduce((a, b) => a + b.amount, 0), [items, currentYear]);

	const categoryTitle = categoryRange === 'month' ? 'Spending by Category (This Month)'
		: categoryRange === 'ytd' ? 'Spending by Category (Year to Date)'
		: 'Spending by Category (Last 12 Months)';

	return (
		<Section title="Dashboard" subtitle={`Year-to-date spending: $${totalYtd.toFixed(2)}`}>
			<div className="dashboard-grid">
				<Card title={categoryTitle} action={
					<div style={{ display: 'flex', gap: '0.5rem' }}>
						<Button variant={categoryRange === 'month' ? 'primary' : 'secondary'} onClick={() => setCategoryRange('month')}>Month</Button>
						<Button variant={categoryRange === 'ytd' ? 'primary' : 'secondary'} onClick={() => setCategoryRange('ytd')}>YTD</Button>
						<Button variant={categoryRange === 'last12' ? 'primary' : 'secondary'} onClick={() => setCategoryRange('last12')}>Last 12</Button>
					</div>
				}>
					{byCategory.labels.length ? (
						<Pie data={{
							labels: byCategory.labels,
							datasets: [{
								label: 'Amount',
								data: byCategory.data,
								backgroundColor: ['#60a5fa','#34d399','#f472b6','#fbbf24','#a78bfa','#f87171','#4ade80','#22d3ee'],
								borderWidth: 1,
							}]}}
						options={{
							plugins: {
								tooltip: {
									callbacks: {
										label: (context) => {
											const rawValue = context.parsed as number;
											const dataset = context.dataset.data as number[];
											const total = dataset.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
											const pct = total > 0 ? (rawValue / total) * 100 : 0;
											const label = context.label ?? '';
											return `${label}: $${rawValue.toFixed(2)} (${pct.toFixed(1)}%)`;
										}
									}
								}
							}
						}}
						/>
					) : <div className="no-data">No data for selected range.</div>}
				</Card>
				<Card title="Spending Trend (Last 12 Months)">
					<div className="chart-container">
						<Line data={{
							labels: last12.labels,
							datasets: [{
								label: 'Monthly Total',
								data: last12.sums,
								borderColor: '#3b82f6',
								backgroundColor: 'rgba(59,130,246,0.2)'
							}]}}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							scales: {
								y: { beginAtZero: true }
							}
						}} />
					</div>
				</Card>
			</div>
		</Section>
	);
}
