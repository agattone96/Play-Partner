import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import Dashboard from "@/pages/dashboard";
import Partners from "@/pages/partners";
import PartnerDetail from "@/pages/partner-detail";
import Assessments from "@/pages/assessments";
import Tags from "@/pages/tags";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

export function AuthenticatedRouter() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Switch location={location}>
          <Route path="/" component={Dashboard} />
          {/* CNT-01: 'Partners' -> 'All Partners' conceptual mapping */}
          <Route path="/partners" component={Partners} />
          <Route path="/partners/:id" component={PartnerDetail} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/tags" component={Tags} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}
