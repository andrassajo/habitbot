import Chat from '@/components/chat';
import Conversations from '@/components/conversations';
import ConversationsSkeleton from '@/components/conversations/conversations-skeleton';
import Info from '@/components/info';
import InfoSkeleton from '@/components/info/info-skeleton';
import { Suspense } from 'react';
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getConversationById } from '@/lib/actions';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
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
        <div className='flex flex-row items-end justify-end h-full gap-20 w-full px-3 lg:px-10'>
            <Suspense fallback={<InfoSkeleton />}>
                <Info categoryKey={(await params).category} />
            </Suspense>
            <Chat {...await params} />
            <Suspense fallback={<ConversationsSkeleton />}>
                <Conversations />
            </Suspense>
        </div>
    );
}
