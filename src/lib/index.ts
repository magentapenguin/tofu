// place files you want to import through the `$lib` alias in this folder.

import { GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN, CODESPACE_NAME } from "$env/static/private";

function humanizeTimestamp(timestamp: string | number | Date, includeTime: boolean, locale: string = 'en-US'): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(includeTime && { hour: 'numeric', minute: 'numeric' })
    });
}

function correctURL(url: URL): URL {
    if (GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
        url.hostname = `${CODESPACE_NAME}-${url.port}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
        url.port = '';
    }
    return url;
}

function correctOrigin(url: string | URL): string {
    let originURL: URL;
    if (typeof url === 'string') {
        originURL = new URL(url);
    } else {
        originURL = url;
    }
    return correctURL(originURL).origin;
}

export { humanizeTimestamp, correctURL, correctOrigin };