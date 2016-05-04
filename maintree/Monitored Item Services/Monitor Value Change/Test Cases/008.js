/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems uses the following parameter values:
            const       MODE   = MonitoringMode.Reporting;
            const       FILTER = null; // needs to reflect whatever "OFF" means????
            const       QUEUE  = 0;
            const       TIMES  = TimestampsToReturn.Server;
        Expected to succeed.
        subscription is created and deleted in initialize and cleanup scripts */

function createMonitoredItems591013() {
    const       MODE   = MonitoringMode.Reporting;
    const       FILTER = null; // needs to reflect whatever "OFF" means????
    const       QUEUE  = 0;
    const       TIMES  = TimestampsToReturn.Server;
    basicCreateMonitoredItemsTest( MODE, FILTER, QUEUE, TIMES );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591013 } );