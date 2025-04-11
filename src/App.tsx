// App.tsx
import ThemeProvider from "@/components/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import router from "./route";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
