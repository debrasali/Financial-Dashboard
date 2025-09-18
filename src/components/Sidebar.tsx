import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const linkClass = ({ isActive }: { isActive: boolean }) =>
	`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`;

export default function Sidebar() {
	return (
		<div className="sidebar-container">
			<div className="sidebar-logo">
				<div>Financial<br/>Planner</div>
			</div>
			<nav className="sidebar-nav">
				<NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
				<NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
				<NavLink to="/savings" className={linkClass}>Savings Planner</NavLink>
				<NavLink to="/data" className={linkClass}>Add/Import/Export</NavLink>
			</nav>
		</div>
	);
}
