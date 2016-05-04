/*  Test prepared by compliance@opcfoundation.org; original work by: Anand Taparia; ataparia@kepware.com
      Description: Script does multiple linksToAdd[] and linksToRemove[]. 
          Steps:
          - Create 5 monitored items.
          - SetTrigger: 1 triggereditem + 2 linksToAdd[]
          - Actual test: SetTrigger: Remove the 2 links added above and add 2 new linksToAdd[] */

function setTriggering594005() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings.concat( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings ) );
    if( !MonitorTriggeringSubscription.SubscriptionCreated ) addError( "Subscription for conformance unit Monitor Triggering was not created." );
    else {
        items[0].MonitoringMode = MonitoringMode.Reporting; // trigger is reporting
        for( var i=1; i<items.length; i++ ) items[i].MonitoringMode = MonitoringMode.Sampling;
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorTriggeringSubscription } ) ) {
            addLog ( "Setting up trigger (SetTrigger: 2 linksToAdd[])." );
            var addLinkedItems = [ items[1], items[2] ];
            if( SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToAdd: addLinkedItems } ) ) {
                // We have setup everything. Now the actual test. Remove the links added above and also add new links at the same time
                SetTriggeringHelper.Execute( { SubscriptionId: MonitorTriggeringSubscription, TriggeringItemId: items[0], LinksToAdd: [ items[3], items[4] ], LinksToRemove: [ items[1], items[2] ] } );
            }
        }
        // delete the items we added in this test
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorTriggeringSubscription } );
    }
    return( true );
}

Test.Execute( { Procedure: setTriggering594005 } );