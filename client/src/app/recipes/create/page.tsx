import { Box } from "@mui/material";

import CreateRecipeForm from "@/components/CreateRecipeForm";
import TitleHeader from "@/components/TitleHeader";

const CreateRecipePage = () => {
  return (
    <Box>
      <TitleHeader title="CREATE RECIPE" />
      <Box className="flex min-h-[300px] items-center justify-center p-8">
        <CreateRecipeForm />
      </Box>
    </Box>
  );
};

export default CreateRecipePage;
