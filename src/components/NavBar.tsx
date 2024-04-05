import { NavLink } from "react-router-dom";

const links = ["/", "tag", "article"];

export function NavBar() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${links.length}, 50px)`,
        border: "1px solid black",
        padding: 4,
      }}
    >
      {links.map((link) => (
        <Link key={link} to={link} />
      ))}
    </div>
  );
}

function Link(props: { to: string }) {
  return (
    <NavLink
      style={(p) => ({
        textDecoration: p.isActive ? "none" : undefined,
      })}
      to={props.to}
    >
      {props.to}
    </NavLink>
  );
}
