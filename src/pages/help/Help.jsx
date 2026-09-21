import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  BookOpen, 
  Briefcase, 
  Users, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

const Help = () => {
  const [activeModule, setActiveModule] = useState('jobs');

  const docsData = {
    jobs: {
      title: 'Job Postings Management',
      icon: <Briefcase size={20} className="text-blue-500" />,
      content: `
### Overview
The **Job Postings** module allows you to create, monitor, filter, and close job openings across different departments (Engineering, Design, Marketing, etc.).

### Key Features
* **Filtering & Search**: Quickly look up positions by title, location, or unique **Job ID** using the search bar. Use dropdown filters to isolate *Active*, *Closed*, or *Draft* statuses.
* **Pagination Safety**: Handles large lists smoothly (16 jobs per page) with automatic bounds protection when items are filtered or deleted.
* **Status Controls**: 
  * **View**: Inspect full applicant information and job specifications.
  * **Close Position (X)**: Change an active role's status to Closed without deleting it.
  * **Delete (Trash)**: Permanently remove old postings from the system.

> **Tip:** You can click the **Refresh** icon next to the "Post New Job" button anytime to fetch the latest updates from your database.
      `
    },
    candidates: {
      title: 'Candidate Management',
      icon: <Users size={20} className="text-purple-500" />,
      content: `
### Overview
The **Candidate Management** section tracks all applicants who have applied for your open listings. 

### Key Features
* **Applicant Pipeline**: Move candidates through different stages (Applied, Interviewing, Offered, Hired, Rejected).
* **Resume Preview**: Access uploaded resumes directly from the candidate profile view.
* **Direct Actions**: Schedule interviews or send automated communication notifications.

> **Note:** Make sure candidates are mapped correctly to their corresponding **Job ID** to maintain accurate applicant counts on your dashboard cards.
      `
    },
    settings: {
      title: 'System Settings',
      icon: <Settings size={20} className="text-emerald-500" />,
      content: `
### Overview
Configure global configurations, user roles, security preferences, and integration webhooks for EZOjobs.

### Configuration Areas
* **Profile Management**: Update administrative account credentials.
* **Department Tags**: Add or modify internal department categories used in job posting dropdowns.
* **Theme Preferences**: Switch between system display configurations.

> **Security Warning:** Ensure your API keys and environment variables remain secure and are never exposed publicly on the frontend client.
      `
    }
  };

  const currentDoc = docsData[activeModule] || docsData.jobs;

  return (
    <div className="flex-1 flex flex-col h-full w-full gap-6 overflow-y-auto">
      
      {/* Top Header & Pills Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-extrabold text-lg tracking-tight">
            <BookOpen size={22} />
            <span>Help Center</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Documentation and user guides for all application modules.
          </p>
        </div>

        {/* Horizontal Navigation Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#080e1b] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveModule('jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeModule === 'jobs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase size={15} className={activeModule === 'jobs' ? 'text-white' : 'text-blue-500'} />
            <span>Job Postings</span>
          </button>

          <button
            onClick={() => setActiveModule('candidates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeModule === 'candidates'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users size={15} className={activeModule === 'candidates' ? 'text-white' : 'text-purple-500'} />
            <span>Candidates</span>
          </button>

          <button
            onClick={() => setActiveModule('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeModule === 'settings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings size={15} className={activeModule === 'settings' ? 'text-white' : 'text-emerald-500'} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Documentation Viewport Content Area */}
      <div className="flex-1 bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 md:p-10 shadow-sm mb-6">
        
        {/* Header Title */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            {currentDoc.icon}
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">Documentation Guide</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{currentDoc.title}</h1>
          </div>
        </div>

        {/* Markdown Content Styling Overrides */}
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
          <ReactMarkdown
            components={{
              h3: ({node, ...props}) => <h3 className="text-base font-bold text-slate-900 dark:text-white mt-6 mb-2 tracking-tight" {...props} />,
              ul: ({node, ...props}) => <ul className="space-y-2 my-3 pl-5 list-disc marker:text-blue-500" {...props} />,
              ol: ({node, ...props}) => <ol className="space-y-2 my-3 pl-5 list-decimal marker:text-blue-500" {...props} />,
              li: ({node, ...props}) => <li className="text-slate-600 dark:text-slate-300 pl-1" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-slate-100" {...props} />,
              blockquote: ({node, ...props}) => (
                <div className="my-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 text-slate-700 dark:text-slate-300 text-xs sm:text-sm shadow-sm" {...props} />
              ),
              code: ({node, inline, ...props}) => 
                inline ? (
                  <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 font-mono text-xs" {...props} />
                ) : (
                  <code className="block p-4 rounded-xl bg-slate-900 dark:bg-[#050811] text-blue-300 font-mono text-xs border border-slate-800 overflow-x-auto" {...props} />
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