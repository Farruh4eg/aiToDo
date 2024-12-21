import Together from 'together-ai';

const together = new Together();

export const POST = async ({ request }) => {
	let prompt;
	let body = await request.json();
	let { type } = body;
	if (type === 'direct') {
		let { userInput, existingNotes } = body;
		prompt = `
      You are an AI assistant integrated into a note-taking web application. Your tasks include assisting users with the following functionalities:
      
      1. **Searching Notes:**
      When a user asks a question about their stored notes, provide relevant answers by searching through the existing notes in the app. Prioritize relevant information from the stored content.
      
      2. **Generating New Notes:**
      When a user asks a question or requests new information, generate a well-structured, concise response that can be saved as a new note. Ensure the response is clear and informative, and prompt the user to save it.
      
      3. **Answering Questions:**
      Provide accurate, helpful, and informative answers to any questions the user submits, using the app's note database as a source of reference whenever applicable. If the answer requires new information, create a suggestion for a new note. If you didn't find something user asked in his notes, you can just omit saying that you didn't find such info in his notes.
      
      **IMPORTANT:** 
      - Do not use any Markdown syntax such as "**" for bold or "*" for italics.
      - Avoid using any special formatting (like lists with "-").
      - Provide answers in plain text without any special characters for emphasis (e.g., no bold or italics).
      - Format newlines using the text "\n" for easy display in HTML.
      - When user asks you about his notes, he is sending you his notes as JSON.stringified. You can see some numbers before his notes, those are note ids in database. You can omit those numbers from your answer.

      User Input: ${userInput}
      
      Existing Notes: ${existingNotes}
  `;
	} else if (type === 'summarize') {
		let { aiAnswer } = body;
		prompt = `
      You are an AI assistant integrated into a note-taking web application. A user has asked a question, and you've provided an answer. Now, your task is to summarize this answer into a concise, structured note that can be saved in the user's note collection.

      The answer you provided is: 

      ${aiAnswer}

      Please generate a short, clear summary of this answer, formatted as a note to be saved. Do not use any special formatting, Markdown syntax, or extra characters. The note should be easy to understand and ready to be stored in the app.

      Summarized Note:
        `;
	} else {
		let { userInput } = body;
		console.log('yes');
		console.log(body);
		console.log(userInput);
		prompt = `
      You are an AI assistant integrated into a note-taking web application. The user has saved a note with the following content:
    
      ${userInput}
    
      The user now wants you to answer their question or provide useful information related to this note. Please read the note content carefully and provide a thoughtful, informative response that directly addresses the user's potential follow-up question or request.
    
      **Important Guidelines:**
      - Your response should be relevant to the content of the user's note.
      - Avoid unnecessary repetition or overly generic responses.
      - Provide practical advice, suggestions, or answer a query based on the content.
      - Your answer should be clear, concise, and easy to understand.
      - Do not use any Markdown syntax such as "**" for bold or "*" for italics.
      - Avoid using any special formatting (like lists with "-").
      - Provide answers in plain text without any special characters for emphasis (e.g., no bold or italics).
      - Format newlines using the text "\n" for easy display in HTML.
    
      Your task is to help the user by responding to their inquiry with context taken from their saved note.
      `;
	}

	const stream = await together.chat.completions.create({
		model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
		messages: [{ role: 'user', content: prompt }],
		stream: false,
		temperature: 0.2
	});

	return new Response(JSON.stringify(stream), {
		status: 200
	});
};
