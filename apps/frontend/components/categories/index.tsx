import { getCategories } from "@/lib/actions";
import CategoryCard from "./category-card";

export default async function Categories() {
    const categories = await getCategories();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-center mx-0 md:mx-4">
            {categories.map((category, index) => (
                <CategoryCard key={index} category={category} />
            ))}
        </div>
    );
}