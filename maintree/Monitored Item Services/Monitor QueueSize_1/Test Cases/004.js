/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: For all scalar items, monitor all attributes except Value; call Publish() for initial values. */
include( "./library/Base/NodeTypeAttributesMatrix.js" );

function createMonitoredItem591070() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 0, Attribute.ArrayDimensions, "", MonitoringMode.Reporting, undefined, undefined, 1);
    if( !isDefined( items ) || items.length === 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }
    // now to multiple all items by all attributes to create a massive list:
    var desiredAttributes = new NodeTypeAttributesMatrix().Variable;
    var allItems = [], expectedResults = [];
    var skipItems = false;
    for( var i=0; i<items.length; i++ ) {
        if( skipItems ) break;
        for( var a=0; a<desiredAttributes.length; a++ ) {
            // check that we do not exceed the max supported monitored items
            if( gServerCapabilities.MaxSupportedMonitoredItems > 0 ) {
                if( allItems.length >= gServerCapabilities.MaxSupportedMonitoredItems ) {
                    addLog( "Skipping remaining monitoredItem creation so we do not exceed the max support monitoredItems, currently configured as: " + gServerCapabilities.MaxSupportedMonitoredItems );
                    skipItems = true;
                    break;
                }
            }
            var item = MonitoredItem.Clone( items[i] );
            // skip the value attribute when creating the monitored item    
            item.AttributeId = desiredAttributes[a];
            if( item.AttributeId === 13 ) {
                print( "Excluding the value attribute to be included in the CreateMonitored Items to match the test case description" );
                a++;
            }
            else allItems.push( item );
        }//for i
    }//for a


    // add items to existing subscription
    if( !CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: allItems,
            TimestampsToReturn: TimestampsToReturn.Server, 
            SubscriptionId: MonitorQueueSize1Subscription } ) ) return( false );
    
    PublishHelper.WaitInterval( { items: allItems, Subscription: MonitorQueueSize1Subscription } );

    // call Publish()() make sure we receive the initial data change
    PublishHelper.Execute( { FirstPublish: true } );
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() initial data-change expected.", "Publish() received initial data change notifications, as expected." ) ) {
        Assert.Equal( allItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Publish() did not return the # of items as expected.", "Publish() received the expected # of notifications, one per item/attribute." );
    }


    // clean-up
    DeleteMonitoredItemsHelper.Execute( { 
            ItemsToDelete: allItems, 
            SubscriptionId: MonitorQueueSize1Subscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItem591070 } );