<script lang="ts">

    interface Setting<T = any> {
        name: string
        type: any
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


    const settings: Setting[] = [
        {
            name: 'Theme',
            type: 'select',
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
        }
    ]
</script>

{#each settings as setting}
    <div class="setting-item">
        <strong>{setting.name}</strong>
        {#if setting.type === 'select'}
            <select
                bind:value={setting.value}
                on:change={(e) => setting.onChange((e.target as HTMLSelectElement).value)}
            >
                {#each setting.options as option}
                    <option value={option} selected={option === setting.value}>{option}</option>
                {/each}
            </select>
        {:else if setting.type === 'boolean'}
            <input
                type="checkbox"
                bind:checked={setting.value}
                on:change={(e) => setting.onChange((e.target as HTMLInputElement).checked)}
            />
        
        {/if}
    </div>
{/each}

