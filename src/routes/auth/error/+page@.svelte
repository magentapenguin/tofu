<script lang="ts">
    import { page } from "$app/state";
    import posthog  from "posthog-js";

    function onFeedbackSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const issue_report = formData.get('issue_report') as string;
        form_submitted = true;    
        posthog.capture('auth_error_feedback', {
            error: query.get("error"),
            error_description: query.get("error_description"),
            issue_report: issue_report
        });    
    }
    let form_submitted = $state(false);
    let query = page.url.searchParams;
    const expected_errors = [
        'access_denied',
        null
    ];
</script>
<div class="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col gap-1 max-w-3xl p-4 border border-gray-300 dark:border-gray-700 rounded shadow-lg">
    <h1 class="text-4xl font-bold text-center">Authentication Error</h1>
    <h2 class="text-lg">{query.get("error")??'An unknown error occurred'}</h2>
    <div class="input text-wrap break-words">
        {query.get("error_description")??'No additional information provided'}
    </div>
    {#if !expected_errors.includes(query.get("error"))}
    <form class="flex flex-col" onsubmit={onFeedbackSubmit}>
        <label for="issue_report" class="mt-4 font-semibold">Please consider reporting this issue to help us improve:</label>
        <textarea id="issue_report" class="input" name="issue_report" placeholder="Describe what you were doing when the error occurred..."></textarea>
        <button type="submit" class="btn mt-2 self-start">Submit Report</button>
    </form>
    {/if}
    <a href="/auth/login" class="btn">Go to Login</a>
    <a href="/auth/register" class="btn">Go to Register</a>
    <a href="/" class="btn">Go to Home</a>
</div>