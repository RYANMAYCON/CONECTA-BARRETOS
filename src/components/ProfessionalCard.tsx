import { MessageCircle, Star, ShieldCheck, MapPin, Trash2 } from "lucide-react";
import { Professional } from "../types";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface ProfessionalCardProps {
  professional: Professional;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}

export const ProfessionalCard = ({ professional, onDelete, isOwner }: ProfessionalCardProps) => {
  const getWhatsAppUrl = (whatsapp: string) => {
    const clean = whatsapp.replace(/\D/g, "");
    if (clean.startsWith("55") && clean.length >= 12) {
      return `https://wa.me/${clean}`;
    }
    const formatted = clean.startsWith("0") ? clean.substring(1) : clean;
    return `https://wa.me/55${formatted}`;
  };

  const whatsappUrl = getWhatsAppUrl(professional.whatsapp);
  const initials = (professional.companyName || (professional as any).name || "P")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "bg-white rounded-[2rem] p-7 border border-slate-100 relative flex flex-col gap-6 transition-all hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.12)] hover:-translate-y-2 h-full justify-between group",
        professional.isPremium && "ring-[3px] ring-amber-400/30 border-amber-200"
      )}
    >
      <div className="absolute top-0 right-0 p-5 flex items-center gap-2">
        {isOwner && onDelete && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onDelete(professional.id!);
            }}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all shadow-sm z-20"
            title="Remover perfil"
          >
            <Trash2 size={16} />
          </button>
        )}
        {professional.isPremium && (
          <span className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] px-5 py-2 rounded-full font-black tracking-[0.2em] z-10 shadow-2xl border-2 border-white flex items-center gap-2 animate-pulse">
            <ShieldCheck size={14} />
            PREMIUM
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-5 items-center">
          <div 
            className={cn(
              "w-20 h-20 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-inner shrink-0",
              professional.isPremium ? "bg-amber-100 text-amber-700" : "bg-slate-50 text-slate-300"
            )}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-slate-900 group-hover:text-primary-blue transition-colors leading-[1.1] mb-1">
              {professional.companyName || (professional as any).name}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-primary-blue uppercase tracking-widest bg-blue-50/50 w-fit px-2 py-1 rounded-md">
              {professional.service}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 py-2 border-y border-slate-50/60">
          <div className="flex items-center gap-2 text-[13px] font-black text-amber-600">
            <Star size={16} className="fill-amber-500 text-amber-500" />
            <span>{professional.rating?.toFixed(1) || "NOVO"}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <MapPin size={14} className="text-slate-300" />
            <span>{professional.city}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Resumo Profissional (Experiência)</h4>
          <p className="text-[14px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
            {professional.description}
          </p>
        </div>
      </div>

      <div className="pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-whatsapp-green hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95"
        >
          <MessageCircle size={18} />
          <span>Falar com Profissional</span>
        </a>
      </div>
    </div>
  );
};
