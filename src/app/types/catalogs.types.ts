export interface Catalog {
    slug: string;
    name: string;
    description: string;
    isActive: boolean;
    icon: string;
}

export interface Segment {
    SegmentID: number;
    Name: string;
}

export interface Category {
    CategoryID: number;
    Name: string;
}

export interface Subcategory {
    SubcategoryID: number;
    Name: string;
}

export interface Concept {
    ConceptID: number;
    Name: string;
}