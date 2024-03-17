import { Link } from "@remix-run/react";

export default function AdminIndex() {
  return (
    <Link to="new" className="text-xl">
      <div className="bg-blue-500 hover:bg-blue-100  p-5 text-white hover:text-blue-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        Create a new post
      </div>
    </Link>
  );
}
