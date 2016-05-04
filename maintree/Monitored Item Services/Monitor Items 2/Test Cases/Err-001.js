/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request more than 2 items in a subscription, e.g. 6. */

function tooManyItems2() {
    var items2 = []
    var expectedResults = [];
    for( var i=0; i<6; i++ ) {
        if ( !isDefined( items[i] ) ) items2.push( items2[i-1] );
        else items2.push( items[i] );
        var er = new ExpectedAndAcceptedResults( StatusCode.Good );
        if( i >= 2 ) er.addExpectedResult( BAD_TOOMANYMONITOREDITEMS );
        expectedResults.push( er );
    }
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items2, TimestampsToReturn: TimestampsToReturn.Server, SubscriptionId: defaultSubscription, OperationResults: expectedResults } );
    // Since we are cloning the items, MonitoredItemsId will be same which returns error when we use Items2 in DeleteMonitoredItems method. 
    var items3 = CreateMonitoredItemsHelper.Response.Results;
    for( var i=0; i<6; i++ ) {
        var er = new ExpectedAndAcceptedResults( StatusCode.Good );
        if( i >= 2 ) er.addExpectedResult( StatusCode.BadMonitoredItemIdInvalid );
    }
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items3, SubscriptionId: defaultSubscription } );
    return( true );
}


Test.Execute( { Procedure: tooManyItems2 } );