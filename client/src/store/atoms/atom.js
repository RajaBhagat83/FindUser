import {atom} from "recoil"
import { io } from "socket.io-client";

export const us = atom({
  key:"user",
  default: JSON.parse(localStorage.getItem("user:details")) || {}
})


export const selectedUsers = atom({
  key:"selectedUser",
  default:null
});


export const conversations = atom({
  key:"conversation",
  default:[]
});

export const messaging = atom({
  key:"messages",
  default: { 
    messages: [],
    receiver: null,
    conversationId: null
  }
});

export const messag = atom({
  key:"message",
  default:""
});

export const people = atom({
  key:"users",
  default:[]
});

 
export const sockets = atom({
  key:"socket",
  default:null
});

export const interests = atom({
  key:"interest",
  default:""
});


export const filteredUser = atom({
  key:"filteredUsers",
  default:[]
});

export const searchUsers = atom({
  key:"searchUser",
  default:""
});

export const profiles = atom({
  key:"profile",
  default:false
});

