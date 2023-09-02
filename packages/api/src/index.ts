export interface AskServiceWorkerEvent {
  type: 'ASKSW'
  domain: string
  scriptURL: string
}

export type SWEvent = AskServiceWorkerEvent

export interface RemoveServiceWorkerEvent {
  type: 'REMOVESW'
  scriptURL: string
}

export interface FieldValue {
  selector: string
  value: string
}

export interface AddFieldValueEvent {
  type: 'ADD_FIELD_VALUE'
  fields: FieldValue[]
}

export type SWBackgroundEvent = RemoveServiceWorkerEvent | AddFieldValueEvent

export type SWPreferences = {
  domain: string
  regs: Record<string, boolean>
}
