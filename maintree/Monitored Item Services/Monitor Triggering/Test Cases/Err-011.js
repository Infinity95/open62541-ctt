/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
     Description: Script specifies items from different subscriptions for triggeringItemId and linksToRemove[].
          The subscriptionID used for triggering is of the subscription that the triggeringItemId belongs to. */

function setTriggering594Err011() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    // We already have one subscription created in the initialize routine. Lets's
    // create the second one here
    SecondSubscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: SecondSubscription } ) ) return( false );
    // Just for clarity
    var FirstSubscription = MonitorTriggeringSubscription;
    if( !FirstSubscription.SubscriptionCreated || !SecondSubscription.SubscriptionCreated ) {
        addError( "One or both subscriptions for conformance unit Monitor Triggering was not created.", uaStatus );
        return( false );
    }
    // add 1 item (will be used as triggeringItemId) to the first subscription
    if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: FirstSubscription, ItemsToCreate: items[0] } ) ) {
        // Now add 1 item (will be used as linksToAdd[]) to the second subscription
        if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: SecondSubscription, ItemsToCreate: [ items[1], items[2] ] } ) ) {
            // create the trigger and mix the items in both subscriptions (not allowed)
            SetTriggeringHelper.Execute( { SubscriptionId: FirstSubscription, TriggeringItemId: items[0], LinksToAdd: items[2], AddResults: new ExpectedAndAcceptedResults( StatusCode.BadMonitoredItemIdInvalid ) } );
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: [ items[1], items[2] ], SubscriptionId: SecondSubscription } );
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items[0], SubscriptionId: FirstSubscription } );
    }
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: SecondSubscription } );
    return( true );
}

Test.Execute( { Procedure: setTriggering594Err011 } );