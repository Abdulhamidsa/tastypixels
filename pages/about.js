import { fetchData } from "../database/dataFetcher";
export default function UserPage({ userData }) {
  return (
    <div>
      <h1>User Details</h1>
      {/* Map over the userData array and render each user's details */}
      {userData.map((user) => (
        <div key={user._id}>
          <h2>User ID: {user._id}</h2>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          {/* If you want to display the recipes, you can map over the recipes array */}
          <div>
            <h2>Recipes:</h2>
            {user.recipes.map((recipe, index) => (
              <p key={index}>{JSON.stringify(recipe)}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const userData = await fetchData();
  userData.forEach((user) => {
    user._id = user._id.toString();
  });
  return { props: { userData }, revalidate: 60 };
}
