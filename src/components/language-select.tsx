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

function LanguageSelect() {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale()
    return (
        <Select value={locale} onValueChange={(value: Locale) => setUserLocale(value)}>
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