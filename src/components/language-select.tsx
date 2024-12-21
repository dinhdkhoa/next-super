'use client'
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Locale, locales } from '@/i18n/i18n'
import { useLocale, useTranslations } from 'next-intl';
import { getUserLocale, setUserLocale } from '@/i18n/locale';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

function LanguageSelect() {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale()
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();

    return (
        <Select value={locale} onValueChange={(value: Locale) => router.replace(
            // @ts-expect-error -- TypeScript will validate that only known `params`
            // are used in combination with a given `pathname`. Since the two will
            // always match for the current route, we can skip runtime checks.
            { pathname, params },
            { locale: value }
        )}>
            <SelectTrigger className="w-[60px] text-xs">
                <SelectValue placeholder={t('label')} />
            </SelectTrigger>
            <SelectContent >
                {locales.map(lan =>
                    <SelectItem value={lan} key={lan} className="text-xs">{lan.toUpperCase()}</SelectItem>
                )}

            </SelectContent>
        </Select>
    )
}

export default LanguageSelect