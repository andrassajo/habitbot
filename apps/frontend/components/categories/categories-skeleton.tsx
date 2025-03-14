import React from "react";

function SkeletonCategoryCard() {
    return (
        <div className="bg-white rounded-lg shadow-md animate-pulse transition-transform duration-300 transform hover:scale-105 p-4 h-full flex flex-col md:max-w-xs w-full mx-auto">
            <div className="flex flex-col items-start gap-2">
                <div className="flex flex-row items-center gap-3">
                    <div className="bg-gray-300 rounded-full w-12 h-12"></div>
                    <div className="w-20 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="w-full h-3 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}

export default function SkeletonCategories() {
    const skeletonArray = Array.from({ length: 3 });

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-center mx-0 md:mx-4">
            {skeletonArray.map((_, index) => (
                <SkeletonCategoryCard key={index} />
            ))}
        </div>
    );
}
