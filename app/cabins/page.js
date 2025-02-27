import Counter from "../_components/Counter";

export const metadata = {
  title: {
    template: "%s | Cabins",
    default: "Cabins",
  },
};

async function cabins() {
  return (
    <div>
      <h1>Cabins</h1>
      <Counter />
    </div>
  );
}

export default cabins;
