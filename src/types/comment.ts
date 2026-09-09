export interface Comment {
  id: string;
  petitionId: string;
  userId: string;
  userName: string;
  userRole: "citizen" | "officer" | "admin";
  content: string;
  createdAt: string;
  isInternal?: boolean;
}
