import { Link, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DataImportExport from './pages/DataImportExport';
import AllTransactions from './pages/AllTransactions';
import SavingsPlanner from './pages/SavingsPlanner';
import './App.css';

function App() {
	return (
		<div className="app-container">
			<div className="app-layout">
				<aside className="app-sidebar"><Sidebar /></aside>
				<main className="app-main">
					<Routes>
						<Route path="/" element={<Navigate to="/dashboard" replace />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/transactions" element={<AllTransactions />} />
						<Route path="/savings" element={<SavingsPlanner />} />
						<Route path="/data" element={<DataImportExport />} />
						<Route path="*" element={<div className="not-found">Not Found. <Link className="not-found-link" to="/dashboard">Go Home</Link></div>} />
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default App;
