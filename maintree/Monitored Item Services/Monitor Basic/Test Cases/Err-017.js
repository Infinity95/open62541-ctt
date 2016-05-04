/* Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
       Modify single monitoredItem; Specify an invalid subscriptionId.
       ServiceResult = Bad_SubscriptionIdInvalid */

function modifyMonitoredItems592Err001() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
        return( false );
    }
    // add 3 monitored items using default parameters
    var testItems = [ scalarItems[0].clone(), scalarItems[1].clone(), scalarItems[2].clone() ];
    for( var i=0; i<testItems.length; i++ ) {
        testItems[i].AttributeId = Attribute.Value;
        testItems[i].SamplingInterval = -1;
        testItems[i].QueueSize = 1;
        testItems[i].DiscardOldest = true;
    }

    if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorBasicSubscription, ItemsToCreate: testItems } ) ) {
        // Modify single monitoredItem
        testItems[0].DiscardOldest = true;
        // temporarily manipulate the subscriptionId to force the error
        MonitorBasicSubscription.SubscriptionId += 0x1234;
        ModifyMonitoredItemsHelper.Execute( { SubscriptionId: MonitorBasicSubscription, ItemsToModify: testItems[0], ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) } );
        MonitorBasicSubscription.SubscriptionId -= 0x1234;
        DeleteMonitoredItemsHelper.Execute( { SubscriptionId: MonitorBasicSubscription, ItemsToDelete: testItems } );
    }
    return( true );
}

Test.Execute( { Procedure: modifyMonitoredItems592Err001 } );