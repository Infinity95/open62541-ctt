/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Using default parameters to monitor more than 3 items per subscription, with 3 subscriptions. Vary the data-types of the items being 
        subscribed to. Vary the scan rates of the subscriptions to 100, 1000 and 5000 respectively. */

function createMonitoredItems591018() {
    const MONITORINGMODE = MonitoringMode.Reporting;
    const FILTER         = null;
    const REQQUEUESIZE   = 1;
    const TIMESTAMPS     = TimestampsToReturn.Both;
    const SESSIONCOUNT   = 3;

    // get as many nodes as we can
    var settings = Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings;
    if( settings === undefined || settings === null || settings.length === 0 ) {
        addSkipped( "Static Scalar (numeric)" );
        return( false );
    }
    var items = MonitoredItem.fromSettings( settings, 0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 10 );
    if( items.length < 4 ) {
        addWarning( "Test cannot be completed: " + items.length + " variables are configured in settings but more tha 3 are required for this test." );
        return( false );
    }

    // test 10 subscriptions per session, 3 sessions!
    basicCreateMonitoredItemsMultipleNodes( items, MONITORINGMODE, FILTER, REQQUEUESIZE, TIMESTAMPS, SESSIONCOUNT );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591018 } );