export interface AskServiceWorkerEvent {
  type: 'ASKSW';
  domain: string;
  scriptURL: string;
}

export type SWEvent = AskServiceWorkerEvent 

export interface RemoveServiceWorkerEvent {
  type: 'REMOVESW';
  scriptURL: string
}

export type SWBackgroundEvent = RemoveServiceWorkerEvent

export type SWPreferences = {
  domain: string,
  regs: Record<string, boolean>
}