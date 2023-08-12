import { atom } from 'recoil';

// Define atoms
export const userAtom = atom({
  key: 'userAtom', // A unique ID (with respect to other atoms/selectors)
  default: {
    name: '',
    email: '',
    Image: '',
    uid: '',
  },
});

export const uidAtom= atom({
  key: 'uidAtom', // A unique ID (with respect to other atoms/selectors)
  default: '',
})
