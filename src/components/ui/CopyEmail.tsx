"use client";

import { Check, Copy } from "lucide-react";
import { useCopyEmail } from "@/hooks/useCopyEmail";
import { siteConfig } from "@/data/siteConfig";

export function CopyEmail() {
  const { status, copy } = useCopyEmail();
  return (
    <div className="copy-email-control">
      <button
        className="interaction-button"
        onClick={() => void copy()}
        data-cursor="COPY"
      >
        {status === "copied" ? (
          <>
            COPIED <Check size={15} />
          </>
        ) : (
          <>
            COPY EMAIL <Copy size={15} />
          </>
        )}
      </button>
      <span className="sr-only" role="status">
        {status === "copied"
          ? "Email address copied."
          : status === "manual"
            ? "Select and copy the email address below."
            : ""}
      </span>
      {status === "manual" && (
        <label className="copy-fallback">
          Select and copy manually
          <input
            aria-label="Email address to copy"
            readOnly
            value={siteConfig.email}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
