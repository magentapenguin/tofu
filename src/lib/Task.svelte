<script lang="ts">
    import { supabase } from "./db";
    interface Props {
        id: string;
        title: string;
        description?: string;
        due?: string;
        completed?: boolean;
        syncing?: boolean;
        onDelete?: () => void;
        onChange?: (completed: boolean) => void;
    }
    let { id, title, description, due, syncing = false, onDelete, onChange }: Props = $props();
    let completed = $state(false);
    function toggleCompleted() {
        completed = !completed;
        onChange?.(completed);
    }
</script>
<div class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg mb-4 bg-white dark:bg-gray-900 shadow-sm">
    <button class="{!completed ? "border-2 border-gray-400 dark:border-gray-600" : "bg-emerald-500"} size-8 rounded-md not-disabled:cursor-pointer" 
        disabled={syncing} aria-busy={syncing} 
        aria-checked={completed} role="checkbox"
        onclick={toggleCompleted}>
        {#if syncing}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon icon-6 animate-spin text-gray-400 dark:text-gray-600"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M544.1 256L552 256C565.3 256 576 245.3 576 232L576 88C576 78.3 570.2 69.5 561.2 65.8C552.2 62.1 541.9 64.2 535 71L483.3 122.8C439 86.1 382 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6C143.2 199.5 223.3 128 320 128C364.4 128 405.2 143 437.7 168.3L391 215C384.1 221.9 382.1 232.2 385.8 241.2C389.5 250.2 398.3 256 408 256L544.1 256zM573.5 356.5C576 339 563.8 322.8 546.4 320.3C529 317.8 512.7 330 510.2 347.4C496.9 440.4 416.8 511.9 320.1 511.9C275.7 511.9 234.9 496.9 202.4 471.6L249 425C255.9 418.1 257.9 407.8 254.2 398.8C250.5 389.8 241.7 384 232 384L88 384C74.7 384 64 394.7 64 408L64 552C64 561.7 69.8 570.5 78.8 574.2C87.8 577.9 98.1 575.8 105 569L156.8 517.2C201 553.9 258 576 320 576C449 576 555.7 480.6 573.4 356.5z"/></svg>
        {:else if completed}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon icon-6 text-gray-100"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
        {:else}
            <div class="icon icon-6">&nbsp;</div>
        {/if}
    </button>
    <div>
        test
    </div>
</div>