'use server';

import { getCategoryByKey, getConversationById } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function Info({ params }: { params: { category: string, id: string } }) {
  const t = await getTranslations('chat');

  const category = await getCategoryByKey(params?.category);
  const conversation = await getConversationById(params?.id);

  return (
    <div className="flex flex-col items-center justify-around h-5/6 lg:h-full w-5/6 lg:w-full">
      <Link href="/" className="hidden lg:flex items-center gap-2 text-white font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m8 5l-5 5l5 5" /><path d="M3 10h8c5.523 0 10 4.477 10 10v1" /></g></svg>
        {t("back")}
      </Link>
      <div className="flex flex-col items-center justify-center text-center gap-5 shadow-2xl p-10 rounded-xl bg-primary lg:bg-transparent">
        <div className="h-48 w-48 rounded-full overflow-hidden">
          <Image
            src={`/images/${category.key}.webp`}
            priority
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
        {conversation?.title && <p className="text-sm"><span className="font-semibold">{t('topic')}:</span> {conversation?.title}</p>}
      </div>
    </div>
  );
}