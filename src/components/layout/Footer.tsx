import { ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <a href="#top" className="footer-wordmark">
        CAN—OZAN<span>© {new Date().getFullYear()}</span>
      </a>
      <span>MADE WITH INTENTION & A LITTLE TOO MUCH COFFEE.</span>
      <a href="#top" className="back-top">
        BACK TO TOP <ArrowUp size={14} />
      </a>
    </footer>
  );
}
