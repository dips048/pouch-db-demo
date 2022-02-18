import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggerService, LogLevel } from '@dips048/angular-logger';
import { Product } from 'src/app/shared/models';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit{
  logEntries;

  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.registerComponent(this.constructor.name , LogLevel.All);
  }

  testLog() {
    this.logger.log('test log');
    this.logger.warn('warning');
    this.logger.debug('debug');
    this.logger.error('error');
    this.logger.info('info');
    this.logger.fatal('fatal');
  }

  clearLog(): void {
    this.logger.clear();
  }

  objectLog(): void {
    let product = new Product(1, "A new product", new Date(), 10, "www.fairwaytech.com");

    // product.productId = 1;
    // product.productName = "A new product";
    // product.introductionDate = new Date();
    // product.price = 10;
    // product.url = "www.fairwaytech.com";

    this.logger.log("This is a product object", 'color: black', product);
  }



}
