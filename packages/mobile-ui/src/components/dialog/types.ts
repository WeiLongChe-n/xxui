export type DialogAction = 'confirm' | 'cancel' | 'overlay'

export interface DialogBeforeClose {
  (action: DialogAction): boolean | Promise<boolean>
}
