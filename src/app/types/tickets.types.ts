export interface Tickets {
  AssignmentStatusID: number;
  AssignmentStatusName: string;
  AuthorizationStatusID: number;
  AuthorizationStatusName: string;
  Conclusion: string;
  ConclusionDefinition: string | null;
  EndDate: string | null;
  File1: any;
  File2: any;
  HierarchyID: number;
  HierarchyName: string;
  Issue: string | null;
  Observations: string | null;
  Opinion: string | null;
  PrestructuredTicket: any; // Buffer
  Quotation: string | null;
  RequestNotes: string | null;
  RequestPurpose: string | null;
  RequiresAuthorization: any; // Buffer
  StartDate: string | null;
  Suggestion: string | null;
  TaskID: number;
  TaskName: string;
  TicketID: number;
  TicketStartDate: string;
  UserExecID: number | null;
  UserExecName: string | null;
  UserHolderDate: string;
  UserHolderID: number;
  UserHolderName: string;

  SegmentID: number | null;
  SegmentName: string | null;
  CategoryID: number | null;
  CategoryName: string | null;
  SubcategoryID: number | null;
  SubcategoryName: string | null;
  ConceptID: number | null;
  ConceptName: string | null;
}
