import Chat from '@/components/chat';

export default async function ChatPage({ params }: {
    params: Promise<{ category: string, id: string }>
}) {
    return (
        <Chat {...await params} />
    );
}
