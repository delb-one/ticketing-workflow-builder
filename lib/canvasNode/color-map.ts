import { NodeType } from "../store";
import { NodeTheme } from "./types";
import { getNodeTypeColorToken } from "../colors/color-map";

export const TYPE_THEME_MAP: Record<NodeType, NodeTheme> = {
  actor: {
    color: getNodeTypeColorToken("actor"),
    gradient: getNodeTypeColorToken("actor"),
    softText: getNodeTypeColorToken("actor"),
    handle: getNodeTypeColorToken("actor"),
  },
  decision: {
    color: getNodeTypeColorToken("decision"),
    gradient: getNodeTypeColorToken("decision"),
    softText: getNodeTypeColorToken("decision"),
    handle: getNodeTypeColorToken("decision"),
  },
  condition: {
    color: getNodeTypeColorToken("condition"),
    gradient: getNodeTypeColorToken("condition"),
    softText: getNodeTypeColorToken("condition"),
    handle: getNodeTypeColorToken("condition"),
  },
  automation: {
    color: getNodeTypeColorToken("automation"),
    gradient: getNodeTypeColorToken("automation"),
    softText: getNodeTypeColorToken("automation"),
    handle: getNodeTypeColorToken("automation"),
  },
  action: {
    color: getNodeTypeColorToken("action"),
    gradient: getNodeTypeColorToken("action"),
    softText: getNodeTypeColorToken("action"),
    handle: getNodeTypeColorToken("action"),
  },
  start: {
    color: getNodeTypeColorToken("start"),
    gradient: getNodeTypeColorToken("start"),
    softText: getNodeTypeColorToken("start"),
    handle: getNodeTypeColorToken("start"),
  },
  end: {
    color: getNodeTypeColorToken("end"),
    gradient: getNodeTypeColorToken("end"),
    softText: getNodeTypeColorToken("end"),
    handle: getNodeTypeColorToken("end"),
  },
  status: {
    color: getNodeTypeColorToken("status"),
    gradient: getNodeTypeColorToken("status"),
    softText: getNodeTypeColorToken("status"),
    handle: getNodeTypeColorToken("status"),
  },
  event: {
    color: getNodeTypeColorToken("event"),
    gradient: getNodeTypeColorToken("event"),
    softText: getNodeTypeColorToken("event"),
    handle: getNodeTypeColorToken("event"),
  },
};

export const TYPE_LABEL_MAP: Record<NodeType, string> = {
  actor: 'Actor',
  decision: 'Decision',
  condition: 'Condition',
  automation: 'Automation',
  action: 'Action',
  start: 'Start',
  end: 'End',
  status: 'Status',
  event: 'Event',
};
