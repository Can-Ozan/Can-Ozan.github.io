import { ArrowUp } from "lucide-react";
import { LocalTime } from "@/components/ui/LocalTime";

export function Footer() {
  return (
    <footer className="site-footer">
      <a href="#top" className="footer-wordmark">
        CAN—OZAN<span>© {new Date().getFullYear()}</span>
      </a>
      <LocalTime />
      <a href="#top" className="back-top">
        BACK TO TOP <ArrowUp size={14} />
      </a>
    </footer>
  );
}
