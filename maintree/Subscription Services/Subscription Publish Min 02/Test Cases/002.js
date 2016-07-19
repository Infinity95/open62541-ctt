/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Delete a subscription which currently has 2 outstanding Publish requests.
        Note: This script contains asynchronous elements.
              To simplify scripting the test will make all of the calls first, cache the results
              and then analyze the results at the end. */

var callbacksReceived = 0;

// define callback function
// call it however you like - the signature is mandatory
// first parameter is the service responce 
// second parameter is an object you can define however you want
function publishCallback002( response, callbackData ) {
print("*********************************************************");
    callbacksReceived += 1;
    print( "Publish() response #" + callbacksReceived + " received. Processing..." );
    switch( callbacksReceived ) {
        case 1: 
            // first Publish() we can accept either: (a) initial data-change; (b) Bad_NoSubscription
            if( response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadNoSubscription ) addLog( "Publish(#1).Response.ServiceResult is Bad_NoSubscription; which is acceptable." );
            else {
                if( Assert.Equal( StatusCode.Good, response.ResponseHeader.ServiceResult.StatusCode, "Publish(#1).Response.ServiceResult is not Good or Bad_NoSubscription, which are the codes expected. Received: " + response.ResponseHeader.ServiceResult.StatusCode ) ) {
                    var dataChange = response.ResponseHeader.NotificationMessage.NotificationData[0].toDataChangeNotification();
                    Assert.True( isDefined( dataChange ), "Publish(#1).Response.NotificationMessage does not contain a data-change notification, which was expected because the server did not report that the subscription is deleted yet." );
                }
            }
            break;
        case 2:
            // second Publish() call returns Bad_NoSubscription
            Assert.Equal( StatusCode.BadNoSubscription, response.ResponseHeader.ServiceResult.StatusCode, "Publish(#2).Response.ServiceResult is not Bad_NoSubscription. The subscription should no longer exist!", "Publish(#2).Response.ServiceResult correctly returned Bad_NoSubscription." );
            break;
        default:
            break;
    }// switch
}// function publishCallback002( response, callbackData )

function deleteSub5106004() {
    monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    // read all items first 
    ReadHelper.Execute( { NodesToRead: monitoredItems } );
    // create subscription
    var subscription = new Subscription2( { PublishingInterval:5000, RequestedLifetimeCount:10, MaxKeepAliveCount:1 } );
    //subscription
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) addError( "Error creating subscription." );
    else {
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
            return( false );
        }
        // write a new value to all subscribed items 
        for( var i=0; i<monitoredItems.length; i++ ) UaVariant.Increment( { Value: monitoredItems[i].Value } );
        WriteHelper.Execute( { NodesToWrite: monitoredItems, ReadVerification: false } );
        // queue 2 publish requests:
        var timeoutSetting = parseInt( 3 * readSetting( "/Server Test/Session/DefaultTimeoutHint" ).toString(), 10 );
        for( var q=0; q<2; q++ ) {
            // queue publish request
            var publishRequest = new UaPublishRequest;
            Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );
            publishRequest.RequestHeader.TimeoutHint = timeoutSetting;
            // just use the publish counter as callback data
            // we could also define any type of object and use that as callback data - now it's just a number
            Test.Session.Session.beginPublish( publishRequest, publishCallback002, null );
            addLog( "Publish() [async] called: " + (1+q)  + " of 2. RequestHandle: " + publishRequest.RequestHeader.RequestHandle + "." );
        }// for q...
        // delete the subscription
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        // now wait for both Publish calls to complete.
        var timeoutAt = UaDateTime.utcNow();
        timeoutAt.addSeconds( 12 );
        while( UaDateTime.utcNow() < timeoutAt ) {
            print( "... waiting for Publish() responses. Received: " + callbacksReceived + " of 2.  Abort in " + Math.abs( timeoutAt.secsTo( UaDateTime.utcNow() ) ) + " seconds." );
            for( var i=0; i<10; i++ ) wait( 50 );
            if( callbacksReceived == 2 ) break;
        }
        Assert.Equal( 2, callbacksReceived, "Publish() did not return the 2 callbacks as expected." );
    }
    return( true );
}// function deleteSub5106004()

Test.Execute( { Procedure: deleteSub5106004 } );