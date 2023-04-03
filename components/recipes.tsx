import { FunctionComponent } from "react";
import Image from "next/image";
import { Recipe } from "@/types";

type RecipesProps = {
  recipes: Recipe[];
  imageURL: string[];
}

const Recipes: FunctionComponent<RecipesProps> = (props) => {
  const { recipes, imageURL } = props;

  const handlePressImage = (index: number) => window.open(imageURL[index], "_blank");

  return (
    <div className='md:flex justify-center rounded-lg space-x-4'>
      {recipes.map((recipe, index) => (
        <div key={index} className='relative rounded-lg cursor-pointer overflow-hidden group' title={recipe.title}>
          <div className='opacity-100 md:group-hover:opacity-40 bg-opacity-90 duration-300 object-cover'>
            <Image
              height={500}
              width={500}
              src={imageURL[index]}
              alt={`AI generated image of ${recipe.title}`}
              onClick={() => handlePressImage(index)}
            />
          </div>
          <div className='md:absolute flex-col space-y-2 md:opacity-0 group-hover:opacity-100 top-0 left-0 px-6 py-4'>
            <h1 className='font-bold text-lg font-sans tracking-tight text-white'>{recipe.title}</h1>
            <div>
              {recipe.ingredients.map((ingredient: any, index: number) => (
                <div key={index}>
                  <p className='text-sm font-sans text-white'>{`• ${ingredient}`}</p>
                </div>
              ))}
            </div>
            <div>
              {recipe.instructions.map((instruction: any, index: number) => (
                <p key={index} className='text-sm font-sans tracking-tight text-white'>{instruction}</p>
              ))}
            </div>
          </div>
        </div>
        )
      )}
    </div>
  )
}

export default Recipes;
