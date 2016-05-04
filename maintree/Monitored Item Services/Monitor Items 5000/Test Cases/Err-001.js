/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Request 5000 items in a subscription.
        This is a 2-part test:
            part 1: try to add 600 items into a single CreateMonitoredItems call. If that fails withBad_TooManyOperations then do part 2
            part 2: in a loop, call CreateMonitoredItems specifying the max # items per call until the total # of items exceeds the servers capabilities by 100.
*/

function createMonitoredItems5000() {
    // create too many items
    var tooManyItems = MonitoredItem.Clone( originalItems5000 );
    for( var i=0; i<1000; i++ ) tooManyItems.push( MonitoredItem.Clone( originalItems5000[i] ) );
    var expectedResults = new ExpectedAndAcceptedResults( StatusCode.Good, BAD_TOOMANYMONITOREDITEMS );

    if( !CreateMonitoredItemsHelper.Execute( {
            ItemsToCreate: tooManyItems, 
            TimestampsToReturn: TimestampsToReturn.Server,
            SubscriptionId: defaultSubscription,
            ServiceResult: expectedResults,
            SuppressMessaging: true
            } ) ) return( false );

    // did we get an error? if so, proceed to step 2
    if( CreateMonitoredItemsHelper.Response.ResponseHeader.ServiceResult.StatusCode === BAD_TOOMANYMONITOREDITEMS ) {
        CreateMonitoredItemsHelper.Execute( {
                ItemsToCreate: tooManyItems, 
                TimestampsToReturn: TimestampsToReturn.Server,
                SubscriptionId: defaultSubscription,
                MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
                SuppressMessaging: true
                } );
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: tooManyItems, 
            SubscriptionId: defaultSubscription,
            MaxItemsPerCall: gServerCapabilities.MaxMonitoredItemsPerCall,
            SuppressMessaging: true
            } );

    return( true );
}// function createMonitoredItems5000()

Test.Execute( { Procedure: createMonitoredItems5000 } );