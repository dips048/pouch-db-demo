import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../shared/models';
import { LoggerService, LogLevel } from '@dips048/angular-logger';

@Component({
  selector: 'app-log-test',
  templateUrl: './log-test.component.html',
  styleUrls: ['./log-test.component.scss'],
})
export class LogTestComponent implements OnInit{

  logEntries;

  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.registerComponent(this.constructor.name,LogLevel.Debug);
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
