export interface lastUpdate {
  communication: string;
  time: string;
}

export interface userInterface {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  age: number;
  permissions: personPermissions;
  blockedPersons: string[];
  lastTimeOnline: string;
  lastUpdate: lastUpdate[];
}

export interface personPermissions {
  canOtherSeeMyProfilePicture: boolean;
  canOtherAddMeToACommunicate: boolean;
}

export interface chanelInterface {
  _id: string; //id is chanel name...
  subscribers: string[];
  description: string;
  owner: string;
}

export interface chatRoom {
  _id: string;
  user1: string;
  user2: string;
}

export interface groupeInterface {
  _id: string; //id is chanel name...
  description: string;
  owner: string;
  permissions: string[];
  users: userInterface[];
}

export interface messageInterface {
  _id: string;
  communicateName: string;
  time: string;
  msg: string;
  msgOwner: string;
}
