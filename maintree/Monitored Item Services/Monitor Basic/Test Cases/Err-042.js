/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems, deadband requested when not supported. */

function CreateMonitoredItemsErr005() { 
    // create our invalid NodeId 
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    item.Filter = Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue );

    CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: item,
            SubscriptionId: MonitorBasicSubscription,
            OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadMonitoredItemFilterUnsupported ] )
            } );
    if( CreateMonitoredItemsHelper.Response.Results[0].StatusCode.isGood() ) DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}//func

Test.Execute( { Procedure: CreateMonitoredItemsErr005 } );