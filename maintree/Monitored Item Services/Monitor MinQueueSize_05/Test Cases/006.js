/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create multiple monitored items where item[0].QueueSize=1; [1].QueueSize=2; both.DiscardOldest=true. 
    Write 5 values to each node, pausing RevisedSamplingInterval each time. 
    Modify both items so item [0].QueueSize=2; [1].QueueSize=1. Call Publish. */

function QueueSize( args ) {
const OVERFLOWBIT = 0x480;
    if( !isDefined( args ) || !isDefined( args.QueueSize ) ) throw( "QueueSize.args.QueueSize not set!" );
    var result = true;

    addLog( "Testing QueueSize: " + args.QueueSize );

    // make sure we have enough items first, and then get their initial values.
    var items = MonitoredItem.fromSettings(  Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( items.length < 2 ) { addSkipped( "Not enough items available for testing. Please configure more." ); return( false ); }
    if( !ReadHelper.Execute( { NodesToRead: items } ) ) { addSkipped( "Unable to obtain initial values." );  return( false ); }

    // record the initial values, so that we can revert back to them later
    for( var i=0; i<items.length; i++ ) items[i].InitialValue = items[i].Value.Value.clone();

    // create a subscription
    var sub = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: sub } ) ) {

        // configure our test items per the test-case
        for( var i=0; i<items.length; i++ ) {
            items[i].QueueSize = args.QueueSize;
            items[i].DiscardOldest = true;
        }
        items[0].QueueSize = 1;
        
        // create a subscription, and then add our items to it (per test case definition)
        if( CreateMonitoredItemsHelper.Execute( { SubscriptionId: sub, ItemsToCreate: items } ) ) {

            // step 1: write to all items, 6 times, once per RevisedSamplingInterval
            for( var t=0; t<6; t++ ) {
                for( var i=0; i<items.length; i++ ) UaVariant.Increment( { Value: items[i].Value } );
                WriteHelper.Execute( { NodesToWrite: items } );
                PublishHelper.WaitInterval( { Items: items[0], Subscription:sub } );
            }//for t...

            // remember the last value written for all items 
            for( var i=0; i<items.length; i++ ) items[i].LastValue = items[i].Value.Value.clone();

            // step 2: modify the items, switch their queue size (NOTE: no Publish calls yet)
            items[0].QueueSize = args.QueueSize;
            for( var i=1; i<items.length; i++ ) items[i].QueueSize = 1;
            if( ModifyMonitoredItemsHelper.Execute( { SubscriptionId: sub, ItemsToModify: items } ) ) {

                // call Publish, we expect the first item to have lost all except the last value 
                // and all other items have the last value only (size=1 for all)
                PublishHelper.WaitInterval( { Items: items, Subscription: sub } );
                if( PublishHelper.Execute() ) {

                    if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish expected to contain data-change notifications" ) ) {
                        Assert.Equal( items.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected notifications for all subscribed items." );
                        // make sure all items have reported in 
                        for( var i=0; i<items.length; i++ ) Assert.True( PublishHelper.HandleIsInCurrentDataChanges( items[i].ClientHandle ), "Item not found in Publish response: " + items[i].NodeSetting );

                        // update our items with the latest value, quality, and timestamp
                        PublishHelper.SetItemValuesFromDataChange( items, "vqstdt" );

                        // check each received value matches the LAST value written 
                        for( var i=0; i<items.length; i++ ) Assert.Equal( items[i].LastValue, items[i].Value.Value, "Value mismatch. Item: " + items[i].NodeId + " (setting: " + items[i].NodeSetting + ")." );

                        // check overflow bit for all-but-the-first item
                        for( var i=1; i<items.length; i++ ) Assert.NotEqual( StatusCode.Good + OVERFLOWBIT, items[i].Value.StatusCode.StatusCode, "StatusCode.Overflow bit is set here! StatusCode.Overflow bit should not be set when queuesize is 1." );
                    }//if contains data

                }//if Publish 

            }//if modifyMonitoredItems

            // clean-up
            DeleteMonitoredItemsHelper.Execute( { SubscriptionId: sub, ItemsToDelete: items } );
        }// if CreateMonitoredItems

        // clean-up
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: sub } );
    }// create subscription
    sub = null;
    return( result );
}

function queueSize5() { return( QueueSize( { QueueSize: 5 } ) ); }

Test.Execute( { Procedure: queueSize5 } );