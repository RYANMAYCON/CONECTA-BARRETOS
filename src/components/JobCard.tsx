import { JobPost } from "../types";
import { cn } from "../lib/utils";
import { Clock, MapPin, MessageSquare, Calendar, Users, Trash2 } from "lucide-react";

interface JobCardProps {
  job: JobPost;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}

export const JobCard = ({ job, onDelete, isOwner }: JobCardProps) => {
  const getWhatsAppUrl = (whatsapp: string) => {
    const clean = whatsapp.replace(/\D/g, "");
    if (clean.startsWith("55") && clean.length >= 12) {
      return `https://wa.me/${clean}`;
    }
    const formatted = clean.startsWith("0") ? clean.substring(1) : clean;
    return `https://wa.me/55${formatted}`;
  };

  const whatsappUrl = getWhatsAppUrl(job.whatsapp);

  const urgencyLabel = {
    immediate: "Imediato",
    weekend: "Fim de Semana",
    flexible: "Flexível"
  };

  const urgencyClass = {
    immediate: "bg-red-50 text-red-600 border-red-100",
    weekend: "bg-orange-50 text-orange-600 border-orange-100",
    flexible: "bg-blue-50 text-blue-600 border-blue-100"
  };

  return (
    <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm hover:shadow-[0_30px_70px_-10px_rgba(37,99,235,0.12)] hover:-translate-y-2 transition-all flex flex-col gap-6 group relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-5 flex items-center gap-2">
        {isOwner && onDelete && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onDelete(job.id!);
            }}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all shadow-sm"
            title="Remover vaga"
          >
            <Trash2 size={16} />
          </button>
        )}
        <span className={cn(
          "text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border shadow-sm",
          urgencyClass[job.urgency]
        )}>
          {urgencyLabel[job.urgency]}
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 pr-24">
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-blue transition-colors leading-[1.1]">
            {job.title}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Users size={14} className="text-slate-300" />
            Empresa: {job.creatorName}
          </p>
        </div>

        <div className="space-y-3 py-4 border-y border-slate-50/60">
          <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Descrição da Oportunidade</h4>
          <p className="text-[14px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-[11px] font-black text-slate-600 uppercase tracking-tight">
            <div className="p-2.5 bg-blue-50/50 rounded-[1rem]">
              <Clock size={18} className="text-primary-blue" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-300 leading-none mb-1">Carga Horária</span>
              <span className="truncate">{job.hours}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-black text-slate-600 uppercase tracking-tight">
            <div className="p-2.5 bg-blue-50/50 rounded-[1rem]">
              <MapPin size={18} className="text-primary-blue" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-300 leading-none mb-1">Localização</span>
              <span className="truncate">{job.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 mt-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 bg-whatsapp-green text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
        >
          <MessageSquare size={18} />
          Entrar em Contato
        </a>
      </div>
    </div>
  );
};
