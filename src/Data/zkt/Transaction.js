export class Transaction{
    constructor(id, eventTime, pin, name, lastName, deptName, areaName, cardNo, devSn, verifyModeName,eventName,eventPointName,readerName,accZone,devName,logId) {
        this.id = id ;
        this.eventTime = eventTime;
        this.pin = pin;
        this.name = name;
        this.lastName = lastName;
        this.deptName = deptName;
        this.areaName = areaName;
        this.cardNo = cardNo;
        this.devSn = devSn;
        this.verifyModeName = verifyModeName;
        this.eventName = eventName; 
        this.eventPointName = eventPointName;
        this.readerName = readerName;
        this.accZone = accZone;
        this.devName = devName; 
        this.logId = logId;
    }
};