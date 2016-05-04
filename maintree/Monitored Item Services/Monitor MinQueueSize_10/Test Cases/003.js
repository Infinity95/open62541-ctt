/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems: QueueSize=5; DiscardOldest=true. Write 7 items. Only last 2 received. */
        
function CreateMonitoredItems003() { 
    const MAXQUEUESIZE = 10;
    // define the item with the required parameters 
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( !isDefined( item ) ) {
        addError( "Aborting test. No numeric scalar types defined in the CTT settings." );
        return( false );
    }

    item.QueueSize = MAXQUEUESIZE;
    item.DiscardOldest = false;

    ReadHelper.Execute( { NodesToRead: item } );

    // read the item, so that we can get its current value 
    // create a sinscription
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );

    // add to a subscription
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: subscription } );

    // check the revised queuesize is the same!
    Assert.Equal( item.RevisedQueueSize, item.QueueSize, "CreateMonitoredItems().Response.Results[0].RevisedQueueSize was modified from its supported maximum of " + MAXQUEUESIZE + "." );

    // call Publish and check that we receive an initial data-change 
    PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response did not return the initial data-change.", "Publish().Response returned the initial data-change notification, as expected." );

    // now to write multiple items that will cause a buffer overflow.
    // we must do these one at a time so that the samplingInterval can detect the change.
    var valuesWritten = [];
    for( var i=0; i<MAXQUEUESIZE+2; i++ ) { 
        UaVariant.Increment( { Value: item.Value } );
        valuesWritten.push( item.Value.Value.clone() );
        WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } );
        wait( item.RevisedSamplingInterval * 2 );
    }//for i

    // call Publish to get the next notification message.
    PublishHelper.WaitInterval( { Items: item, Subscription: subscription } );
    PublishHelper.Execute();
    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response did not return a data-change notification of our prior set of Write operations." ) ) {

        // we should have received the first 4 writes, and then the last
        var expected, actual;
        for( var i=0; i<MAXQUEUESIZE-1; i++ ) { 
            expected = valuesWritten[i];
            actual = PublishHelper.CurrentDataChanges[0].MonitoredItems[i].Value.Value;
            Assert.Equal( expected, actual, "Publish().Response.Notifications[0].MonitoredItems[" + i + "].Value does not match the value expected.", "Publish().Response.Notifications[0].MonitoredItems[" + i + "].Value (" + actual + ") " + "matches the value expected (" + expected + ")." );
        }//for i
        expected = valuesWritten[ valuesWritten.length -1 ];
        actual = PublishHelper.CurrentDataChanges[0].MonitoredItems[ PublishHelper.CurrentDataChanges[0].MonitoredItems.length - 1 ].Value.Value;
        Assert.Equal( expected, actual, "Publish().Response.Notifications[0].MonitoredItems[last].Value does not match the value expected. The overflow does not appear to be used correctly. The values previously written were: " + valuesWritten.toString(), "Publish().Response.Notifications[0].MonitoredItems[" + i + "].Value (" + actual + ") " + "matches the value expected (" + expected + ")." );

    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}// func

Test.Execute( { Procedure: CreateMonitoredItems003 } );