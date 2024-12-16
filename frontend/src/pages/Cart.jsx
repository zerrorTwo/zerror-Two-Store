import { useGetCurrentUserQuery } from "../redux/api/userSlice";

function Cart() {
  const { data: user, error, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <p>Email: {user?.userName}</p>
    </div>
  );
}

export default Cart;
