import prisma from '$lib/prisma';
import type { NoteBody } from '$lib/utils/interfaces.js';

export const POST = async ({ cookies, request }) => {
	let cookie_id = cookies.get('todo-id');
	let body = (await request.json()) as NoteBody;
	let response;

	if (body.noteText && cookie_id) {
		const noteData = await prisma.note.create({
			data: {
				text: body.noteText,
				cookie_id
			},
			select: {
				id: true,
				text: true,
				timestamp: true
			}
		});

		response = {
			body: JSON.stringify(noteData, null, 4),
			status: 200
		};
	} else {
		response = {
			body: JSON.stringify({ message: 'No cookies found' }, null, 4),
			status: 404
		};
	}

	return new Response(response.body, {
		headers: {
			'Content-Type': 'application/json'
		},
		status: response.status
	});
};

export const DELETE = async ({ cookies, request }) => {
	let body = await request.json();
	let id = body.id;

	let result = await prisma.note.delete({
		where: {
			id,
			cookie_id: cookies.get('todo-id')
		}
	});

	if (result) {
		return new Response(JSON.stringify({ message: 'Success' }, null, 4), {
			status: 200
		});
	}

	return new Response(JSON.stringify({ message: 'Check your cookies' }, null, 4), { status: 403 });
};

export const PUT = async ({ cookies, request }) => {
	let body = await request.json();
	let { id, text } = body;
	let timestamp = new Date();

	let result = await prisma.note.update({
		where: {
			id,
			cookie_id: cookies.get('todo-id')
		},
		data: {
			text,
			timestamp: timestamp.toISOString()
		}
	});

	if (result) {
		return new Response(JSON.stringify({ message: 'Success' }, null, 4), {
			status: 200
		});
	}

	return new Response(JSON.stringify({ message: 'Check your cookies' }, null, 4), { status: 403 });
};
