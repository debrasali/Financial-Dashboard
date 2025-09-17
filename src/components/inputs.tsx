import { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import './inputs.css';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
	return <input {...props} className={`text-input ${props.className ?? ''}`} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
	return <select {...props} className={`select-input ${props.className ?? ''}`} />;
}

export function Button({ variant = 'primary', className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
	const variantClass = `button-${variant}`;
	return <button {...rest} className={`button ${variantClass} ${className ?? ''}`} />;
}
