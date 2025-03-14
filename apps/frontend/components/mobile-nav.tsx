'use client';

import Link from "next/link";
import Modal from "./modal";
import { useState } from "react";
import _ from 'lodash';
import { useTranslations } from "next-intl";

export default function MobileNav({
    componentInfo,
    componentConversations
}: {
    componentInfo: React.ReactNode,
    componentConversations: React.ReactNode
}) {
    const t = useTranslations('chat.mobile_nav')

    const [modal, setModal] = useState('none');

    const isOpen = _.includes(['info', 'conversations'], modal);

    return (
        <footer className="lg:hidden absolute bottom-0 w-full flex flex-row justify-around items-center text-white text-xs border-t border-gray-300">
            <Link href="/" className="hover:bg-white hover:text-secondary transition duration-300 ease-in-out flex flex-col items-center justify-center w-full gap-1 h-full pt-2 pb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75" /></svg>
                {t('home')}
            </Link>
            <button
                className={`cursor-pointer transition duration-300 ease-in-out flex flex-col items-center justify-center w-full gap-1 h-full pt-2 pb-1 ${modal === 'info' ? 'bg-white text-secondary' : 'hover:bg-white hover:text-secondary'}`}
                onClick={() => setModal('info')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z" /></svg>
                {t('info')}
            </button>
            <button
                className={`cursor-pointer transition duration-300 ease-in-out flex flex-col items-center justify-center w-full gap-1 h-full pt-2 pb-1 ${modal === 'conversations' ? 'bg-white text-secondary' : 'hover:bg-white hover:text-secondary'}`}
                onClick={() => setModal('conversations')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm2 5h2v2H6zm5 0a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2zm-3 4H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1m-2 3H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1" clipRule="evenodd" /></svg>
                {t('conversations')}
            </button>

            <Modal isOpen={isOpen} onClose={() => setModal('none')}>
                {modal === 'info' && componentInfo}
                {modal === 'conversations' && componentConversations}
            </Modal>
        </footer >
    )

}