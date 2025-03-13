import React from "react";

function SkeletonCategoryCard() {
    return (
        <div className="bg-white rounded-lg shadow-md animate-pulse p-4 h-full flex flex-col md:max-w-xs w-full mx-auto">
            <div className="flex flex-col items-center text-center gap-4">
                {/* Image placeholder: matching the original 24x24 size */}
                <div className="bg-gray-300 rounded-full w-24 h-24"></div>
                {/* Title placeholder: wider and taller to better simulate the actual text */}
                <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                {/* Description placeholder: increased width and height */}
                <div className="w-full h-4 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}

export default function SkeletonCategories() {
    // Adjust the number of skeleton cards as needed.
    const skeletonArray = Array.from({ length: 4 });

    return (
        <div className="w-[95%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-center mx-0 md:mx-4">
            {skeletonArray.map((_, index) => (
                <SkeletonCategoryCard key={index} />
            ))}
        </div>
    );
}
