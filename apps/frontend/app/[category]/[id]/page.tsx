import Chat from '@/components/chat';
import Conversations from '@/components/conversations';
import ConversationsSkeleton from '@/components/conversations/conversations-skeleton';
import Info from '@/components/info';
import InfoSkeleton from '@/components/info/info-skeleton';
import { Suspense } from 'react';
import { getTranslations } from "next-intl/server";
import { getConversationById } from '@/lib/actions';
import MobileNav from '@/components/mobile-nav';

export async function generateMetadata({ params }: { params: Promise<{ category: string, id: string }> }) {
    const { id } = await params;

    const t = await getTranslations('home.meta');
    const conversation = await getConversationById(id);

    return {
        title: conversation?.title || t('title')
    };
}

export default async function ChatPage({ params }: {
    params: Promise<{ category: string, id: string }>
}) {
    return (
        <div className='flex flex-col lg:flex-row items-end h-full gap-20 w-full px-3 lg:px-10'>
            <div className="hidden lg:flex flex-col items-center justify-around h-full w-full">
                <Suspense fallback={<InfoSkeleton />}>
                    <Info params={await params} />
                </Suspense>
            </div>
            <Chat {...await params} />
            <div className="hidden lg:flex flex-col items-center justify-around h-full w-full">
                <Suspense fallback={<ConversationsSkeleton />}>
                    <Conversations />
                </Suspense>
            </div>
            <MobileNav
                componentInfo={<Info params={await params} />}
                componentConversations={<Conversations />}
            />
        </div>
    );
}
