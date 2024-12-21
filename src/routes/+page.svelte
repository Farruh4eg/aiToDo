<script lang="ts">
	import AiAnswer from '$lib/components/AIAnswer.svelte';
	import Note from '$lib/components/Note.svelte';
	import { onMount } from 'svelte';
	import { preventDefault } from 'svelte/legacy';

	let { data } = $props();
	let notesArray: { text: string; id: number; timestamp: Date }[] = $state([]);

	let userInput: string = $state('');
	let conversation: { role: 'user' | 'ai'; content: string }[] = $state([]);
	let notesContainer: HTMLElement;
	let textField: HTMLTextAreaElement;
	let sendButton: HTMLButtonElement;

	function clear() {
		textField.value = '';
	}

	async function submitToDo(value = textField.value) {
		let request = await fetch('/v1/notes', {
			method: 'POST',
			body: JSON.stringify({ noteText: value })
		});

		if (request.ok) {
			let response = (await request.json()) as { id: number; text: string; timestamp: Date };
			notesArray.unshift({ id: response.id, text: response.text, timestamp: response.timestamp });
			clear();
		}
	}

	async function submitChat() {
		conversation.push({ role: 'user', content: userInput });

		let request = await fetch('/v1/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userInput,
				existingNotes: JSON.stringify(notesArray),
				type: 'direct'
			})
		});

		userInput = '';

		if (request.ok) {
			let response = await request.json();
			conversation.push({ role: 'ai', content: response.choices[0]?.message.content });
		}
	}

	async function saveAsNote() {
		let request = await fetch('/v1/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ type: 'summarize', aiAnswer: conversation.at(-1)?.content })
		});

		if (request.ok) {
			let response = await request.json();
			await submitToDo(response.choices[0]?.message.content);
		}
	}

	async function askAbout(noteText: string) {
		conversation.push({ role: 'user', content: noteText });

		let request = await fetch('/v1/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userInput: noteText,
				type: 'askAbout'
			})
		});

		userInput = '';

		if (request.ok) {
			let response = await request.json();
			conversation.push({ role: 'ai', content: response.choices[0]?.message.content });
		}
	}

	$effect(() => {
		if (userInput.trim()) {
			sendButton.disabled = false;
			sendButton.classList.remove('opacity-25');
		} else {
			sendButton.disabled = true;
			sendButton.classList.add('opacity-25');
		}
	});

	onMount(() => {
		notesArray = data.notes;
	});
</script>

<section class="flex h-screen w-full justify-evenly p-8">
	<section class="flex w-2/5 flex-col gap-4">
		<form
			method="POST"
			name="noteForm"
			id="nameForm"
			class="mx-auto mt-8 flex w-full flex-col gap-4 rounded-xl border p-6"
			onsubmit={(event) => {
				event.preventDefault();
				submitToDo();
			}}
		>
			<textarea
				name="note"
				id="note"
				bind:this={textField}
				class="resize-none rounded-lg border p-2"
				placeholder="Введите заметку"
				rows="3"
			></textarea>
			<section class="flex gap-4 self-end">
				<button onclick={clear} class="w-max border bg-red-600 p-2 font-bold text-white">
					Очистить
				</button>
				<button class="w-max border bg-green-600 p-2 font-bold text-white" type="submit">
					Сохранить
				</button>
			</section>
		</form>
		<section
			id="notesContainer"
			bind:this={notesContainer}
			class="mt-10 flex max-h-[1000px] flex-col gap-4 overflow-y-scroll rounded-lg text-center scrollbar-thin"
		>
			<h1 class="text-lg font-bold">Заметки</h1>
			{#if notesArray}
				{#each notesArray as note, index}
					<Note
						id={note.id}
						text={note.text}
						timestamp={note.timestamp}
						remove="{async () => {
							let request = await fetch('/v1/notes', {
								method: 'DELETE',
								body: JSON.stringify({ id: note.id })
							});

							await request.json();

							if (request.ok) {
								notesArray.splice(index, 1);
							}
						}},"
						{askAbout}
					/>
				{/each}
			{/if}
		</section>
	</section>

	<section class="flex h-full w-1/4 flex-col items-center justify-end gap-4 rounded-lg border p-4">
		<section
			class="flex h-full w-full flex-col gap-4 overflow-y-scroll rounded-lg p-4 text-gray-700 scrollbar-thin"
		>
			{#if conversation}
				{#each conversation as message}
					{#if message.role === 'user'}
						<pre
							class="max-w-full self-end whitespace-pre-wrap rounded-lg bg-blue-500 p-4 text-white">{message.content}</pre>
					{:else}
						<AiAnswer content={message.content} {saveAsNote} />
					{/if}
				{/each}
			{/if}
		</section>
		<form method="POST" class="text flex w-full gap-4" onsubmit={preventDefault(submitChat)}>
			<input
				type="text"
				class="w-full rounded-lg border border-gray-400 p-2"
				placeholder="Введите запрос"
				bind:value={userInput}
			/>
			<button class="w-max p-2" bind:this={sendButton}>
				<svg
					width="32px"
					height="32px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					stroke="#000000"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<path
							d="M12 5V19M12 5L6 11M12 5L18 11"
							stroke="#0000FF"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</g></svg
				>
			</button>
		</form>
	</section>
</section>
