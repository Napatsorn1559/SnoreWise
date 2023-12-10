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
