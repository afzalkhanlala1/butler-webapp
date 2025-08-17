import { Slack, Calendar, Inbox, Bell, ListTodo, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const groupClasses = "text-sm font-medium text-muted-foreground px-3 mt-6 mb-2";

const SidebarNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClasses = (href: string) => {
    const isActive = currentPath === href || (href === "/" && currentPath === "/");
    return cn(
      "block px-3 py-2 text-sm rounded-md transition-colors",
      isActive 
        ? "bg-accent text-accent-foreground font-medium" 
        : "hover:bg-accent/30"
    );
  };

  return (
    <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r">
      <nav className="py-6">
        <p className={groupClasses}>Get Started</p>
        <ul className="space-y-1">
          <li>
            <a href="/" className={getLinkClasses("/")}>Introduction</a>
          </li>
        </ul>

        {/* Removed "Ways to Reach Butler" and Tools per request */}

        <p className={groupClasses}>Integrations</p>
        <ul className="space-y-1">
          <li><a className={getLinkClasses("/calendar")} href="/calendar">Calendar</a></li>
          <li><a className={getLinkClasses("/inbox")} href="/inbox">Inbox</a></li>
          <li><a className={getLinkClasses("/reminders")} href="/reminders">Reminders</a></li>
          <li><a className={getLinkClasses("/todos")} href="/todos">To-dos</a></li>
          <li><a className={getLinkClasses("/notes")} href="/notes">Notes</a></li>
          <li><a className={getLinkClasses("/slack")} href="/slack">Slack</a></li>
          <li><a className={getLinkClasses("/foodpanda")} href="/foodpanda">Foodpanda</a></li>
          <li><a className={getLinkClasses("/careem")} href="/careem">Careem</a></li>
        </ul>

        

        <p className={groupClasses}>Background Tasks</p>
        <ul className="space-y-1">
          <li><a className={getLinkClasses("/email-briefings")} href="/email-briefings">Email Briefings</a></li>
          <li><a className={getLinkClasses("/proactive-drafts")} href="/proactive-drafts">Proactive Drafts</a></li>
          <li><a className={getLinkClasses("/email-triage")} href="/email-triage">Email Triage</a></li>
          <li><a className={getLinkClasses("/wake-up-calls")} href="/wake-up-calls">Wake Up Calls</a></li>
          <li><a className={getLinkClasses("/cc-to-schedule")} href="/cc-to-schedule">Cc to Schedule</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarNav;
