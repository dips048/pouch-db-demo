import { Component } from '@angular/core';
import { LogEntry, LogLocalStorage, Product } from '../../shared/models';
import { LogService } from '../../services';
import { LogLevel } from 'src/app/shared/enums';

@Component({
  selector: 'app-log-test',
  templateUrl: './log-test.component.html',
  styleUrls: ['./log-test.component.scss']
})
export class LogTestComponent {

  logEntries: LogEntry[];

  constructor(private logger: LogService) { }

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

    this.logger.log("This is a product object", product);
  }

  getLocalStorage(): void {
    let tmp = this.logger.publishers.find(p => p.constructor.name === "LogLocalStorage");
    if (tmp != null) {
      let local = tmp as LogLocalStorage;
      local.getAll().subscribe(response => this.logEntries = response);
    }
  }
}
