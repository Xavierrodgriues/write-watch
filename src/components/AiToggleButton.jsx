import { useState } from "react";

const AiToggleButton = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsActive((prev) => !prev);
    // Optionally call DisplayContent here if needed
    // DisplayContent();
  };

  return (
    <div className="" onClick={handleToggle}>
      <div className="group relative">
        <a
          href="#"
          title="Press to toggle Special Offers"
          className={`relativebtn--special outline-none inline-block p-4 text-sm mr-0 mx-md-4 font-semibold text-white border-2 rounded-lg hover:text-white active:text-white hover:bg-purple-800 active:bg-purple-800 ${
            isActive ? "bg-purple-800" : "bg-purple-600"
          }`}
        >
          <i className="far fa-badge-dollar mr-1" aria-hidden="true"></i> Enhance with AI ✨
        </a>
        <span className="border rounded border-red-100 bg-red-50 py-1 px-3 text-red-600 text-xs pointer-events-none absolute -top-12 left-0 w-60 opacity-0 transition-opacity group-hover:opacity-100">
          Your original content will be replaced by AI, do at your own risk.
        </span>
      </div>
    </div>
  );
};

export default AiToggleButton;
