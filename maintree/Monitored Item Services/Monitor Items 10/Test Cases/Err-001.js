/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request more than 10 items in a subscription, e.g. 15. */

function tooManyItems10() {
const LIMIT = 10;
    var items2 = []
    var expectedResults = [];
    var maxCount = (LIMIT + (LIMIT/2) );
    var itemPos = -1;
    for( var i=0; i<maxCount; i++ ) {
        if( ( itemPos++ >= items.length - 1 ) || ( itemPos >= LIMIT ) ) itemPos = 0;
        items2.push( MonitoredItem.Clone( items[itemPos] ) );
        var er = new ExpectedAndAcceptedResults( StatusCode.Good );
        if( i >= LIMIT ) er.addExpectedResult( BAD_TOOMANYMONITOREDITEMS );
        expectedResults.push( er );
    }
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items2, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription, OperationResults: expectedResults } ) ) {
        for( var i=0; i<6; i++ ) {
            var er = new ExpectedAndAcceptedResults( StatusCode.Good );
            if( i >= LIMIT ) er.addExpectedResult( StatusCode.BadMonitoredItemIdInvalid );
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items2, SubscriptionId: defaultSubscription } );
    }
    return( true );
}// function tooManyItems10()

Test.Execute( { Procedure: tooManyItems10 } );