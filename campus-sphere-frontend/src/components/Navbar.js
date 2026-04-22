import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <Link to="/">Home</Link> |{" "}
      <Link to="/deadlines">Deadlines</Link> |{" "}
      <Link to="/lostfound">Lost & Found</Link> |{" "}
      <Link to="/expenses">Expenses</Link>
    </div>
  );
}

export default Navbar;