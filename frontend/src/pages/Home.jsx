import { useGetAllCurrentUserQuery } from "../redux/api/userSlice";

function Home() {
  const { data: user, error, isLoading } = useGetAllCurrentUserQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <p>Email: {user?.userName}</p>
    </div>
  );
}

export default Home;
