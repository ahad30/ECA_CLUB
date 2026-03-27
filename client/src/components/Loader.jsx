const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
      <div className="loader" />
      <p className="text-sm text-gray-400 font-medium">Loading...</p>
    </div>
  );
};

export default Loader;
