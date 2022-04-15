import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-80 text-xl font-mono space-y-5">
      <pre>404 (page not found)</pre>
      <Link to="/" className="underline text-sm">
        click me to go Home
      </Link>
    </div>
  );
}