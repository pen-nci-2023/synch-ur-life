// app/root.jsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useCatch,
  Link,
  useLocation,
} from "@remix-run/react";
import Calendar from './components/Calendar/Calendar'; // Make sure the path is correct

// Define the links function to include additional resources
export const links = () => [
  { rel: "stylesheet", href: "/css/style.css"}, // Adjust the path as needed
  // You can include more resources here
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links /> {/* This will include links defined in your `links` function */}
      </head>
      <body>
        <h1>Sync-Ur-Life</h1>
        
        {/* Include the Calendar component here */}
        <Calendar year={2024} month={1} />
        
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
