async function processUserInput(input, api) {
    try {
        if (typeof api !== 'object' || !api.createCompletion) {
            throw new Error('Некорректный объект API');
        }

        const response = await api.createCompletion({
            model: 'text-davinci-003', // Выберите подходящий для вас вариант модели
            prompt: input,
            temperature: 0.9,
            max_tokens: 1000, // Максимальное количество токенов в ответе
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: ["You:"]
        });
  
        if (Array.isArray(response.data.choices) && response.data.choices.length > 0) {
            // Ожидается, что response.data.choices[0].input является строкой
            return response.data.choices[0].input;
        } else {
            throw new Error('Некорректный формат ответа');
        }
    } catch (error) {
        console.error('Ошибка при взаимодействии с ChatGPT:', error);
        return 'Произошла ошибка при обработке вашего запроса.';
    }
}

module.exports = {
    processUserInput
};