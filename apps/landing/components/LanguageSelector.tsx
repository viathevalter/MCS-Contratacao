'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '../navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSelector() {
    const t = useTranslations('LanguageSelector');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <label className="relative inline-flex items-center">
            <span className="sr-only">{t('label')}</span>
            <select
                defaultValue={locale}
                className="appearance-none bg-transparent py-1 pl-2 pr-6 text-xs md:py-2 md:pl-3 md:pr-8 md:text-sm font-medium border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="es">🇪🇸 ES</option>
                <option value="en">🇺🇸 EN</option>
                <option value="pt">🇵🇹 PT</option>
                <option value="it">🇮🇹 IT</option>
                <option value="fr">🇫🇷 FR</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-2 text-slate-500">
                <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </label>
    );
}
