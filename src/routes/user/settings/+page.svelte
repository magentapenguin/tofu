<script lang="ts">
    import { page } from "$app/state"
    import { supabase } from "$lib/db"


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

    const settings: AnySetting[] = [
        {
            name: 'Theme',
            type: 'select',
            description: 'Choose the application theme.',
            options: ['Light', 'Dark', 'System Default'],
            value: 'System Default',
            onChange: (oldValue: string, newValue: string) => {
                if (newValue === 'Light') {
                    localStorage.setItem('theme', 'light')
                } else if (newValue === 'Dark') {
                    localStorage.setItem('theme', 'dark')
                } else {
                    localStorage.removeItem('theme')
                }
            }
        },
        {
            name: 'Username',
            type: 'text',
            description: 'Your username in the application.',
            value: page.data.session?.user.user_metadata.user_name ?? page.data.session?.user.email ?? '',
            onChange: (oldValue: string, newValue: string) => {
                
            }
        }
    ]
</script>

{#each settings as setting}
    <div class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg mb-4 bg-white dark:bg-gray-900 shadow-sm grid gap-1 gap-x-3"
    style="grid-template-columns: auto 1fr auto; grid-template-rows: auto auto; grid-template-areas: 'title setting' 'description setting';">
        <strong style="grid-area: title;" class="text-lg">{setting.name}</strong>
        <div style="grid-area: description;">
            {setting.description}
        </div>
        {#if setting.type === 'select'}
            <select
                bind:value={setting.value}
                class="input self-center justify-self-center p-3"
                style="grid-area: setting;"
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
                style="grid-area: setting;"
                class="p-3"
                bind:checked={setting.value}
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
                class="input self-center justify-self-center p-3"
                style="grid-area: setting;"
                bind:value={setting.value}
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

