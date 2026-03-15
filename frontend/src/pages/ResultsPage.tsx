import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAnalysisResult, type AnalysisResponse } from '../services/api';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('gap'); // 'gap', 'questions', 'tips'
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    getAnalysisResult(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Failed to load result", err);
        alert("Result not found or expired.");
        navigate('/');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        <span className="material-symbols-outlined animate-spin text-4xl">refresh</span>
      </div>
    );
  }

  // Calculate SVG stroke offset for the circular progress bar (circumference = 552.92)
  const scoreCircumference = 552.92;
  const scoreOffset = scoreCircumference - (data.overallScore / 100) * scoreCircumference;
  
  let scoreColorClass = "text-primary";
  if (data.overallScore < 40) scoreColorClass = "text-rose-500";
  else if (data.overallScore < 70) scoreColorClass = "text-amber-500";

  return (
    <div className="bg-background-light  font-display text-slate-900  min-h-screen pb-24">
      <header className="sticky top-0 z-50 bg-white /80  border-b border-slate-200 ">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigate('/')}
          >
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <span className="material-symbols-outlined text-2xl">analytics</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">HireMatch AI</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <section className="flex flex-col items-center mb-10">
          <div className="relative flex items-center justify-center w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-slate-200 dark:text-slate-800" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
              <circle className={scoreColorClass} cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray={scoreCircumference} strokeDashoffset={scoreOffset} strokeWidth="12" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-900 ">{data.overallScore}</span>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Score</span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-1">{data.verdict}</h1>
            <p className="text-slate-500 ">Match generated based on your resume and the specified job description.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white  border border-slate-200  rounded-full shadow-sm">
              <span className={`w-2 h-2 rounded-full ${data.breakdown.skillsMatch >= 70 ? 'bg-primary' : data.breakdown.skillsMatch >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
              <span className="text-sm font-semibold">Skills Match: {data.breakdown.skillsMatch}%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white  border border-slate-200  rounded-full shadow-sm">
              <span className={`w-2 h-2 rounded-full ${data.breakdown.experienceRelevance >= 70 ? 'bg-primary' : data.breakdown.experienceRelevance >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
              <span className="text-sm font-semibold">Experience: {data.breakdown.experienceRelevance}%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white  border border-slate-200  rounded-full shadow-sm">
              <span className={`w-2 h-2 rounded-full ${data.breakdown.educationFit >= 70 ? 'bg-primary' : data.breakdown.educationFit >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
              <span className="text-sm font-semibold">Education: {data.breakdown.educationFit}%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white  border border-slate-200  rounded-full shadow-sm">
              <span className={`w-2 h-2 rounded-full ${data.breakdown.keywordsCoverage >= 70 ? 'bg-primary' : data.breakdown.keywordsCoverage >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
              <span className="text-sm font-semibold">Keywords: {data.breakdown.keywordsCoverage}%</span>
            </div>
          </div>
        </section>

        <div className="border-b border-slate-200  mb-8">
          <nav aria-label="Tabs" className="flex gap-8 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('gap')}
              className={`px-1 py-4 text-sm font-bold flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'gap' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 '}`}
            >
              <span className="material-symbols-outlined text-lg">analytics</span> Gap Analysis
            </button>
            <button 
              onClick={() => setActiveTab('questions')}
              className={`px-1 py-4 text-sm font-bold flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'questions' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 '}`}
            >
              <span className="material-symbols-outlined text-lg">question_answer</span> Interview Questions
            </button>
            <button 
               onClick={() => setActiveTab('tips')}
               className={`px-1 py-4 text-sm font-bold flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'tips' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 '}`}
             >
              <span className="material-symbols-outlined text-lg">edit_note</span> Resume Tips
            </button>
          </nav>
        </div>

        {activeTab === 'gap' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white  p-6 rounded-xl border border-slate-200  shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <h3 className="font-bold text-lg">Skills You Have</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skillsFound.length > 0 ? data.skillsFound.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium">{skill}</span>
                  )) : (
                    <span className="text-slate-500 text-sm">No significant matching skills found.</span>
                  )}
                </div>
              </div>

              <div className="bg-white  p-6 rounded-xl border border-slate-200  shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-rose-500">error</span>
                  <h3 className="font-bold text-lg">Skills Missing</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skillsMissing.length > 0 ? data.skillsMissing.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-sm font-medium">{skill}</span>
                  )) : (
                     <span className="text-slate-500 text-sm">No missing skills identified!</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">lightbulb</span>
                What to add to your resume
              </h3>
              <ul className="space-y-4">
                {data.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-1 shrink-0">arrow_forward</span>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium text-slate-500">Original:</span> {suggestion.original}</p>
                      <p><span className="font-medium text-primary">Improved:</span> {suggestion.improved}</p>
                      <p className="text-slate-600 italic">Why: {suggestion.reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Predicted Interview Questions</h2>
              <button 
                className="flex items-center gap-2 text-sm font-bold text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  const qText = data.interviewQuestions.map(q => `Q: ${q.question}\nA: ${q.hint}`).join('\n\n');
                  navigator.clipboard.writeText(qText);
                  alert('Copied to clipboard!');
                }}
              >
                <span className="material-symbols-outlined text-base">content_copy</span> Copy All Questions
              </button>
            </div>
            
            {data.interviewQuestions.map((q, idx) => (
              <div key={idx} className="bg-white  border border-slate-200  rounded-xl overflow-hidden shadow-sm group">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                        q.category === 'Technical' ? 'bg-blue-100 text-blue-700  ' :
                        q.category === 'Behavioural' ? 'bg-purple-100 text-purple-700  ' :
                        'bg-amber-100 text-amber-700  '
                      }`}>
                        {q.category}
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-800 ">"{q.question}"</p>
                </div>
                <div className="bg-slate-50  p-6 border-t border-slate-100 ">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">What a good answer looks like</h4>
                  <p className="text-sm text-slate-600 ">{q.hint}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="mt-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-primary/5  p-8 rounded-xl border border-primary/30 text-center">
               <h3 className="font-bold text-lg mb-2">Review your suggestions</h3>
               <p className="text-sm text-slate-600  max-w-lg mx-auto">
                 We've analyzed your gaps and found areas to optimize. Head back to the Gap Analysis tab to see exactly what to add.
               </p>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90   border-t border-slate-200  py-4 z-50">
        <div className="max-w-4xl mx-auto px-4 flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-slate-200  text-slate-900  py-3 rounded-lg font-bold hover:bg-slate-300  transition-all"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
          >
            <span className="material-symbols-outlined text-xl">share</span>
            Copy Shareable Link
          </button>
        </div>
      </div>
    </div>
  );
}
