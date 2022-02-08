import { Component, OnDestroy } from '@angular/core';
import { Product } from '../../shared/models';
import { AngularLoggerService, LogLevel } from '@dips048/angular-logger';

@Component({
  selector: 'app-log-test',
  templateUrl: './log-test.component.html',
  styleUrls: ['./log-test.component.scss']
})
export class LogTestComponent implements OnDestroy {

  logEntries;

  constructor(private logger: AngularLoggerService) {
    this.logger.registerComponent(this.constructor.name, LogLevel.All);
  }

  testLog() {
    this.logger.log(this.constructor.name, 'test log');
    this.logger.warn(this.constructor.name, 'warning');
    this.logger.debug(this.constructor.name, 'debug');
    this.logger.error(this.constructor.name, 'error');
    this.logger.info(this.constructor.name, 'info');
    this.logger.fatal(this.constructor.name, 'fatal');
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

    this.logger.log(this.constructor.name,"This is a product object", product);
  }

  getLocalStorage(): void {
    // let tmp = this.logger.publishers.find(p => p.constructor.name === "LogLocalStorage");
    // if (tmp != null) {
    //   this.logger.getAll(this.constructor.name).subscribe(response => this.logEntries = response)
    //   // let local = tmp as unknown as LogLocalStorage;
    //   // local.getAll().subscribe(response => this.logEntries = response);
    // }
  }

  ngOnDestroy(): void {
    // if(this.logger.publishers && this.logger.publishers.length) {
    //   this.logger.publishers[1].location =  'logging';
    // }
  }
}
