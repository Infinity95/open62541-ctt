/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        CreateMonitoredItems uses the following parameter values:
            MODE   = MonitoringMode.Reporting;
            FILTER = Event.GetDataChangeFilter( DeadbandType.Absolute, 0, DataChangeTrigger.StatusValue );
            QUEUE  = 1;
            TIMES  = TimestampsToReturn.Server;
        Expected to succeed.
        Subscription is created and deleted in initialize and cleanup scripts. */

function createMonitoredItems591010() {
    const       MODE   = MonitoringMode.Reporting;
    const       FILTER = Event.GetDataChangeFilter( DeadbandType.Absolute, 0, DataChangeTrigger.StatusValue );
    const       QUEUE  = 1;
    const       TIMES  = TimestampsToReturn.Server;
    basicCreateMonitoredItemsTest( MODE, FILTER, QUEUE, TIMES );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591010 } );