/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script sets monitoring mode of at least one monitoreditemId belonging to a different subscription. */

function setMonitoringMode593Err008() {
    // We already have one subscription created in the initialize routine. Lets's create the second one here
    var secondSubscription = new Subscription();
    CreateSubscriptionHelper.Execute( { Subscription: secondSubscription } );
    // Just for clarity
    var firstSubscription = MonitorBasicSubscription;
    var firstItem = scalarItems[0].clone();
    if( !firstSubscription.SubscriptionCreated || !secondSubscription.SubscriptionCreated ) {
        addError( "One or both subscriptions for conformance unit Monitor Basic was not created." );
        return( false );
    }
    // Add monitored items using default parameters to the first subscription
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: firstItem, SubscriptionId: firstSubscription } ) ) {
        // Add monitored items using default parameters to the second subscription
        var secondItem = scalarItems[1].clone();
        var thirdItem = scalarItems[2].clone();
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: [ secondItem, thirdItem ], SubscriptionId: secondSubscription } ) ) {
            // Set the monitoringmode to disabled
            SetMonitoringModeHelper.Execute( { SubscriptionId: firstSubscription, MonitoredItemIds: thirdItem, MonitoringMode: MonitoringMode.Disabled, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ) } );
        }
        // Delete the items we added to the first subscription
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: firstItem, SubscriptionId: firstSubscription } );
        // Delete the items we added to the second subscription
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [ secondItem, thirdItem ], SubscriptionId: secondSubscription } );
    }
    // Delete the second subscription (first subscription will be deleted in the common cleanup code)
    return( DeleteSubscriptionsHelper.Execute( { SubscriptionIds: secondSubscription } ) );
}

Test.Execute( { Procedure: setMonitoringMode593Err008 } );