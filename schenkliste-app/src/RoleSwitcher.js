import React from "react";

const RoleSwitcher = ({ role, setRole }) => {
  return (
    <div className="role-switcher">
      <button
        onClick={() => setRole("wuenscher")}
        className={role === "wuenscher" ? "active" : ""}
      >
        Wünscher
      </button>
      <button
        onClick={() => setRole("schenker")}
        className={role === "schenker" ? "active" : ""}
      >
        Schenker
      </button>
    </div>
  );
};

export default RoleSwitcher;
