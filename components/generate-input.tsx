import { ingredientOptions } from "@/utils";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { FunctionComponent } from "react";

type GenerateInputProps = {
  selectedIngredients: string[];
  onChange: (value: string[]) => void;
  onClickGenerate: () => void;
  onClickReset: () => void;
  loading: boolean;
}

const GenerateInput: FunctionComponent<GenerateInputProps> = (props) => {
  const { selectedIngredients, onChange, onClickGenerate, onClickReset, loading } = props;

  return (
    <div className='justify-center items-center md:py-24 md:px-96 flex space-y-2'>
      <div className='w-full'>
        <div>
          <Stack spacing={3}>
            <Autocomplete
              multiple
              id="tags-standard"
              freeSolo
              options={ingredientOptions}
              value={selectedIngredients}
              onChange={(_, newValue) => {
                onChange(newValue);
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
        <button 
          className="bg-blue-500 disabled:bg-slate-500 disabled:cursor-not-allowed max-w-xs hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" 
          onClick={onClickGenerate}
          disabled={loading}
        >
            Generate recipes
        </button>
        {selectedIngredients.length > 0 && (
          <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={onClickReset}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  </div>
  )
}

export default GenerateInput;
