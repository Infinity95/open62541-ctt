/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems uses the following parameter values:
            MODE   = MonitoringMode.Disabled;
            FILTER = null;
            QUEUE  = 0;
            TIMES  = TimestampsToReturn.Server;
        Expected to succeed.
        subscription is created and deleted in initialize and cleanup scripts */

function createMonitoredItems591005() {
    const       MODE   = MonitoringMode.Disabled;
    const       FILTER = null;
    const       QUEUE  = 0;
    const       TIMES  = TimestampsToReturn.Server;
    basicCreateMonitoredItemsTest( MODE, FILTER, QUEUE, TIMES );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591005 } );