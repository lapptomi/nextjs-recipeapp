/* eslint-disable no-null/no-null */
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { AccessTime, Add, CloudUpload, Delete, Description, DiningRounded, Group, Title } from '@mui/icons-material';
import { Alert, Button, FormControl, IconButton, InputAdornment, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useFieldArray, useForm } from 'react-hook-form';

import { recipeActions } from '@/actions';

import styles from '../styles/CreateRecipeForm.module.css';
import { NewRecipeSchema } from '../types';

import type { NewRecipe } from '../types';

const CreateRecipeForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<NewRecipe>({
    defaultValues: {
      title: '',
      description: '',
      // TODO: change ingredients to string[] instead of object[]
      ingredients: [{ ingredient: 'Add ingredient...'}],
      instructions: '',
      cookingTime: 0,
      servings: 0,
      image: null,
    },
    resolver: zodResolver(NewRecipeSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "ingredients",
  });

  const handleAddIngredient = (event: any) => {
    append({ ingredient: event.target.value });
  };

  const selectedImage = watch('image');

  const handleFormSubmit = (data: NewRecipe) => {
    const formData = new FormData();
    formData.append('image', selectedImage as any);

    recipeActions.create(data, formData)
      .then((recipe) => {
        window.location.replace(`/recipes/${recipe.id}`);
      })
      .catch((error) => {
        window.alert(`Something went wrong! ${error.message}`);
      });
  };

  return (
    <form
      className={styles.formcontainer}
      onSubmit={handleSubmit(handleFormSubmit, (error) => console.log('ERROR = ', error))}
    >
      <Stepper activeStep={0} alternativeLabel style={{ width: '100%' }}>
        {['Recipe Info', 'Settings', 'Confirm'].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant="overline">
        create new recipe
      </Typography>

      <TextField
        required
        error={!!errors.title}
        helperText={errors.title?.message}
        fullWidth
        label="Recipe Title"
        size="small"
        placeholder='Title'
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Title />
            </InputAdornment>
          ),
        }}
        {...register('title')}
      />
      <TextField
        fullWidth
        label="Description (optional)"
        size="small"
        placeholder='Description'
        error={!!errors.description}
        helperText={errors.description?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Description />
            </InputAdornment>
          ),
        }}
        {...register('description')}
      />

      <FormControl style={{ width: '100%' }}>
        <Typography variant="overline">
          Ingredients
        </Typography>
        {fields.map((item, index) => {
          const showError = (
            errors.ingredients?.[index]?.ingredient?.message !== undefined
            && errors.ingredients?.[index] !== undefined
          );
          return (
            <TextField
              sx={{ marginTop: 1 }}
              key={index}
              required
              error={showError}
              helperText={errors.ingredients?.[index]?.ingredient?.message}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DiningRounded />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => remove(index)}>
                      <Delete />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register(`ingredients.${index}.ingredient`)}
            />
          );
        })}
        <Button size="small" onClick={handleAddIngredient}>
          <Add color="primary" />
          <Typography variant="caption">ADD INGREDIENT</Typography>
        </Button>
      </FormControl>

      <TextField
        error={!!errors.instructions}
        helperText={errors.instructions?.message}
        required
        fullWidth
        label="Instructions"
        size="small"
        placeholder='Instructions'
        multiline
        minRows={6}
        {...register('instructions')}
      />

      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly' }}>
        {/* TODO: Change minutes to time picker */}
        <TextField
          size="small"
          label="Cooking time (minutes)"
          placeholder='Title'
          type="number"
          defaultValue={0}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTime />
              </InputAdornment>
            ),
          }}
          {...register('cookingTime', { valueAsNumber: true })}  
        />
        
        <TextField
          size="small"
          label="Servings"
          placeholder='Servings'
          type="number"
          defaultValue={0}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Group />
              </InputAdornment>
            ),
          }}
          {...register('servings', { valueAsNumber: true })}
        />
      </div>

      <div className={styles.formimagecontainer}>
        <Typography variant="caption" color="error">
          {errors.image && errors.image.message}
        </Typography>
        <Button component="label" startIcon={<CloudUpload />}>
          <Typography variant="subtitle1">Upload recipe image</Typography>
          <input  
            type="file"
            hidden
            accept="image/png, image/jpeg"
            {...register('image')}
            onChange={(event: any) => setValue('image', event.target.files[0])}
          />
        </Button>
        {selectedImage && (
          <div>
            <Image
              alt="recipe image"
              width={100}
              height={100}
              src={URL.createObjectURL(selectedImage as any)}
            />
            <IconButton size="large">
              <Delete onClick={() => {
                setValue('image', null);
                clearErrors('image');
              }} />
            </IconButton>
          </div>
        )}
        <Typography variant="caption">
          {selectedImage && selectedImage.name}
        </Typography>
      </div>

      {Object.keys(errors).length !== 0 && (
        <Alert severity="error">
          Please fill in all required fields
        </Alert>
      )}

      <div>
        <Button color="error">Cancel</Button>
        <Button variant="contained" type="submit">Next</Button>
      </div>
    </form>
  );
};

export default CreateRecipeForm;