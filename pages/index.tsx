import Head from 'next/head'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [imageURL, setImageURL] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [outputRecipes, setOutputRecipes] = useState<string>('');
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');

  const handlePressImage = (index: number) => {
    window.open(imageURL[index], '_blank');
  }

  const ingredientOptions = [
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
    setProgressText('Generating recipes')

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
    setShowCards(true);
    setProgressText('');
  };

  const handleClickGenerate = () => {
    handleGetRecipes()
  }

  const handleClickReset = () => {
    setLoading(false);
    setShowCards(false);
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
      <main className='justify-center items-center p-10 flex-col h-screen bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-sky-950 via-indigo-950 to-slate-950'>
        <div className='flex justify-between'>
          <h1 className='font-bold text-sm font-sans tracking-tight text-white'>
            AI-Generated Recipes
          </h1>
          <div className='flex justify-center items-center space-x-2 cursor-pointer' onClick={() => window.open('https://twitter.com/tausani93')}>
            <Image 
              className="rounded-full"
              width={72}
              height={72}
              src='/tausani.jpg'
              alt='Tausani'
            />
            <div className='justify-center items-center'>
              <h1 className='text-sm font-bold font-sans tracking-tight text-white'>
                Tausani
              </h1>
              <h1 className='text-sm font-sans tracking-tight text-white'>
                @tausani93
              </h1>
            </div>
          </div>
        </div>
        <div className='justify-center items-center py-10 flex'>
          <h1 className='text-4xl font-bold font-sans tracking-tight text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text sm:text-6xl text-center max-w-screen-md'>
            Taste the Future: AI-Generated Recipes
          </h1>
        </div>
        <div className='justify-center items-center p-24 flex-col space-y-2'>
          <div>
            <Stack spacing={3}>
              <Autocomplete
                multiple
                id="tags-standard"
                freeSolo
                options={ingredientOptions}
                value={selectedIngredients}
                onChange={(event, newValue) => {
                  setSelectedIngredients(newValue);
                }}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    sx={{ backgroundColor: 'white', borderRadius: '10px' }}
                    placeholder={selectedIngredients.length === 0 ? 'Add ingredients' : ''}
                  />
                )}
              />
            </Stack>
          </div>
          <div className='justify-left items-center py-4 flex space-x-2'>
            <div 
              className="bg-blue-500 max-w-xs hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer" 
              onClick={handleClickGenerate}
            >
                Generate recipes
            </div>
            {selectedIngredients.length > 0 && (
              <div 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer"
                onClick={handleClickReset}
              >
                Reset
              </div>
            )}
          </div>
        </div>
        {loading && (
          <div className='justify-center items-center flex-col space-y-5'>
            <div>
              <LinearProgress sx={{ textAlign: 'center' }} />
            </div>
            <p className="font-sans italic text-slate-500">
              {progressText}
            </p>
            <p className="text-slate-500 font-sans italic">
              ...please allow a couple minutes
            </p>
          </div>
        )}
        {showCards && !loading && hasTranslated && (  
          <div className='cursor-pointer'>
            <Grid container spacing={3}>
              {JSON.parse(outputRecipes).recipes.map((card: any, index: number) => (
                <Grid item key={card.title} xs={12} sm={6} md={4}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    {!imageURL[index] 
                      ? (
                        <p>...generating image</p>
                      )
                      : (
                        <CardMedia
                          component="img"
                          image={imageURL[index]}
                          alt="random"
                          onClick={() => handlePressImage(index)}
                        />
                      )
                    }
                    <div className='p-4 space-y-2'>
                      <p className="text-black font-sans text-4xl">
                        {card.title}
                      </p>
                      {card.instructions.map((instruction: string) => (
                        <p className="text-black font-sans" key={instruction.slice(0)}>
                          {instruction}
                        </p>
                      ))}
                    </div>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </main>
    </>
  )
}
