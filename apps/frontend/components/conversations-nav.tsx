'use client';

import Modal from "./modal";
import { useState } from "react";
import _ from 'lodash';
import { useTranslations } from "next-intl";

export default function ConversationsNav({
    componentConversations
}: {
    componentConversations: React.ReactNode
}) {
    const t = useTranslations('chat.mobile_nav')

    const [modal, setModal] = useState('none');

    const isOpen = modal === 'conversations';

    return (
        <footer className="flex flex-row justify-around items-center text-white text-xs">
            <button
                className={`p-1 rounded-xl cursor-pointer transition duration-300 ease-in-out flex flex-col items-center justify-center w-full gap-1 h-full pt-2 pb-1 ${modal === 'conversations' ? 'bg-white text-secondary' : 'hover:bg-white hover:text-secondary'}`}
                onClick={() => setModal('conversations')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm2 5h2v2H6zm5 0a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2zm-3 4H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1m-2 3H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1" clipRule="evenodd" /></svg>
                {t('conversations')}
            </button>

            <Modal isOpen={isOpen} onClose={() => setModal('none')}>
                <div className="flex flex-col items-center justify-center gap-2 h-full lg:h-3/4 w-full lg:w-1/2 lg:bg-primary lg:p-6 lg:rounded-xl">
                    {modal === 'conversations' && componentConversations}
                </div>
            </Modal>
        </footer >
    )

}