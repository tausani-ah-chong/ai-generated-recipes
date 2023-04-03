import Head from 'next/head'
import { useState } from 'react';
import TopBar from '@/components/top-bar';
import Header from '@/components/header';
import GenerateInput from '@/components/generate-input';
import LoadingComponent from '@/components/loading-component';
import Recipes from '@/components/recipes';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [outputRecipes, setOutputRecipes] = useState<string>('');
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');

  const handleGenerateImage = async (recipeTitle: string, itemNumber: number) => {
    setLoading(true);

    setProgressText(`Generating images from DALL-E: ${itemNumber} / 3`)

    const controller = new AbortController();

    const body = {
      recipeTitle,
    };

    const response = await fetch('/api/generate-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data: any = await response.json();

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    return data.data[0].url;
  };

  const handleGetRecipes = async () => {
    if (selectedIngredients.length === 0) {
      alert('Please enter some ingredients.');
      return;
    }

    setLoading(true);
    setOutputRecipes('');
    setProgressText('Generating recipes...')

    const controller = new AbortController();

    const body = {
      selectedIngredients,
    };

    const response = await fetch('/api/get-recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputRecipes(code);
    }
    
    const image1 = await handleGenerateImage(JSON.parse(code).recipes[0].title, 1)
    const image2 = await handleGenerateImage(JSON.parse(code).recipes[1].title, 2)
    const image3 = await handleGenerateImage(JSON.parse(code).recipes[2].title, 3)

    setImageURL([image1, image2, image3])
    setLoading(false);
    setHasTranslated(true);
    setProgressText('');
  };

  const handleClickGenerate = () => {
    handleGetRecipes()
  }

  const handleClickReset = () => {
    setLoading(false);
    setSelectedIngredients([]);
    setOutputRecipes('');
    setHasTranslated(false);
    setProgressText('');
  }

  return (
    <>
      <Head>
        <title>AI-Generated Recipes</title>
        <meta name="description" content="AI what's for tea?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='justify-center items-center p-4 lg:p-20 flex-col min-h-screen bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-sky-700 via-indigo-950 to-slate-950'>
        {!loading && !hasTranslated && <TopBar />}
        {!loading && !hasTranslated && <Header />}
        <GenerateInput 
          onChange={(newValue) => setSelectedIngredients(newValue)}
          onClickGenerate={handleClickGenerate}
          onClickReset={handleClickReset}
          selectedIngredients={selectedIngredients}
          loading={loading}
        />
        {loading && (
          <LoadingComponent progressText={progressText} />
        )}
        {!loading && hasTranslated && (  
          <Recipes
            recipes={JSON.parse(outputRecipes).recipes}
            imageURL={imageURL}
          />
        )}
      </main>
    </>
  )
}
