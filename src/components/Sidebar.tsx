import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

const linkClass = ({ isActive }: { isActive: boolean }) =>
	`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`;

export default function Sidebar() {
	const [open, setOpen] = useState(false);

	return (
		<div className={`sidebar-container${open ? ' sidebar-open' : ''}`}>
			<div className="sidebar-header">
				<div className="sidebar-logo-text">Financial<br/>Planner</div>
				<button className="sidebar-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle navigation">
					<span className="sidebar-toggle-bar" />
					<span className="sidebar-toggle-bar" />
					<span className="sidebar-toggle-bar" />
				</button>
			</div>
			<nav className="sidebar-nav">
				<NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
				<NavLink to="/transactions" className={linkClass} onClick={() => setOpen(false)}>Transactions</NavLink>
				<NavLink to="/savings" className={linkClass} onClick={() => setOpen(false)}>Savings Planner</NavLink>
				<NavLink to="/data" className={linkClass} onClick={() => setOpen(false)}>Add/Import/Export</NavLink>
			</nav>
		</div>
	);
}
