import { getCategoryByKey } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

export default async function Info({ categoryKey }: { categoryKey: string }) {
  const category = await getCategoryByKey(categoryKey);

  return (
    <div className="hidden lg:flex flex-col items-center justify-around h-full w-full">
      <Link href="/" className="flex items-center gap-2 text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m8 5l-5 5l5 5" /><path d="M3 10h8c5.523 0 10 4.477 10 10v1" /></g></svg>
        Back to homepage
      </Link>
      <div className="flex flex-col items-center justify-center text-center gap-5 shadow-2xl p-10 rounded-xl">
        <div className="h-48 w-48 rounded-full overflow-hidden">
          <Image
            src={`/images/${category.key}.webp`}
            width={200}
            height={200}
            alt={category.name}
            className="rounded-full object-cover h-full w-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-2xl font-semibold">{category.name}</h1>
          <p className="text-sm italic">{category.description}</p>
        </div>
      </div>
    </div>
  );
}