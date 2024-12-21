import prisma from '$lib/prisma';
import { randomUUID } from 'crypto';

export const load = async ({ cookies }) => {
	if (!cookies.get('todo-id')) {
		cookies.set('todo-id', randomUUID(), { path: '/', maxAge: 157680000 });
	}

	let cookie_id = cookies.get('todo-id');

	let notes = await prisma.note.findMany({
		where: {
			cookie_id
		},
		select: {
			id: true,
			text: true,
			timestamp: true
		},
		orderBy: {
			timestamp: 'desc'
		}
	});

	return { notes };
};
