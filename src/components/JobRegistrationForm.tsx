import React, { useState } from "react";
import { TOP_CITIES_SP_INTERIOR } from "../types";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface JobRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function JobRegistrationForm({ onClose, onSuccess }: JobRegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hours: "",
    urgency: "immediate" as const,
    whatsapp: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "jobs"), {
        ...formData,
        ownerId: auth.currentUser.uid,
        creatorName: auth.currentUser.displayName || "Empresa",
        createdAt: serverTimestamp(),
      });
      setDone(true);
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Erro ao publicar vaga. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-xl p-8 relative overflow-hidden shadow-2xl border border-slate-200"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10">
          <X size={20} className="text-slate-400" />
        </button>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tighter uppercase">Anunciar Oportunidade</h2>
                <p className="text-sm text-slate-500 font-bold tracking-tight uppercase">Encontre o profissional certo para sua urgência.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 font-bold">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400">Título do Serviço (O que você precisa?)</label>
                  <input
                    required
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300 font-bold"
                    placeholder="Ex: Atendente Urgente, Eletricista para Sábado"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400">Cidade (Interior SP)</label>
                    <input
                      required
                      list="cities"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm"
                      placeholder="Busque sua cidade..."
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                    />
                    <datalist id="cities">
                      {TOP_CITIES_SP_INTERIOR.map(city => <option key={city} value={city} />)}
                    </datalist>
                  </div>
                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400">Urgência</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm cursor-pointer"
                      value={formData.urgency}
                      onChange={e => setFormData({ ...formData, urgency: e.target.value as any })}
                    >
                      <option value="immediate">Urgente / Imadiato</option>
                      <option value="weekend">Apenas Fim de Semana</option>
                      <option value="flexible">Flexível / Recorrente</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400">Horário e Diária</label>
                    <input
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300"
                      placeholder="Ex: 08h às 18h - R$ 150,00"
                      value={formData.hours}
                      onChange={e => setFormData({ ...formData, hours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400">WhatsApp para Contato</label>
                    <input
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300"
                      placeholder="Ex: 11999999999"
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 font-bold">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400">Descrição Detalhada do Serviço</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300 resize-none"
                    placeholder="Descreva o que será feito, requisitos e diferenciais..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 py-4 rounded-xl text-white font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 mt-4 shadow-xl active:scale-[0.98]"
                >
                  {loading ? "Publicando..." : "Anunciar Vaga Imediata"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={48} className="text-primary-blue" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Vaga Publicada!</h2>
              <p className="text-sm text-slate-500 font-medium">Sua oportunidade está visível no feed de vagas imediatas.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
