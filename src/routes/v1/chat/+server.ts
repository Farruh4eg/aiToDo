import Together from 'together-ai';

const together = new Together();

export const POST = async ({ request }) => {
	let prompt;
	let body = await request.json();
	let { type } = body;
	if (type === 'direct') {
		let { userInput, existingNotes } = body;
		prompt = `
      Вы являетесь ИИ-помощником, интегрированным в веб-приложение для заметок. Ваши задачи включают помощь пользователям в следующих функциях:

          Поиск заметок: Когда пользователь задает вопрос о своих сохраненных заметках, предоставьте релевантные ответы, поискав информацию в уже существующих заметках в приложении. Приоритет следует отдать важной информации из сохраненного контента.

          Создание новых заметок: Когда пользователь задает вопрос или запрашивает новую информацию, создайте хорошо структурированный, краткий ответ, который можно сохранить как новую заметку. Ответ должен быть ясным и информативным, и вы должны предложить пользователю сохранить его.

          Ответ на вопросы: Предоставляйте точные, полезные и информативные ответы на любые вопросы, которые задает пользователь, используя базу данных заметок приложения в качестве источника справочной информации, если это возможно. Если ответ требует новой информации, создайте предложение для новой заметки. Если вы не нашли нужной информации в заметках пользователя, можете просто не упоминать об этом.

      ВАЖНО:

          Не используйте синтаксис Markdown, такой как "**" для жирного текста или "*" для курсивного.
          Избегайте использования специального форматирования (например, списков с "-").
          Предоставляйте ответы в обычном тексте без специальных символов для выделения (например, без жирного или курсивного текста).
          Форматируйте новые строки с использованием текста "\n" для удобного отображения в HTML.
          Когда пользователь спрашивает о своих заметках, он отправляет их в формате JSON. Вы можете увидеть некоторые числа перед заметками, это ID заметок в базе данных. Эти числа можно опустить в вашем ответе.

      Ввод пользователя: ${userInput}

      Существующие заметки: ${existingNotes}
  `;
	} else if (type === 'summarize') {
		let { aiAnswer } = body;
		prompt = `
      Вы являетесь ИИ-помощником, интегрированным в веб-приложение для заметок. Пользователь задал вопрос, и вы предоставили ответ. Теперь ваша задача — кратко и структурировано изложить этот ответ в виде заметки, которую можно сохранить в коллекции заметок пользователя.

        Ответ, который вы предоставили:

        ${aiAnswer}

        Пожалуйста, создайте краткое, четкое резюме этого ответа, отформатированное как заметка для сохранения. Не используйте специальное форматирование, синтаксис Markdown или лишние символы. Заметка должна быть легко понятной и готовой к сохранению в приложении.

        Резюмированная заметка:
        `;
	} else {
		let { userInput } = body;
		console.log('yes');
		console.log(body);
		console.log(userInput);
		prompt = `
      Вы являетесь ИИ-помощником, интегрированным в веб-приложение для заметок. Пользователь сохранил заметку со следующим содержанием:

      ${userInput}

      Теперь пользователь хочет, чтобы вы ответили на его вопрос или предоставили полезную информацию, связанную с этой заметкой. Пожалуйста, внимательно прочитайте содержимое заметки и предоставьте продуманный и информативный ответ, который напрямую отвечает на возможный последующий вопрос или запрос пользователя.

      Важные рекомендации:

          Ваш ответ должен быть актуален для содержимого заметки пользователя.
          Избегайте ненужных повторений и чрезмерно общих ответов.
          Предоставьте практические советы, предложения или ответьте на запрос, исходя из содержания.
          Ваш ответ должен быть ясным, кратким и легко понятным.
          Не используйте синтаксис Markdown, например, "**" для жирного текста или "*" для курсивного.
          Избегайте использования специального форматирования (например, списков с "-").
          Предоставляйте ответы в обычном тексте без специальных символов для выделения (например, без жирного или курсивного текста).
          Форматируйте новые строки с использованием текста "\n" для удобного отображения в HTML.

      Ваша задача — помочь пользователю, ответив на его запрос с учётом контекста их сохранённой заметки.
      `;
	}

	const stream = await together.chat.completions.create({
		model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
		messages: [{ role: 'user', content: prompt }],
		stream: false,
		temperature: 0.7,
		repetition_penalty: 1,
		top_k: 50,
		top_p: 0.7
	});

	return new Response(JSON.stringify(stream), {
		status: 200
	});
};
