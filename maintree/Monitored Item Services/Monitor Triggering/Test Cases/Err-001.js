/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
    Description: Specify an invalid subscription. */

function setTriggering594Err001() {
    var items = [ scalarItems[0].clone(), scalarItems[1].clone(), scalarItems[2].clone() ];
    // subscription is created and deleted in initialize and cleanup scripts
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) {
        addError( "Subscription for conformance unit Monitor Triggering was not created." );
        return( false );
    }
    items[0].MonitoringMode = MonitoringMode.Reporting;
    items[1].MonitoringMode = MonitoringMode.Sampling;
    items[2].MonitoringMode = MonitoringMode.Sampling;
    if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, ItemsToCreate: items } ) ) {
        // set triggering with an invalid subscriptionId by temporarily changing the subscription id
        MonitorTriggeringSubscription.SubscriptionId += 0x1234;
        SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToAdd: [ items[1], items[2] ], ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ) } );
        MonitorTriggeringSubscription.SubscriptionId -= 0x1234;
        // cleanup
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorTriggeringSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering594Err001 } );