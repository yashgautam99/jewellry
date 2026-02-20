"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("newsletter-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletter-popup-dismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[101] inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-white dark:bg-card rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid sm:grid-cols-2">
                {/* Left Panel */}
                <div className="bg-primary p-8 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
                  <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
                  <Gift className="w-10 h-10 text-primary-foreground/80 mb-4" />
                  <h3 className="text-2xl font-serif font-bold text-primary-foreground leading-tight mb-2">
                    Get 10% Off Your First Order
                  </h3>
                  <p className="text-sm text-primary-foreground/70">
                    Join the Lumière family for exclusive offers, new arrivals,
                    and jewellery stories.
                  </p>
                </div>
                {/* Right Panel */}
                <div className="p-8 flex flex-col justify-center relative">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {!submitted ? (
                    <>
                      <h4 className="font-serif text-lg font-semibold text-foreground mb-1">
                        Subscribe & Save
                      </h4>
                      <p className="text-xs text-muted-foreground mb-5">
                        No spam. Unsubscribe anytime.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-9 h-11 rounded-xl"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-11 rounded-xl"
                        >
                          Claim 10% Off
                        </Button>
                      </form>
                      <button
                        onClick={handleClose}
                        className="mt-3 text-xs text-muted-foreground hover:text-foreground text-center w-full transition-colors"
                      >
                        No thanks, I prefer full price
                      </button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎉</span>
                      </div>
                      <h4 className="font-serif font-semibold text-foreground mb-1">
                        You&apos;re in!
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Check your inbox for your 10% discount code.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
