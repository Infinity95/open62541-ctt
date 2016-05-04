/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems uses the following parameter values
            MODE   = MonitoringMode.Disabled;
            FILTER = Event.GetDataChangeFilter( DeadbandType.Absolute, 0, DataChangeTrigger.StatusValue ); // needs to reflect whatever "ON" means?????
            QUEUE  = 1;
            TIMES  = TimestampsToReturn.Server;
        Expected to succeed. Subscription is created and deleted in initialize and cleanup scripts */

function createMonitoredItems591003() {
    const       MODE   = MonitoringMode.Disabled;
    const       FILTER = Event.GetDataChangeFilter( DeadbandType.Absolute, 0, DataChangeTrigger.StatusValue ); // needs to reflect whatever "ON" means?????
    const       QUEUE  = 1;
    const       TIMES  = TimestampsToReturn.Server;
    basicCreateMonitoredItemsTest( MODE, FILTER, QUEUE, TIMES );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591003 } );