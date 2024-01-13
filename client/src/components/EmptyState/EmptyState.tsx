import React from 'react';

type EmptyStateProps = {
	animation?: boolean;
	title: string;
	description: string;
};

export default function EmptyState({
	animation,
	title,
	description,
}: EmptyStateProps) {
	return (
		<div className="text-center mb-4">
			<h2 className="mb-2">{title}</h2>
			<p className="h3 !leading-5">{description}</p>
		</div>
	);
}
