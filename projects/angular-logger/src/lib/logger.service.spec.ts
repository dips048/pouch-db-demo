import { TestBed } from '@angular/core/testing';
import { LogLevel } from '.';
import { LogEntry } from './log-entry';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService]
    });
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('on registerComponent()', () => {

    beforeEach(() => {
      localStorage.clear();
    })

    it('should call setItems() at localstorage to add data to localstorage', () => {
      let jsonParseSpy = spyOn(JSON, 'parse').and.returnValue({});
      let setItemSpy = spyOn(localStorage, 'setItem');

      service.registerComponent('default', LogLevel.All);

      expect(service.componentName).toEqual('default');
      expect(jsonParseSpy).toHaveBeenCalled();
      expect(setItemSpy).toHaveBeenCalledWith('logConfig', '{"default":0}');
    })

    it('should not call setItems() at localstorage for adding data to localstorage if data already exist', () => {
      let jsonParseSpy = spyOn(JSON, 'parse').and.returnValue({default:0});
      let setItemSpy = spyOn(localStorage, 'setItem');

      service.registerComponent('default', LogLevel.All);

      expect(service.componentName).toEqual('default');
      expect(jsonParseSpy).toHaveBeenCalled();
      expect(setItemSpy).not.toHaveBeenCalledWith('logConfig', '{"default":0}');
    })
  })

  describe('on changeLogLevel()', () => {

    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem('logConfig', '{"test":0}')
      service.componentName = 'test';
    })

    it('should add new value of "default" with its level in localStorage', () => {
      let setItemSpy = spyOn(localStorage, 'setItem');

      localStorage.clear();
      service.componentName = "default"
      service.changeLogLevel(LogLevel.Off);

      expect(setItemSpy).toHaveBeenCalledWith('logConfig', '{"default":7}');
    })

    it('should update the value of "test" in localStorage', () => {
      let setItemSpy = spyOn(localStorage, 'setItem');

      service.changeLogLevel(LogLevel.Off);

      expect(setItemSpy).toHaveBeenCalledWith('logConfig', '{"test":7}');
    })

    it('should insert value of "default" in localStorage without removing the old data', () => {
      let setItemSpy = spyOn(localStorage, 'setItem');

      service.componentName = "default"
      service.changeLogLevel(LogLevel.Off);

      expect(setItemSpy).toHaveBeenCalledWith('logConfig', '{"test":0,"default":7}');
    })

  })

  describe('on getLogLevel()', () => {
    beforeEach(() => {
      localStorage.clear();
      service.componentName = 'test';
    })
    it("should return value of component's level from localStorage", () => {
      localStorage.setItem('logConfig', '{"test":6}');

      const data = service.getLogLevel();

      expect(service.componentName).toEqual('test');
      expect(data).toEqual(6);
    })

    it("should return default level if no data found in localstorage", () => {

      const data = service.getLogLevel();

      expect(service.componentName).toEqual('test');
      expect(data).toEqual(service.level);
    })
  })

  it("log() should not console.log the msg when logLevel is Off", () => {
    service.level = LogLevel.Off;
    let consoleSpy = spyOn(console, 'log');

    service.log('abc', 'color: blue');

    expect(consoleSpy).not.toHaveBeenCalled();
  })

  describe('service method', () => {
    let consoleSpy;

    beforeEach(() => {
      service.componentName = 'test';
      consoleSpy = spyOn(console, 'log');
      localStorage.setItem('logConfig', '{"test":0}');
    })

    it("log() should console.log the msg when logLevel is All", () => {
      service.log('abc', 'color: blue');
      //service.writeToLog('abc', LogLevel.All, 'color: blue', []);

      expect(consoleSpy).toHaveBeenCalledWith(`%c ${new LogEntry(new Date(), 'abc', LogLevel.All, [], service.logWithDate).buildLogString()}`, 'color: blue');
    })

    it("debug() should console.log the msg when logLevel is All", () => {
      service.debug('abc', 'color: blue');
      // service.writeToLog('abc', LogLevel.Debug, 'color: blue', []);

      expect(consoleSpy).toHaveBeenCalledWith(`%c ${new LogEntry(new Date(), 'abc', LogLevel.Debug, [], service.logWithDate).buildLogString()}`, 'color: blue');
    })

    it("error() should console.error the msg when logLevel is All", () => {
      consoleSpy = spyOn(console, 'error');

      service.error('abc');
      // service.writeToLog('abc', LogLevel.Error, '', []);

      expect(consoleSpy).toHaveBeenCalledWith(`${new LogEntry(new Date(), 'abc', LogLevel.Error, [], service.logWithDate).buildLogString()}`);
    })

    it("warn() should console.warn the msg when logLevel is All", () => {
      consoleSpy = spyOn(console, 'warn');

      service.warn('abc');
      // service.writeToLog('abc', LogLevel.Warn, '', []);

      expect(consoleSpy).toHaveBeenCalledWith(`${new LogEntry(new Date(), 'abc', LogLevel.Warn, [], service.logWithDate).buildLogString()}`);
    })

    it("fatal() should console.log the msg when logLevel is All", () => {
      service.fatal('abc', 'color: blue');
      // service.writeToLog('abc', LogLevel.Fatal, 'color: blue', []);

      expect(consoleSpy).toHaveBeenCalledWith(`%c ${new LogEntry(new Date(), 'abc', LogLevel.Fatal, [], service.logWithDate).buildLogString()}`, 'color: blue');
    })


    it("info() should console.log the msg when logLevel is All", () => {
      service.info('abc', 'color: blue');
      // service.writeToLog('abc', LogLevel.Info, 'color: blue', []);

      expect(consoleSpy).toHaveBeenCalledWith(`%c ${new LogEntry(new Date(), 'abc', LogLevel.Info, [], service.logWithDate).buildLogString()}`, 'color: blue');
    })

    it("stopTimer() should console.timeEnd the msg when logLevel is All", () => {
      consoleSpy = spyOn(console, 'timeEnd');

      service.stopTimer('abc');
      // service.writeToLog('abc', LogLevel.Diagnostic, '', []);

      expect(consoleSpy).toHaveBeenCalledWith('abc');
    })

    it("startTimer() should console.time the msg when logLevel is All", () => {
      consoleSpy = spyOn(console, 'time');

      service.startTimer('abc');

      expect(consoleSpy).toHaveBeenCalledWith('abc');
    })

    it("startTimer() should not console.time the msg when logLevel is Off", () => {
      service.level = LogLevel.Off;
      consoleSpy = spyOn(console, 'time');

      service.startTimer('abc');

      expect(consoleSpy).not.toHaveBeenCalled();
    })

    it("startTimer() should console.time the msg when logLevel is Diagnostic", () => {
      service.level = LogLevel.Diagnostic;
      consoleSpy = spyOn(console, 'time');

      service.startTimer('abc');

      expect(consoleSpy).toHaveBeenCalledWith('abc');
    })

    it("clear() should console.clear", () => {
      consoleSpy = spyOn(console, 'clear');

      service.clear();

      expect(consoleSpy).toHaveBeenCalled();
    })
  })

  describe('on deleteLogLevel()', () => {

    beforeEach(() => {
      localStorage.clear();
      service.componentName = 'testComponent';
    })

    it('should remove value of "testComponent" with its level value in localStorage', () => {
      localStorage.setItem('logConfig', '{"testComponent":0,"defaultComp":0}')

      let setItemSpy = spyOn(localStorage, 'setItem');
      service.deleteLogLevel();

      expect(setItemSpy).toHaveBeenCalledWith('logConfig', '{"defaultComp":0}');
    })

    it('should remove value of "testComponent" with its level value in localStorage if it exists', () => {
      let setItemSpy = spyOn(localStorage, 'setItem');

      service.deleteLogLevel();

      expect(setItemSpy).toHaveBeenCalledWith('logConfig', '{}');
    })
  })

  describe('service method', () => {
    let consoleSpy;

    beforeEach(() => {
      service.componentName = 'test';
      consoleSpy = spyOn(console, 'log');
      localStorage.setItem('logConfig', '{"test":7}');
    })

    it("log() should not console.log the msg when logLevel is Off", () => {
      service.log('abc', 'color: blue');

      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it("debug() should not console.log the msg when logLevel is Off", () => {
      service.debug('abc', 'color: blue');;

      expect(consoleSpy).not.toHaveBeenCalled();
    })

    it("error() should not console.error the msg when logLevel is Off", () => {
      consoleSpy = spyOn(console, 'error');

      service.error('abc');

      expect(consoleSpy).not.toHaveBeenCalled();
    })

    it("warn() should not console.warn the msg when logLevel is Off", () => {
      consoleSpy = spyOn(console, 'warn');

      service.warn('abc');

      expect(consoleSpy).not.toHaveBeenCalled();
    })

    it("fatal() should not console.log the msg when logLevel is Off", () => {
      service.fatal('abc', 'color: blue');

      expect(consoleSpy).not.toHaveBeenCalled();
    })


    it("info() should not console.log the msg when logLevel is Off", () => {
      service.info('abc', 'color: blue');

      expect(consoleSpy).not.toHaveBeenCalled();
    })

    it("stopTimer() not should console.timeEnd the msg when logLevel is Off", () => {
      consoleSpy = spyOn(console, 'timeEnd');

      service.stopTimer('abc');

      expect(consoleSpy).not.toHaveBeenCalledWith('abc');
    })

    it("startTimer() not should console.time the msg when logLevel is Off", () => {
      consoleSpy = spyOn(console, 'time');

      service.startTimer('abc');

      expect(consoleSpy).not.toHaveBeenCalledWith('abc');
    })
  })

  // describe('on shouldLog()', () => {
  //   it("should return true if level is >= default level", () => {
  //     let getLogLevelSpy = spyOn(service, "getLogLevel").and.returnValue(1);

  //     const data = service.shouldLog(4);

  //     expect(getLogLevelSpy).toHaveBeenCalled();
  //     expect(data).toEqual(true);
  //   })

  //   it("should return false if default level >= level", () => {
  //     let getLogLevelSpy = spyOn(service, "getLogLevel").and.returnValue(5);

  //     const data = service.shouldLog(4);

  //     expect(getLogLevelSpy).toHaveBeenCalled();
  //     expect(data).toEqual(false);
  //   })

  //   it("should return false if level is 'Off'", () => {
  //     let getLogLevelSpy = spyOn(service, "getLogLevel").and.returnValue(LogLevel.Off);

  //     const data = service.shouldLog(4);

  //     expect(getLogLevelSpy).toHaveBeenCalled();
  //     expect(data).toEqual(false);
  //   })

  // })
});
