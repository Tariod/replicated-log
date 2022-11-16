export type RepLogMsgId = number;

export interface RepLogMsg {
  id: RepLogMsgId;
  message: string;
}

export type RepLogMsgList = RepLogMsg[];
