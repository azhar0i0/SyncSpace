import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Link as LinkIcon,
  Undo,
  Redo,
  Share2,
  MessageSquare,
  ChevronLeft,
  Check,
  Loader2,
  X,
  Send,
  Strikethrough,
  Code,
  Quote,
  MoreVertical,
  Download,
  Copy,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ToolbarBtn {
  icon: React.ElementType;
  label: string;
  command: string;
  arg?: string;
}

const formattingGroups: ToolbarBtn[][] = [
  [
    { icon: Undo, label: "Undo", command: "undo" },
    { icon: Redo, label: "Redo", command: "redo" },
  ],
  [
    { icon: Bold, label: "Bold", command: "bold" },
    { icon: Italic, label: "Italic", command: "italic" },
    { icon: UnderlineIcon, label: "Underline", command: "underline" },
    { icon: Strikethrough, label: "Strikethrough", command: "strikeThrough" },
  ],
  [
    { icon: Heading1, label: "Heading 1", command: "formatBlock", arg: "h1" },
    { icon: Heading2, label: "Heading 2", command: "formatBlock", arg: "h2" },
    { icon: Quote, label: "Blockquote", command: "formatBlock", arg: "blockquote" },
    { icon: Code, label: "Code", command: "formatBlock", arg: "pre" },
  ],
  [
    { icon: List, label: "Bullet List", command: "insertUnorderedList" },
    { icon: ListOrdered, label: "Numbered List", command: "insertOrderedList" },
  ],
  [
    { icon: AlignLeft, label: "Align Left", command: "justifyLeft" },
    { icon: AlignCenter, label: "Align Center", command: "justifyCenter" },
    { icon: AlignRight, label: "Align Right", command: "justifyRight" },
  ],
  [
    { icon: LinkIcon, label: "Link", command: "createLink" },
    { icon: Image, label: "Image", command: "insertImage" },
  ],
];

interface Comment {
  id: number;
  user: string;
  text: string;
  time: string;
  replies: { user: string; text: string; time: string }[];
}

const initialComments: Comment[] = [
  {
    id: 1,
    user: "Sarah",
    text: "Should we add more detail to the timeline section?",
    time: "2 min ago",
    replies: [{ user: "You", text: "Good idea — I'll expand it after the intro.", time: "1 min ago" }],
  },
  {
    id: 2,
    user: "Alex",
    text: "Love the new structure. The headings really help readability.",
    time: "15 min ago",
    replies: [],
  },
  {
    id: 3,
    user: "Marcus",
    text: "Can we include the budget breakdown here?",
    time: "1 hour ago",
    replies: [],
  },
];

const collaborators = [
  { name: "Sarah", color: "hsl(235 72% 58%)" },
  { name: "Alex", color: "hsl(258 60% 55%)" },
  { name: "Marcus", color: "hsl(152 60% 42%)" },
];

const fakeCursors = [
  { name: "Sarah", color: "hsl(235 72% 58%)", top: "26%", left: "40%" },
  { name: "Alex", color: "hsl(258 60% 55%)", top: "54%", left: "65%" },
];

const docTitles: Record<string, string> = {
  "1": "Q4 Strategy Brief",
  "2": "Product Roadmap 2026",
  "3": "Design System v3",
  "4": "Engineering Standup Notes",
  "5": "Marketing Campaign Draft",
  "6": "Investor Update Q3",
  demo: "Project Brief",
};

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [replyOpen, setReplyOpen] = useState<number | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [docTitle, setDocTitle] = useState(docTitles[id || ""] || `Document ${id}`);
  const [editingTitle, setEditingTitle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSaveState("saving");
      setTimeout(() => setSaveState("saved"), 800);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const triggerSave = useCallback(() => {
    setSaveState("saving");
    setTimeout(() => setSaveState("saved"), 600);
  }, []);

  const checkActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("strikeThrough")) formats.add("strikeThrough");
    if (document.queryCommandState("insertUnorderedList")) formats.add("insertUnorderedList");
    if (document.queryCommandState("insertOrderedList")) formats.add("insertOrderedList");
    setActiveFormats(formats);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", checkActiveFormats);
    return () => document.removeEventListener("selectionchange", checkActiveFormats);
  }, [checkActiveFormats]);

  const execCommand = useCallback(
    (command: string, arg?: string) => {
      editorRef.current?.focus();
      if (command === "createLink") {
        const url = prompt("Enter URL:");
        if (url) document.execCommand("createLink", false, url);
      } else if (command === "insertImage") {
        const url = prompt("Enter image URL:");
        if (url) document.execCommand("insertImage", false, url);
      } else if (command === "formatBlock") {
        document.execCommand("formatBlock", false, `<${arg}>`);
      } else {
        document.execCommand(command, false, arg);
      }
      triggerSave();
      checkActiveFormats();
    },
    [triggerSave, checkActiveFormats]
  );

  const handleAddComment = useCallback(() => {
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      user: "You",
      text: commentInput.trim(),
      time: "Just now",
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentInput("");
    toast({ title: "Comment added" });
  }, [commentInput, toast]);

  const handleAddReply = useCallback(
    (commentId: number) => {
      const replyText = replyInputs[commentId]?.trim();
      if (!replyText) return;
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: [...c.replies, { user: "You", text: replyText, time: "Just now" }] }
            : c
        )
      );
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      setReplyOpen(null);
    },
    [replyInputs]
  );

  const handleDeleteComment = useCallback(
    (commentId: number) => {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast({ title: "Comment deleted" });
    },
    [toast]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center px-3 gap-2 bg-card/80 backdrop-blur-lg z-20">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
          <Link to="/dashboard">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="h-5 w-5 rounded gradient-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-[7px] font-bold">S</span>
          </div>
          {editingTitle ? (
            <input
              autoFocus
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              onBlur={() => {
                setEditingTitle(false);
                triggerSave();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingTitle(false);
                  triggerSave();
                }
              }}
              className="font-display font-semibold text-sm text-foreground bg-transparent border-b border-primary outline-none w-48"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="font-display font-semibold text-sm text-foreground truncate hover:text-primary transition-colors"
              title="Click to rename"
            >
              {docTitle}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {saveState === "saving" ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="hidden sm:inline">Saving</span>
            </>
          ) : (
            <>
              <Check className="h-3 w-3 text-success" />
              <span className="hidden sm:inline">Saved</span>
            </>
          )}
        </div>

        <div className="hidden sm:flex -space-x-1.5 mx-1">
          {collaborators.map((c) => (
            <div
              key={c.name}
              title={c.name}
              style={{ backgroundColor: c.color }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-primary-foreground ring-2 ring-card"
            >
              {c.name[0]}
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1 h-8 px-2.5"
          onClick={() => setCommentsOpen(!commentsOpen)}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="text-xs">{comments.length}</span>
        </Button>

        <Button
          size="sm"
          className="gradient-primary shadow-glow-sm hover:shadow-glow h-8 px-3 text-xs font-medium transition-all duration-300"
          onClick={() => setShareDialogOpen(true)}
        >
          <Share2 className="h-3.5 w-3.5 mr-1" />
          <span className="hidden sm:inline">Share</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                toast({ title: "Copied to clipboard", description: "Document content copied." });
              }}
            >
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy content
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast({ title: "Download started", description: "Your document is being exported." });
              }}
            >
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                toast({ title: "Document deleted" });
                navigate("/dashboard");
              }}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border px-3 py-1.5 flex items-center gap-0.5 overflow-x-auto bg-card/50">
        {formattingGroups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <div className="w-px h-5 bg-border mx-1 shrink-0" />}
            {group.map((btn) => (
              <button
                key={btn.label}
                title={btn.label}
                onClick={() => execCommand(btn.command, btn.arg)}
                className={`p-1.5 rounded-md transition-colors shrink-0 ${
                  activeFormats.has(btn.command)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <btn.icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Editor + Comments */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto relative">
          <div className="max-w-[680px] mx-auto px-6 md:px-10 py-10">
            <div
              ref={editorRef}
              className="prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[60vh] [&_h1]:font-display [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:text-foreground/80 [&_p]:leading-relaxed [&_li]:text-foreground/80 [&_blockquote]:border-l-primary [&_blockquote]:text-muted-foreground [&_pre]:bg-muted [&_pre]:text-foreground [&_pre]:rounded-lg"
              contentEditable
              suppressContentEditableWarning
              onInput={triggerSave}
            >
              <h1>{docTitle}</h1>
              <p style={{ color: "hsl(220 10% 46%)" }}>
                This document outlines our strategic priorities for the fourth quarter, including key milestones,
                resource allocation, and team responsibilities.
              </p>
              <h2>Executive Summary</h2>
              <p>
                Our primary focus for Q4 is to expand market reach by 35% while maintaining our commitment to product
                quality and customer satisfaction. This involves launching two new features, strengthening partnerships,
                and optimizing our go-to-market strategy.
              </p>
              <h2>Key Objectives</h2>
              <ul>
                <li>Launch real-time collaboration v2 with enhanced cursor tracking</li>
                <li>Achieve 50,000 active workspace users by end of quarter</li>
                <li>Reduce document loading time by 40%</li>
                <li>Establish partnerships with 3 enterprise clients</li>
              </ul>
              <h2>Timeline</h2>
              <p>
                Phase 1 (October): Feature development and internal testing. Phase 2 (November): Beta rollout and
                partner onboarding. Phase 3 (December): Full launch and performance review.
              </p>
            </div>

            {fakeCursors.map((cursor) => (
              <motion.div
                key={cursor.name}
                className="absolute pointer-events-none"
                style={{ top: cursor.top, left: cursor.left }}
                animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="10" height="16" viewBox="0 0 12 18" fill="none">
                  <path d="M0 0L12 12H5L2 18L0 0Z" fill={cursor.color} />
                </svg>
                <span
                  className="text-[9px] font-medium px-1.5 py-0.5 rounded ml-0.5 whitespace-nowrap"
                  style={{ backgroundColor: cursor.color, color: "white" }}
                >
                  {cursor.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comments sidebar */}
        <AnimatePresence>
          {commentsOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="border-l border-border bg-card flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Comments ({comments.length})
                </h3>
                <button
                  onClick={() => setCommentsOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-3 space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="rounded-lg border border-border/60 bg-card p-3 group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground">
                          {comment.user[0]}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{comment.user}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{comment.time}</span>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[13px] text-foreground/85 leading-relaxed">{comment.text}</p>
                      <button
                        onClick={() => setReplyOpen(replyOpen === comment.id ? null : comment.id)}
                        className="text-[11px] text-primary hover:text-primary/80 font-medium mt-2 transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                    {comment.replies.map((reply, ri) => (
                      <div key={ri} className="ml-4 rounded-lg border border-border/40 bg-muted/30 p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[7px] font-bold text-muted-foreground">
                            {reply.user[0]}
                          </div>
                          <span className="text-[11px] font-semibold text-foreground">{reply.user}</span>
                          <span className="text-[10px] text-muted-foreground ml-auto">{reply.time}</span>
                        </div>
                        <p className="text-[12px] text-foreground/80 leading-relaxed">{reply.text}</p>
                      </div>
                    ))}

                    {replyOpen === comment.id && (
                      <div className="ml-4 flex gap-1.5">
                        <Input
                          placeholder="Write a reply..."
                          value={replyInputs[comment.id] || ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({ ...prev, [comment.id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleAddReply(comment.id)}
                          className="h-8 text-xs bg-muted/40"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          className="h-8 w-8 gradient-primary shrink-0"
                          onClick={() => handleAddReply(comment.id)}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border shrink-0">
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Add a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    className="h-9 text-sm bg-muted/40"
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9 gradient-primary shrink-0"
                    onClick={handleAddComment}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="font-display">Share document</DialogTitle>
            <DialogDescription>Invite team members to collaborate on this document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex gap-2">
              <Input placeholder="Enter email address" className="h-10 flex-1" />
              <Button className="gradient-primary h-10">Invite</Button>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">People with access</p>
              <div className="space-y-2.5">
                {["You (Owner)", ...collaborators.map((c) => c.name)].map((name, i) => (
                  <div key={name} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground">
                      {name[0]}
                    </div>
                    <span className="text-sm text-foreground flex-1">{name}</span>
                    <span className="text-xs text-muted-foreground">{i === 0 ? "Owner" : "Editor"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/editor/${id}`);
                  toast({ title: "Link copied!", description: "Share this link with your team." });
                }}
              >
                <Copy className="h-3.5 w-3.5 mr-2" />
                Copy link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
