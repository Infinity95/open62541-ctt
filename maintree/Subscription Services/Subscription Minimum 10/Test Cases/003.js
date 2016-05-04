/*  Test 1 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Enables 10 subscriptions that were previously marked as Disabled. */

Test.Execute( { Procedure: function test() {
    var subscriptions = [];
    var maxRevisedPublishingInterval = 0, items = [];

    for( var i=0; i<10; i++ ) {
        subscriptions.push( new Subscription( null, false ) ); 
        if( CreateSubscriptionHelper.Execute( { Subscription: subscriptions[i] } ) ) {
            if( subscriptions[i].RevisedPublishingInterval > maxRevisedPublishingInterval ) maxRevisedPublishingInterval = subscriptions[i].RevisedPublishingInterval;
            // add some monitored items our subscriptions
            items[i] = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
            ReadHelper.Execute( { NodesToRead: items[i] } );
            if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items[i], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptions[i] } ) ) return( false );
        }
    }

    // now to call Publish() on all of these subscriptions to make sure that we are NOT receiving any data change notifications...
    addLog( "call Publish() to make sure that we are NOT receiving data for enabled subscriptions." );
    for( i=0; i<subscriptions.length; i++ ) PublishHelper.Execute( { NoAcks: true } ); //do not acknowledge any subscriptions

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );
    // clear the publish object's properties...
    PublishHelper.Clear();

    // set publishing mode, ENABLE ALL subscriptions
    if( SetPublishingModeHelper.Execute( { SubscriptionIds: subscriptions, PublishingEnabled: true } ) ) {
        // wait to ensure we get data
        wait( maxRevisedPublishingInterval );

        // we'll call Publish() a number of times to see if we do NOT get data changes
        // for any of our subscriptions.
        addLog( "\nPublish to be called now a maximum of " + subscriptions.length + " times....NO DATACHANGES EXPECTED!" );
        for( var s=0; s<subscriptions.length; s++ ) PublishHelper.Execute( { NoAcks: true } );
    }//SetPublishingModeHelper

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );

    // delete all subscriptions added above
    for( i=0; i<subscriptions.length; i++ ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: subscriptions[i] } )
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[i] } );
    }
    // clear the publish object's properties...
    PublishHelper.Clear();
    return( true );
} } );