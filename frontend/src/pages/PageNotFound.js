import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="flex h-80 flex-col items-center justify-center space-y-5 font-mono text-xl">
      <pre>404 (page not found)</pre>
      <Link to="/" className="text-sm underline">
        click me to go Home
      </Link>
    </div>
  );
}
