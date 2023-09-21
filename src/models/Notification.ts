export interface Notification {
  type: TYPENOTIFICATION;
  isread: boolean;
  extra: any;
}

enum TYPENOTIFICATION {
  FRIENDREQUEST,
}
