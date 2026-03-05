import React from "react";

const Footer = () => {
  return (
    <footer className="text-center py-4 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">
      © {new Date().getFullYear()} Neon Blog. All rights reserved.
    </footer>
  );
};

export default Footer;
