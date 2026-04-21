import { useEffect, useState, useMemo } from 'react';
import { db, auth } from './firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  deleteDoc,
  doc
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Search, Plus, LogIn, LogOut, LayoutGrid, Trash2, MapPin, Briefcase, Users, ShieldCheck } from 'lucide-react';
import { Professional, JobPost, CATEGORIES, Category } from './types';
import { ProfessionalCard } from './components/ProfessionalCard';
import { JobCard } from './components/JobCard';
import { RegistrationForm } from './components/RegistrationForm';
import { JobRegistrationForm } from './components/JobRegistrationForm';
import { AuthModal } from './components/AuthModal';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [viewMode, setViewMode] = useState<"jobs" | "professionals">("jobs");

  const isAdmin = user?.email === 'ryanamancio857@gmail.com';

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const qPro = query(collection(db, "professionals"), orderBy("createdAt", "desc"));
    const unsubscribePro = onSnapshot(qPro, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Professional[];
      setProfessionals(data);
    });

    const qJobs = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsubscribeJobs = onSnapshot(qJobs, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobPost[];
      setJobs(data);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePro();
      unsubscribeJobs();
    };
  }, []);

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(p => {
      const matchesSearch = 
        (p.companyName || (p as any).name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [professionals, searchTerm, selectedCategory]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      return j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             j.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             j.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
             j.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [jobs, searchTerm]);

  const handleDelete = async (id: string, collectionName: string) => {
    if (window.confirm("Deseja realmente remover este registro definitivamente?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        alert("Removido com sucesso!");
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Erro ao remover. Você tem permissão para isso?");
      }
    }
  };

  const getCategoryCount = (catValue: Category | "all") => {
    if (catValue === "all") return professionals.length;
    return professionals.filter(p => p.category === catValue).length;
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans flex flex-col">
      {/* Navbar */}
      <nav className="h-20 bg-primary-blue flex items-center justify-between px-6 sticky top-0 z-50 shadow-lg shadow-blue-500/20">
        <div className="text-2xl font-black text-white tracking-tighter uppercase">CONECTA BARRETOS</div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-3 mr-4">
                <button 
                  onClick={() => setShowJobForm(true)}
                  className="px-5 py-2.5 text-[11px] font-black uppercase text-primary-blue bg-white rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  Postar Vaga
                </button>
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 text-[11px] font-black uppercase text-white bg-blue-400/20 border border-white/20 rounded-xl hover:bg-blue-400/30 transition-all active:scale-95"
                >
                  Perfil Profissional
                </button>
              </div>

              {isAdmin && (
                <button 
                  onClick={() => setIsAdminView(!isAdminView)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black uppercase transition-all mr-2",
                    isAdminView ? "bg-white text-primary-blue" : "text-white hover:bg-white/10"
                  )}
                >
                   ADMIN
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white font-black text-sm">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowAuth(true)}
                className="px-5 py-2.5 text-xs font-black uppercase text-white hover:bg-white/10 rounded-xl transition-all"
              >
                Entrar
              </button>
              <button 
                onClick={() => setShowAuth(true)}
                className="px-6 py-2.5 text-xs font-black uppercase text-primary-blue bg-white rounded-xl hover:bg-slate-50 transition-all shadow-xl active:scale-95"
              >
                Começar
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Actions (Sticky Bottom potentially, but let's keep it clean) */}
      {user && (
        <div className="sm:hidden bg-white border-b border-border-light px-6 py-3 flex gap-2 overflow-x-auto whitespace-nowrap">
          <button 
            onClick={() => setShowJobForm(true)}
            className="px-4 py-2 text-[10px] font-black uppercase text-slate-800 bg-slate-100 rounded-lg"
          >
            Postar Vaga
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-[10px] font-black uppercase text-white bg-primary-blue rounded-lg"
          >
            Perfil Profissional
          </button>
        </div>
      )}

      {/* Mode Switcher */}
      {!isAdminView && (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-10">
            <button 
              onClick={() => setViewMode("jobs")}
              className={cn(
                "h-full flex items-center gap-2.5 text-xs font-black uppercase transition-all border-b-4",
                viewMode === "jobs" ? "border-primary-blue text-primary-blue" : "border-transparent text-slate-300 hover:text-slate-500"
              )}
            >
              <Briefcase size={18} />
              Vagas de Urgência
            </button>
            <button 
              onClick={() => setViewMode("professionals")}
              className={cn(
                "h-full flex items-center gap-2.5 text-xs font-black uppercase transition-all border-b-4",
                viewMode === "professionals" ? "border-primary-blue text-primary-blue" : "border-transparent text-slate-300 hover:text-slate-500"
              )}
            >
              <Users size={18} />
              Talentos Locais
            </button>
          </div>
        </div>
      )}

      {/* Hero Search Section */}
      {!isAdminView && (
        <section className="relative px-6 py-28 overflow-hidden text-center bg-white border-b border-blue-50">
          <div className="absolute top-0 -translate-x-1/2 left-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent -z-10" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-blue/10 blur-[150px] rounded-full -z-10 animate-pulse" />
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-400/5 blur-[100px] rounded-full -z-10" />
          
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-1000">
            <div className="space-y-5">
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl">
                  <ShieldCheck size={14} className="text-primary-blue" />
                  Barretos e Região • Marketplace Profissional
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter sm:text-7xl text-slate-900 uppercase leading-[0.85]">
                {viewMode === "jobs" ? (
                  <>Vagas de <span className="text-primary-blue drop-shadow-sm">Urgência</span> em Barretos</>
                ) : (
                  <>Contrate em <span className="text-primary-blue drop-shadow-sm">Barretos</span> e Região</>
                )}
              </h1>
              <p className="max-w-3xl mx-auto text-lg font-black text-slate-400 uppercase tracking-widest leading-none">
                {viewMode === "jobs" 
                  ? "Conectando Diaristas, Atendentes e Suportes em Tempo Real na Nossa Região." 
                  : "A maior vitrine de talentos locais para sua empresa agora em Barretos."}
              </p>
            </div>

            <div className="max-w-2xl mx-auto pt-6">
              <div className="flex flex-col gap-3 p-2.5 transition-all bg-white border shadow-[0_30px_60px_-15px_rgba(37,99,235,0.15)] sm:flex-row rounded-[2rem] border-slate-100 hover:border-primary-blue/20">
                <div className="relative flex items-center flex-1">
                  <Search className="absolute left-6 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    placeholder={viewMode === "jobs" ? "Ex: Lanchonete, Diarista..." : "Ex: Mecânico, Pintor..."}
                    className="w-full py-5 pl-14 pr-6 text-base font-bold bg-transparent outline-none text-slate-900 placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="px-10 py-5 text-xs font-black text-white uppercase tracking-widest bg-primary-blue rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-xl active:scale-95 group flex items-center justify-center gap-2">
                  Buscar Agora
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid Content */}
      <main className={cn(
        "max-w-7xl mx-auto px-6 py-8 flex-1 w-full",
        !isAdminView && viewMode === "professionals" && "grid md:grid-cols-[240px_1fr] gap-8"
      )}>
        {loading ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Sincronizando Barretos...</p>
          </div>
        ) : (
          <>
            {!isAdminView && viewMode === "professionals" && (
              <aside className="space-y-8 hidden md:block">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Setor do Profissional</h4>
              <nav className="flex flex-col gap-1.5">
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-[11px] font-black uppercase transition-all flex justify-between items-center group tracking-wider",
                    selectedCategory === "all" ? "bg-primary-blue text-white shadow-lg shadow-blue-500/20" : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-100"
                  )}
                >
                  <span>Todos</span>
                  <span className={cn(
                    "text-[10px] px-2.5 py-1 rounded-lg font-black",
                    selectedCategory === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  )}>{getCategoryCount("all")}</span>
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-[11px] font-black uppercase transition-all flex justify-between items-center group text-left tracking-wider",
                      selectedCategory === cat.value ? "bg-primary-blue text-white shadow-lg shadow-blue-500/20" : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-100"
                    )}
                  >
                    <span>{cat.label}</span>
                    <span className={cn(
                      "text-[10px] px-2.5 py-1 rounded-lg font-black",
                      selectedCategory === cat.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}>{getCategoryCount(cat.value)}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        <section className="flex-1">
          {isAdminView ? (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Admin CONECTA BARRETOS</h2>
                  <p className="text-sm text-slate-500 font-medium">Controle total da plataforma.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode("jobs")} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest", viewMode === "jobs" ? "bg-blue-50 text-primary-blue shadow-sm" : "bg-slate-100")}>Gerenciar Vagas</button>
                  <button onClick={() => setViewMode("professionals")} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest", viewMode === "professionals" ? "bg-blue-50 text-primary-blue shadow-sm" : "bg-slate-100")}>Gerenciar Talentos</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-border-light shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-border-light">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Informação</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cidade & Data</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {(viewMode === "jobs" ? jobs : professionals).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-black uppercase truncate max-w-[200px]">
                              {viewMode === "jobs" ? (item as JobPost).title : ((item as Professional).companyName || (item as any).name)}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[300px] font-bold">
                              {item.description}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-slate-700 uppercase">{item.city}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                              {item.createdAt?.toDate().toLocaleDateString('pt-BR')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => item.id && handleDelete(item.id, viewMode === "jobs" ? "jobs" : "professionals")}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === "jobs" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            )}>
              <AnimatePresence>
                {viewMode === "jobs" ? (
                  filteredJobs.length > 0 ? (
                    filteredJobs.map(j => (
                      <motion.div 
                        key={j.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                      >
                        <JobCard 
                          job={j} 
                          onDelete={(id) => handleDelete(id, "jobs")}
                          isOwner={user?.uid === j.ownerId || isAdmin}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <NoResults text="Nenhuma vaga encontrada" />
                  )
                ) : (
                  filteredProfessionals.length > 0 ? (
                    filteredProfessionals.map(p => (
                      <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                      >
                        <ProfessionalCard 
                          professional={p} 
                          onDelete={(id) => handleDelete(id, "professionals")}
                          isOwner={user?.uid === p.ownerId || isAdmin}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <NoResults text="Nenhum profissional encontrado" />
                  )
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
        </>
        )}
      </main>

      <footer className="mt-auto px-6 py-20 bg-slate-900 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-3xl font-black text-white tracking-widest uppercase">CONECTA BARRETOS</div>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-loose">
            Marketplace de talentos e vagas rápidas focado em Barretos e Região. Conectando quem precisa com quem sabe fazer no interior Paulista.
          </p>
          <div className="pt-8 text-[9px] text-white/20 font-bold uppercase tracking-widest">
            © 2026 Conecta Barretos • Todos os direitos reservados
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showForm && (
          <RegistrationForm 
            onClose={() => setShowForm(false)} 
            onSuccess={() => {}}
          />
        )}
        {showJobForm && (
          <JobRegistrationForm 
            onClose={() => setShowJobForm(false)} 
            onSuccess={() => {}}
          />
        )}
        {showAuth && (
          <AuthModal 
            onClose={() => setShowAuth(false)}
            onSuccess={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NoResults({ text }: { text: string }) {
  return (
    <div className="col-span-full py-32 text-center space-y-6">
      <div className="text-slate-100 flex justify-center animate-bounce">
        <Search size={80} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">{text}</h3>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.1em]">Tente buscar em cidades vizinhas como Colina ou Olímpia.</p>
      </div>
    </div>
  );
}
