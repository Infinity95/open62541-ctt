/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Script modifies a monitoredItem to use an unsupported filter, e.g. PercentDeadband. */

function modifyMonitoredItems592011() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for Monitor Basic was not created" );
        return( false );
    }
    var analogInUse = true;
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings );
    if( !isDefined( items ) || items.length === 0 ) {
        items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
        if( !isDefined( items ) || items.length === 0 ) {
            addSkipped( "No items to test. Please configure settings: \Server Test\NodeIds\Static\All Profiles\Scalar" );
            return( false );
        }
        analogInUse = false;
    }
    // add items to existing subscription
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) return( false );
    // call Publish()() make sure we receive the initial data change
    PublishHelper.WaitInterval( { Items: items, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() initial data-change expected.", "Publish() received initial data change notifications, as expected." );
    // specify a filter that might not be supported
    var expectedResults = []
    for( var i=0; i<items.length; i++ ) {
        items[i].Filter = Event.GetDataChangeFilter( DeadbandType.Percent, 10, DataChangeTrigger.StatusValue );
        var er = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadMonitoredItemFilterUnsupported ] );
        if( !analogInUse ) er.addExpectedResult( StatusCode.BadFilterNotAllowed );
        expectedResults.push( er );
    }
    ModifyMonitoredItemsHelper.Execute( { ItemsToModify: items, SubscriptionId: MonitorBasicSubscription, OperationResults: expectedResults } );
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItems592011 } );