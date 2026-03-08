import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Pencil,
  MousePointer2,
  MessageCircle,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Star,
  CheckCircle2,
  Play,
  Sparkles,
} from "lucide-react";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/[0.07] via-accent/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black_40%,transparent_100%)]" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-[720px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.08] border border-primary/[0.12] text-primary text-[13px] font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Now in public beta
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-display-md sm:text-display-lg lg:text-display-xl font-bold text-foreground mb-6 text-balance"
          >
            Write together,{" "}
            <span className="gradient-text">in real time</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-muted-foreground max-w-[520px] mx-auto mb-10 leading-relaxed"
          >
            SyncSpace brings your team together with live editing, cursor tracking, and threaded comments — all in one clean workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              className="gradient-primary shadow-glow hover:shadow-glow text-sm font-medium px-7 h-11 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              asChild
            >
              <Link to="/signup">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-sm font-medium px-7 h-11 hover:bg-muted/50 transition-all duration-200"
              asChild
            >
              <Link to="/editor/demo">
                <Play className="mr-2 h-3.5 w-3.5" />
                Live demo
              </Link>
            </Button>
          </motion.div>

          {/* Editor preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-16 md:mt-20"
          >
            <div className="rounded-2xl border border-border/60 bg-card shadow-elevated-lg overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-0.5 rounded-md bg-muted/60 text-[11px] text-muted-foreground font-mono">
                    Project Brief.doc
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-primary/80 ring-2 ring-card flex items-center justify-center text-[8px] text-primary-foreground font-bold">S</div>
                  <div className="w-5 h-5 rounded-full bg-accent/80 -ml-1 ring-2 ring-card flex items-center justify-center text-[8px] text-accent-foreground font-bold">A</div>
                  <div className="w-5 h-5 rounded-full bg-success/70 -ml-1 ring-2 ring-card flex items-center justify-center text-[8px] text-success-foreground font-bold">M</div>
                </div>
              </div>
              {/* Editor body */}
              <div className="p-6 md:p-8 text-left">
                <div className="space-y-4">
                  <div className="h-6 bg-foreground/[0.08] rounded-md w-[55%]" />
                  <div className="space-y-2.5">
                    <div className="h-3.5 bg-foreground/[0.05] rounded w-full" />
                    <div className="h-3.5 bg-foreground/[0.05] rounded w-[90%]" />
                    <div className="h-3.5 bg-foreground/[0.05] rounded w-[75%]" />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-4 w-0.5 bg-primary rounded-full animate-cursor-blink" />
                    <span className="text-xs text-primary font-medium">Sarah is typing...</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-3.5 bg-foreground/[0.05] rounded w-[65%]" />
                    <div className="h-3.5 bg-foreground/[0.05] rounded w-[82%]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" /> Free forever plan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" /> Setup in 30 seconds
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Pencil,
    title: "Live Editing",
    description: "Edit documents simultaneously with your team. Every change syncs instantly across all connected users.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MousePointer2,
    title: "Cursor Tracking",
    description: "See exactly where your collaborators are working with real-time colored cursors and selections.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: MessageCircle,
    title: "Threaded Comments",
    description: "Leave contextual feedback directly in documents. Keep discussions organized with nested threads.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Zap,
    title: "Instant Sync",
    description: "Zero-latency updates powered by conflict-free data structures. Never lose a keystroke.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, SOC 2 compliance, and granular access controls built in from day one.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Users,
    title: "Team Workspaces",
    description: "Organize documents by project, team, or topic. Invite collaborators with a single link.",
    color: "bg-primary/10 text-primary",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
          <h2 className="font-display text-display-sm md:text-display-md font-bold text-foreground mb-4 text-balance">
            Everything you need to collaborate
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Purpose-built tools for seamless real-time teamwork, designed for teams of all sizes.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <AnimatedSection key={f.title}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-elevated hover:shadow-elevated-lg hover:border-border transition-all duration-300 h-full"
              >
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { number: "01", title: "Create a workspace", description: "Sign up and set up your team workspace in under 30 seconds. No installation required." },
  { number: "02", title: "Invite your team", description: "Share a link or send email invites. Collaborators join instantly with zero friction." },
  { number: "03", title: "Start collaborating", description: "Edit documents together in real-time with live cursors, comments, and instant sync." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 gradient-subtle">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="font-display text-display-sm md:text-display-md font-bold text-foreground mb-4 text-balance">
            Up and running in minutes
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <AnimatedSection key={s.number}>
              <div className="text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
                )}
                <div className="text-display-sm font-display font-bold gradient-text mb-4">{s.number}</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">{s.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Alex Chen",
    role: "Product Lead at Vercel",
    quote: "SyncSpace transformed how our team collaborates. The real-time editing is buttery smooth and the UI is gorgeous.",
    avatar: "AC",
  },
  {
    name: "Priya Sharma",
    role: "Engineering Manager at Stripe",
    quote: "We replaced three tools with SyncSpace. The cursor tracking alone saves us hours of miscommunication every week.",
    avatar: "PS",
  },
  {
    name: "Marcus Johnson",
    role: "Founder of BuildKit",
    quote: "The best collaboration tool I've ever used. Clean, fast, and the threaded comments system is brilliant.",
    avatar: "MJ",
  },
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="font-display text-display-sm md:text-display-md font-bold text-foreground text-balance">
            Loved by teams everywhere
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <AnimatedSection key={t.name}>
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-elevated hover:shadow-elevated-lg transition-all duration-300 h-full flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto">
        <AnimatedSection>
          <div className="gradient-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-foreground/[0.06] rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-foreground/[0.04] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="font-display text-display-sm md:text-display-md font-bold text-primary-foreground mb-4 text-balance">
                Ready to collaborate smarter?
              </h2>
              <p className="text-primary-foreground/70 max-w-md mx-auto mb-8 text-sm sm:text-base">
                Join thousands of teams using SyncSpace to work together in real-time. Start free today.
              </p>
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-sm font-medium px-8 h-11 shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                asChild
              >
                <Link to="/signup">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
