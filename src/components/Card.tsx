import { ReactNode } from 'react';
import './Card.css';

export default function Card({ title, action, children }: { title?: ReactNode; action?: ReactNode; children: ReactNode }) {
	return (
		<div className="card">
			{(title || action) && (
				<div className="card-header">
					{title && <h2 className="card-title">{title}</h2>}
					{action}
				</div>
			)}
			<div className="card-content">{children}</div>
		</div>
	);
}
