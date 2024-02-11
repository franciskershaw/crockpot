const LoadingSpinner = () => {
	return (
		<div className="fixed inset-0 bg-disabled bg-opacity-50 flex justify-center items-center z-modalOverlay">
			<div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green"></div>
		</div>
	);
};

export default LoadingSpinner;
