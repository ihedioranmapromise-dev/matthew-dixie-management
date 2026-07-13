const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        {/* Rotating golden ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent animate-spin" />
        {/* MD text in center */}
        <div className="absolute inset-0 flex items-center justify-center text-gold font-serif text-2xl font-bold">
          MD
        </div>
      </div>
      <p className="text-gold/70 text-sm mt-4 animate-pulse">Please wait...</p>
    </div>
  );
};

export default LoadingSpinner;