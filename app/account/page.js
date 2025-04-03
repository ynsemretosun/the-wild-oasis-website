import Navigation from "../_components/Navigation";
import { auth } from "../_lib/auth";

async function page() {
  const session = await auth();
  const firstname = session.user.name.split(" ")[0];
  return (
    <div>
      <h2 className="text-accent-400 font-semibold text-2xl mb-7">
        Welcome, {firstname}
      </h2>
    </div>
  );
}

export default page;
