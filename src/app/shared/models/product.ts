export class Product {
  constructor(
    public productId: number,
    public productName: string,
    public introductionDate: Date,
    public price: number,
    public url: string
  ) {}
}
