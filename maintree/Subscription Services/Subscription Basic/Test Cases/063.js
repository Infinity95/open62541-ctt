/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a subscription and make subscription calls (non-Publish). Each call
                 should extend the subscription lifetime counter.
                 Do: ModifyMonitoredItems, ModifySubscription, SetPublishingMode, Republish, SetMonitoringMode, SetTriggering*, DeleteMonitoredItems */

function test063() {
    // get our items from the settings
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings.concat( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings ) );
    if( !isDefined( items ) ) {
        addSkipped( "No items defined. Skipping test." );
        return( false );
    }

    // create the new subscription
    var doNextTest = true;
    var sub = new Subscription2( { RequestedLifetimeCount: 10 } );
    if( CreateSubscriptionHelper.Execute( { Subscription: sub, SuppressMessaging: true } ) ) {
        // test 1: wait and then call CreateMonitoredItems()
        var timeout = parseInt( sub.Expiration() * 0.8 ); // create our timeout to be 80% of lifetimeCount * publishInterval
        print( "Waiting " + timeout + " msecs prior to calling CreateMonitoredItems()" );
        wait( timeout );
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, SubscriptionId: sub, SuppressMessaging: true } ) ) doNextTest = false;

        // test 2: wait and call ModifyMonitoredItems()
        if( doNextTest ) {
            print( "Waiting " + timeout + " msecs prior to calling ModifyMonitoredItems()" );
            wait( timeout );
            if( !ModifyMonitoredItemsHelper.Execute( { ItemsToModify: items[0], TimestampsToReturn: TimestampsToReturn.Neither, SubscriptionId: sub, SuppressMessaging: true } ) ) doNextTest = false;
        }

        // test 3: wait and call ModifySubscription() { adjust publishing interval }
        if( doNextTest ) {
            print( "Waiting " + timeout + " msecs prior to calling ModifySubscription()" );
            wait( timeout );
            if( !ModifySubscriptionHelper.Execute( { SubscriptionId: sub, RequestedPublishingInterval: 2 * sub.RevisedPublishingInterval, SuppressMessaging: true } ) ) doNextTest = false;
        }

        // test 4: wait and call SetPublishingMode() -- call it twice, to disable and then re-enable publishing
        if( doNextTest ) {
            print( "Waiting " + timeout + " msecs prior to calling SetPublishingMode() (twice)" );
            wait( timeout );
            if( !SetPublishingModeHelper.Execute( { SubscriptionIds: sub, PublishingEnabled: false, SuppressMessaging: true } ) ) doNextTest = false;
            if( !SetPublishingModeHelper.Execute( { SubscriptionIds: sub, PublishingEnabled: true, SuppressMessaging: true } ) ) doNextTest = false;
        }

        // test 5: wait and call Republish() -- allow this to fail because we'll request an invalid sequence
        if( doNextTest ) {
            print( "Waiting " + timeout + " msecs prior to calling Republish()" );
            wait( timeout );
            if( !RepublishHelper.Execute( { SubscriptionId: sub, RetransmitSequenceNumber: 0, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.BadSequenceNumberUnknown, StatusCode.BadMessageNotAvailable ] ), SuppressMessaging: true } ) ) doNextTest = false;
        }

        // test 6: wait and call SetMonitoringMode() -- toggle to sampling, and then reporting
        if( doNextTest ) {
            print( "Waiting " + timeout + " msecs prior to calling SetMonitoringMode() (twice)" );
            wait( timeout );
            if( !SetMonitoringModeHelper.Execute( { SubscriptionId: sub, MonitoredItemIds: items[0], MonitoringMode: MonitoringMode.Sampling, SuppressMessaging: true } ) ) doNextTest = false;
            if( !SetMonitoringModeHelper.Execute( { SubscriptionId: sub, MonitoredItemIds: items[0], MonitoringMode: MonitoringMode.Reporting, SuppressMessaging: true } ) ) doNextTest = false;
        }

        // test 7: wait and call SetTriggering() - may not be supported!
        if( doNextTest ) {
            print( "Waiting " + timeout + " msecs prior to calling SetTriggering() -- may not be supported" );
            wait( timeout );
            if( !SetTriggeringHelper.Execute( { SubscriptionId: sub, TriggeringItemId: items[0], LinksToAdd: items[1], ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadServiceUnsupported ] ), SuppressMessaging: true } ) ) doNextTest = false;
        }

        // test 8: wait and call DeleteMonitoredItems()
        print( "Waiting " + timeout + " msecs prior to calling DeleteMonitoredItems()" );
        wait( timeout );
        if( DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[0], SubscriptionId: sub, SuppressMessaging: true } ) ) {
            if( doNextTest ) {
                // test 9: call Publish(), we expect the subscription to be alive and to contain the initial data set.
                print( "Waiting " + timeout + " msecs prior to calling Publish()" );
                wait( timeout );
                PublishHelper.Execute( { FirstPublish: true, SuppressMessaging: true } );
                Assert.True( PublishHelper.CurrentlyContainsData(), "Publish.Response expected the initial data-change notification because the Subscription's expiration should have incremented on each subscription service-call." );
            }
        }
        // clean-up
        var remainingItems = [];
        for( var i=1; i<items.length; i++ ) remainingItems.push( items[i] );
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: remainingItems, SubscriptionId: sub, SuppressMessaging: true } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: sub, SuppressMessaging: true } );
    }// CreateSubscription
    return( true );
}

Test.Execute( { Procedure: test063 } );