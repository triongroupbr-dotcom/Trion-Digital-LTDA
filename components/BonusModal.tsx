import React from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Zap, X } from "lucide-react";

interface BonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const BonusModal: React.FC<BonusModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
      <Card className="w-full max-w-lg border-2 border-red-500 relative overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse-fast"></div>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-red-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8 text-center">
          <div className="mx-auto mb-6 bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center border border-red-500/50">
            <Zap className="w-8 h-8 text-red-400 animate-pulse" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-orbitron">
            ATENÇÃO, OPERADOR
          </h2>
          
          <p className="text-red-300 mb-6 text-sm md:text-base leading-relaxed">
            Detectamos um padrão de alta compatibilidade no seu perfil. Antes de finalizar, o sistema liberou um <span className="text-white font-bold underline">bônus secreto.</span>
          </p>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-bold text-red-400 text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              AULA SECRETA
            </h4>
            <ul className="text-xs text-red-300 space-y-2 list-disc pl-4">
              <li>O Melhor Oral da Vida Dela (AO VIVO)</li>
              <li>O Homem que elas desejam na cama</li>
              <li>Acesso Prioritário ao Suporte</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onAccept}
              className="w-full py-6 text-lg font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20"
            >
              RESGATAR BÔNUS E CONTINUAR
            </Button>
            <button 
              onClick={onClose}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline"
            >
              Não, eu não quero vantagens injustas
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};