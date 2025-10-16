// place files you want to import through the `$lib` alias in this folder.

function humanizeTimestamp(timestamp: string | number | Date, includeTime: boolean, locale: string = 'en-US'): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(includeTime && { hour: 'numeric', minute: 'numeric' })
    });
}

export { humanizeTimestamp };