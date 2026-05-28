"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function PrivacyDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Política de Privacidade</DialogTitle>
          <DialogDescription>Como tratamos os seus dados</DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Os dados pessoais informados no pré-cadastro e no cadastro completo (nome, e-mail, WhatsApp, CPF/CNPJ, dados da proposta e demais informações) são coletados e tratados pela INOVATEC-JP exclusivamente para fins de avaliação, comunicação e acompanhamento das inscrições do Edital Inova Soluções Públicas.
          </p>
          <p>
            O tratamento é realizado em conformidade com a <b>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</b>. Seus dados não são compartilhados com terceiros sem sua autorização, salvo por obrigação legal ou no âmbito do processo seletivo do edital.
          </p>
          <p>
            Você pode, a qualquer momento, solicitar acesso, correção, anonimização ou exclusão dos seus dados entrando em contato pelo e-mail <a href="mailto:hubdeinovacaoinovatec@gmail.com" className="font-semibold text-brand-blue hover:underline">hubdeinovacaoinovatec@gmail.com</a>.
          </p>
          <p>
            Os dados são mantidos pelo período necessário ao processo do edital e às obrigações legais aplicáveis, sendo armazenados em ambiente seguro com controles de acesso restritos.
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button className="rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white">Fechar</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PrivacyDialog;
