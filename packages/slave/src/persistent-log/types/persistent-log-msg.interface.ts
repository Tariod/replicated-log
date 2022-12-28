export type PersistentLogMsgId = number;

export interface PersistentLogMsg {
  id: PersistentLogMsgId;
  message: string;
}

export type PersistentLogMsgList = PersistentLogMsg[];
