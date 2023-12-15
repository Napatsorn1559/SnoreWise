// ApiState.js
import { atom } from 'recoil';

export const currentUserId = atom({
  key: 'currentUserId',
  default: '0',
})

export const currentUsername = atom({
  key: 'currentUsername',
  default: 'user',
})

export const currentDate = atom({
  key: 'currentDate',
  default: new Date(),
})

export const totalCalls = atom({
  key: 'totalCalls',
  default: '0'
})

export const totalSleeptime = atom({
  key: 'totalSleeptime',
  default: '0'
})

export const totalNotification = atom({
  key: 'totalNotification',
  default: '0'
})