/*  Test 5.10.3 Error test case 3 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Tries to disable publishing for a mix of valid and invalid subscriptionIds. */

Test.Execute( { Procedure: function test() {
    var items = [];
    var subscriptions = [ new Subscription(), new Subscription() ];
    var publishCount = subscriptions.length * 2;

    for( var i=0; i<subscriptions.length; i++ ) {
        items[i] = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
        ReadHelper.Execute( { NodesToRead: items[i] } );
        if( CreateSubscriptionHelper.Execute( { Subscription: subscriptions[i] } ) ) {
            // add some monitored items our subscriptions
            if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[i], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptions[i] } ) ) return( false );
        }
    }

    // now to call Publish() on all of these subscriptions to make sure that we are NOT receiving any data change notifications...
    addLog( "call Publish() to make sure that we are NOT receiving data for enabled subscriptions." );
    for( i=0; i<publishCount; i++ ) PublishHelper.Execute( { NoAcks: true } ); //do not acknowledge any subscriptions

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );
    // clear the publish object's properties...
    PublishHelper.Clear();

    // set publishing mode, DISABLE some valid and invlaid subscriptions
    var invalidSubscriptions = [ new Subscription(), subscriptions[0], new Subscription() ];
    var expectedResults = [];
    expectedResults[0] = new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid );
    expectedResults[1] = new ExpectedAndAcceptedResults( StatusCode.Good );
    expectedResults[2] = new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid );

    if( SetPublishingModeHelper.Execute( { SubscriptionIds: invalidSubscriptions, PublishingEnabled: false, OperationResults: expectedResults } ) ) {
        // write to the monitoredItem
        for( i=0; i<items[0].length; i++ ) UaVariant.Increment( { Value: items[0][i].Value.Value } );
        WriteHelper.Execute( { NodesToWrite: items[0], ReadVerification: false } );

        // we'll call Publish() a number of times to see if we do NOT get data changes
        // for any of our subscriptions.
        addLog( "\r\nPublish to be called now a maximum of " + publishCount + " times....NO DATACHANGES EXPECTED!" );
        for( var s=0; s<publishCount; s++ ) PublishHelper.Execute( { NoAcks: true } );
    }//SetPublishingModeHelper

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );

    // delete all subscriptions added above
    for( i=0; i<subscriptions.length; i++ ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: subscriptions[i] } )
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[i] } );
    }
    PublishHelper.Clear();
    return( true );
} } );