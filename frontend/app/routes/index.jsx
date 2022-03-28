import { Link } from "remix";

export default function Index() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center space-y-4 bg-gray-500">
      <h1 className="mt-4 text-4xl font-bold">Welcome to AlgoSim!</h1>
      <Link to="/add">
        <div className="min-w-[22rem] rounded-xl bg-teal-400 p-4 text-center text-2xl font-bold shadow-2xl duration-200 hover:bg-teal-900 hover:text-teal-200">
          Click me to add numbers.
        </div>
      </Link>
      <Link to="/graph">
        <div className="min-w-[22rem] rounded-xl bg-teal-400 p-4 text-center text-2xl font-bold shadow-2xl duration-200 hover:bg-teal-900 hover:text-teal-200">
          Click me to see graphs.
        </div>
      </Link>
    </div>
  );
}
