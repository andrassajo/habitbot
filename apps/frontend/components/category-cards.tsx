import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

async function CategoryCard({ category }: { category: string }) {
    const t = await getTranslations(`home.categories.${category}`);

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 p-4 h-full flex flex-col md:max-w-xs w-full mx-auto">
            <Link href={`/category/${category}`}>
                <div className="flex flex-col items-center text-center gap-2">
                    {/* Smaller image container */}
                    <div className="bg-amber-200 p-1 rounded-full overflow-hidden w-24 h-24">
                        <Image
                            src={`/images/${category}.webp`}
                            alt={category}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full rounded-full object-center"
                        />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900 mb-1">{t("title")}</h2>
                    <p className="text-sm text-gray-600">{t("description")}</p>
                </div>
            </Link>
        </div>
    );
}

export default async function CategoryCards() {
    const categories = ["default", "productivity", "fitness", "mindfulness"];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-center mx-0 md:mx-4">
            {categories.map((category, index) => (
                <CategoryCard key={index} category={category} />
            ))}
        </div>
    );
}
