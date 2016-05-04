/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script modifies the ClientHandle for the first item to a number already in use by another MonitoredItem.
        How this test works:
            1. create 3 monitored items with ClientHandle's = 0, 1, 2.
            2. modify the 1st handle to be "1". So all 3 items shoudl have handles 1, 1, 2.
            3. we do not expect any errors since the ClientHandle is of no significance to the Server. */

function modifyMonitoredItems592Err005() {
    var items = MonitoredItem.GetRequiredNodes( { Settings: Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings, Number: 3 } );
    if( !isDefined( items ) || items.length !== 3 ) { addSkipped( "Not enough Scalar items to test with." ); return( false ); }
    if( !MonitorBasicSubscription.SubscriptionCreated ) { addError( "Subscription for Monitor Basic was not created" ); return( false ); }

    var result = true;

    // Add 3 monitored items using default parameters
    if( !CreateMonitoredItemsHelper.Execute( { SubscriptionId: MonitorBasicSubscription, ItemsToCreate: items } ) ) return( false );

    // show the original ClientHandles
    print( "Original Client Handles: ");
    for( var h=0; h<items.length; h++ ) print( "\tItem # " + h + " = " + CreateMonitoredItemsHelper.Request.ItemsToCreate[h].RequestedParameters.ClientHandle );

    print( "Created the " + items.length + " monitored items." );
    print( "Modifying the " + items.length + " monitored items. Setting the ClientHandle of the first item to the ClientHandle of another item." );

    // Modify the the monitoredItem
    // While the spec does not prohibit this behavior, it is actually a bad idea.
    items[1].OriginalClientHandle = items[1].ClientHandle;
    items[1].ClientHandle = items[0].ClientHandle;
    if( !ModifyMonitoredItemsHelper.Execute( { SubscriptionId: MonitorBasicSubscription, ItemsToModify: items[1] } ) ) result = false;

    // Cleanup
    items[1].ClientHandle = items[1].OriginalClientHandle;
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: MonitorBasicSubscription } );
    return( result );
}

Test.Execute( { Procedure: modifyMonitoredItems592Err005 } );