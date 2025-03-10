const LoadingCard = () => {
  return (
    <div className="card w-[300px] bg-white rounded-lg border overflow-hidden">
      <figure className="w-full h-60 bg-gray-200 animate-pulse"></figure>
      <div className="card-body p-4">
        <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 animate-pulse mb-4 w-full"></div>
        <div className="h-8 bg-gray-200 animate-pulse mb-2 w-1/2"></div>
        <div className="h-5 bg-gray-200 animate-pulse mb-2 w-1/3"></div>
        <div className="flex gap-2 mt-2">
          <span className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></span>
          <span className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></span>
          <span className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className="w-4 h-4 bg-gray-200 animate-pulse rounded-full"
              ></span>
            ))}
          </div>
          <span className="h-4 w-10 bg-gray-200 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};
export default LoadingCard;
