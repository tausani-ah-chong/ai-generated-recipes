import { OpenAIModelType } from '@/types';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

export const OpenAICompletionsStream = async (
  model: OpenAIModelType,
  messages: any,
) => {
  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages,
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

export const OpenAIImageGeneration = async (
  prompt: any,
) => {
  const res = await fetch(`https://api.openai.com/v1/images/generations`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      prompt,
      n: 1,
    }),
  });

  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  return res.body;
};

export const ingredientOptions = [
  'Salt',
  'Pepper',
  'Olive Oil',
  'Garlic',
  'Onions',
  'Tomatoes',
  'Potatoes',
  'Rice',
  'Pasta',
  'Bread',
  'Butter',
  'Sugar',
  'Flour',
  'Eggs',
  'Milk',
  'Cheese',
  'Yogurt',
  'Chicken Breasts',
  'Ground Beef',
  'Bacon',
  'Fish',
  'Shrimp',
  'Carrots',
  'Broccoli',
  'Spinach',
  'Lettuce',
  'Avocado',
  'Lemon',
  'Soy Sauce',
  'Ketchup',
  'Mustard',
  'Mayonnaise',
  'Peanut Butter',
  'Jelly',
  'Chocolate',
  'Vanilla',
  'Cinnamon',
  'Steak',
  'Green Beans',
  'Salmon',
  'Cauliflower',
  'Mushrooms',
];
