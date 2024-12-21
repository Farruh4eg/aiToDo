<script lang="ts">
	let { content, saveAsNote } = $props();
</script>

<pre class="whitespace-pre-wrap">{content}</pre>
<button
	onclick={saveAsNote}
	class="flex h-8 w-8 items-center justify-center self-start bg-blue-500 p-2 text-center font-bold text-white"
	>+</button
>
