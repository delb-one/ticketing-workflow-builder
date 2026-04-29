import type { Edge } from '@xyflow/react';
import type { CustomNode } from '@/lib/store';
import type { DecisionOutcome, NodeConfig, NodeType } from '@/lib/simulation/types';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  nodes: CustomNode[];
  edges: Edge[];
}

const RAW_WORKFLOW_TEMPLATES = [
  {
    id: "l1-l2-escalation",
    name: "1. Escalation L1 -> L2",
    description: "Flusso base di escalation con un solo punto decisionale.",
    nodes: [
      {
        id: "start",
        data: { label: "Inizio", description: "Contesto: Inizio.", type: "start", id: "start", config: {} },
        position: { x: 250, y: 0 },
        type: "canvas",
      },
      {
        id: "l1-actor",
        data: {
          label: "Tecnico L1", description: "Contesto: Tecnico L1.", type: "actor",
          id: "l1-tech",
          config: {},
        },
        position: { x: 150, y: 100 },
        type: "canvas",
      },
      {
        id: "resolve-check",
        data: {
          label: "Riesce a risolvere?", description: "Contesto: Riesce a risolvere?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 150, y: 250 },
        type: "canvas",
      },
      {
        id: "escalate-l2",
        data: {
          label: "Escalation a L2", description: "Contesto: Escalation a L2.", type: "automation",
          id: "escalation",
          config: {},
        },
        position: { x: 350, y: 250 },
        type: "canvas",
      },
      {
        id: "l2-actor",
        data: {
          label: "Tecnico L2", description: "Contesto: Tecnico L2.", type: "actor",
          id: "l2-tech",
          config: {},
        },
        position: { x: 350, y: 400 },
        type: "canvas",
      },
      {
        id: "resolve-l2",
        data: {
          label: "Risolvi Ticket", description: "Contesto: Risolvi Ticket.", type: "action",
          id: "resolve",
          config: {},
        },
        position: { x: 150, y: 400 },
        type: "canvas",
      },
      {
        id: "close",
        data: { label: "Chiudi Ticket", description: "Contesto: Chiudi Ticket.", type: "end", id: "end", config: {} },
        position: { x: 250, y: 550 },
        type: "canvas",
      },
    ],
    edges: [
      { id: "start-l1", source: "start", target: "l1-actor" },
      { id: "l1-check", source: "l1-actor", target: "resolve-check" },
      {
        id: "check-resolve",
        source: "resolve-check",
        target: "resolve-l2",
        label: "Si",
      },
      {
        id: "check-escalate",
        source: "resolve-check",
        target: "escalate-l2",
        label: "No",
      },
      { id: "escalate-l2-actor", source: "escalate-l2", target: "l2-actor" },
      { id: "l2-resolve", source: "l2-actor", target: "close" },
      { id: "resolve-close", source: "resolve-l2", target: "close" },
    ],
  },
  {
    id: "request-fulfillment",
    name: "2. Evasione Richieste",
    description:
      "Flusso medio con validazione, approvazione e assegnazione automatica.",
    nodes: [
      {
        id: "start",
        data: {
          label: "Richiesta Aperta", description: "Contesto: Richiesta Aperta.", type: "start",
          id: "start",
          config: {},
        },
        position: { x: 300, y: 0 },
        type: "canvas",
      },
      {
        id: "client",
        data: { label: "Cliente", description: "Contesto: Cliente.", type: "actor", id: "client", config: {} },
        position: { x: 300, y: 100 },
        type: "canvas",
      },
      {
        id: "validate",
        data: {
          label: "Valida Ticket", description: "Contesto: Valida Ticket.", type: "action",
          id: "validate",
          config: {},
        },
        position: { x: 300, y: 220 },
        type: "canvas",
      },
      {
        id: "complete-check",
        data: {
          label: "Dati completi?", description: "Contesto: Dati completi?.", type: "decision",
          id: "condition",
          config: { decisionType: "boolean" },
        },
        position: { x: 300, y: 340 },
        type: "canvas",
      },
      {
        id: "notify-missing",
        data: {
          label: "Notifica", description: "Contesto: Notifica.", type: "automation",
          id: "notify",
          config: {},
        },
        position: { x: 120, y: 460 },
        type: "canvas",
      },
      {
        id: "approve-rules",
        data: {
          label: "Regole di Business", description: "Contesto: Regole di Business.", type: "automation",
          id: "business-rules",
          config: {},
        },
        position: { x: 300, y: 460 },
        type: "canvas",
      },
      {
        id: "approve-check",
        data: {
          label: "Approvato?", description: "Contesto: Approvato?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 300, y: 580 },
        type: "canvas",
      },
      {
        id: "assign-tech",
        data: {
          label: "Assegnazione Automatica", description: "Contesto: Assegnazione Automatica.", type: "automation",
          id: "auto-assign",
          config: {},
        },
        position: { x: 460, y: 700 },
        type: "canvas",
      },
      {
        id: "l1",
        data: {
          label: "Tecnico L1", description: "Contesto: Tecnico L1.", type: "actor",
          id: "l1-tech",
          config: {},
        },
        position: { x: 460, y: 820 },
        type: "canvas",
      },
      {
        id: "resolve",
        data: {
          label: "Risolvi Ticket", description: "Contesto: Risolvi Ticket.", type: "action",
          id: "resolve",
          config: {},
        },
        position: { x: 460, y: 940 },
        type: "canvas",
      },
      {
        id: "reopen",
        data: {
          label: "Riapri Ticket", description: "Contesto: Riapri Ticket.", type: "automation",
          id: "reopen",
          config: {},
        },
        position: { x: 120, y: 700 },
        type: "canvas",
      },
      {
        id: "end",
        data: { label: "Chiudi Ticket", description: "Contesto: Chiudi Ticket.", type: "end", id: "end", config: {} },
        position: { x: 460, y: 1060 },
        type: "canvas",
      },
    ],
    edges: [
      { id: "e1", source: "start", target: "client" },
      { id: "e2", source: "client", target: "validate" },
      { id: "e3", source: "validate", target: "complete-check" },
      {
        id: "e4",
        source: "complete-check",
        target: "approve-rules",
        label: "Si",
      },
      {
        id: "e5",
        source: "complete-check",
        target: "notify-missing",
        label: "No",
      },
      { id: "e6", source: "notify-missing", target: "client" },
      { id: "e7", source: "approve-rules", target: "approve-check" },
      {
        id: "e8",
        source: "approve-check",
        target: "assign-tech",
        label: "Si",
      },
      { id: "e9", source: "approve-check", target: "reopen", label: "No" },
      { id: "e10", source: "reopen", target: "client" },
      { id: "e11", source: "assign-tech", target: "l1" },
      { id: "e12", source: "l1", target: "resolve" },
      { id: "e13", source: "resolve", target: "end" },
    ],
  },
  {
    id: "sla-breach-control",
    name: "3. Controllo Violazione SLA",
    description:
      "Flusso avanzato con timer SLA, escalation multipla e controllo del supervisore.",
    nodes: [
      {
        id: "start",
        data: {
          label: "Ticket Creato", description: "Contesto: Ticket Creato.", type: "start",
          id: "start",
          config: {},
        },
        position: { x: 420, y: 0 },
        type: "canvas",
      },
      {
        id: "l1-intake",
        data: {
          label: "Tecnico L1", description: "Contesto: Tecnico L1.", type: "actor",
          id: "l1-tech",
          config: {},
        },
        position: { x: 420, y: 100 },
        type: "canvas",
      },
      {
        id: "timer",
        data: {
          label: "Timer SLA", description: "Contesto: Timer SLA.", type: "automation",
          id: "sla-timer",
          config: {},
        },
        position: { x: 420, y: 220 },
        type: "canvas",
      },
      {
        id: "rule-check",
        data: {
          label: "Regole di Business", description: "Contesto: Regole di Business.", type: "automation",
          id: "business-rules",
          config: {},
        },
        position: { x: 420, y: 340 },
        type: "canvas",
      },
      {
        id: "resolved-fast",
        data: {
          label: "Risolto entro SLA?", description: "Contesto: Risolto entro SLA?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 420, y: 460 },
        type: "canvas",
      },
      {
        id: "l2-escalation",
        data: {
          label: "Escalation", description: "Contesto: Escalation.", type: "automation",
          id: "escalation",
          config: {},
        },
        position: { x: 640, y: 580 },
        type: "canvas",
      },
      {
        id: "l2-owner",
        data: {
          label: "Tecnico L2", description: "Contesto: Tecnico L2.", type: "actor",
          id: "l2-tech",
          config: {},
        },
        position: { x: 640, y: 700 },
        type: "canvas",
      },
      {
        id: "breach-check",
        data: {
          label: "Rischio violazione?", description: "Contesto: Rischio violazione?.", type: "decision",
          id: "condition",
          config: { decisionType: "boolean" },
        },
        position: { x: 640, y: 820 },
        type: "canvas",
      },
      {
        id: "notify-supervisor",
        data: {
          label: "Notifica", description: "Contesto: Notifica.", type: "automation",
          id: "notify",
          config: {},
        },
        position: { x: 860, y: 940 },
        type: "canvas",
      },
      {
        id: "supervisor",
        data: {
          label: "Supervisore", description: "Contesto: Supervisore.", type: "actor",
          id: "supervisor",
          config: {},
        },
        position: { x: 860, y: 1060 },
        type: "canvas",
      },
      {
        id: "auto-reassign",
        data: {
          label: "Assegnazione Automatica", description: "Contesto: Assegnazione Automatica.", type: "automation",
          id: "auto-assign",
          config: {},
        },
        position: { x: 640, y: 940 },
        type: "canvas",
      },
      {
        id: "resolve",
        data: {
          label: "Risolvi Ticket", description: "Contesto: Risolvi Ticket.", type: "action",
          id: "resolve",
          config: {},
        },
        position: { x: 420, y: 940 },
        type: "canvas",
      },
      {
        id: "close",
        data: { label: "Chiudi Ticket", description: "Contesto: Chiudi Ticket.", type: "end", id: "end", config: {} },
        position: { x: 420, y: 1080 },
        type: "canvas",
      },
    ],
    edges: [
      { id: "e1", source: "start", target: "l1-intake" },
      { id: "e2", source: "l1-intake", target: "timer" },
      { id: "e3", source: "timer", target: "rule-check" },
      { id: "e4", source: "rule-check", target: "resolved-fast" },
      { id: "e5", source: "resolved-fast", target: "resolve", label: "Si" },
      {
        id: "e6",
        source: "resolved-fast",
        target: "l2-escalation",
        label: "No",
      },
      { id: "e7", source: "l2-escalation", target: "l2-owner" },
      { id: "e8", source: "l2-owner", target: "breach-check" },
      {
        id: "e9",
        source: "breach-check",
        target: "notify-supervisor",
        label: "Si",
      },
      { id: "e10", source: "breach-check", target: "resolve", label: "No" },
      { id: "e11", source: "notify-supervisor", target: "supervisor" },
      { id: "e12", source: "supervisor", target: "auto-reassign" },
      { id: "e13", source: "auto-reassign", target: "l2-owner" },
      { id: "e15", source: "resolve", target: "close" },
    ],
  },
  {
    id: "major-incident-response",
    name: "4. Gestione Major Incident",
    description:
      "Flusso enterprise con loop di investigazione, escalation verso vendor e postmortem.",
    nodes: [
      {
        id: "start",
        data: {
          label: "Ticket Creato", description: "Contesto: Ticket Creato.", type: "start",
          id: "start",
          config: {},
        },
        position: { x: 460, y: 0 },
        type: "canvas",
      },
      {
        id: "intake-bot",
        data: {
          label: "Bot Intake Automatico", description: "Contesto: Bot Intake Automatico.", type: "automation",
          id: "business-rules",
          config: {},
        },
        position: { x: 460, y: 100 },
        type: "canvas",
      },
      {
        id: "triage-l1",
        data: { label: "Triage L1", description: "Contesto: Triage L1.", type: "actor", id: "l1-tech", config: {} },
        position: { x: 460, y: 200 },
        type: "canvas",
      },
      {
        id: "critical-check",
        data: {
          label: "Impatto critico?", description: "Contesto: Impatto critico?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 460, y: 320 },
        type: "canvas",
      },
      {
        id: "assign-im",
        data: {
          label: "Assegna Incident Manager", description: "Contesto: Assegna Incident Manager.", type: "automation",
          id: "auto-assign",
          config: {},
        },
        position: { x: 220, y: 440 },
        type: "canvas",
      },
      {
        id: "notify-stakeholders",
        data: {
          label: "Notifica Stakeholder", description: "Contesto: Notifica Stakeholder.", type: "action",
          id: "validate",
          config: {},
        },
        position: { x: 460, y: 440 },
        type: "canvas",
      },
      {
        id: "l3-investigation",
        data: {
          label: "Investigazione Approfondita L3", description: "Contesto: Investigazione Approfondita L3.", type: "actor",
          id: "l3-specialist",
          config: {},
        },
        position: { x: 700, y: 440 },
        type: "canvas",
      },
      {
        id: "workaround-check",
        data: {
          label: "Workaround disponibile?", description: "Contesto: Workaround disponibile?.", type: "decision",
          id: "condition",
          config: { decisionType: "boolean" },
        },
        position: { x: 700, y: 560 },
        type: "canvas",
      },
      {
        id: "publish-workaround",
        data: {
          label: "Pubblica Workaround", description: "Contesto: Pubblica Workaround.", type: "action",
          id: "validate",
          config: {},
        },
        position: { x: 540, y: 680 },
        type: "canvas",
      },
      {
        id: "vendor-escalation",
        data: {
          label: "Escalation al Vendor", description: "Contesto: Escalation al Vendor.", type: "automation",
          id: "escalation",
          config: {},
        },
        position: { x: 860, y: 680 },
        type: "canvas",
      },
      {
        id: "vendor-response",
        data: {
          label: "Fix del Vendor pronto?", description: "Contesto: Fix del Vendor pronto?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 860, y: 800 },
        type: "canvas",
      },
      {
        id: "monitoring",
        data: {
          label: "Monitora Stabilità", description: "Contesto: Monitora Stabilit�.", type: "action",
          id: "resolve",
          config: {},
        },
        position: { x: 700, y: 920 },
        type: "canvas",
      },
      {
        id: "standard-resolution",
        data: {
          label: "Risoluzione Standard", description: "Contesto: Risoluzione Standard.", type: "action",
          id: "resolve",
          config: {},
        },
        position: { x: 220, y: 560 },
        type: "canvas",
      },
      {
        id: "qa-validation",
        data: {
          label: "Validazione QA", description: "Contesto: Validazione QA.", type: "actor",
          id: "l2-tech",
          config: {},
        },
        position: { x: 220, y: 680 },
        type: "canvas",
      },
      {
        id: "resolved-check",
        data: {
          label: "Risolto?", description: "Contesto: Risolto?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 360, y: 800 },
        type: "canvas",
      },
      {
        id: "postmortem",
        data: {
          label: "Postmortem + Aggiornamento KB", description: "Contesto: Postmortem + Aggiornamento KB.", type: "automation",
          id: "business-rules",
          config: {},
        },
        position: { x: 460, y: 920 },
        type: "canvas",
      },
      {
        id: "close",
        data: { label: "Chiudi Ticket", description: "Contesto: Chiudi Ticket.", type: "end", id: "end", config: {} },
        position: { x: 460, y: 1040 },
        type: "canvas",
      },
    ],
    edges: [
      { id: "e1", source: "start", target: "intake-bot" },
      { id: "e2", source: "intake-bot", target: "triage-l1" },
      { id: "e3", source: "triage-l1", target: "critical-check" },
      { id: "e4", source: "critical-check", target: "assign-im", label: "Si" },
      { id: "e5", source: "assign-im", target: "notify-stakeholders" },
      { id: "e6", source: "notify-stakeholders", target: "l3-investigation" },
      { id: "e7", source: "l3-investigation", target: "workaround-check" },
      {
        id: "e8",
        source: "workaround-check",
        target: "publish-workaround",
        label: "Si",
      },
      {
        id: "e9",
        source: "workaround-check",
        target: "vendor-escalation",
        label: "No",
      },
      { id: "e10", source: "vendor-escalation", target: "vendor-response" },
      {
        id: "e11",
        source: "vendor-response",
        target: "monitoring",
        label: "Si",
      },
      {
        id: "e12",
        source: "vendor-response",
        target: "l3-investigation",
        label: "No",
      },
      { id: "e13", source: "publish-workaround", target: "monitoring" },
      { id: "e14", source: "monitoring", target: "postmortem" },
      {
        id: "e15",
        source: "critical-check",
        target: "standard-resolution",
        label: "No",
      },
      { id: "e16", source: "standard-resolution", target: "qa-validation" },
      { id: "e17", source: "qa-validation", target: "resolved-check" },
      {
        id: "e18",
        source: "resolved-check",
        target: "postmortem",
        label: "Si",
      },
      { id: "e19", source: "resolved-check", target: "triage-l1", label: "No" },
      { id: "e20", source: "postmortem", target: "close" },
    ],
  },
  {
    id: "global-outage-war-room",
    name: "5. War Room Disservizio Globale",
    description:
      "Flusso expert con triage multilivello, loop di remediation e chiusura governata.",
    nodes: [
      {
        id: "start",
        data: {
          label: "Disservizio Rilevato", description: "Contesto: Disservizio Rilevato.", type: "start",
          id: "start",
          config: {},
        },
        position: { x: 520, y: 0 },
        type: "canvas",
      },
      {
        id: "intake",
        data: { label: "Presa in Carico L1", description: "Contesto: Presa in Carico L1.", type: "actor", id: "l1-tech", config: {} },
        position: { x: 520, y: 110 },
        type: "canvas",
      },
      {
        id: "rules",
        data: {
          label: "Regole di Business", description: "Contesto: Regole di Business.", type: "automation",
          id: "business-rules",
          config: {},
        },
        position: { x: 520, y: 230 },
        type: "canvas",
      },
      {
        id: "sev-decision",
        data: {
          label: "SEV-1 confermato?", description: "Contesto: SEV-1 confermato?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 520, y: 360 },
        type: "canvas",
      },
      {
        id: "incident-manager",
        data: {
          label: "Assegna Incident Manager", description: "Contesto: Assegna Incident Manager.", type: "automation",
          id: "auto-assign",
          config: {},
        },
        position: { x: 260, y: 500 },
        type: "canvas",
      },
      {
        id: "major-bridge",
        data: {
          label: "Crea Bridge", description: "Contesto: Crea Bridge.", type: "action",
          id: "validate",
          config: {},
        },
        position: { x: 260, y: 620 },
        type: "canvas",
      },
      {
        id: "l3",
        data: {
          label: "Specialista L3", description: "Contesto: Specialista L3.", type: "actor",
          id: "l3-specialist",
          config: {},
        },
        position: { x: 520, y: 500 },
        type: "canvas",
      },
      {
        id: "vendor",
        data: {
          label: "Escalation al Vendor", description: "Contesto: Escalation al Vendor.", type: "automation",
          id: "escalation",
          config: {},
        },
        position: { x: 780, y: 500 },
        type: "canvas",
      },
      {
        id: "workaround-decision",
        data: {
          label: "Workaround disponibile?", description: "Contesto: Workaround disponibile?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 520, y: 650 },
        type: "canvas",
      },
      {
        id: "publish-workaround",
        data: {
          label: "Pubblica Workaround", description: "Contesto: Pubblica Workaround.", type: "action",
          id: "validate",
          config: {},
        },
        position: { x: 340, y: 780 },
        type: "canvas",
      },
      {
        id: "vendor-fix-decision",
        data: {
          label: "Fix del Vendor pronto?", description: "Contesto: Fix del Vendor pronto?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 780, y: 650 },
        type: "canvas",
      },
      {
        id: "wait-cycle",
        data: {
          label: "Timer SLA", description: "Contesto: Timer SLA.", type: "automation",
          id: "sla-timer",
          config: {},
        },
        position: { x: 940, y: 780 },
        type: "canvas",
      },
      {
        id: "stability-decision",
        data: {
          label: "Stabile per 30 min?", description: "Contesto: Stabile per 30 min?.", type: "decision",
          id: "decision",
          config: { decisionType: "boolean" },
        },
        position: { x: 520, y: 910 },
        type: "canvas",
      },
      {
        id: "rollback",
        data: {
          label: "Riapri Ticket", description: "Contesto: Riapri Ticket.", type: "automation",
          id: "reopen",
          config: {},
        },
        position: { x: 700, y: 1030 },
        type: "canvas",
      },
      {
        id: "postmortem",
        data: {
          label: "Postmortem + Aggiornamento KB", description: "Contesto: Postmortem + Aggiornamento KB.", type: "automation",
          id: "business-rules",
          config: {},
        },
        position: { x: 520, y: 1030 },
        type: "canvas",
      },
      {
        id: "closure",
        data: { label: "Chiudi Ticket", description: "Contesto: Chiudi Ticket.", type: "end", id: "end", config: {} },
        position: { x: 520, y: 1160 },
        type: "canvas",
      },
    ],
    edges: [
      { id: "e1", source: "start", target: "intake" },
      { id: "e2", source: "intake", target: "rules" },
      { id: "e3", source: "rules", target: "sev-decision" },
      {
        id: "e4",
        source: "sev-decision",
        target: "incident-manager",
        label: "Si",
      },
      { id: "e5", source: "sev-decision", target: "l3", label: "No" },
      { id: "e6", source: "incident-manager", target: "major-bridge" },
      { id: "e7", source: "major-bridge", target: "l3" },
      { id: "e8", source: "l3", target: "workaround-decision" },
      {
        id: "e9",
        source: "workaround-decision",
        target: "publish-workaround",
        label: "Si",
      },
      {
        id: "e10",
        source: "workaround-decision",
        target: "vendor",
        label: "No",
      },
      { id: "e11", source: "publish-workaround", target: "stability-decision" },
      { id: "e12", source: "vendor", target: "vendor-fix-decision" },
      {
        id: "e13",
        source: "vendor-fix-decision",
        target: "stability-decision",
        label: "Si",
      },
      {
        id: "e14",
        source: "vendor-fix-decision",
        target: "wait-cycle",
        label: "No",
      },
      { id: "e15", source: "wait-cycle", target: "l3" },
      {
        id: "e16",
        source: "stability-decision",
        target: "postmortem",
        label: "Si",
      },
      {
        id: "e17",
        source: "stability-decision",
        target: "rollback",
        label: "No",
      },
      { id: "e18", source: "rollback", target: "l3" },
      { id: "e19", source: "postmortem", target: "closure" },
    ],
  },
] as WorkflowTemplate[];

const buildDefaultNodeConfig = (
  nodeType: NodeType,
  blockId: string | undefined,
  nodeId: string,
  edges: Edge[],
): NodeConfig => {
  if (nodeType === 'decision') {
    const outcomes: DecisionOutcome[] = edges
      .filter((edge) => edge.source === nodeId)
      .map((edge, index) => ({
        label: (typeof edge.label === 'string' ? edge.label : '').trim() || `Opzione ${index + 1}`,
        targetNodeId: edge.target,
      }));

    return {
      nodeType: 'decision',
      decisionType: 'manual',
      outcomes,
    };
  }

  if (nodeType === 'condition') {
    return { nodeType: 'condition' };
  }

  if (nodeType === 'automation') {
    const automationType =
      blockId === 'sla-timer' ||
      blockId === 'escalation' ||
      blockId === 'auto-assign' ||
      blockId === 'notify' ||
      blockId === 'business-rules' ||
      blockId === 'reopen'
        ? blockId
        : 'business-rules';

    return {
      nodeType: 'automation',
      automationType,
      duration: automationType === 'sla-timer' ? 60 : undefined,
      assignTo: automationType === 'auto-assign' ? 'l2' : undefined,
      channel: automationType === 'notify' ? 'email' : undefined,
    };
  }

  if (nodeType === 'action') {
    const ticketAction = blockId === 'resolve' || blockId === 'validate' || blockId === 'close' ? blockId : 'validate';
    return { nodeType: 'action', ticketAction };
  }

  if (nodeType === 'actor') {
    const agentLevel =
      blockId === 'l1-tech'
        ? 'l1'
        : blockId === 'l2-tech'
          ? 'l2'
          : blockId === 'l3-specialist'
            ? 'l3'
            : blockId === 'client'
              ? 'client'
              : blockId === 'supervisor'
                ? 'supervisor'
                : undefined;
    return { nodeType: 'actor', agentLevel };
  }

  if (nodeType === 'status') {
    return { nodeType: 'status', statusValue: 'in_progress' };
  }

  if (nodeType === 'event') {
    return { nodeType: 'event', eventTrigger: 'manual' };
  }

  if (nodeType === 'start') {
    return { nodeType: 'start' };
  }

  return { nodeType: 'end' };
};

const enrichTemplate = (template: WorkflowTemplate): WorkflowTemplate => {
  const normalizedEdges = template.edges.map((edge) => ({
    ...edge,
    label: typeof edge.label === 'string' ? edge.label : undefined,
  }));

  const normalizedNodes: CustomNode[] = template.nodes.map((node) => {
    const blockId = node.data.blockId ?? node.data.id;
    const config = node.data.config ?? buildDefaultNodeConfig(node.data.type, blockId, node.id, normalizedEdges);

    return {
      ...node,
      data: {
        ...node.data,
        blockId,
        config,
      },
    };
  });

  return {
    ...template,
    nodes: normalizedNodes,
    edges: normalizedEdges,
  };
};

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = RAW_WORKFLOW_TEMPLATES.map(enrichTemplate);





