/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create two subscriptions. The first subscription is empty, the other contains valid monitoredItems. Delete from
        the first subscription but specify the monitoredItemId of an item from the second subscription.
        Expected results: Service result = Good. Operation = �Bad_MonitoredItemIdInvalid�. */

function deleteMonitoredItems595Err007() {
    var __recreateCuSubscription = false;
    // we likely have a subscription already in use from the CU, if so then delete it. We can re-create 
    // it at the end of the test...
    if( MonitorBasicSubscription.SubscriptionCreated ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: MonitorBasicSubscription } );
        __recreateCuSubscription = true;
    }

    //~~~~~~~~~~~~~~~~~~~ STEP 1 - CREATE 2 SUBSCRIPTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // now to define the monitoredItems, for subscription2
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 3 } );
    if( items == null || items.length != 3 ) {
        addError( "Need multiple items to perform this test. Please check the settings for these: " + settingNames.toString() );
        return( false );
    }

    var subscription1 = new Subscription();
    var subscription2 = new Subscription();

    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription1 } ) ) {
        addError( "Unable to create subscription1" );
        return( false );
    }
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription2 } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription1 } );
        addError( "Unable to create subscription2" );
        return( false );
    }

    // create the monitoredItems in subscription2
    if( ! CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription2 } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription1 } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription2 } );
        return( false );
    }



    //~~~~~~~~~~~~~~~~~~~ STEP 2 - DELETE MONITOREDITEMS ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // we are going to delete from Subscription #1 the first 2 items.
    // we are also going to specify the 3rd item from Subscription #2.
    // REMEMBER: this call should fail!
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ),
                            new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ),
                            new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ) ];
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: subscription1, OperationResults: expectedResults } );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: subscription2 } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription1 } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription2 } );

    // restore the CU wide subscription?
    if( __recreateCuSubscription ) CreateSubscriptionHelper.Execute( { Subscription: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: deleteMonitoredItems595Err007 } );