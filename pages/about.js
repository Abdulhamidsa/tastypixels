import { fetchData } from "../database/dataFetcher";
export default function UserPage({ userData }) {
  return (
    <div>
      <h1>User Details</h1>
      {/* Map over the userData array and render each user's details */}
      {userData.map((user, index) => (
        <div key={index}>
          <h2>User ID: {user._id}</h2>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Created At: {user.createdAt}</p>
          <div>
            <h2>Recipes:</h2>
            {user.recipes && Array.isArray(user.recipes) && user.recipes.map((recipe, index) => <p key={index}>{JSON.stringify(recipe)}</p>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const userData = await fetchData();
  userData.forEach((user) => {
    // Convert ObjectId to string
    user._id = user._id.toString();
    console.log(userData);
    // Convert Date to string
    if (user.createdAt) {
      user.createdAt = user.createdAt.toISOString();
    }

    // Convert ObjectIds in recipes to strings
    if (user.recipes) {
      user.recipes.forEach((recipe) => {
        if (recipe._id) {
          recipe._id = recipe._id.toString();
        }
      });
    }
  });
  return { props: { userData }, revalidate: 60 };
}
