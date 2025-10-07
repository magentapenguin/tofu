import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://40d5b3aa3b0848bae53236205a3b8230@o4506782055596032.ingest.us.sentry.io/4510149234130944',

	tracesSampleRate: 1.0,

	// Enable logs to be sent to Sentry
	enableLogs: true

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});
