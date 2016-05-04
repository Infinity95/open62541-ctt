/*  Test 5.10.4 Test 9, prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        call Publish() and acknowledge multiple valid sequence numbers while 
        verifying that each subscription is returning the correct number 
        of dataChange callbacks.
        ServiceResult = Good; results[i] = Good.
        Verify sequence numbers acknowledged are not returned in availableSequenceNumbers. */

function publish5104009() { 
    const SCANRATETESTS = [ 1000, 2000, 4000 ];  // the scanrates to test
    const TIMEINMSECS   = 10000;                 // how much time to devote to receiving dataChange callbacks
    const WARNING_FLUCTUATION = 1;               // the +/- of callbacks we're willing to accept outside of expectations

    // step 1 - create some items to subscribe to (monitor).
    // define the monitored items and then make the call to monitor them!
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, 0, Attribute.Value, "", MonitoringMode.Reporting, true, undefined, 1);

    if( items == null || items.length === 0 ) {
        addSkipped( "Static Scalar - 2 items needed" );
        return( false );
    }
	while( items.length > 2 ) items.splice( 0, 1 );

    ReadHelper.Execute( { NodesToRead: items } );

    // go into a loop, one for each scanrate to test
    for( var st=0; st<SCANRATETESTS.length; st++ ) {
        var expectedCallbackCount = Math.round( ( TIMEINMSECS / SCANRATETESTS[st] ) - 0.5 );
        addLog( "\n\n\nSCANRATE TEST: " + SCANRATETESTS[st] + " msecs. We expect " + expectedCallbackCount + " dataChange callbacks to have been received after " + ( TIMEINMSECS / 1000 ) + " seconds have elapsed." );

        // step 2 - create the subscription.
        basicSubscription = new Subscription( SCANRATETESTS[st] );
        basicSubscription.MaxKeepAliveCount=2;
        CreateSubscriptionHelper.Execute( { Subscription: basicSubscription } );

        // register the subscription with Publish.
        PublishHelper.RegisterSubscription( basicSubscription );

        // 4 params are: (1) items to monitor (2) timestamps (3) subscription (4) sesssion
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: basicSubscription } ) ) {
            // wait for the server to start polling the item(s)
            PublishHelper.WaitInterval( { Items: items, Subscription: basicSubscription } );

            var callbackCount = 0;

            // when in the future the loop should exit
            var startTime = UaDateTime.utcNow();
            var stopAt = UaDateTime.utcNow();
            stopAt.addSeconds( ( TIMEINMSECS / 1000 ) );

            var expectedResults = [];
            // publish calls, get some sequenceNumber's buffered for later acknowledgement.
            while( UaDateTime.utcNow() < stopAt ) {
                // write values to the items
                for( i=0; i<items.length; i++ ) items[i].SafelySetValueTypeKnown( 1 + UaVariantToSimpleType(items[i].Value.Value), items[i].Value.Value.DataType );

                // when determining how much time to wait before calling Publish, take into consideration the time needed for the Write() operation
                var beforeWrite = new Date();
                WriteHelper.Execute( { NodesToWrite: items } );
                var afterWrite = new Date();
                var delta = afterWrite - beforeWrite;

                var waitTime = 0;
                if( delta < basicSubscription.RevisedPublishingInterval ) waitTime = basicSubscription.RevisedPublishingInterval - delta;
                wait( waitTime );

                // call Publish(), but do not acknowledge anything
                PublishHelper.Execute( { NoAcks: true } );
                if( PublishHelper.CurrentlyContainsData() ) {
                    callbackCount++;
                    expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.Good ) );
                    PublishHelper.SetItemValuesFromDataChange( items );
                }
            }//for (calls to Publish)
            // reverse the expected results since any purged messages will be left first
            expectedResults.reverse();

            var stoppedAt = UaDateTime.utcNow();
            // lets see how many callbacks we received vs what was expected
            print( "\t** ExpectedCallbackCount: " + expectedCallbackCount + " vs received: " + callbackCount + "**" );
            if( expectedCallbackCount !== callbackCount ) {
                addLog( "\t** Started: " + startTime + "; Ended: " + stoppedAt + "; Received: " + callbackCount + " dataChanges. **" );
                // Warnings are +/- 1 callback
                // Errors are where the difference is greater than 1
                var minRange = expectedCallbackCount - WARNING_FLUCTUATION;
                var maxRange = expectedCallbackCount + 1 + WARNING_FLUCTUATION;
                if( callbackCount >= minRange && callbackCount <= maxRange ) addLog( "Callback count was within the acceptable range of +/- 1 callback. Received: " + callbackCount + ", but desired: " + expectedCallbackCount );
                else addError( "Callback count was OUTSIDE the acceptable range of +/- 1 callback. Received: " + callbackCount + ", but desired: " + expectedCallbackCount );
            }

            // now to acknowledge everything in one call
            print( "\tACKNOWLEDGE ALL sequenceNumbers received." );
            if( expectedResults.length > 0 && PublishHelper.AvailableSequenceNumbers !== null ) {
                // quickly check if we need to trim the expectedResults in case the server
                // has purged some of the notifications
                while( expectedResults.length > PublishHelper.AvailableSequenceNumbers.length ) {
                    print( "\t... trimming an expected result (Server purged some notifications)" );
                    expectedResults.shift();
                }
                print( "\t... there are " + expectedResults.length + " expected results now!" );
                // the OLDEST notification (sequenceNumber) may have been purged from the Server's queue
                // while we were processing... so let's allow for that in our expectations
                expectedResults[0].addExpectedResult( StatusCode.BadSequenceNumberUnknown );
                PublishHelper.Execute( false, expectedResults, true );
            }
            else PublishHelper.Execute();
        }//if createMonitoredItems
        else {
            // delete the subscription we added here 
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
            // clear all stats in the publishHelper.
            PublishHelper.Clear();
            break;
        }

        // delete the items we added in this test
        var monitoredItemsIdsToDelete = new UaUInt32s();
        var j=0;
        for( var i=0; i<items.length; i++ ) {
            if(items[i].IsCreated) monitoredItemsIdsToDelete[j++] = items[i].MonitoredItemId
        }// for i...
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItemsIdsToDelete, SubscriptionId: basicSubscription } );
        PublishHelper.UnregisterSubscription( basicSubscription );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: basicSubscription } );
    }// for st...
    return( true );
}

Test.Execute( { Procedure: publish5104009 } );