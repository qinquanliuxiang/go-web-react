import { useState } from "react";

function TestCssPage() {
  const handleClick = () => {
    console.log("Button clicked");
  };
  const aHandleClick = () => {
    console.log("Link clicked");
    window.open("https://www.baidu.com", "_blank");
  };
  const [value, setValue] = useState("");
  return (
    <div className="flex text-blue-300 text-[20px] gap-x-[100px] m-4">
      <div className="grow">
        <button
          className="min-w-[80px] py-2 bg-blue-500 text-white rounded-xl hover:bg-cyan-300 cursor-pointer"
          onClick={handleClick}
        >
          首页
        </button>
      </div>
      <input
        className="grow border-3 rounded-xl pl-3 min-w-[200px] max-w-[400px]"
        type="text"
        placeholder="请输入内容"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <div className="grow flex items-center justify-center">
        <button
          className="bg-blue-500 rounded-xl text-white cursor-pointer min-w-[80px] hover:bg-cyan-300 py-2"
          onClick={aHandleClick}
        >
          跳转
        </button>
      </div>
    </div>
  );
}
export default TestCssPage;
