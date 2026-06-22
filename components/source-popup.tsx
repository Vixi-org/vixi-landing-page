"use client";

import {
  type KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { LinkedinGlyph, XGlyph } from "@/components/source-glyphs";

export interface SourcePost {
  id: string;
  content: string;
}

export type PostSourceType = "linkedin" | "twitter";

// Per-type config: which glyph + brand color tints the header badge + list
// rows, and which i18n sub-namespace holds the copy.
const CFG: Record<
  PostSourceType,
  { Glyph: typeof LinkedinGlyph; brand: string; i18nKey: "linkedin" | "x" }
> = {
  linkedin: { Glyph: LinkedinGlyph, brand: "#0A66C2", i18nKey: "linkedin" },
  twitter: { Glyph: XGlyph, brand: "#0F1419", i18nKey: "x" },
};

const MAX_LEN = 10_000;
const ADD_ANIM_MS = 700; // cleanup buffer (drop keyframe is 520ms)
const REMOVE_ANIM_MS = 380; // matches li-remove-puff duration

// Stable client-side ids for added posts (used as React keys + anim targets;
// the real backend id is assigned later, during the cross-app handoff).
let _seq = 0;
const newId = () => `post-${++_seq}`;

interface SourcePopupProps {
  open: boolean;
  onClose: () => void;
  sourceType: PostSourceType;
  posts: SourcePost[];
  onChange: (next: SourcePost[]) => void;
}

// "Clean sheet" popup for adding LinkedIn / X posts by pasting the post TEXT
// (not a URL — mirrors the educator platform). The added-posts list has a
// FIXED height and scrolls internally; a floating "View more" pill appears when
// there's content below the fold. New cards drop in (anim-li-add-drop); removed
// cards puff out (anim-li-remove-puff). Edits happen in a separate stacked
// dialog (the composer is only ever for brand-new posts).
export function SourcePopup({
  open,
  onClose,
  sourceType,
  posts,
  onChange,
}: SourcePopupProps) {
  const t = useTranslations("home.sourcePopup");
  const cfg = CFG[sourceType];
  const Glyph = cfg.Glyph;

  const [composer, setComposer] = useState("");
  const [composerPulse, setComposerPulse] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<SourcePost | null>(null);
  const [editValue, setEditValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Anchor the dialog to the VISUAL viewport (the area NOT covered by the
  // on-screen keyboard) instead of the layout viewport. On mobile, focusing the
  // composer raises the keyboard; a layout-centered modal would slide partly
  // behind it and push the "Done" button off-screen (and iOS would try to scroll
  // the input into view). Tracking visualViewport.height/offsetTop keeps the
  // popup centered in the space ABOVE the keyboard — sticky as the user types,
  // and re-centering down a touch when the keyboard is dismissed. Paired with the
  // 16px composer font below (≥16px stops iOS from auto-zooming on focus).
  const [vv, setVv] = useState<{ top: number; height: number } | null>(null);
  useEffect(() => {
    if (!open) return;
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;
    const update = () =>
      setVv({ top: visualViewport.offsetTop, height: visualViewport.height });
    update();
    visualViewport.addEventListener("resize", update);
    visualViewport.addEventListener("scroll", update);
    return () => {
      visualViewport.removeEventListener("resize", update);
      visualViewport.removeEventListener("scroll", update);
    };
  }, [open]);

  // Scroll affordance for the fixed-height list: the "View more" pill shows
  // while there's content below the fold.
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const recompute = () => {
    const el = listRef.current;
    setCanScrollDown(
      !!el && el.scrollTop + el.clientHeight < el.scrollHeight - 4,
    );
  };
  useLayoutEffect(() => {
    recompute();
  }, [posts.length, open]);

  // Keep the latest onClose / editing without re-running the scroll-lock
  // effect (which must bind exactly once per open).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const editingRef = useRef<SourcePost | null>(editing);
  editingRef.current = editing;

  // Scroll lock. The page runs Lenis (JS smooth-scroll) which hijacks the wheel
  // and scrolls the window programmatically — CSS overflow:hidden alone can't
  // stop it. The overlay carries `data-lenis-prevent` (below) so Lenis ignores
  // wheel/touch inside the popup entirely; combined with html/body overflow
  // hidden (blocks native page scroll on backdrop wheels) and the list's own
  // overflow-y-auto + overscroll-contain (scrolls the list, never chains), the
  // background never moves and the list scrolls wherever the cursor is.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevHtml = html.style.overflow;
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingRef.current) setEditing(null);
        else onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, [open]);

  // Reset transient state whenever the dialog (re)opens.
  useEffect(() => {
    if (open) {
      setComposer("");
      setAnimatingId(null);
      setRemovingId(null);
      setEditing(null);
    }
  }, [open]);

  if (!open || !mounted) return null;

  const addPost = () => {
    const content = composer.trim();
    if (!content) return;
    const id = newId();
    setComposerPulse(true);
    window.setTimeout(() => setComposerPulse(false), 320);
    // Prepend so the newest sits on top and drops in from above.
    onChange([{ id, content }, ...posts]);
    setAnimatingId(id);
    window.setTimeout(() => setAnimatingId(null), ADD_ANIM_MS);
    setComposer("");
    textareaRef.current?.focus();
    // After the new card mounts at the top, make sure the list shows it.
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = 0;
      recompute();
    });
  };

  const removePost = (id: string) => {
    if (removingId === id) return;
    setRemovingId(id);
    window.setTimeout(() => {
      onChange(posts.filter((p) => p.id !== id));
      setRemovingId((cur) => (cur === id ? null : cur));
    }, REMOVE_ANIM_MS);
  };

  const openEdit = (post: SourcePost) => {
    setEditing(post);
    setEditValue(post.content);
  };
  const saveEdit = () => {
    if (!editing) return;
    const content = editValue.trim();
    if (!content) return;
    onChange(posts.map((p) => (p.id === editing.id ? { ...p, content } : p)));
    setEditing(null);
  };

  const onComposerKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      addPost();
    }
  };

  const main = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-popup-heading"
      data-lenis-prevent
      className="fixed inset-0 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Centering wrapper pinned to the visual viewport so the card stays above
          the keyboard. Falls back to the full layout viewport before mount. */}
      <div
        className="absolute inset-x-0 flex items-center justify-center p-4"
        style={vv ? { top: vv.top, height: vv.height } : { top: 0, bottom: 0 }}
      >
        <div
          className="relative flex max-h-full w-full max-w-[29rem] animate-in fade-in zoom-in-95 flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-[0_30px_80px_-30px_rgba(74,50,111,0.5)] duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex flex-none items-center gap-3 px-6 pt-6">
          <span
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-white"
            style={{ background: cfg.brand }}
          >
            <Glyph className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <h2
              id="source-popup-heading"
              className="text-[1.06875rem] font-semibold text-card-foreground"
            >
              {t(`${cfg.i18nKey}.title`)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="-mr-1 ml-auto inline-flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <X className="size-[18px]" aria-hidden />
          </button>
        </div>

        {/* Scrollable body — shrinks (and scrolls) when the viewport above the
            keyboard is short, keeping the footer's "Done" always on screen. */}
        <div className="min-h-0 overflow-y-auto">
        {/* Composer */}
        <div className="px-6 pt-4">
          <textarea
            ref={textareaRef}
            value={composer}
            onChange={(e) => setComposer(e.target.value.slice(0, MAX_LEN))}
            onKeyDown={onComposerKeyDown}
            rows={4}
            autoFocus
            placeholder={t(`${cfg.i18nKey}.placeholder`)}
            className={cn(
              "block w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-base leading-relaxed text-card-foreground placeholder:text-foreground/50 focus:border-primary focus:outline-none sm:text-sm",
              composerPulse && "animate-li-composer-eject",
            )}
          />
          <div className="mt-2.5 flex justify-end">
            <StickerButton onClick={addPost} disabled={composer.trim().length === 0}>
              {t("addPost")}
            </StickerButton>
          </div>
        </div>

        {/* Fixed-height list region (constant height for 0 / 2 / N posts) */}
        <div className="relative mx-6 mt-3.5 mb-3.5">
          <div
            ref={listRef}
            onScroll={recompute}
            data-source-scroll="1"
            className="h-[9.5rem] overflow-y-auto overscroll-contain pr-1"
          >
            {posts.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground">
                {t("noPosts")}
              </div>
            ) : (
              <ul className="flex flex-col gap-2.5 pb-1">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className={cn(
                      "flex gap-3 rounded-xl border border-border bg-muted/40 p-3",
                      post.id === animatingId && "animate-li-add-drop",
                      post.id === removingId &&
                        "animate-li-remove-puff pointer-events-none",
                    )}
                  >
                    <span
                      className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-white"
                      style={{ background: cfg.brand }}
                    >
                      <Glyph className="size-3.5" />
                    </span>
                    <p className="line-clamp-2 min-w-0 flex-1 text-[13px] leading-relaxed text-card-foreground/90">
                      {post.content}
                    </p>
                    <div className="flex flex-none items-start gap-0.5">
                      <IconButton label={t("edit")} onClick={() => openEdit(post)}>
                        <Pencil className="size-3.5" />
                      </IconButton>
                      <IconButton
                        label={t("delete")}
                        onClick={() => removePost(post.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </IconButton>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Floating "View more" pill — same affordance as the educator list */}
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
        </div>

        {/* Footer */}
        <div className="flex flex-none items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-3.5">
          <span className="text-[13px] font-medium text-muted-foreground">
            {t("count", { count: posts.length })}
          </span>
          <StickerButton onClick={onClose}>{t("done")}</StickerButton>
        </div>
        </div>
      </div>
    </div>
  );

  // Separate, stacked dialog for editing one post's full text.
  const editDialog = editing ? (
    <div
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
      className="fixed inset-0 z-[60] animate-in fade-in duration-150"
      onClick={() => setEditing(null)}
    >
      <div className="absolute inset-0 bg-foreground/10 backdrop-blur-md" />
      <div
        className="absolute inset-x-0 flex items-center justify-center p-4"
        style={vv ? { top: vv.top, height: vv.height } : { top: 0, bottom: 0 }}
      >
      <div
        className="relative flex max-h-full w-full max-w-[29rem] animate-in fade-in zoom-in-95 flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-[0_30px_80px_-30px_rgba(74,50,111,0.55)] duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-none items-center gap-3 px-6 pt-6">
          <span
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-white"
            style={{ background: cfg.brand }}
          >
            <Glyph className="size-[18px]" />
          </span>
          <h2 className="text-lg font-semibold text-card-foreground">
            {t("editTitle")}
          </h2>
          <button
            type="button"
            onClick={() => setEditing(null)}
            aria-label={t("close")}
            className="ml-auto inline-flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <X className="size-[18px]" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto px-6 pb-4 pt-4">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value.slice(0, MAX_LEN))}
            rows={8}
            autoFocus
            className="block w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-base leading-relaxed text-card-foreground focus:border-primary focus:outline-none sm:text-sm"
          />
        </div>
        <div className="flex flex-none items-center justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3.5">
          <GhostButton onClick={() => setEditing(null)}>{t("cancel")}</GhostButton>
          <StickerButton
            onClick={saveEdit}
            disabled={editValue.trim().length === 0}
          >
            {t("savePost")}
          </StickerButton>
        </div>
      </div>
      </div>
    </div>
  ) : null;

  return createPortal(
    <>
      {main}
      {editDialog}
    </>,
    document.body,
  );
}

export function StickerButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border-2 border-card-foreground bg-secondary px-4 text-sm font-semibold text-secondary-foreground select-none",
        "shadow-[3px_3px_0_0_rgb(74,50,111)] transition-all duration-150 ease-out",
        "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)]",
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
    >
      {children}
    </button>
  );
}

export function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-primary"
    >
      {children}
    </button>
  );
}
