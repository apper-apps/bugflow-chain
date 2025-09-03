import React from "react";

const Loading = ({ type = "board" }) => {
  if (type === "board") {
    return (
      <div className="flex gap-6 p-6">
        {[...Array(4)].map((_, colIndex) => (
          <div key={colIndex} className="flex-1">
            <div className="bg-white rounded-lg p-4 mb-4 card-shadow">
              <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer w-16"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white rounded-lg p-4 card-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer w-20"></div>
                    <div className="h-6 w-16 bg-gradient-to-r from-surface-200 to-surface-300 rounded-full animate-shimmer"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer w-3/4"></div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer w-24"></div>
                    <div className="h-8 w-8 bg-gradient-to-r from-surface-200 to-surface-300 rounded-full animate-shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer"></div>
        <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer"></div>
          <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer"></div>
          <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-shimmer w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default Loading;