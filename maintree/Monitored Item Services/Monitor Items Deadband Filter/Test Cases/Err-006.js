/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
     Description: Check if server responds correctly to deadbands that it doesnt support, e.g. Percent. */

Test.Execute( { Procedure: function test() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item ) ) { 
        addSkipped( "Unable to locate a Static Scalar type of: Int, UInt, Double. Aborting test." );
        return( false );
    }
    // create the monitored item
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: MonitorBasicSubscription } );
    // now modify the monitored item
    item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, 10, DataChangeTrigger.StatusValue );
    ModifyMonitoredItemsHelper.Execute( { ItemsToModify: item, SubscriptionId: MonitorBasicSubscription, OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadMonitoredItemFilterUnsupported ] ) } );
    // clean-up
    if( CreateMonitoredItemsHelper.Response.Results[0].StatusCode.isGood() ) { 
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    }
    return( true );
} } );