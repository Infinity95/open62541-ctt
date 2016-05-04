/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request more than 100 items in a subscription, e.g. 6. */

function tooManyItems10() {
    const LIMIT = 100;
    var items2 = []
    var expectedResults = [];
    for( var i=0; i<(LIMIT+ (LIMIT/2) ); i++ ) {
        items2.push( MonitoredItem.Clone( originalItems100[0], i ) );
        var er = new ExpectedAndAcceptedResults( StatusCode.Good );
        if( i >= LIMIT ) er.addExpectedResult( StatusCode.BadTooManyMonitoredItems );
        expectedResults.push( er );
    }
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items2, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription, OperationResults: expectedResults, SuppressMessaging: true } );

    for( var i=0; i<6; i++ ) {
        var er = new ExpectedAndAcceptedResults( StatusCode.Good );
        if( i >= LIMIT ) er.addExpectedResult( StatusCode.BadMonitoredItemIdInvalid );
    }
    return( DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items2, SubscriptionId: defaultSubscription, SuppressMessaging: true } ) );
}

Test.Execute( { Procedure: tooManyItems10 } );