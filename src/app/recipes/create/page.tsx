import CreateRecipeForm from '@/components/CreateRecipeForm';
import TitleHeader from '@/components/TitleHeader';

const CreateRecipePage = () => {
  return (
    <>
      <TitleHeader title="CREATE RECIPE" />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
        padding: 30,
      }}>
        <CreateRecipeForm />
      </div>
    </>
  );
};

export default CreateRecipePage;