/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems uses the following parameter values:
            MODE   = MonitoringMode.Reporting;
            FILTER = null;
            QUEUE  = 1;
            TIMES  = TimestampsToReturn.Server;
        Expected to succeed.
        subscription is created and deleted in initialize and cleanup scripts */

function createMonitoredItems591012() {
    const       MODE   = MonitoringMode.Reporting;
    const       FILTER = null;
    const       QUEUE  = 1;
    const       TIMES  = TimestampsToReturn.Server;
    basicCreateMonitoredItemsTest( MODE, FILTER, QUEUE, TIMES );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591012 } );