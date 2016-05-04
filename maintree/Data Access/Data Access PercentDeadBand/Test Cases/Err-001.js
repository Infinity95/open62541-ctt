/*  Test prepared by Kevin Herron: kevin@inductiveautomation.ocm
    Description: Create a MonitoredItem and specify an attribute (NOT the .Value attribute)
        to monitor for change, and specify a filter criteria of type PercentDeadband.
    Expected results: ServiceLevel: �Good�. OperationLevel: Bad_FilterNotAllowed. */
 
function createMonitoredItemErr612001() {
    const QUEUESIZE = 4;
    const DEADBANDVALUE = 10;
    const DISCARDOLDEST = false;

    // Create a MonitoredItem and specify an attribute that is NOT the Value attribute
    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings;
    var item = MonitoredItem.fromSettings( settings, 0, Attribute.DisplayName, "", MonitoringMode.Reporting, DISCARDOLDEST, null, QUEUESIZE )[0];
    if( item === undefined ) {
        addSkipped( "Static Analog" );
        return( false );
    }

    // Set the filter to PercentDeadband
    item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, DEADBANDVALUE, DataChangeTrigger.StatusValue );

    // create the monitored items, which we expect to fail
    var expectedResult = [ new ExpectedAndAcceptedResults( StatusCode.BadFilterNotAllowed ) ];
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription, OperationResults: expectedResult  } );

    // delete the monitored items, which should fail.
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItemErr612001 } );