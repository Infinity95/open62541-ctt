/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems uses the following parameter values:
            MODE   = MonitoringMode.Sampling;
            FILTER = null; // needs to reflect whatever "ON" means????
            QUEUE  = 1;
            TIMES  = TimestampsToReturn.Server;
        Expected to succeed.
        subscription is created and deleted in initialize and cleanup scripts */

function createMonitoredItems591008() {
    const       MODE   = MonitoringMode.Sampling;
    const       FILTER = null; // needs to reflect whatever "ON" means????
    const       QUEUE  = 1;
    const       TIMES  = TimestampsToReturn.Server;
    basicCreateMonitoredItemsTest( MODE, FILTER, QUEUE, TIMES );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591008 } );