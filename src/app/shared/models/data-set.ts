export interface DataSet {
  dataSetName:  string,
  docImageIds:  DocImage[]
  totalPages: number
}

export interface DocImage {
  id: string,
  totalPages: number,
  date: number
}
