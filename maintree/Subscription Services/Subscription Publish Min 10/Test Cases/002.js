/*  Test 2, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Create 10 subscriptions per session.
        Verify all 10 subscriptions are returning data.
        Disable 5 subscriptions.
        Verify the subscriptions are still returning data, except for the 2 disabled. */

function setPublishingMode593016() {
    var subscriptions = [], items = [];
    for( var i=0; i<10; i++ ) subscriptions.push( new Subscription() );

    for( var i=0; i<subscriptions.length; i++ ) {
        if( CreateSubscriptionHelper.Execute( { Subscription: subscriptions[i] } ) ) {
            // add some monitored items our subscriptions
            items[i] = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
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

    // set publishing mode, Disable all ODD subscriptions
    var disabledSubscriptions = [];
    for( s=0; s<subscriptions.length; s++ ) if( s % 2 == 1 ) disabledSubscriptions.push( subscriptions[s] );
    if( SetPublishingModeHelper.Execute( { SubscriptionIds: disabledSubscriptions, PublishingEnabled: false } ) ) {
        // read the initial value, and then write to the monitoredItem
        ReadHelper.Execute( { NodesToRead: items[0] } );
        for( i=0; i<items[0].length; i++ ) UaVariant.Increment( { Value: items[0][i].Value } );
        WriteHelper.Execute( { NodesToWrite: items[0] } );

        // we'll call Publish() a number of times to see if we do NOT get data changes
        // for any of our subscriptions.
        addLog( "\nPublish to be called now a maximum of " + subscriptions.length + " times....NO DATACHANGES EXPECTED!" );
        for( s=0; s<subscriptions.length; s++ ) PublishHelper.Execute( { NoAcks: true } );
    }//SetPublishingModeHelper

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );

    // delete all subscriptions added above
    for( i=0; i<subscriptions.length; i++ ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[i], SubscriptionId: subscriptions[i]  } )
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[i] } );
    }
    // clear the publish object's properties...
    PublishHelper.Clear();
    return( true );
}// function setPublishingMode593016()

Test.Execute( { Procedure: setPublishingMode593016 } );