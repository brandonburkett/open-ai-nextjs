import { Configuration, OpenAIApi } from "openai";

// init openai
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Endpoint
 */
export default async function (req, res) {
  if (!configuration.apiKey) {
    return res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
  }

  // TODO: input validation
  console.log(req.body);
  return res.status(500).json({ error: { message: 'Not implemented' } });

  try {
    const completion = await openai.createChatCompletion({
      // pricing; https://platform.openai.com/docs/models/gpt-3
      // model: "text-davinci-003",
      model: req.body.model, // $0.0005 / 1K tokens
      prompt: generatePrompt(req.text),
      temperature: req.body.temperature, // variation
    });

    console.log(completion);

    return res.status(200).json({ result: completion.data.choices[0].text, raw: completion });
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

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
