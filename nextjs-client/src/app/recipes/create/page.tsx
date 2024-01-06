import CreateRecipeForm from '@/components/CreateRecipeForm';
import TitleHeader from '@/components/TitleHeader';

import styles from './page.module.css';

const CreateRecipePage = () => {
  return (
    <>
      <TitleHeader title="CREATE RECIPE" />
      <div className={styles.maincontainer}>
        <CreateRecipeForm />
      </div>
    </>
  );
};

export default CreateRecipePage;