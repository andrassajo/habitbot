import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Hero() {
    const t = await getTranslations("home")

    return (
        <div className="flex flex-col gap-4 items-center w-full md:w-3/5">
            <div className="bg-white rounded-full flex items-center justify-center">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="rounded-full"
                />
            </div>
            <div className="flex flex-col gap-0 items-center">
                <h1 className="text-lg font-bold text-white  text-center">
                    {t("title")}
                </h1>
                <h1 className="text-2xl font-bold text-white text-center">
                    {t("subtitle")}
                </h1>
            </div>
            <p className="text-sm text-gray-200 text-center w-full md:w-2/3">
                {t("description")}
            </p>
        </div>
    )
}