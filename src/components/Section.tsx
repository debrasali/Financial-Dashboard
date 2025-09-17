import { ReactNode } from 'react';
import './Section.css';

export default function Section({ title, subtitle, children }: { title: ReactNode; subtitle?: ReactNode; children: ReactNode }) {
	return (
		<section className="section">
			<div className="section-header">
				<h1 className="section-title">{title}</h1>
				{subtitle && <p className="section-subtitle">{subtitle}</p>}
			</div>
			{children}
		</section>
	);
}
