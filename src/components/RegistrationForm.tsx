import React, { useState } from "react";
import { CATEGORIES, TOP_CITIES_SP_INTERIOR } from "../types";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function RegistrationForm({ onClose, onSuccess }: RegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    service: "",
    description: "",
    whatsapp: "",
    city: "",
    category: "outros",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "professionals"), {
        ...formData,
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        isPremium: false,
        rating: 0,
      });
      setDone(true);
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error adding professional:", error);
      alert("Houve um erro ao salvar os dados. Tente novamente.");
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
                <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight uppercase">Conectar Negócio</h2>
                <p className="text-sm text-slate-500 font-medium tracking-tight">O Conecta Barretos ajuda sua empresa a ser encontrada localmente.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400">Nome da Empresa / Profissional</label>
                    <input
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300"
                      placeholder="Ex: João Elétrica"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400">Cidade (Interior SP)</label>
                    <input
                      required
                      list="cities"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300"
                      placeholder="Busque sua cidade..."
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                    />
                    <datalist id="cities">
                      {TOP_CITIES_SP_INTERIOR.map(city => <option key={city} value={city} />)}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1.5 font-bold">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400">Título do Serviço Principal</label>
                  <input
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300"
                    placeholder="Ex: Eletricista Residencial, Consultoria de Marketing"
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400">WhatsApp (DDD + Número)</label>
                    <input
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300"
                      placeholder="Ex: 11999999999"
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400">Setor do Negócio</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 font-bold">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400">Resumo de Experiência / O que você já fez?</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue transition-all outline-none text-sm placeholder:text-slate-300 resize-none font-medium"
                    placeholder="Conte sobre seus trabalhos anteriores, anos de experiência e suas principais habilidades..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-blue py-4 rounded-xl text-white font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 mt-4 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                >
                  {loading ? "Processando..." : "Publicar Empresa no Conecta Barretos"}
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
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={48} className="text-whatsapp-green" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Negócio Ativo!</h2>
              <p className="text-sm text-slate-500 font-medium">Sua empresa agora é visível para milhares de clientes locais.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
