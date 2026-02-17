import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['es', 'pt', 'it', 'fr', 'en'],

    // Used when no locale matches
    defaultLocale: 'es'
});

// Lightweight wrapper around Next.js' navigation APIs
// that handles client-side locale prefixes
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
