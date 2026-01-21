export interface Task {
    TaskID: number;
    TaskName: string;
    SegmentID: number;
    SegmentName: string;
    CategoryID: number;
    CategoryName: string;
    SubcategoryID: number;
    SubcategoryName: string;
    ConceptID: number | null;
    ConceptName: string | null;
}