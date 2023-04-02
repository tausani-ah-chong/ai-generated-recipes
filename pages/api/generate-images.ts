import { OpenAIImageGeneration } from '@/utils';
import endent from 'endent';

export const config = {
  runtime: 'edge',
};

const generateImages = async (req: Request): Promise<Response> => {
  const { recipeTitle } = await req.json();

  try {
    const prompt = endent`
      Influencer, from a high class magazine, high quality, Michelin star, restaurant picture of ${recipeTitle} as a meal
     `;

    const body = await OpenAIImageGeneration(prompt);

    return new Response(body);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default generateImages;
