import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResume } from "../services/api";

export default function LandingPage() {
  const navigate = useNavigate();
  const [jdText, setJdText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!jdText || !file) return;
    setLoading(true);
    try {
      const result = await analyzeResume(jdText, file);
      navigate(`/results/${result.shareId}`);
    } catch (err) {
      alert("Analysis failed. Please check the console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const isFormValid = jdText.trim().length > 0 && file !== null;

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 text-left">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white   ">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-xl">acute</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 ">
              HireMatch AI
            </span>
          </div>
          <nav className="hidden md:flex md:gap-x-8">
            <a
              className="text-sm font-semibold leading-6 text-slate-700 hover:text-primary "
              href="#"
            >
              Features
            </a>
            <a
              className="text-sm font-semibold leading-6 text-slate-700 hover:text-primary "
              href="#"
            >
              Pricing
            </a>
            <a
              className="text-sm font-semibold leading-6 text-slate-700 hover:text-primary "
              href="#"
            >
              About
            </a>
          </nav>
          {/* <div className="flex items-center gap-4">
            <a className="hidden text-sm font-semibold leading-6 text-slate-900  lg:block" href="#">Log in</a>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors">
              Sign Up Free
            </button>
          </div> */}
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-slate-900  sm:text-7xl">
                Know your match before{" "}
                <span className="text-primary">you apply</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 ">
                Paste a job description, upload your resume, and get your
                compatibility score in seconds. Stop guessing and start landing
                more interviews.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-900 ">
                    Job Description
                  </label>
                  <span className="text-xs text-slate-500">
                    {jdText.length} / 5000 characters
                  </span>
                </div>
                <textarea
                  className="h-64 w-full rounded-xl border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-primary    "
                  placeholder="Paste the full job description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-900 ">
                  Your Resume
                </label>
                <div
                  onClick={() => !loading && fileInputRef.current?.click()}
                  className={`flex h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white/50 px-6 py-10 text-center transition-colors  /50 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-primary/50"}`}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <span className="material-symbols-outlined text-3xl">
                      upload_file
                    </span>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-600 ">
                    <p className="font-semibold text-slate-900 ">
                      {file ? file.name : "Drop your resume here"}
                    </p>
                    {!file && (
                      <p>
                        or{" "}
                        <span className="text-primary hover:underline">
                          click to upload
                        </span>
                      </p>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    PDF, DOCX (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!isFormValid || loading}
                className="group flex min-w-[280px] items-center justify-center gap-2 rounded-xl bg-primary px-8 py-5 text-lg font-bold text-white shadow-xl  hover:bg-primary/90 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Analyzing Match..." : "Analyze My Match"}
                {!loading && (
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                )}
                {loading && (
                  <span className="material-symbols-outlined animate-spin">
                    refresh
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24 ">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start gap-4 p-6 bg-white  rounded-2xl shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    analytics
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 ">
                    Instant Match Score
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 ">
                    Get a percentage score showing exactly how well your skills
                    align with the role requirements.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4 p-6 bg-white  rounded-2xl shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    schema
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 ">
                    Gap Analysis
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 ">
                    Identify missing keywords and experience areas to optimize
                    your resume before you hit submit.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4 p-6 bg-white  rounded-2xl shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    forum
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 ">
                    Interview Prep
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 ">
                    Receive personalized interview questions based on the
                    specific job and your unique background.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12  ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
                <span className="material-symbols-outlined text-sm">acute</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 ">
                HireMatch AI
              </span>
            </div>
            <p className="text-sm text-slate-500 ">
              © 2026 HireMatch AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
