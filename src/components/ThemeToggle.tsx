import { useContext } from "react";
import { GlobalContext } from "./ThemeProvider";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(GlobalContext);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      type="text"
      icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      className="flex items-center gap-2"
      style={{
        color: theme === "dark" ? "#fff" : "#000",
        fontSize: 22,
      }}
    />
  );
}
