import { userActions } from "@/actions";
import TitleHeader from "@/components/TitleHeader";

interface ProfilePageParams {
  params: {
    id: string;
  }
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const user = await userActions.findById(parseFloat(params.id));
  
  return (
    <div>
      <TitleHeader title={`PROFILE OF ${user?.username}`.toUpperCase()} />
    </div>
  );
};

export default ProfilePage;