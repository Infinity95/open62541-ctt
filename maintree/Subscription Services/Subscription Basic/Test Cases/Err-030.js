/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Subscribe to ByteStringArray node and a StringArray node while specifying a valid IndexRange as being outside 
                 of the bounds of the array. */

function CreateMonitoredItemsErr030() { 

    // get our items for testing
    var byteStringNode = MonitoredItem.fromSettings( "/Server Test/NodeIds/Static/All Profiles/Arrays/ByteString" )[0];
    var stringNode = MonitoredItem.fromSettings( "/Server Test/NodeIds/Static/All Profiles/Arrays/String" )[0];

    var items = [], expectedResults = [] ;
    if( isDefined( byteStringNode ) ) items.push( byteStringNode );
    if( isDefined( stringNode ) ) items.push( stringNode );

    if( items.length == 0 ) {
        addSkipped( "Skipping test. ByteString[] and String[] are not defined." );
        return( false );
    }

    // read the items, to get their initial values 
    ReadHelper.Execute( { NodesToRead: items } );

    // now define the items such that their IndexRange is out of their physical bounds 
    for( var i=0; i<items.length; i++ ) { 
        var rangeStart = parseInt( 1 + items[i].Value.Value.getArraySize() );
        items[i].IndexRange = rangeStart.toString() + ":" + parseInt( 1 + rangeStart );
        var results =  new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadIndexRangeNoData ] );
        expectedResults.push( results );
    }//for i...
    // create the subscription
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );
    // add the monitored item(s)
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, SubscriptionId: subscription, OperationResults: expectedResults } ) ) {
        PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );
        PublishHelper.Execute();
        // check the response; if all items fail then make sure publish yields nothing
        var numFailedItems = 0;
        for( var i=0; i<CreateMonitoredItemsHelper.Response.Results.length; i++ ) if( CreateMonitoredItemsHelper.Response.Results[i].StatusCode.StatusCode == StatusCode.BadIndexRangeNoData ) numFailedItems++;
        if( numFailedItems === items.length ) {
            // call Publish() and receive a keepalive
            Assert.False( PublishHelper.CurrentlyContainsData(), "Publish should have received a KeepAlive since all items failed to add in CreateMonitoredItems." );
        }
        else {
            // call Publish() and make sure we get initial change value with bad quality codes
            if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response.NotificationMessage does not contain the initial data-change." ) ) { 
                // make sure all status codes are Bad_IndexRangeNoData 
                for( var i=0; i<items.length; i++ ) { 
                    Assert.Equal( StatusCode.BadIndexRangeNoData, PublishHelper.CurrentDataChanges[0].MonitoredItems[i].Value.StatusCode.StatusCode, "PublishHelper.CurrentDataChanges[0].MonitoredItems[i].Value.StatusCode should indicate the specified index range will yield no data!", "Publish().Response.NotificationMessage.MonitoredItems[" + i + "] correctly reports the specified IndexRange will yield no data." );
                }//for i
            }// if contains data
            // clean up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: subscription } );
        }
    }// if CreateMonitoredItems successful
    // clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}// func

Test.Execute( { Procedure: CreateMonitoredItemsErr030 } );