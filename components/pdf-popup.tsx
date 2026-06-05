"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, FileText, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { IconButton, StickerButton } from "@/components/source-popup";

export interface PdfFileItem {
  id: string;
  name: string;
  size: number;
  file: File;
}

const PDF_BRAND = "#C8102E";
const REMOVE_ANIM_MS = 380;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

interface PdfPopupProps {
  open: boolean;
  onClose: () => void;
  files: PdfFileItem[];
  onChange: (next: PdfFileItem[]) => void;
  onAddMore: () => void; // opens the native file picker
}

// Manage popup for added PDF files. The file picker itself is native (triggered
// from the hero toolbar / the "Add more" button here); this dialog lists the
// chosen files with delete, mirroring the post popups (fixed-height scroll, a
// "More posts" pill, drop-in / puff-out animations, Lenis-proof scroll lock).
export function PdfPopup({
  open,
  onClose,
  files,
  onChange,
  onAddMore,
}: PdfPopupProps) {
  const t = useTranslations("home.sourcePopup");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const recompute = () => {
    const el = listRef.current;
    setCanScrollDown(!!el && el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  };
  useEffect(() => {
    recompute();
  }, [files.length, open]);

  // Drop-in animation for files newly added since the last render (they arrive
  // from the native picker, outside this dialog).
  const seenRef = useRef<Set<string>>(new Set());
  const [animIds, setAnimIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!open) return;
    const fresh = files.filter((f) => !seenRef.current.has(f.id)).map((f) => f.id);
    if (fresh.length === 0) return;
    fresh.forEach((id) => seenRef.current.add(id));
    setAnimIds(new Set(fresh));
    const tid = window.setTimeout(() => setAnimIds(new Set()), 700);
    return () => window.clearTimeout(tid);
  }, [files, open]);

  const [removingId, setRemovingId] = useState<string | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevHtml = html.style.overflow;
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const removeFile = (id: string) => {
    if (removingId === id) return;
    setRemovingId(id);
    window.setTimeout(() => {
      onChange(files.filter((f) => f.id !== id));
      setRemovingId((cur) => (cur === id ? null : cur));
    }, REMOVE_ANIM_MS);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-popup-heading"
      data-lenis-prevent
      className="fixed inset-0 z-50 flex animate-in fade-in items-center justify-center p-4 duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-md" />

      <div
        className="relative flex w-full max-w-[29rem] animate-in fade-in zoom-in-95 flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-[0_30px_80px_-30px_rgba(74,50,111,0.5)] duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6">
          <span
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-white"
            style={{ background: PDF_BRAND }}
          >
            <FileText className="size-[18px]" />
          </span>
          <h2
            id="pdf-popup-heading"
            className="text-[1.06875rem] font-semibold text-card-foreground"
          >
            {t("pdf.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="-mr-1 ml-auto inline-flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <X className="size-[18px]" aria-hidden />
          </button>
        </div>

        {/* Add more */}
        <div className="px-6 pt-4">
          <div className="flex justify-end">
            <StickerButton onClick={onAddMore}>
              <Plus className="mr-1 size-4" aria-hidden />
              {t("addMore")}
            </StickerButton>
          </div>
        </div>

        {/* Fixed-height list */}
        <div className="relative mx-6 mt-3.5">
          <div
            ref={listRef}
            onScroll={recompute}
            className="h-[9.5rem] overflow-y-auto overscroll-contain pr-1"
          >
            {files.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground">
                {t("noFiles")}
              </div>
            ) : (
              <ul className="flex flex-col gap-2.5 pb-1">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3",
                      animIds.has(file.id) && "animate-li-add-drop",
                      removingId === file.id &&
                        "animate-li-remove-puff pointer-events-none",
                    )}
                  >
                    <span
                      className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-white"
                      style={{ background: PDF_BRAND }}
                    >
                      <FileText className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-card-foreground/90">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                    <IconButton label={t("delete")} onClick={() => removeFile(file.id)}>
                      <Trash2 className="size-3.5" />
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {canScrollDown ? (
            <button
              type="button"
              onClick={() =>
                listRef.current?.scrollBy({
                  top: listRef.current.clientHeight * 0.8,
                  behavior: "smooth",
                })
              }
              className="absolute bottom-1 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-[0_4px_14px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-0.5"
            >
              {t("viewMore")}
              <ChevronDown className="size-3.5" />
            </button>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-3.5">
          <span className="text-[13px] font-medium text-muted-foreground">
            {t("fileCount", { count: files.length })}
          </span>
          <StickerButton onClick={onClose}>{t("done")}</StickerButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}
