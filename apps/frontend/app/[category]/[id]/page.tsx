import Chat from '@/components/chat';
import Conversations from '@/components/conversations';
import InfoWrapper from '@/components/info/info-wrapper';
import { Suspense } from 'react';
export default async function ChatPage({ params }: {
    params: Promise<{ category: string, id: string }>
}) {
    return (
        <div className='flex flex-row items-end justify-end h-full gap-20 w-full md:px-10'>
            <Suspense fallback={<div>Loading...</div>}>
                <InfoWrapper categoryKey={(await params).category} />
            </Suspense>
            <Chat {...await params} />
            <Suspense fallback={<div>Loading...</div>}>
                <Conversations />
            </Suspense>
        </div>
    );
}
