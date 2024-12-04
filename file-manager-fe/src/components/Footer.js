import React from "react";
import "./../assets/components/Footer.scss";

const Footer = () => (
  <footer className="footer">
    <div className="text-center">
      &copy; {new Date().getFullYear()} File Manager. All Rights Reserved.
    </div>
  </footer>
);

export default Footer;
