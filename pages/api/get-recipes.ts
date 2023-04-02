import { OpenAICompletionsStream } from '@/utils';
import endent from 'endent';

export const config = {
  runtime: 'edge',
};

const getRecipes = async (req: Request): Promise<Response> => {
  const { selectedIngredients } = await req.json();

  try {
    const prompt = endent`
      You are an expert culinary chef and how to come up with recipes that are easy for others to read and make. You will come up with 3 recipes based only these ${selectedIngredients} you have available
      Requirements:

      - You will return a list of 3 recipes
      - Each recipe must have a title
      - Each recipe must have a list of ingredients
      - Each recipe must have a list of instructions
      - Each recipe must be unique
      - Each recipe has to include all ingredients selected
      - Please format your recipes in JSON format:
      
      Example with ingredients Mince, Mushroom, spinach:

      {
        recipes: [
          {
            "title": "Mince and Mushroom Pasta",
            "ingredients": [
              "Mince",
              "Mushroom",
              "Spinach",
              "Pasta"
            ],
            "instructions": [
              '1. Put pasta in boiling water \n',
              '2. Fry mince and mushroom \n',
            ]
          }
        ]
      }
     `;

    const messages = [{ role: 'system', content: prompt }];

    const stream = await OpenAICompletionsStream('gpt-3.5-turbo', messages);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default getRecipes;
