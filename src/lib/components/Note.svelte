<script lang="ts">
	let {
		id,
		text,
		timestamp,
		remove,
		askAbout
	}: { id: number; text: string; timestamp: Date; remove: any; askAbout: any } = $props();

	let isReadOnly = $state(true);
	let noteText: HTMLTextAreaElement;

	function edit() {
		isReadOnly = false;
		noteText.disabled = false;
		noteText.focus();
	}

	async function save() {
		text = noteText.value;
		let request = await fetch('/v1/notes', {
			method: 'PUT',
			body: JSON.stringify({ id, text })
		});

		if (request.ok) {
			let response = await request.json();
			console.log(response.message);
			isReadOnly = true;
			noteText.disabled = true;
		}
	}
</script>

<section class="flex flex-col gap-4 p-2">
	<textarea
		bind:this={noteText}
		bind:value={text}
		disabled
		class="resize-none rounded-lg border border-gray-200 p-2"
		rows="5"
	></textarea>
	<section class="flex w-full items-end justify-between gap-4">
		<button
			onclick={async () => {
				await remove();
			}}
			class="w-max"
		>
			<svg
				fill="#FF0000"
				version="1.1"
				id="Capa_1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				width="32px"
				height="32px"
				viewBox="0 0 485 485"
				xml:space="preserve"
				stroke="#FF0000"
				><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
				></g><g id="SVGRepo_iconCarrier">
					<g>
						<g>
							<rect x="67.224" width="350.535" height="71.81"></rect>
							<path
								d="M417.776,92.829H67.237V485h350.537V92.829H417.776z M165.402,431.447h-28.362V146.383h28.362V431.447z M256.689,431.447 h-28.363V146.383h28.363V431.447z M347.97,431.447h-28.361V146.383h28.361V431.447z"
							></path>
						</g>
					</g>
				</g></svg
			>
		</button>
		<p>Дата изменения: {timestamp}</p>
		<section class="flex gap-4 self-end">
			{#if isReadOnly}
				<button onclick={edit} class="self-end"
					><svg
						width="32px"
						height="32px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						stroke="#0000FA"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						></g><g id="SVGRepo_iconCarrier">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M8.56078 20.2501L20.5608 8.25011L15.7501 3.43945L3.75012 15.4395V20.2501H8.56078ZM15.7501 5.56077L18.4395 8.25011L16.5001 10.1895L13.8108 7.50013L15.7501 5.56077ZM12.7501 8.56079L15.4395 11.2501L7.93946 18.7501H5.25012L5.25012 16.0608L12.7501 8.56079Z"
								fill="#080341"
							></path>
						</g></svg
					></button
				>
				<button
					class="self-end"
					onclick={async () => {
						await askAbout(text);
					}}
					><svg
						width="32px"
						height="32px"
						viewBox="0 0 36 36"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						aria-hidden="true"
						role="img"
						class="iconify iconify--twemoji"
						preserveAspectRatio="xMidYMid meet"
						fill="#000000"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						></g><g id="SVGRepo_iconCarrier"
							><ellipse fill="#F4900C" cx="33.5" cy="14.5" rx="2.5" ry="3.5"></ellipse><ellipse
								fill="#F4900C"
								cx="2.5"
								cy="14.5"
								rx="2.5"
								ry="3.5"
							></ellipse><path
								fill="#FFAC33"
								d="M34 19a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v9zM7 19a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v9z"
							></path><path
								fill="#FFCC4D"
								d="M28 5c0 2.761-4.478 4-10 4C12.477 9 8 7.761 8 5s4.477-5 10-5c5.522 0 10 2.239 10 5z"
							></path><path
								fill="#F4900C"
								d="M25 4.083C25 5.694 21.865 7 18 7c-3.866 0-7-1.306-7-2.917c0-1.611 3.134-2.917 7-2.917c3.865 0 7 1.306 7 2.917z"
							></path><path
								fill="#269"
								d="M30 5.5C30 6.881 28.881 7 27.5 7h-19C7.119 7 6 6.881 6 5.5S7.119 3 8.5 3h19A2.5 2.5 0 0 1 30 5.5z"
							></path><path fill="#55ACEE" d="M30 6H6a2 2 0 0 0-2 2v26h28V8a2 2 0 0 0-2-2z"
							></path><path
								fill="#3B88C3"
								d="M35 33v-1a2 2 0 0 0-2-2H22.071l-3.364 3.364a.999.999 0 0 1-1.414 0L13.929 30H3a2 2 0 0 0-2 2v1c0 1.104-.104 2 1 2h32c1.104 0 1-.896 1-2z"
							></path><circle fill="#FFF" cx="24.5" cy="14.5" r="4.5"></circle><circle
								fill="#DD2E44"
								cx="24.5"
								cy="14.5"
								r="2.721"
							></circle><circle fill="#FFF" cx="11.5" cy="14.5" r="4.5"></circle><path
								fill="#F5F8FA"
								d="M29 25.5a2.5 2.5 0 0 1-2.5 2.5h-17a2.5 2.5 0 1 1 0-5h17a2.5 2.5 0 0 1 2.5 2.5z"
							></path><path
								fill="#CCD6DD"
								d="M17 23h2v5h-2zm-5 0h2v5h-2zm10 0h2v5h-2zM7 25.5a2.5 2.5 0 0 0 2 2.45v-4.9a2.5 2.5 0 0 0-2 2.45zm20-2.45v4.899a2.5 2.5 0 0 0 0-4.899z"
							></path><circle fill="#DD2E44" cx="11.5" cy="14.5" r="2.721"></circle></g
						></svg
					></button
				>
			{:else}
				<button class="w-max border bg-green-600 p-2 font-bold text-white" onclick={save}
					>Сохранить</button
				>
			{/if}
		</section>
	</section>
</section>
