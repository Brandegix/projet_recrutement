// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname } = useLocation();
  
    useEffect(() => {
      console.log("Navigated to:", pathname);
      
      setTimeout(() => { // Ensures execution after render
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0; // Fallback for older browsers
      }, 10); // Slight delay can help prevent race conditions
  
    }, [pathname]);
  
    return null;
  }
  

export default ScrollToTop;
