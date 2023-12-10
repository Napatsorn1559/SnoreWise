// ApiState.js
import { atom } from 'recoil';

export const currentUserId = atom({
  key: 'currentUserId',
  default: 3,
})

export const currentDate = atom({
  key: 'currentDate',
  default: new Date(),
})
