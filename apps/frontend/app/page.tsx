import Categories from "@/components/categories";
import SkeletonCategories from "@/components/categories/categories-skeleton";
import ChatInput from "@/components/chat/chat-input";
import Conversations from "@/components/conversations";
import ConversationsNav from "@/components/conversations-nav";
import Hero from "@/components/hero";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function Home() {
  const t = await getTranslations('chat.mobile_nav');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]">
      <main className="max-w-[1440px] flex flex-col p-6 md:p-0 gap-10 items-center relative h-full">
        <Hero />
        <Suspense fallback={<SkeletonCategories />}>
          <Categories />
        </Suspense>
        <ChatInput />
        <ConversationsNav componentConversations={<Conversations />} />
      </main>
    </div>
  );
}
