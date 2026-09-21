import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  BookOpen, 
  PlusCircle, 
  FileText, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';

const Help = () => {
  const [activeModule, setActiveModule] = useState('manage');

  const docsData = {
    create: {
      title: 'Create Job Module Guide',
      icon: <PlusCircle size={20} className="text-blue-500 animate-pulse" />,
      content: `
### Overview
The **Create Job** module serves as the primary intake portal for recruiting teams to introduce new employment openings into the EZOjobs ecosystem.

### Comprehensive Instructions & Form Fields
* **Job Title & Code**: Assign a precise market-aligned designation alongside a unique auto-generated or custom **Job ID** (e.g., \`ENG-2026-04\`).
* **Department Routing**: Select appropriate department categories (Engineering, Product, Design, Marketing) to ensure smooth candidate filtering and dashboard analytics categorization.
* **Employment Structure**: Define employment criteria including type (*Full-Time*, *Part-Time*, *Contract*, *Internship*) and workplace location mode (*Remote*, *Hybrid*, *On-site*).
* **Compensation Range**: Input competitive salary structures with minimum and maximum thresholds mapped to currency standards.
* **Rich Text Description Editor**: 
  * Structure role responsibilities using clear bullet points.
  * Define mandatory technical stack requirements, preferred qualifications, and employee benefits packages.
* **Status Action Assignment**: 
  * Click **Save as Draft** to preserve unfinished records securely in your database without exposing them publicly.
  * Click **Publish Live** to instantly broadcast the opening across candidate portals.

> **Pro Tip:** Double-check your department tags and unique ID parameters prior to publishing to maintain flawless pipeline synchronization and automated applicant tracking counts.
      `
    },
    drafts: {
      title: 'Draft Jobs Module Guide',
      icon: <FileText size={20} className="text-amber-500 animate-bounce" />,
      content: `
### Overview
The **Draft Jobs** workspace acts as a staging reservoir for unpublished, pending, or under-review job listings saved collaboratively by hiring managers.

### Comprehensive Instructions & Features
* **Resume & Iterative Editing**: Click on any archived draft card to reload its parameters back into the editor viewport, allowing you to update criteria, change salary bands, or refine skill tags.
* **Instant Publication Workflow**: Transition a validated draft directly to an **Active** production status with a single verification click, automatically generating public application endpoints.
* **Bulk Cleanup & Deletion**: Purge obsolete or expired draft entries permanently using the inline trash trigger to prevent workspace clutter.
* **Audit Tracking**: Review creation timestamps and author identifiers to trace who initiated each job blueprint.

> **Security Note:** Draft items are completely hidden from public job boards and external applicant listings until their operational status is explicitly updated to active.
      `
    },
    manage: {
      title: 'Manage Jobs Module Guide',
      icon: <Briefcase size={20} className="text-purple-500" />,
      content: `
### Overview
The **Manage Jobs** dashboard is the centralized command center used to monitor, filter, update status flags, and sunset active or closed job requisitions.

### Comprehensive Instructions & Features
* **Advanced Filtering & Search**: 
  * Utilize the real-time search bar to look up positions instantly by title, location keywords, or unique **Job ID**.
  * Use status isolation dropdown filters to toggle between *Active*, *Closed*, and *Draft* views.
* **Pagination Safety Protocol**: 
  * Seamlessly handles large-scale databases by rendering listings in optimized blocks (16 jobs per page).
  * Includes automatic bounds protection that re-indexes page pointers when items are filtered out or deleted.
* **Interactive Status Controls**: 
  * **View Modal**: Inspect comprehensive lists of mapped applicants, interview statuses, and full job descriptions.
  * **Close Position (X)**: Transition an active role immediately to a *Closed* state, halting new applications while preserving historical candidate data.
  * **Delete Action (Trash)**: Permanently eliminate obsolete job posts from the cluster database.
* **Database Synchronization**: Click the integrated **Refresh** icon next to action headers at any time to execute manual API re-fetching and load live database changes.

> **Tip:** Keeping your closed positions accurately marked prevents candidate confusion and maintains clean recruitment analytics across all dashboard metrics.
      `
    }
  };

  const currentDoc = docsData[activeModule] || docsData.manage;

  return (
    <div className="flex-1 flex flex-col h-full w-full gap-6 overflow-y-auto p-2 sm:p-4 transition-all duration-300">
      
      {/* Top Header & Animated Pills Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-extrabold text-lg tracking-tight">
            <BookOpen size={22} className="animate-spin-slow" />
            <span>Jobs & Recruitment Help Center</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive documentation and step-by-step instructions for managing your recruitment lifecycle.
          </p>
        </div>

        {/* Horizontal Navigation Pills with Smooth Hover & Scale Animations */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#080e1b] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          
          <button
            onClick={() => setActiveModule('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform active:scale-95 whitespace-nowrap ${
              activeModule === 'create'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle size={15} className={`transition-transform duration-300 ${activeModule === 'create' ? 'text-white rotate-90' : 'text-blue-500'}`} />
            <span>Create Job</span>
          </button>

          <button
            onClick={() => setActiveModule('drafts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform active:scale-95 whitespace-nowrap ${
              activeModule === 'drafts'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileText size={15} className={`transition-transform duration-300 ${activeModule === 'drafts' ? 'text-white scale-110' : 'text-amber-500'}`} />
            <span>Draft Jobs</span>
          </button>

          <button
            onClick={() => setActiveModule('manage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform active:scale-95 whitespace-nowrap ${
              activeModule === 'manage'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Briefcase size={15} className={`transition-transform duration-300 ${activeModule === 'manage' ? 'text-white scale-110' : 'text-purple-500'}`} />
            <span>Manage Jobs</span>
          </button>

        </div>
      </div>

      {/* Main Documentation Viewport Content Area with Fade-In Animation */}
      <div className="flex-1 bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 md:p-10 shadow-sm mb-6 transition-all duration-500 animate-fadeIn">
        
        {/* Header Title with Icon Container */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-6 transition-all duration-300">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-inner transform hover:rotate-6 transition-transform duration-300">
            {currentDoc.icon}
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse" /> Official Recruitment Protocol
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">{currentDoc.title}</h1>
          </div>
        </div>

        {/* Markdown Content Styling with Custom Component Animations */}
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
          <ReactMarkdown
            components={{
              h3: ({node, ...props}) => <h3 className="text-base font-bold text-slate-900 dark:text-white mt-6 mb-2 tracking-tight flex items-center gap-2" {...props} />,
              ul: ({node, ...props}) => <ul className="space-y-2.5 my-3 pl-5 list-disc marker:text-blue-500" {...props} />,
              ol: ({node, ...props}) => <ol className="space-y-2.5 my-3 pl-5 list-decimal marker:text-blue-500" {...props} />,
              li: ({node, ...props}) => <li className="text-slate-600 dark:text-slate-300 pl-1 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-slate-100 bg-blue-50 dark:bg-blue-950/40 px-1 py-0.5 rounded" {...props} />,
              blockquote: ({node, ...props}) => (
                <div className="my-5 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border-l-4 border-blue-500 text-slate-700 dark:text-slate-300 text-xs sm:text-sm shadow-sm transition-all duration-300 hover:translate-x-1" {...props} />
              ),
              code: ({node, inline, ...props}) => 
                inline ? (
                  <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 font-mono text-xs border border-slate-200 dark:border-slate-700" {...props} />
                ) : (
                  <code className="block p-4 rounded-xl bg-slate-900 dark:bg-[#050811] text-blue-300 font-mono text-xs border border-slate-800 overflow-x-auto shadow-inner" {...props} />
                )
            }}
          >
            {currentDoc.content}
          </ReactMarkdown>
        </div>

      </div>

    </div>
  );
};

export default Help;