import type { Edge } from "@xyflow/react";
import type { CustomNode } from "@/lib/store";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  nodes: CustomNode[];
  edges: Edge[];
}

export const WORKFLOW_TEMPLATES = [
  {
    id: "l1",
    name: "L1",
    description: "Workflow L1",
    nodes: [
      {
        id: "start-1777878601490",
        data: {
          label: "Start",
          type: "start",
          blockId: "start",
          description: "Entry point of the workflow",
          config: {
            nodeType: "start",
          },
        },
        position: {
          x: -1178.5824114891793,
          y: 321.6627152451022,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "end-1777878602692",
        data: {
          label: "End",
          type: "end",
          blockId: "end",
          description: "Termination point of the workflow",
          config: {
            nodeType: "end",
          },
        },
        position: {
          x: -1183.336429251392,
          y: 1408.7481102044555,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777878607039",
        data: {
          label: "L1 Technician",
          type: "actor",
          blockId: "l1-tech",
          description: "First level support - initial triage",
          config: {
            nodeType: "actor",
            agentLevel: "l1",
          },
        },
        position: {
          x: -1059.7319674338564,
          y: 611.6577987400899,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777878619549",
        data: {
          label: "Auto Assignment",
          type: "automation",
          blockId: "auto-assign",
          description:
            "Automatically assign ticket to first available Technician",
          config: {
            nodeType: "automation",
            automationType: "auto-assign",
            assignTo: "l1",
          },
        },
        position: {
          x: -1134.2115790418588,
          y: 453.1905399996594,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777878629591",
        data: {
          label: "Resolve Ticket",
          type: "action",
          blockId: "resolve",
          description: "Mark ticket as resolved (solution provided)",
          config: {
            nodeType: "action",
            ticketAction: "resolve",
          },
        },
        position: {
          x: -1284.7554748452676,
          y: 714.6615169213695,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777878631630",
        data: {
          label: "Validate Ticket",
          type: "action",
          blockId: "validate",
          description: "Client validates if resolution is satisfactory",
          config: {
            nodeType: "action",
            ticketAction: "validate",
          },
        },
        position: {
          x: -1061.3166400212608,
          y: 1145.6924606953405,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777878632940",
        data: {
          label: "Close Ticket",
          type: "action",
          blockId: "close",
          description: "Permanently close the ticket",
          config: {
            nodeType: "action",
            ticketAction: "close",
          },
        },
        position: {
          x: -1005.8530994621101,
          y: 1283.5589757995149,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "decision-1777878673600",
        data: {
          label: "Problema risolto?",
          type: "decision",
          blockId: "decision-manual",
          description: "Pauses workflow for human decision (Approve/Reject)",
          config: {
            nodeType: "decision",
            decisionType: "manual",
            outcomes: [],
          },
        },
        position: {
          x: -494.98920839413194,
          y: 935.7296097072254,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777878679369",
        data: {
          label: "Notification",
          type: "automation",
          blockId: "notify",
          description: "Send notification to client/supervisor",
          config: {
            nodeType: "automation",
            automationType: "notify",
            channel: "email",
          },
        },
        position: {
          x: -1070.8246755456867,
          y: 869.9594304869916,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777878686860",
        data: {
          label: "Client",
          type: "actor",
          blockId: "client",
          description: "Ticket requester / end user",
          config: {
            nodeType: "actor",
            agentLevel: "client",
          },
        },
        position: {
          x: -1273.6627667334371,
          y: 977.7171664304842,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777884632945",
        data: {
          label: "Reopen Ticket",
          type: "automation",
          blockId: "reopen",
          description: "Reopen a previously resolved/closed ticket",
          config: {
            nodeType: "automation",
            automationType: "reopen",
          },
        },
        position: {
          x: -745.1161088441813,
          y: 655.8369607932983,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
    ],
    edges: [
      {
        id: "start-1777878601490-automation-1777878619549-1777878639049",
        source: "start-1777878601490",
        target: "automation-1777878619549",
        style: {
          stroke: "var(--node-5)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "automation-1777878619549-actor-1777878607039-1777878641749",
        source: "automation-1777878619549",
        target: "actor-1777878607039",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "actor-1777878607039-action-1777878629591-1777878660669",
        source: "actor-1777878607039",
        target: "action-1777878629591",
        style: {
          stroke: "var(--node-4)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "action-1777878629591-automation-1777878679369-1777878681199",
        source: "action-1777878629591",
        target: "automation-1777878679369",
        style: {
          stroke: "var(--node-1)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "automation-1777878679369-actor-1777878686860-1777878690289",
        source: "automation-1777878679369",
        target: "actor-1777878686860",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "actor-1777878686860-decision-1777878673600-1777878693189",
        source: "actor-1777878686860",
        target: "decision-1777878673600",
        style: {
          stroke: "var(--node-4)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "decision-1777878673600-action-1777878631630-1777878715609",
        source: "decision-1777878673600",
        target: "action-1777878631630",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "si",
      },
      {
        id: "action-1777878631630-action-1777878632940-1777878720909",
        source: "action-1777878631630",
        target: "action-1777878632940",
        style: {
          stroke: "var(--node-1)",
          strokeWidth: 1,
        },
      },
      {
        id: "action-1777878632940-end-1777878602692-1777878723959",
        source: "action-1777878632940",
        target: "end-1777878602692",
        style: {
          stroke: "var(--node-1)",
          strokeWidth: 1,
        },
      },
      {
        id: "decision-1777878673600-automation-1777884632945-1777884639224",
        source: "decision-1777878673600",
        target: "automation-1777884632945",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "no",
      },
      {
        id: "automation-1777884632945-automation-1777878619549-1777884653934",
        source: "automation-1777884632945",
        target: "automation-1777878619549",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },
      },
    ],
  },
  {
    id: "l2-l3",
    name: "L2-L3",
    description: "Workflow L2-L3",
    nodes: [
      {
        id: "start-1777569281227",
        data: {
          label: "Start",
          type: "start",
          blockId: "start",
          description: "Entry point of the workflow",
          config: {
            nodeType: "start",
          },
        },
        position: {
          x: -718.0945740024576,
          y: 259.4037592166657,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "end-1777569286318",
        data: {
          label: "End",
          type: "end",
          blockId: "end",
          description: "Termination point of the workflow",
          config: {
            nodeType: "end",
          },
        },
        position: {
          x: -330.4035150060654,
          y: 1354.5948922582554,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777569303287",
        data: {
          label: "Hot Liner",
          type: "actor",
          blockId: "l1-tech",
          description: "First level support - initial triage",
          config: {
            nodeType: "actor",
            agentLevel: "l1",
          },
        },
        position: {
          x: -685.8334599837236,
          y: 539.7332423022664,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777569304698",
        data: {
          label: "L2 Technician",
          type: "actor",
          blockId: "l2-tech",
          description: "Second level support - advanced troubleshooting",
          config: {
            nodeType: "actor",
            agentLevel: "l2",
          },
        },
        position: {
          x: 210.03541173524997,
          y: 607.2869320759565,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777569354928",
        data: {
          label: "Resolve Ticket",
          type: "action",
          blockId: "resolve",
          description: "Mark ticket as resolved (solution provided)",
          config: {
            nodeType: "action",
            ticketAction: "resolve",
          },
        },
        position: {
          x: -39.734376654869024,
          y: 738.077408593868,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777569412269",
        data: {
          label: "Escalation",
          type: "automation",
          blockId: "escalation",
          description: "Escalate ticket",
          config: {
            nodeType: "automation",
            automationType: "escalation",
          },
        },
        position: {
          x: -195.88862692603217,
          y: 334.92510926258575,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777569462009",
        data: {
          label: "SLA Timer",
          type: "automation",
          blockId: "sla-timer",
          description: "Start SLA timer for ticket",
          config: {
            nodeType: "automation",
            automationType: "sla-timer",
            duration: 1,
          },
        },
        position: {
          x: -700.0849704348716,
          y: 642.1631676785804,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777569500360",
        data: {
          label: "Auto Assignment",
          type: "automation",
          blockId: "auto-assign",
          description:
            "Automatically assign ticket to first available Technician",
          config: {
            nodeType: "automation",
            automationType: "auto-assign",
            assignTo: "l1",
          },
        },
        position: {
          x: -708.3960393446325,
          y: 415.62744674140697,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "decision-1777569516698",
        data: {
          label: "Risolve il ticket?",
          type: "decision",
          blockId: "decision-manual",
          description: "Pauses workflow for human decision (Approve/Reject)",
          config: {
            nodeType: "decision",
            decisionType: "manual",
            outcomes: [],
          },
        },
        position: {
          x: -347.7146548457643,
          y: 644.0438384972207,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777844284597",
        data: {
          label: "Notification",
          type: "automation",
          blockId: "notify",
          description: "Send notification to client/supervisor",
          config: {
            nodeType: "automation",
            automationType: "notify",
            channel: "email",
          },
        },
        position: {
          x: -422.9797555358433,
          y: 794.0484057962319,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777844301218",
        data: {
          label: "Client",
          type: "actor",
          blockId: "client",
          description: "Ticket requester / end user",
          config: {
            nodeType: "actor",
            agentLevel: "client",
          },
        },
        position: {
          x: -727.9772500365183,
          y: 879.320950832289,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "decision-1777844325457",
        data: {
          label: "Problema risolto?",
          type: "decision",
          blockId: "decision-manual",
          description: "Pauses workflow for human decision (Approve/Reject)",
          config: {
            nodeType: "decision",
            decisionType: "manual",
            outcomes: [],
          },
        },
        position: {
          x: -708.5770486864001,
          y: 986.5983624224419,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777844384047",
        data: {
          label: "Close Ticket",
          type: "action",
          blockId: "close",
          description: "Permanently close the ticket",
          config: {
            nodeType: "action",
            ticketAction: "close",
          },
        },
        position: {
          x: -539.0207555267071,
          y: 1244.9514069226325,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777844530718",
        data: {
          label: "Reopen Ticket",
          type: "automation",
          blockId: "reopen",
          description: "Reopen a previously resolved/closed ticket",
          config: {
            nodeType: "automation",
            automationType: "reopen",
          },
        },
        position: {
          x: -210.9241717440577,
          y: 1044.3484399359884,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777845004840",
        data: {
          label: "Auto Assignment",
          type: "automation",
          blockId: "auto-assign",
          description:
            "Automatically assign ticket to first available Technician",
          config: {
            nodeType: "automation",
            automationType: "auto-assign",
            assignTo: "l2",
          },
        },
        position: {
          x: 42.39670351891624,
          y: 1155.2998633057637,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777845204749",
        data: {
          label: "Validate Ticket",
          type: "action",
          blockId: "validate",
          description: "Client validates if resolution is satisfactory",
          config: {
            nodeType: "action",
            ticketAction: "validate",
          },
        },
        position: {
          x: -687.5605584603878,
          y: 1141.7467175041284,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
    ],
    edges: [
      {
        id: "automation-1777569412269-actor-1777569304698-1777569418367",
        source: "automation-1777569412269",
        target: "actor-1777569304698",
        selected: false,
      },
      {
        id: "automation-1777569500360-actor-1777569303287-1777569504987",
        source: "automation-1777569500360",
        target: "actor-1777569303287",
        selected: false,
      },
      {
        id: "decision-1777569516698-action-1777569354928-1777569530258",
        source: "decision-1777569516698",
        target: "action-1777569354928",
        selected: false,
        label: "si",
      },
      {
        id: "decision-1777569516698-automation-1777569412269-1777569535077",
        source: "decision-1777569516698",
        target: "automation-1777569412269",
        selected: false,
        label: "no",
      },
      {
        id: "actor-1777569304698-action-1777569354928-1777569568436",
        source: "actor-1777569304698",
        target: "action-1777569354928",
        selected: false,
      },
      {
        id: "start-1777569281227-automation-1777569500360-1777844251655",
        source: "start-1777569281227",
        target: "automation-1777569500360",
        style: {
          stroke: "var(--node-5)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "actor-1777569303287-automation-1777569462009-1777844257555",
        source: "actor-1777569303287",
        target: "automation-1777569462009",
        style: {
          stroke: "var(--node-4)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "automation-1777569462009-decision-1777569516698-1777844259015",
        source: "automation-1777569462009",
        target: "decision-1777569516698",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "action-1777569354928-automation-1777844284597-1777844296225",
        source: "action-1777569354928",
        target: "automation-1777844284597",
        style: {
          stroke: "var(--node-1)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "automation-1777844284597-actor-1777844301218-1777844307946",
        source: "automation-1777844284597",
        target: "actor-1777844301218",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "actor-1777844301218-decision-1777844325457-1777844375186",
        source: "actor-1777844301218",
        target: "decision-1777844325457",
        style: {
          stroke: "var(--node-4)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "action-1777844384047-end-1777569286318-1777844395786",
        source: "action-1777844384047",
        target: "end-1777569286318",
        style: {
          stroke: "var(--node-1)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "decision-1777844325457-automation-1777844530718-1777844542707",
        source: "decision-1777844325457",
        target: "automation-1777844530718",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "no",
      },
      {
        id: "automation-1777844530718-automation-1777845004840-1777845009478",
        source: "automation-1777844530718",
        target: "automation-1777845004840",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "automation-1777845004840-actor-1777569304698-1777845013068",
        source: "automation-1777845004840",
        target: "actor-1777569304698",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "decision-1777844325457-action-1777845204749-1777845207688",
        source: "decision-1777844325457",
        target: "action-1777845204749",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "si",
      },
      {
        id: "action-1777845204749-action-1777844384047-1777845211158",
        source: "action-1777845204749",
        target: "action-1777844384047",
        style: {
          stroke: "var(--node-1)",
          strokeWidth: 1,
        },
      },
    ],
  },
  {
    id: "l1-l2-l3",
    name: "L1-L2-L3",
    description: "Workflow L1-L2-L3",
    nodes: [
      {
        id: "start-1777652008784",
        data: {
          label: "Start",
          type: "start",
          blockId: "start",
          description: "Entry point of the workflow",
          config: {
            nodeType: "start",
          },
        },
        position: {
          x: -1065.0345779465401,
          y: -120.92823667259671,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "end-1777652011511",
        data: {
          label: "End",
          type: "end",
          blockId: "end",
          description: "Termination point of the workflow",
          config: {
            nodeType: "end",
          },
        },
        position: {
          x: -1008.1030953927473,
          y: 982.375825157994,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777652076942",
        data: {
          label: "L1 Technician",
          type: "actor",
          blockId: "l1-tech",
          description: "First level support - initial triage",
          config: {
            nodeType: "actor",
            agentLevel: "l1",
          },
        },
        position: {
          x: -677.9192226576645,
          y: 30.03976521601634,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777652091332",
        data: {
          label: "L2 Technician",
          type: "actor",
          blockId: "l2-tech",
          description: "Second level support - advanced troubleshooting",
          config: {
            nodeType: "actor",
            agentLevel: "l2",
          },
        },
        position: {
          x: -20.70017852312452,
          y: 69.61604560811305,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "decision-1777652183443",
        data: {
          label: "Risolve?",
          type: "decision",
          blockId: "decision-manual",
          description: "Pauses workflow for human decision (Approve/Reject)",
          config: {
            nodeType: "decision",
            decisionType: "manual",
            outcomes: [],
          },
        },
        position: {
          x: -627.2956565149148,
          y: 145.29322873597687,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "automation-1777652203483",
        data: {
          label: "Business Rules",
          type: "automation",
          blockId: "business-rules",
          description:
            "Apply business rules (priority calculation, category mapping)",
          config: {
            nodeType: "automation",
            automationType: "business-rules",
          },
        },
        position: {
          x: -1070.5049527749957,
          y: 22.550577616993507,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777652250673",
        data: {
          label: "SLA Timer",
          type: "automation",
          blockId: "sla-timer",
          description: "Start SLA timer for ticket",
          config: {
            nodeType: "automation",
            automationType: "sla-timer",
            duration: 60,
          },
        },
        position: {
          x: -927.1474127446943,
          y: 281.9771607156778,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777652358102",
        data: {
          label: "Resolve Ticket",
          type: "action",
          blockId: "resolve",
          description: "Mark ticket as resolved (solution provided)",
          config: {
            nodeType: "action",
            ticketAction: "resolve",
          },
        },
        position: {
          x: -502.8431798640771,
          y: 462.78708414464904,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777652389183",
        data: {
          label: "Validate Ticket",
          type: "action",
          blockId: "validate",
          description: "Client validates if resolution is satisfactory",
          config: {
            nodeType: "action",
            ticketAction: "validate",
          },
        },
        position: {
          x: -970.0136502994338,
          y: 573.1947326801425,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "action-1777652443993",
        data: {
          label: "Close Ticket",
          type: "action",
          blockId: "close",
          description: "Permanently close the ticket",
          config: {
            nodeType: "action",
            ticketAction: "close",
          },
        },
        position: {
          x: -1007.9091134246057,
          y: 752.7819175491219,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777652506685",
        data: {
          label: "L3 Specialist",
          type: "actor",
          blockId: "l3-specialist",
          description: "Third level support - developer / vendor escalation",
          config: {
            nodeType: "actor",
            agentLevel: "l3",
          },
        },
        position: {
          x: -121.44014937286181,
          y: 484.36255395049636,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "decision-1777652534843",
        data: {
          label: "Risolve?",
          type: "decision",
          blockId: "decision-manual",
          description: "Pauses workflow for human decision (Approve/Reject)",
          config: {
            nodeType: "decision",
            decisionType: "manual",
            outcomes: [],
          },
        },
        position: {
          x: -72.10506577077302,
          y: 239.40308045322178,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "automation-1777732490824",
        data: {
          label: "Auto Assignment",
          type: "automation",
          blockId: "auto-assign",
          description:
            "Automatically assign ticket to first available Technician",
          config: {
            nodeType: "automation",
            automationType: "auto-assign",
            assignTo: "l1",
          },
        },
        position: {
          x: -1078.0305083746894,
          y: 149.2504248875276,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "decision-1777732646294",
        data: {
          label: "Risolve?",
          type: "decision",
          blockId: "decision-manual",
          description: "Pauses workflow for human decision (Approve/Reject)",
          config: {
            nodeType: "decision",
            decisionType: "manual",
            outcomes: [],
          },
        },
        position: {
          x: -103.53966675955161,
          y: 693.4221709136838,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777732693713",
        data: {
          label: "Notification",
          type: "automation",
          blockId: "notify",
          description: "Send notification to client/supervisor",
          config: {
            nodeType: "automation",
            automationType: "notify",
            channel: "email",
          },
        },
        position: {
          x: 372.78482881094885,
          y: 430.6198701478959,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "actor-1777732729453",
        data: {
          label: "Supervisor",
          type: "actor",
          blockId: "supervisor",
          description: "Manager with approval authority",
          config: {
            nodeType: "actor",
            agentLevel: "supervisor",
          },
        },
        position: {
          x: 607.8334809009024,
          y: 533.3448366168384,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "condition-1777732824743",
        data: {
          label: "Check Impact",
          type: "condition",
          blockId: "condition-impact",
          description: "Branch based on business impact",
          config: {
            nodeType: "condition",
          },
        },
        position: {
          x: 404.7750105337724,
          y: 650.2932742899768,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777732839473",
        data: {
          label: "Auto Assignment",
          type: "automation",
          blockId: "auto-assign",
          description:
            "Automatically assign ticket to first available Technician",
          config: {
            nodeType: "automation",
            automationType: "auto-assign",
            assignTo: "l3",
          },
        },
        position: {
          x: 275.7750983929582,
          y: 823.565061935288,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "actor-1777733059543",
        data: {
          label: "Client",
          type: "actor",
          blockId: "client",
          description: "Ticket requester / end user",
          config: {
            nodeType: "actor",
            agentLevel: "client",
          },
        },
        position: {
          x: -314.5117774989219,
          y: 793.4915702198869,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "condition-1777733331033",
        data: {
          label: "Check Priority",
          type: "condition",
          blockId: "condition-impact",
          description: "Branch based on business impact",
          config: {
            nodeType: "condition",
          },
        },
        position: {
          x: 924.4170978728483,
          y: 691.7258933875597,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777733502074",
        data: {
          label: "Auto Assignment",
          type: "automation",
          blockId: "auto-assign",
          description:
            "Automatically assign ticket to first available Technician",
          config: {
            nodeType: "automation",
            automationType: "auto-assign",
            assignTo: "l3",
          },
        },
        position: {
          x: 1046.4248706303915,
          y: 910.2965906205269,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777733593933",
        data: {
          label: "Email Notification",
          type: "automation",
          blockId: "notify",
          description: "Send notification to client/supervisor",
          config: {
            nodeType: "automation",
            automationType: "notify",
            channel: "email",
          },
        },
        position: {
          x: 636.0579103800218,
          y: 894.4624956912521,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "automation-1777733671814",
        data: {
          label: "Escalation",
          type: "automation",
          blockId: "escalation",
          description: "Escalate ticket",
          config: {
            nodeType: "automation",
            automationType: "escalation",
          },
        },
        position: {
          x: 2.9501076675614453,
          y: -70.98843466118281,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
      },
      {
        id: "automation-1777733695194",
        data: {
          label: "Escalation",
          type: "automation",
          blockId: "escalation",
          description: "Escalate ticket",
          config: {
            nodeType: "automation",
            automationType: "escalation",
          },
        },
        position: {
          x: 91.74626512376614,
          y: 362.54574586028707,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
      {
        id: "automation-1777846179755",
        data: {
          label: "Notification",
          type: "automation",
          blockId: "notify",
          description: "Send notification to client/supervisor",
          config: {
            nodeType: "automation",
            automationType: "notify",
            channel: "email",
          },
        },
        position: {
          x: -557.765265696173,
          y: 618.7295272099853,
        },
        type: "canvas",
        measured: {
          width: 220,
          height: 65,
        },
        selected: true,
        dragging: false,
      },
    ],
    edges: [
      {
        id: "decision-1777652183443-action-1777652358102-1777652360351",
        source: "decision-1777652183443",
        target: "action-1777652358102",
        selected: false,
        label: "SI",
      },
      {
        id: "action-1777652443993-end-1777652011511-1777652449682",
        source: "action-1777652443993",
        target: "end-1777652011511",
        selected: false,
      },
      {
        id: "start-1777652008784-automation-1777652203483-1777652461842",
        source: "start-1777652008784",
        target: "automation-1777652203483",
        selected: false,
      },
      {
        id: "actor-1777652091332-decision-1777652534843-1777652536563",
        source: "actor-1777652091332",
        target: "decision-1777652534843",
        selected: false,
      },
      {
        id: "decision-1777652534843-action-1777652358102-1777652582683",
        source: "decision-1777652534843",
        target: "action-1777652358102",
        selected: false,
        label: "SI",
      },
      {
        id: "action-1777652389183-action-1777652443993-1777652807645",
        source: "action-1777652389183",
        target: "action-1777652443993",
        selected: false,
      },
      {
        id: "actor-1777652076942-decision-1777652183443-1777728099201",
        source: "actor-1777652076942",
        target: "decision-1777652183443",

        style: {
          stroke: "var(--node-4)",
          strokeWidth: 1,
        },
        selected: false,
      },
      {
        id: "automation-1777652250673-actor-1777652076942-1777732485801",
        source: "automation-1777652250673",
        target: "actor-1777652076942",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "automation-1777652203483-automation-1777732490824-1777732493671",
        source: "automation-1777652203483",
        target: "automation-1777732490824",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "automation-1777732490824-automation-1777652250673-1777732496192",
        source: "automation-1777732490824",
        target: "automation-1777652250673",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "actor-1777652506685-decision-1777732646294-1777732651192",
        source: "actor-1777652506685",
        target: "decision-1777732646294",
        style: {
          stroke: "var(--node-4)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "decision-1777732646294-action-1777652358102-1777732665692",
        source: "decision-1777732646294",
        target: "action-1777652358102",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "si",
      },
      {
        id: "decision-1777732646294-automation-1777732693713-1777732696662",
        source: "decision-1777732646294",
        target: "automation-1777732693713",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "no",
      },
      {
        id: "automation-1777732693713-actor-1777732729453-1777732732562",
        source: "automation-1777732693713",
        target: "actor-1777732729453",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "actor-1777732729453-condition-1777732824743-1777732827261",
        source: "actor-1777732729453",
        target: "condition-1777732824743",
        style: {
          stroke: "var(--node-4)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "condition-1777732824743-automation-1777732839473-1777732843932",
        source: "condition-1777732824743",
        target: "automation-1777732839473",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "high",
      },
      {
        id: "automation-1777732839473-actor-1777652506685-1777732847961",
        source: "automation-1777732839473",
        target: "actor-1777652506685",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "condition-1777732824743-condition-1777733331033-1777733333532",
        source: "condition-1777732824743",
        target: "condition-1777733331033",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "low",
      },
      {
        id: "condition-1777733331033-automation-1777733502074-1777733504022",
        source: "condition-1777733331033",
        target: "automation-1777733502074",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "critical",
      },
      {
        id: "automation-1777733502074-actor-1777652506685-1777733516052",
        source: "automation-1777733502074",
        target: "actor-1777652506685",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "condition-1777733331033-automation-1777733593933-1777733600782",
        source: "condition-1777733331033",
        target: "automation-1777733593933",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "low",
      },
      {
        id: "automation-1777733593933-actor-1777733059543-1777733611973",
        source: "automation-1777733593933",
        target: "actor-1777733059543",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "decision-1777652183443-automation-1777733671814-1777733673902",
        source: "decision-1777652183443",
        target: "automation-1777733671814",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "no",
      },
      {
        id: "automation-1777733671814-actor-1777652091332-1777733683662",
        source: "automation-1777733671814",
        target: "actor-1777652091332",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "decision-1777652534843-automation-1777733695194-1777733697662",
        source: "decision-1777652534843",
        target: "automation-1777733695194",
        style: {
          stroke: "var(--node-3)",
          strokeWidth: 1,
        },

        selected: false,
        label: "no",
      },
      {
        id: "automation-1777733695194-actor-1777652506685-1777733707502",
        source: "automation-1777733695194",
        target: "actor-1777652506685",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },

        selected: false,
      },
      {
        id: "actor-1777733059543-action-1777652389183-1777846078765",
        source: "actor-1777733059543",
        target: "action-1777652389183",
        style: {
          stroke: "var(--node-4)",
          strokeWidth: 1,
        },
      },
      {
        id: "action-1777652358102-automation-1777846179755-1777846181865",
        source: "action-1777652358102",
        target: "automation-1777846179755",
        style: {
          stroke: "var(--node-1)",
          strokeWidth: 1,
        },
      },
      {
        id: "automation-1777846179755-actor-1777733059543-1777846183885",
        source: "automation-1777846179755",
        target: "actor-1777733059543",
        style: {
          stroke: "var(--node-2)",
          strokeWidth: 1,
        },
      },
    ],
  },
  //  {
  //   id: "l1-l2-escalation",
  //   name: "Escalation L1 -> L2",
  //   description: "Flusso base di escalation con un solo punto decisionale.",
  //   nodes: [
  //     {
  //       id: "start",
  //       data: {
  //         label: "Inizio",
  //         description: "Contesto: Inizio.",
  //         type: "start",
  //         id: "start",
  //         config: {},
  //       },
  //       position: { x: 250, y: 0 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "l1-actor",
  //       data: {
  //         label: "Tecnico L1",
  //         description: "Contesto: Tecnico L1.",
  //         type: "actor",
  //         id: "l1-tech",
  //         config: {},
  //       },
  //       position: { x: 150, y: 100 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "resolve-check",
  //       data: {
  //         label: "Riesce a risolvere?",
  //         description: "Contesto: Riesce a risolvere?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 150, y: 250 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "escalate-l2",
  //       data: {
  //         label: "Escalation a L2",
  //         description: "Contesto: Escalation a L2.",
  //         type: "automation",
  //         id: "escalation",
  //         config: {},
  //       },
  //       position: { x: 350, y: 250 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "l2-actor",
  //       data: {
  //         label: "Tecnico L2",
  //         description: "Contesto: Tecnico L2.",
  //         type: "actor",
  //         id: "l2-tech",
  //         config: {},
  //       },
  //       position: { x: 350, y: 400 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "resolve-l2",
  //       data: {
  //         label: "Risolvi Ticket",
  //         description: "Contesto: Risolvi Ticket.",
  //         type: "action",
  //         id: "resolve",
  //         config: {},
  //       },
  //       position: { x: 150, y: 400 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "close",
  //       data: {
  //         label: "Chiudi Ticket",
  //         description: "Contesto: Chiudi Ticket.",
  //         type: "end",
  //         id: "end",
  //         config: {},
  //       },
  //       position: { x: 250, y: 550 },
  //       type: "canvas",
  //     },
  //   ],
  //   edges: [
  //     { id: "start-l1", source: "start", target: "l1-actor" },
  //     { id: "l1-check", source: "l1-actor", target: "resolve-check" },
  //     {
  //       id: "check-resolve",
  //       source: "resolve-check",
  //       target: "resolve-l2",
  //       label: "Si",
  //     },
  //     {
  //       id: "check-escalate",
  //       source: "resolve-check",
  //       target: "escalate-l2",
  //       label: "No",
  //     },
  //     { id: "escalate-l2-actor", source: "escalate-l2", target: "l2-actor" },
  //     { id: "l2-resolve", source: "l2-actor", target: "close" },
  //     { id: "resolve-close", source: "resolve-l2", target: "close" },
  //   ],
  // },
  // {
  //   id: "request-fulfillment",
  //   name: "Evasione Richieste",
  //   description:
  //     "Flusso medio con validazione, approvazione e assegnazione automatica.",
  //   nodes: [
  //     {
  //       id: "start",
  //       data: {
  //         label: "Richiesta Aperta",
  //         description: "Contesto: Richiesta Aperta.",
  //         type: "start",
  //         id: "start",
  //         config: {},
  //       },
  //       position: { x: 300, y: 0 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "client",
  //       data: {
  //         label: "Cliente",
  //         description: "Contesto: Cliente.",
  //         type: "actor",
  //         id: "client",
  //         config: {},
  //       },
  //       position: { x: 300, y: 100 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "validate",
  //       data: {
  //         label: "Valida Ticket",
  //         description: "Contesto: Valida Ticket.",
  //         type: "action",
  //         id: "validate",
  //         config: {},
  //       },
  //       position: { x: 300, y: 220 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "complete-check",
  //       data: {
  //         label: "Dati completi?",
  //         description: "Contesto: Dati completi?.",
  //         type: "decision",
  //         id: "condition",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 300, y: 340 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "notify-missing",
  //       data: {
  //         label: "Notifica",
  //         description: "Contesto: Notifica.",
  //         type: "automation",
  //         id: "notify",
  //         config: {},
  //       },
  //       position: { x: 120, y: 460 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "approve-rules",
  //       data: {
  //         label: "Regole di Business",
  //         description: "Contesto: Regole di Business.",
  //         type: "automation",
  //         id: "business-rules",
  //         config: {},
  //       },
  //       position: { x: 300, y: 460 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "approve-check",
  //       data: {
  //         label: "Approvato?",
  //         description: "Contesto: Approvato?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 300, y: 580 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "assign-tech",
  //       data: {
  //         label: "Assegnazione Automatica",
  //         description: "Contesto: Assegnazione Automatica.",
  //         type: "automation",
  //         id: "auto-assign",
  //         config: {},
  //       },
  //       position: { x: 460, y: 700 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "l1",
  //       data: {
  //         label: "Tecnico L1",
  //         description: "Contesto: Tecnico L1.",
  //         type: "actor",
  //         id: "l1-tech",
  //         config: {},
  //       },
  //       position: { x: 460, y: 820 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "resolve",
  //       data: {
  //         label: "Risolvi Ticket",
  //         description: "Contesto: Risolvi Ticket.",
  //         type: "action",
  //         id: "resolve",
  //         config: {},
  //       },
  //       position: { x: 460, y: 940 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "reopen",
  //       data: {
  //         label: "Riapri Ticket",
  //         description: "Contesto: Riapri Ticket.",
  //         type: "automation",
  //         id: "reopen",
  //         config: {},
  //       },
  //       position: { x: 120, y: 700 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "end",
  //       data: {
  //         label: "Chiudi Ticket",
  //         description: "Contesto: Chiudi Ticket.",
  //         type: "end",
  //         id: "end",
  //         config: {},
  //       },
  //       position: { x: 460, y: 1060 },
  //       type: "canvas",
  //     },
  //   ],
  //   edges: [
  //     { id: "e1", source: "start", target: "client" },
  //     { id: "e2", source: "client", target: "validate" },
  //     { id: "e3", source: "validate", target: "complete-check" },
  //     {
  //       id: "e4",
  //       source: "complete-check",
  //       target: "approve-rules",
  //       label: "Si",
  //     },
  //     {
  //       id: "e5",
  //       source: "complete-check",
  //       target: "notify-missing",
  //       label: "No",
  //     },
  //     { id: "e6", source: "notify-missing", target: "client" },
  //     { id: "e7", source: "approve-rules", target: "approve-check" },
  //     {
  //       id: "e8",
  //       source: "approve-check",
  //       target: "assign-tech",
  //       label: "Si",
  //     },
  //     { id: "e9", source: "approve-check", target: "reopen", label: "No" },
  //     { id: "e10", source: "reopen", target: "client" },
  //     { id: "e11", source: "assign-tech", target: "l1" },
  //     { id: "e12", source: "l1", target: "resolve" },
  //     { id: "e13", source: "resolve", target: "end" },
  //   ],
  // },
  // {
  //   id: "sla-breach-control",
  //   name: "Controllo Violazione SLA",
  //   description:
  //     "Flusso avanzato con timer SLA, escalation multipla e controllo del supervisore.",
  //   nodes: [
  //     {
  //       id: "start",
  //       data: {
  //         label: "Ticket Creato",
  //         description: "Contesto: Ticket Creato.",
  //         type: "start",
  //         id: "start",
  //         config: {},
  //       },
  //       position: { x: 420, y: 0 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "l1-intake",
  //       data: {
  //         label: "Tecnico L1",
  //         description: "Contesto: Tecnico L1.",
  //         type: "actor",
  //         id: "l1-tech",
  //         config: {},
  //       },
  //       position: { x: 420, y: 100 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "timer",
  //       data: {
  //         label: "Timer SLA",
  //         description: "Contesto: Timer SLA.",
  //         type: "automation",
  //         id: "sla-timer",
  //         config: {},
  //       },
  //       position: { x: 420, y: 220 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "rule-check",
  //       data: {
  //         label: "Regole di Business",
  //         description: "Contesto: Regole di Business.",
  //         type: "automation",
  //         id: "business-rules",
  //         config: {},
  //       },
  //       position: { x: 420, y: 340 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "resolved-fast",
  //       data: {
  //         label: "Risolto entro SLA?",
  //         description: "Contesto: Risolto entro SLA?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 420, y: 460 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "l2-escalation",
  //       data: {
  //         label: "Escalation",
  //         description: "Contesto: Escalation.",
  //         type: "automation",
  //         id: "escalation",
  //         config: {},
  //       },
  //       position: { x: 640, y: 580 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "l2-owner",
  //       data: {
  //         label: "Tecnico L2",
  //         description: "Contesto: Tecnico L2.",
  //         type: "actor",
  //         id: "l2-tech",
  //         config: {},
  //       },
  //       position: { x: 640, y: 700 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "breach-check",
  //       data: {
  //         label: "Rischio violazione?",
  //         description: "Contesto: Rischio violazione?.",
  //         type: "decision",
  //         id: "condition",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 640, y: 820 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "notify-supervisor",
  //       data: {
  //         label: "Notifica",
  //         description: "Contesto: Notifica.",
  //         type: "automation",
  //         id: "notify",
  //         config: {},
  //       },
  //       position: { x: 860, y: 940 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "supervisor",
  //       data: {
  //         label: "Supervisore",
  //         description: "Contesto: Supervisore.",
  //         type: "actor",
  //         id: "supervisor",
  //         config: {},
  //       },
  //       position: { x: 860, y: 1060 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "auto-reassign",
  //       data: {
  //         label: "Assegnazione Automatica",
  //         description: "Contesto: Assegnazione Automatica.",
  //         type: "automation",
  //         id: "auto-assign",
  //         config: {},
  //       },
  //       position: { x: 640, y: 940 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "resolve",
  //       data: {
  //         label: "Risolvi Ticket",
  //         description: "Contesto: Risolvi Ticket.",
  //         type: "action",
  //         id: "resolve",
  //         config: {},
  //       },
  //       position: { x: 420, y: 940 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "close",
  //       data: {
  //         label: "Chiudi Ticket",
  //         description: "Contesto: Chiudi Ticket.",
  //         type: "end",
  //         id: "end",
  //         config: {},
  //       },
  //       position: { x: 420, y: 1080 },
  //       type: "canvas",
  //     },
  //   ],
  //   edges: [
  //     { id: "e1", source: "start", target: "l1-intake" },
  //     { id: "e2", source: "l1-intake", target: "timer" },
  //     { id: "e3", source: "timer", target: "rule-check" },
  //     { id: "e4", source: "rule-check", target: "resolved-fast" },
  //     { id: "e5", source: "resolved-fast", target: "resolve", label: "Si" },
  //     {
  //       id: "e6",
  //       source: "resolved-fast",
  //       target: "l2-escalation",
  //       label: "No",
  //     },
  //     { id: "e7", source: "l2-escalation", target: "l2-owner" },
  //     { id: "e8", source: "l2-owner", target: "breach-check" },
  //     {
  //       id: "e9",
  //       source: "breach-check",
  //       target: "notify-supervisor",
  //       label: "Si",
  //     },
  //     { id: "e10", source: "breach-check", target: "resolve", label: "No" },
  //     { id: "e11", source: "notify-supervisor", target: "supervisor" },
  //     { id: "e12", source: "supervisor", target: "auto-reassign" },
  //     { id: "e13", source: "auto-reassign", target: "l2-owner" },
  //     { id: "e15", source: "resolve", target: "close" },
  //   ],
  // },
  // {
  //   id: "major-incident-response",
  //   name: "Gestione Major Incident",
  //   description:
  //     "Flusso enterprise con loop di investigazione, escalation verso vendor e postmortem.",
  //   nodes: [
  //     {
  //       id: "start",
  //       data: {
  //         label: "Ticket Creato",
  //         description: "Contesto: Ticket Creato.",
  //         type: "start",
  //         id: "start",
  //         config: {},
  //       },
  //       position: { x: 460, y: 0 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "intake-bot",
  //       data: {
  //         label: "Bot Intake Automatico",
  //         description: "Contesto: Bot Intake Automatico.",
  //         type: "automation",
  //         id: "business-rules",
  //         config: {},
  //       },
  //       position: { x: 460, y: 100 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "triage-l1",
  //       data: {
  //         label: "Triage L1",
  //         description: "Contesto: Triage L1.",
  //         type: "actor",
  //         id: "l1-tech",
  //         config: {},
  //       },
  //       position: { x: 460, y: 200 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "critical-check",
  //       data: {
  //         label: "Impatto critico?",
  //         description: "Contesto: Impatto critico?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 460, y: 320 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "assign-im",
  //       data: {
  //         label: "Assegna Incident Manager",
  //         description: "Contesto: Assegna Incident Manager.",
  //         type: "automation",
  //         id: "auto-assign",
  //         config: {},
  //       },
  //       position: { x: 220, y: 440 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "notify-stakeholders",
  //       data: {
  //         label: "Notifica Stakeholder",
  //         description: "Contesto: Notifica Stakeholder.",
  //         type: "action",
  //         id: "validate",
  //         config: {},
  //       },
  //       position: { x: 460, y: 440 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "l3-investigation",
  //       data: {
  //         label: "Investigazione Approfondita L3",
  //         description: "Contesto: Investigazione Approfondita L3.",
  //         type: "actor",
  //         id: "l3-specialist",
  //         config: {},
  //       },
  //       position: { x: 700, y: 440 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "workaround-check",
  //       data: {
  //         label: "Workaround disponibile?",
  //         description: "Contesto: Workaround disponibile?.",
  //         type: "decision",
  //         id: "condition",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 700, y: 560 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "publish-workaround",
  //       data: {
  //         label: "Pubblica Workaround",
  //         description: "Contesto: Pubblica Workaround.",
  //         type: "action",
  //         id: "validate",
  //         config: {},
  //       },
  //       position: { x: 540, y: 680 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "vendor-escalation",
  //       data: {
  //         label: "Escalation al Vendor",
  //         description: "Contesto: Escalation al Vendor.",
  //         type: "automation",
  //         id: "escalation",
  //         config: {},
  //       },
  //       position: { x: 860, y: 680 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "vendor-response",
  //       data: {
  //         label: "Fix del Vendor pronto?",
  //         description: "Contesto: Fix del Vendor pronto?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 860, y: 800 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "monitoring",
  //       data: {
  //         label: "Monitora Stabilità",
  //         description: "Contesto: Monitora Stabilit�.",
  //         type: "action",
  //         id: "resolve",
  //         config: {},
  //       },
  //       position: { x: 700, y: 920 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "standard-resolution",
  //       data: {
  //         label: "Risoluzione Standard",
  //         description: "Contesto: Risoluzione Standard.",
  //         type: "action",
  //         id: "resolve",
  //         config: {},
  //       },
  //       position: { x: 220, y: 560 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "qa-validation",
  //       data: {
  //         label: "Validazione QA",
  //         description: "Contesto: Validazione QA.",
  //         type: "actor",
  //         id: "l2-tech",
  //         config: {},
  //       },
  //       position: { x: 220, y: 680 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "resolved-check",
  //       data: {
  //         label: "Risolto?",
  //         description: "Contesto: Risolto?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 360, y: 800 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "postmortem",
  //       data: {
  //         label: "Postmortem + Aggiornamento KB",
  //         description: "Contesto: Postmortem + Aggiornamento KB.",
  //         type: "automation",
  //         id: "business-rules",
  //         config: {},
  //       },
  //       position: { x: 460, y: 920 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "close",
  //       data: {
  //         label: "Chiudi Ticket",
  //         description: "Contesto: Chiudi Ticket.",
  //         type: "end",
  //         id: "end",
  //         config: {},
  //       },
  //       position: { x: 460, y: 1040 },
  //       type: "canvas",
  //     },
  //   ],
  //   edges: [
  //     { id: "e1", source: "start", target: "intake-bot" },
  //     { id: "e2", source: "intake-bot", target: "triage-l1" },
  //     { id: "e3", source: "triage-l1", target: "critical-check" },
  //     { id: "e4", source: "critical-check", target: "assign-im", label: "Si" },
  //     { id: "e5", source: "assign-im", target: "notify-stakeholders" },
  //     { id: "e6", source: "notify-stakeholders", target: "l3-investigation" },
  //     { id: "e7", source: "l3-investigation", target: "workaround-check" },
  //     {
  //       id: "e8",
  //       source: "workaround-check",
  //       target: "publish-workaround",
  //       label: "Si",
  //     },
  //     {
  //       id: "e9",
  //       source: "workaround-check",
  //       target: "vendor-escalation",
  //       label: "No",
  //     },
  //     { id: "e10", source: "vendor-escalation", target: "vendor-response" },
  //     {
  //       id: "e11",
  //       source: "vendor-response",
  //       target: "monitoring",
  //       label: "Si",
  //     },
  //     {
  //       id: "e12",
  //       source: "vendor-response",
  //       target: "l3-investigation",
  //       label: "No",
  //     },
  //     { id: "e13", source: "publish-workaround", target: "monitoring" },
  //     { id: "e14", source: "monitoring", target: "postmortem" },
  //     {
  //       id: "e15",
  //       source: "critical-check",
  //       target: "standard-resolution",
  //       label: "No",
  //     },
  //     { id: "e16", source: "standard-resolution", target: "qa-validation" },
  //     { id: "e17", source: "qa-validation", target: "resolved-check" },
  //     {
  //       id: "e18",
  //       source: "resolved-check",
  //       target: "postmortem",
  //       label: "Si",
  //     },
  //     { id: "e19", source: "resolved-check", target: "triage-l1", label: "No" },
  //     { id: "e20", source: "postmortem", target: "close" },
  //   ],
  // },
  // {
  //   id: "global-outage-war-room",
  //   name: "War Room Disservizio Globale",
  //   description:
  //     "Flusso expert con triage multilivello, loop di remediation e chiusura governata.",
  //   nodes: [
  //     {
  //       id: "start",
  //       data: {
  //         label: "Disservizio Rilevato",
  //         description: "Contesto: Disservizio Rilevato.",
  //         type: "start",
  //         id: "start",
  //         config: {},
  //       },
  //       position: { x: 520, y: 0 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "intake",
  //       data: {
  //         label: "Presa in Carico L1",
  //         description: "Contesto: Presa in Carico L1.",
  //         type: "actor",
  //         id: "l1-tech",
  //         config: {},
  //       },
  //       position: { x: 520, y: 110 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "rules",
  //       data: {
  //         label: "Regole di Business",
  //         description: "Contesto: Regole di Business.",
  //         type: "automation",
  //         id: "business-rules",
  //         config: {},
  //       },
  //       position: { x: 520, y: 230 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "sev-decision",
  //       data: {
  //         label: "SEV-1 confermato?",
  //         description: "Contesto: SEV-1 confermato?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 520, y: 360 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "incident-manager",
  //       data: {
  //         label: "Assegna Incident Manager",
  //         description: "Contesto: Assegna Incident Manager.",
  //         type: "automation",
  //         id: "auto-assign",
  //         config: {},
  //       },
  //       position: { x: 260, y: 500 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "major-bridge",
  //       data: {
  //         label: "Crea Bridge",
  //         description: "Contesto: Crea Bridge.",
  //         type: "action",
  //         id: "validate",
  //         config: {},
  //       },
  //       position: { x: 260, y: 620 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "l3",
  //       data: {
  //         label: "Specialista L3",
  //         description: "Contesto: Specialista L3.",
  //         type: "actor",
  //         id: "l3-specialist",
  //         config: {},
  //       },
  //       position: { x: 520, y: 500 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "vendor",
  //       data: {
  //         label: "Escalation al Vendor",
  //         description: "Contesto: Escalation al Vendor.",
  //         type: "automation",
  //         id: "escalation",
  //         config: {},
  //       },
  //       position: { x: 780, y: 500 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "workaround-decision",
  //       data: {
  //         label: "Workaround disponibile?",
  //         description: "Contesto: Workaround disponibile?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 520, y: 650 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "publish-workaround",
  //       data: {
  //         label: "Pubblica Workaround",
  //         description: "Contesto: Pubblica Workaround.",
  //         type: "action",
  //         id: "validate",
  //         config: {},
  //       },
  //       position: { x: 340, y: 780 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "vendor-fix-decision",
  //       data: {
  //         label: "Fix del Vendor pronto?",
  //         description: "Contesto: Fix del Vendor pronto?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 780, y: 650 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "wait-cycle",
  //       data: {
  //         label: "Timer SLA",
  //         description: "Contesto: Timer SLA.",
  //         type: "automation",
  //         id: "sla-timer",
  //         config: {},
  //       },
  //       position: { x: 940, y: 780 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "stability-decision",
  //       data: {
  //         label: "Stabile per 30 min?",
  //         description: "Contesto: Stabile per 30 min?.",
  //         type: "decision",
  //         id: "decision",
  //         config: { decisionType: "boolean" },
  //       },
  //       position: { x: 520, y: 910 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "rollback",
  //       data: {
  //         label: "Riapri Ticket",
  //         description: "Contesto: Riapri Ticket.",
  //         type: "automation",
  //         id: "reopen",
  //         config: {},
  //       },
  //       position: { x: 700, y: 1030 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "postmortem",
  //       data: {
  //         label: "Postmortem + Aggiornamento KB",
  //         description: "Contesto: Postmortem + Aggiornamento KB.",
  //         type: "automation",
  //         id: "business-rules",
  //         config: {},
  //       },
  //       position: { x: 520, y: 1030 },
  //       type: "canvas",
  //     },
  //     {
  //       id: "closure",
  //       data: {
  //         label: "Chiudi Ticket",
  //         description: "Contesto: Chiudi Ticket.",
  //         type: "end",
  //         id: "end",
  //         config: {},
  //       },
  //       position: { x: 520, y: 1160 },
  //       type: "canvas",
  //     },
  //   ],
  //   edges: [
  //     { id: "e1", source: "start", target: "intake" },
  //     { id: "e2", source: "intake", target: "rules" },
  //     { id: "e3", source: "rules", target: "sev-decision" },
  //     {
  //       id: "e4",
  //       source: "sev-decision",
  //       target: "incident-manager",
  //       label: "Si",
  //     },
  //     { id: "e5", source: "sev-decision", target: "l3", label: "No" },
  //     { id: "e6", source: "incident-manager", target: "major-bridge" },
  //     { id: "e7", source: "major-bridge", target: "l3" },
  //     { id: "e8", source: "l3", target: "workaround-decision" },
  //     {
  //       id: "e9",
  //       source: "workaround-decision",
  //       target: "publish-workaround",
  //       label: "Si",
  //     },
  //     {
  //       id: "e10",
  //       source: "workaround-decision",
  //       target: "vendor",
  //       label: "No",
  //     },
  //     { id: "e11", source: "publish-workaround", target: "stability-decision" },
  //     { id: "e12", source: "vendor", target: "vendor-fix-decision" },
  //     {
  //       id: "e13",
  //       source: "vendor-fix-decision",
  //       target: "stability-decision",
  //       label: "Si",
  //     },
  //     {
  //       id: "e14",
  //       source: "vendor-fix-decision",
  //       target: "wait-cycle",
  //       label: "No",
  //     },
  //     { id: "e15", source: "wait-cycle", target: "l3" },
  //     {
  //       id: "e16",
  //       source: "stability-decision",
  //       target: "postmortem",
  //       label: "Si",
  //     },
  //     {
  //       id: "e17",
  //       source: "stability-decision",
  //       target: "rollback",
  //       label: "No",
  //     },
  //     { id: "e18", source: "rollback", target: "l3" },
  //     { id: "e19", source: "postmortem", target: "closure" },
  //   ],
  // },
] as WorkflowTemplate[];
