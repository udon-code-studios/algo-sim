import { Link } from "remix";

export default function Index() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center space-y-4 bg-gray-500">
      <h1 className="mt-4 text-4xl font-bold">Welcome to AlgoSim!</h1>
      <Link to="/add">
        <div className="rounded-xl bg-teal-400 p-4 text-2xl font-bold shadow-2xl duration-200 hover:bg-teal-900 hover:text-teal-200">
          Click me to add numbers.
        </div>
      </Link>
    </div>
  );
}
