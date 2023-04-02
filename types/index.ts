export type OpenAIModelType = 'gpt-3.5-turbo' | 'gpt-4';

export type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
}