import React, { useState } from "react";
import { auth, signInWithGoogle, signInWithEmail, signUpWithEmail } from "../firebase";
import { X, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      onSuccess();
      onClose();
    } catch (error) {}
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-sm p-8 relative shadow-2xl overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} className="text-slate-400" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            {mode === "login" ? "Entrar no Conecta Barretos" : "Criar sua Conta"}
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Conectando o interior de SP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seu Nome</label>
              <input
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm"
                placeholder="Ex: Pedro Alvares"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</label>
            <input
              required
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-blue py-4 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] mt-2"
          >
            {loading ? "Processando..." : (mode === "login" ? "Entrar" : "Cadastrar Agora")}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ou</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full mt-4 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Google
        </button>

        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          {mode === "login" ? "Não tem uma conta?" : "Já possui conta?"}{" "}
          <button 
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-primary-blue hover:underline"
          >
            {mode === "login" ? "Cadastrar-se" : "Fazer Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
