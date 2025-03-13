import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Hero() {
    const t = await getTranslations("home")

    return (
        <div className="flex flex-col gap-6 items-center w-full md:w-3/5">
            <div className="bg-white rounded-full flex items-center justify-center">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="rounded-full"
                />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
                {t("title")}
            </h1>
            <p className="text-gray-200 text-center">
                {t("description")}
            </p>
        </div>
    )
}