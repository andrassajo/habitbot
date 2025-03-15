'use client';

import { getUserCookie } from "@/app/actions";
import { Categorie } from "@shared/types";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { v4 } from "uuid";

export default function CategoryCard({ category }: { category: Categorie }) {
    const router = useRouter();

    const {
        key,
        name,
        description
    } = category;

    const handleNavigation = async () => {
        await getUserCookie();

        router.push(`/${key}/${v4()}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 p-4 h-full flex flex-col md:max-w-xs w-full mx-auto">
            <div
                className="flex flex-col items-start gap-2 cursor-pointer"
                onClick={handleNavigation}
            >
                <div className="flex flex-row items-center gap-3">
                    <div className="bg-amber-200 p-1 rounded-full overflow-hidden w-12 h-12">
                        <Image
                            src={`/images/${key}.webp`}
                            alt={name}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full rounded-full object-center"
                        />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-900">{name}</h2>
                </div>
                <p className="text-xs text-gray-600">{description}</p>
            </div>
        </div>
    );
}