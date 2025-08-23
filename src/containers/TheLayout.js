import React from "react";
import TheContent from "./TheContent"
import TheSidebar from "./TheSidebar";
import TheFooter from "./TheFooter";
import TheHeader from "./TheHeader";
const TheLayout = () => {
  return (
    <div>
     
      <div className="c-app c-default-layout">
        <TheSidebar />
        <div className="c-wrapper">
          <TheHeader />
          <div className="c-body">
            <TheContent />
          </div>
          <TheFooter />
        </div>
      </div>
    </div>
  );
};

export default TheLayout;
