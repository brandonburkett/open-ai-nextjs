import { Configuration, OpenAIApi } from "openai";

// init openai
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * OpenAI createChatCompletion endpoint
 *
 * DOCS
 * @see https://platform.openai.com/docs/api-reference/chat
 *
 * PRICING
 * @see https://platform.openai.com/docs/models/gpt-3
 */
export default async function (req, res) {
  if (!configuration.apiKey) {
    return res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
  }

  // TODO: actual validation
  const model = ['gpt-3.5-turbo', 'text-davinci-003'].includes(req.body.model) ? req.body.model : 'gpt-3.5-turbo';
  const temperature = parseFloat(req.body.temperature);
  const systemMsg = req.body.systemMsg || '';
  const userMsg = req.body.userMsg || '';

  try {
    const completion = await openai.createChatCompletion({
      // see pricing in openai docs
      model: model,

      // 0 - 2 in steps of 0.1 - determines randomness / variation
      temperature: temperature,

      messages: [
          {'role': 'system', 'content': systemMsg},
          {"role": 'user', 'content': userMsg},
      ]
    });

    console.log(completion);

    return res.status(200).json({ choice: completion.data.choices[0], raw: completion.data });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }

    console.error(`Error with OpenAI API request: ${error.message}`);
    return res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
}
