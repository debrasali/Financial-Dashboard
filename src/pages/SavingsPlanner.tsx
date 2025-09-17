import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCompoundRate, setMonthlyIncome } from '../store/userSlice';
import { addGoal, deleteGoal, Goal, updateGoal } from '../store/goalsSlice';
import Section from '../components/Section';
import Card from '../components/Card';
import { Button, TextInput, SelectInput } from '../components/inputs';
import './SavingsPlanner.css';

function computeAverageMonthlySpending(transactions: { year: number; month: number; amount: number }[]): number {
	if (transactions.length === 0) return 0;
	const map = new Map<string, number>();
	for (const t of transactions) {
		const key = `${t.year}-${t.month}`;
		map.set(key, (map.get(key) ?? 0) + t.amount);
	}
	const monthlyTotals = Array.from(map.values());
	if (monthlyTotals.length === 0) return 0;
	return monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
}

function projectSavings({
	months,
	baseMonthlySavings,
	annualRatePercent,
	monthlyBoost,
}: {
	months: number;
	baseMonthlySavings: number;
	annualRatePercent: number;
	monthlyBoost: number;
}) {
	const r = annualRatePercent / 100 / 12; // monthly rate
	let balance = 0;
	for (let i = 0; i < months; i++) {
		balance = balance * (1 + r) + (baseMonthlySavings + monthlyBoost);
	}
	return balance;
}

export default function SavingsPlanner() {
	const dispatch = useAppDispatch();
	const transactions = useAppSelector((s) => s.transactions.items);
	const goals = useAppSelector((s) => s.goals.items);
	const user = useAppSelector((s) => s.user);

	const [whatIfBoost, setWhatIfBoost] = useState(0);
	const [whatIfRate, setWhatIfRate] = useState<number | null>(null);
	const [goalAdjustId, setGoalAdjustId] = useState<string | null>(null);
	const [goalAdjustYears, setGoalAdjustYears] = useState(0);
	const [showWhatIf, setShowWhatIf] = useState(false);

	const avgMonthlySpend = useMemo(() => computeAverageMonthlySpending(transactions), [transactions]);
	const baseMonthlySavings = Math.max(0, user.monthlyIncome - avgMonthlySpend);
	const effectiveRate = whatIfRate ?? user.compoundRate;

	const goalsWithAdjustedYears = goals.map((g) => (
		goalAdjustId === g.id ? { ...g, targetYear: g.targetYear + goalAdjustYears } : g
	));

	const projectionToYear = (targetYear: number) => {
		const now = new Date();
		const months = (targetYear - now.getFullYear()) * 12 - now.getMonth() + 11; // end of target year
		return months <= 0 ? 0 : projectSavings({ months, baseMonthlySavings, annualRatePercent: effectiveRate, monthlyBoost: whatIfBoost });
	};

	const totalProjectedAtGoalsEnd = goalsWithAdjustedYears.reduce((sum, g) => Math.max(sum, projectionToYear(g.targetYear)), 0);
	const totalGoalsNeeded = goalsWithAdjustedYears.reduce((sum, g) => sum + g.targetAmount, 0);
	const shortfall = Math.max(0, totalGoalsNeeded - totalProjectedAtGoalsEnd);

	function onAddGoal() {
		const name = prompt('Goal Name')?.trim();
		if (!name) return;
		const targetAmount = Number(prompt('Target Amount', '10000'));
		const targetYear = Number(prompt('Target Year', String(new Date().getFullYear() + 1)));
		dispatch(addGoal({ name, targetAmount, targetYear }));
	}

	function onEditGoal(g: Goal) {
		const name = prompt('Goal Name', g.name)?.trim() ?? g.name;
		const targetAmount = Number(prompt('Target Amount', String(g.targetAmount)) ?? g.targetAmount);
		const targetYear = Number(prompt('Target Year', String(g.targetYear)) ?? g.targetYear);
		dispatch(updateGoal({ ...g, name, targetAmount, targetYear }));
	}

	return (
		<Section title="Savings Planner" subtitle="Adjust inputs to see how fast you can reach your goals.">
			<div className="savings-grid-3">
				<Card title="Income & Spending">
					<label className="input-label">Monthly Income</label>
					<TextInput type="number" value={user.monthlyIncome} onChange={(e) => dispatch(setMonthlyIncome(Number(e.target.value)))} />
					<div className="spending-info">Avg Monthly Spending: ${avgMonthlySpend.toFixed(2)}</div>
					<div className="savings-info">Base Monthly Savings: ${baseMonthlySavings.toFixed(2)}</div>
				</Card>

				<Card title="Compound Rate">
					<label className="input-label">Annual Rate (%)</label>
					<TextInput type="number" step="0.1" value={user.compoundRate} onChange={(e) => dispatch(setCompoundRate(Number(e.target.value)))} />
				</Card>

				<Card title="Goals" action={<Button onClick={onAddGoal}>Add Goal</Button>}>
					<div className="goals-list">
						{goals.map((g) => (
							<div key={g.id} className="goal-item">
								<div className="goal-details">
									<div className="goal-name">{g.name}</div>
									<div className="goal-target">${g.targetAmount.toFixed(2)} by {g.targetYear}</div>
								</div>
								<div className="goal-actions">
									<Button onClick={() => onEditGoal(g)}>Edit</Button>
									<Button variant="danger" onClick={() => dispatch(deleteGoal(g.id))}>Delete</Button>
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>

			<div className="savings-grid-2">
				<Card title="Projection Result">
					<p className="projection-text">Projected savings by goals' end: <span className="projection-amount">${totalProjectedAtGoalsEnd.toFixed(2)}</span></p>
					<p className={shortfall > 0 ? 'shortfall-positive' : 'shortfall-negative'}>
						You are projected to be <span className="projection-amount">${shortfall.toFixed(2)}</span> short of your goals.
					</p>
				</Card>
			</div>

			<div>
				<Button variant="secondary" onClick={() => setShowWhatIf((v) => !v)}>{showWhatIf ? 'Hide What-If Controls' : 'Show What-If Controls'}</Button>
				{showWhatIf && (
					<Card title="What-If Controls">
						<label className="input-label">Increase monthly savings by ($)</label>
						<TextInput type="number" value={whatIfBoost} onChange={(e) => setWhatIfBoost(Number(e.target.value))} />
						<label className="input-label">Achieve average annual return (%)</label>
						<TextInput type="number" step="0.1" value={whatIfRate ?? user.compoundRate} onChange={(e) => setWhatIfRate(Number(e.target.value))} />
						<label className="input-label">Delay goal by years</label>
						<div className="what-if-controls">
							<SelectInput value={goalAdjustId ?? ''} onChange={(e) => setGoalAdjustId(e.target.value || null)}>
								<option value="">Select goal</option>
								{goals.map((g) => (
									<option key={g.id} value={g.id}>{g.name}</option>
								))}
							</SelectInput>
							<TextInput type="number" placeholder="Delay years" value={goalAdjustYears} onChange={(e) => setGoalAdjustYears(Number(e.target.value))} />
						</div>
						<p className="what-if-help">Selected goal target year is adjusted in projection only.</p>
					</Card>
				)}
			</div>
		</Section>
	);
}
