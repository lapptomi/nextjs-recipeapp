import CreateRecipeForm from "@/components/CreateRecipeForm";
import TitleHeader from "@/components/TitleHeader";

const CreateRecipePage = () => {
  return (
    <div>
      <TitleHeader title="CREATE RECIPE" />
      <div className="flex min-h-[300px] items-center justify-center p-8">
        <CreateRecipeForm />
      </div>
    </div>
  );
};

export default CreateRecipePage;
