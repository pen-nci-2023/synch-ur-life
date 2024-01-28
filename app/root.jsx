import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";
import Calendar from './components/Calendar/Calendar'; // Make sure the path is correct

export default function App() {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
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
