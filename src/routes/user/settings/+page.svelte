<script lang="ts">
    import { page } from "$app/state"
    import type { PageData } from './$types'

    let { data }: { data: PageData } = $props()
    const supabase = data.supabase

    interface Setting<T = any> {
        name: string
        description?: string
        type: string
        value: T
        onChange: (oldValue: T, newValue: T) => boolean | void
    }

    interface SelectSetting extends Setting<string> {
        type: 'select'
        options: string[]
    }
    interface BooleanSetting extends Setting<boolean> {
        type: 'boolean'
    }
    interface TextSetting extends Setting<string> {
        type: 'text'
    }

    type AnySetting = SelectSetting | BooleanSetting | TextSetting

    let currentTheme = 'System Default'
    if (typeof localStorage !== 'undefined') {
        const storedTheme = localStorage.getItem('theme')
        if (storedTheme === 'light') {
            currentTheme = 'Light'
        } else if (storedTheme === 'dark') {
            currentTheme = 'Dark'
        }
    }

    const settings: AnySetting[] = [
        {
            name: 'Theme',
            type: 'select',
            description: 'Choose the application theme.',
            options: ['Light', 'Dark', 'System Default'],
            value: currentTheme,
            onChange: (oldValue: string, newValue: string) => {
                if (newValue === 'Light') {
                    localStorage.setItem('theme', 'light')
                } else if (newValue === 'Dark') {
                    localStorage.setItem('theme', 'dark')
                } else {
                    localStorage.removeItem('theme')
                }
                document.documentElement.classList.toggle(
                    "dark",
                    localStorage.theme === "dark" ||
                        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
                );
            }
        },
        {
            name: 'Username',
            type: 'text',
            description: 'Your username in the application.',
            value: page.data.session?.user.user_metadata.user_name ?? page.data.session?.user.email ?? '',
            onChange: (oldValue: string, newValue: string) => {
                supabase.auth.updateUser({
                    data: { user_name: newValue }
                }).then(({ error }) => {
                    if (error) {
                        alert('Error updating username: ' + error.message)
                    }
                })
            }
        }
    ]
</script>

{#each settings as setting}
    <div class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg mb-4 bg-white dark:bg-gray-900 shadow-sm flex gap-1 flex-col">
        <strong class="text-lg">{setting.name}</strong>
        <div>
            {setting.description}
        </div>
        {#if setting.type === 'select'}
            <select
                value={setting.value}
                class="input"
                onchange={(e) => {
                    const oldValue = setting.value
                    const newValue = (e.target as HTMLSelectElement).value
                    setting.value = newValue
                    setting.onChange(oldValue, newValue)
                }}
            >
                {#each (setting as SelectSetting).options as option}
                    <option value={option} selected={option === setting.value} class="bg-gray-100 dark:bg-gray-800">{option}</option>
                {/each}
            </select>
        {:else if setting.type === 'boolean'}
            <input
                type="checkbox"
                checked={setting.value}
                onchange={(e) => {
                    const oldValue = setting.value
                    const newValue = (e.target as HTMLInputElement).checked
                    setting.value = newValue
                    setting.onChange(oldValue, newValue)
                }}
            />
        {:else if setting.type === 'text'}
            <input
                type="text"
                class="input self-center justify-self-center w-full"
                value={setting.value}
                oninput={(e) => {
                    const oldValue = setting.value
                    const newValue = (e.target as HTMLInputElement).value
                    setting.value = newValue
                    setting.onChange(oldValue, newValue)
                }}
            />
        {/if}
    </div>
{/each}

