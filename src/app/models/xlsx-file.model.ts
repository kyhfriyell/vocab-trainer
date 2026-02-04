export interface XlsxFile {
    fileName: string;
    sheets: XlsxSheet[];
}

export interface XlsxSheet {
    sheetName: string;
    entries: any[];
}