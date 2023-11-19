import { userActions } from "@/actions";

const UserPage = async () => {
  const users = await userActions.getAll();
  
  return (
    <div>
      <h1>User Page</h1>
      {users?.map((user) => (
        <span key={user.id}>{user.email}</span>
      ))}
    </div>
  );
};

export default UserPage;