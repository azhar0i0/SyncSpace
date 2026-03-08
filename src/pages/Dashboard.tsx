import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Clock,
  Users,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Trash2,
  Copy,
  Pencil,
  Star,
  FolderOpen,
} from "lucide-react";
import { useState, useCallback } from "react";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Document {
  id: string;
  title: string;
  updated: string;
  collaborators: string[];
  starred: boolean;
}

const initialDocuments: Document[] = [
  { id: "1", title: "Q4 Strategy Brief", updated: "2 min ago", collaborators: ["S", "A", "M"], starred: true },
  { id: "2", title: "Product Roadmap 2026", updated: "15 min ago", collaborators: ["P", "J"], starred: false },
  { id: "3", title: "Design System v3", updated: "1 hour ago", collaborators: ["L", "K", "R"], starred: true },
  { id: "4", title: "Engineering Standup Notes", updated: "3 hours ago", collaborators: ["D"], starred: false },
  { id: "5", title: "Marketing Campaign Draft", updated: "Yesterday", collaborators: ["N", "T"], starred: false },
  { id: "6", title: "Investor Update Q3", updated: "2 days ago", collaborators: ["C", "A"], starred: false },
];

const sidebarItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: FileText, label: "Documents", id: "documents" },
  { icon: Clock, label: "Recent", id: "recent" },
  { icon: Star, label: "Starred", id: "starred" },
  { icon: Users, label: "Shared", id: "shared" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const initialActivity = [
  { user: "Sarah", action: "edited", doc: "Q4 Strategy Brief", time: "2 min ago" },
  { user: "Alex", action: "commented on", doc: "Product Roadmap 2026", time: "15 min ago" },
  { user: "Priya", action: "created", doc: "Sprint Review", time: "1 hour ago" },
  { user: "Marcus", action: "shared", doc: "Design System v3", time: "3 hours ago" },
];

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [activity, setActivity] = useState(initialActivity);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "starred") return matchesSearch && doc.starred;
    return matchesSearch;
  });

  const handleCreateDoc = useCallback(() => {
    if (!newDocTitle.trim()) {
      toast({ title: "Please enter a document title", variant: "destructive" });
      return;
    }
    const newDoc: Document = {
      id: String(Date.now()),
      title: newDocTitle.trim(),
      updated: "Just now",
      collaborators: ["Y"],
      starred: false,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setActivity((prev) => [{ user: "You", action: "created", doc: newDocTitle.trim(), time: "Just now" }, ...prev]);
    setNewDocTitle("");
    setCreateDialogOpen(false);
    toast({ title: "Document created", description: `"${newDoc.title}" is ready to edit.` });
    navigate(`/editor/${newDoc.id}`);
  }, [newDocTitle, navigate, toast]);

  const handleDeleteDoc = useCallback(() => {
    if (!selectedDoc) return;
    setDocuments((prev) => prev.filter((d) => d.id !== selectedDoc.id));
    setActivity((prev) => [{ user: "You", action: "deleted", doc: selectedDoc.title, time: "Just now" }, ...prev]);
    setDeleteDialogOpen(false);
    toast({ title: "Document deleted", description: `"${selectedDoc.title}" has been removed.` });
    setSelectedDoc(null);
  }, [selectedDoc, toast]);

  const handleRenameDoc = useCallback(() => {
    if (!selectedDoc || !renameTitle.trim()) return;
    setDocuments((prev) =>
      prev.map((d) => (d.id === selectedDoc.id ? { ...d, title: renameTitle.trim(), updated: "Just now" } : d))
    );
    setActivity((prev) => [
      { user: "You", action: "renamed", doc: renameTitle.trim(), time: "Just now" },
      ...prev,
    ]);
    setRenameDialogOpen(false);
    toast({ title: "Document renamed", description: `Now called "${renameTitle.trim()}".` });
    setSelectedDoc(null);
  }, [selectedDoc, renameTitle, toast]);

  const handleDuplicateDoc = useCallback(
    (doc: Document) => {
      const dup: Document = {
        ...doc,
        id: String(Date.now()),
        title: `${doc.title} (Copy)`,
        updated: "Just now",
        starred: false,
      };
      setDocuments((prev) => [dup, ...prev]);
      setActivity((prev) => [{ user: "You", action: "duplicated", doc: doc.title, time: "Just now" }, ...prev]);
      toast({ title: "Document duplicated" });
    },
    [toast]
  );

  const handleToggleStar = useCallback((doc: Document) => {
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, starred: !d.starred } : d)));
  }, []);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ${
          collapsed ? "w-[60px]" : "w-[240px]"
        }`}
      >
        <div className="flex items-center h-14 px-3 border-b border-border">
          {!collapsed ? (
            <div className="flex items-center justify-between w-full">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-display font-bold text-[10px]">S</span>
                </div>
                <span className="font-display text-sm font-bold text-foreground">
                  Sync<span className="text-primary">Space</span>
                </span>
              </Link>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 w-full">
              <Link to="/" className="p-1">
                <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-display font-bold text-[10px]">S</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                activeTab === item.id
                  ? "bg-primary/[0.08] text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={() => {
              toast({ title: "Logged out", description: "See you next time!" });
              navigate("/");
            }}
            className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-full mt-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border flex items-center justify-between px-5 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-display font-bold text-[8px]">S</span>
                </div>
              </Link>
            </div>
            <h1 className="font-display text-lg font-bold text-foreground capitalize">
              {activeTab === "home" ? "Dashboard" : activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-56 h-9 text-sm bg-muted/40 border-border"
              />
            </div>
            <Button
              size="sm"
              className="gradient-primary shadow-glow-sm hover:shadow-glow text-sm font-medium h-9 px-4 transition-all duration-300"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New Doc
            </Button>
          </div>
        </header>

        <div className="flex-1 p-5 overflow-auto">
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Documents grid */}
            <div className="lg:col-span-2">
              {filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-1">No documents found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery ? "Try a different search term." : "Create your first document to get started."}
                  </p>
                  <Button
                    size="sm"
                    className="gradient-primary"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Document
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="group relative rounded-xl border border-border/60 bg-card p-5 shadow-elevated hover:shadow-elevated-lg hover:border-border transition-all duration-300 cursor-pointer"
                    >
                      <Link to={`/editor/${doc.id}`} className="absolute inset-0 z-0" />
                      <div className="flex items-start justify-between mb-3 relative z-10">
                        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleStar(doc);
                            }}
                            className={`p-1 rounded-md transition-colors ${
                              doc.starred
                                ? "text-warning"
                                : "text-muted-foreground/0 group-hover:text-muted-foreground hover:text-warning"
                            }`}
                          >
                            <Star className={`h-3.5 w-3.5 ${doc.starred ? "fill-warning" : ""}`} />
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.preventDefault()}
                                className="p-1 rounded-md text-muted-foreground/0 group-hover:text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDoc(doc);
                                  setRenameTitle(doc.title);
                                  setRenameDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateDoc(doc)}>
                                <Copy className="h-3.5 w-3.5 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setSelectedDoc(doc);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">Edited {doc.updated}</p>
                      <div className="flex -space-x-1">
                        {doc.collaborators.map((c, j) => (
                          <div
                            key={j}
                            className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground ring-2 ring-card"
                          >
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="rounded-xl border border-border/60 bg-card p-5 shadow-elevated h-fit">
              <h3 className="font-display font-semibold text-sm text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activity.slice(0, 8).map((a, i) => (
                  <div key={`${a.doc}-${a.time}-${i}`} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground shrink-0 mt-0.5">
                      {a.user[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] leading-snug">
                        <span className="font-medium text-foreground">{a.user}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>{" "}
                        <span className="font-medium text-foreground">{a.doc}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-display">Create new document</DialogTitle>
            <DialogDescription>Give your document a title to get started.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="doc-title">Title</Label>
            <Input
              id="doc-title"
              placeholder="Untitled Document"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateDoc()}
              className="h-10"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary" onClick={handleCreateDoc}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-display">Rename document</DialogTitle>
            <DialogDescription>Enter a new title for this document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="rename-title">Title</Label>
            <Input
              id="rename-title"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameDoc()}
              className="h-10"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary" onClick={handleRenameDoc}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-display">Delete document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedDoc?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDoc}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
