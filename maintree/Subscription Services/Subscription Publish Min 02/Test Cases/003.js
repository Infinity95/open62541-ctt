/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Modify a subscription and check the async Publish response timings. */

// store a copy of the Publish Request and Response objects for later analysis
var pubRequests = [];
var pubResponses = [];
var messages = [];
var monitoredItems;

// Returns a count of outstanding Publish responses.
function getWaitingCount() {
    return( pubRequests.length - pubResponses.length );
}//function getWaitingCount() 


// Returns a structure that pairs a Publish Request with its corresponding Response.
function getPublishPair( requestHandle ) {
    if( !isDefined( requestHandle ) ) requestHandle = 0;
    for( var i=0; i<pubRequests.length; i++ ) {
        if( pubRequests[i].RequestHeader.RequestHandle === requestHandle ) {
            for( var ii=0; ii<pubResponses.length; ii++ ) {
                if( pubResponses[ii].ResponseHeader.RequestHandle === requestHandle ) {
                    return( { Request: pubRequests[i], Response: pubResponses[ii] } );
                }
            }//for ii
        }//if...
    }//for i...
    return( null );
}// function getPublishPair( requestHandle )


var doWriteInCallback = false;

// define callback function
// call it however you like - the signature is mandatory
// first parameter is the service responce 
// second parameter is an object you can define however you want
function publishCallback( response, callbackData ) {
    if( !doWriteInCallback ) {
        response.ResponseHeader.Timestamp = UaDateTime.utcNow(); // a litle smoke/mirrors here; override the timestamp to be the CTT's clock
        pubResponses.push( response );
        print( "Publish() [async] response received. Request.RequestHandle: " + response.ResponseHeader.RequestHandle + ". Publishes received: " + pubResponses.length + "; Waiting: " + getWaitingCount() ); 
    }
    else publishCallbackWithWrite( response, callbackData );
}// function publishCallback( response, callbackData ) 


// the same as above, except a Write() call is placed inside
function publishCallbackWithWrite( response, callbackData ) {
    response.ResponseHeader.Timestamp = UaDateTime.utcNow(); // a litle smoke/mirrors here; override the timestamp to be the CTT's clock
    addLog( "Processing async Publish() response... will invoke a Write() from within this event handler." );
    pubResponses.push( response );
    UaVariant.Increment( { Value: monitoredItems[0].Value } );
    WriteHelper.Execute( { NodesToWrite:monitoredItems[0], ReadVerification:false } );
}// function publishCallbackWithWrite( response, callbackData )

function asyncPublish5102022() {
    monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    messages.push( "\n\n\nTest Analysis:\n" + monitoredItems.length + " monitored items defined." );

    // read all items first 
    ReadHelper.Execute( { NodesToRead: monitoredItems } );

    // create subscription
    var subscription = new Subscription2( { PublishingInterval: 5000, RequestedLifetimeCount: 10, MaxKeepAliveCount: 1 } );
    //subscription
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) addError( "Error creating subscription." );
    else {
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
            return( false );
        }

        // queue 2 publish requests:
        var timeoutSetting = parseInt( 3 * readSetting( "/Server Test/Session/DefaultTimeoutHint" ).toString(), 10 );
        for( var q=0; q<2; q++ ) {
            // queue publish request
            var publishRequest = new UaPublishRequest;
            Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );
            publishRequest.RequestHeader.TimeoutHint = timeoutSetting;
            pubRequests.push( publishRequest.clone() );

            // just use the publish counter as callback data
            // we could also define any type of object and use that as callback data - now it's just a number
            Test.Session.Session.beginPublish( publishRequest, publishCallback, null );
            addLog( "Publish() [async] called: " + pubRequests.length  + ". RequestHandle: " + publishRequest.RequestHeader.RequestHandle + "." );

            // prevent CPU overheat
            wait( 10 );
        }// for( var q=0; q<2; q++ )


        // write to ALL items
        PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: subscription } );
        for( var w=0; w<monitoredItems.length; w++ ) {
            UaVariant.Increment( { Value: monitoredItems[w].Value } );
            monitoredItems[w].WrittenValue = monitoredItems[w].Value.Value.clone();
        }// for( var w=0; w<monitoredItems.length; w++ )
        WriteHelper.Execute( { NodesToWrite:monitoredItems, ReadVerification:false } );


        // wait for our 2 publish requests to come back... but wait a MAX of 
        // 2x PublishingInterval from now
        var abortWaitAtTime = UaDateTime.utcNow();
        abortWaitAtTime.addMilliSeconds( ( subscription.RevisedPublishingInterval * subscription.RevisedLifetimeCount ) + 500 );
        print( "Waiting for all async Publish responses: Publish test #1. Timeout at: " + abortWaitAtTime );
        do {
            wait( 10 );
        }while( getWaitingCount() > 0 && abortWaitAtTime > UaDateTime.utcNow() );

        print( "Publish responses received (#1): " + pubResponses.length );
        if( Assert.Equal( 2, pubResponses.length, "Expected to receive 2 callbacks because 2 Publish() calls were made." ) ) {
            Assert.StringNotNullOrEmpty( pubResponses[0].NotificationMessage.NotificationData, "Expected Publish #1 response to receive a datachange." );
        }




        // now to modify the subscription by doubling the publishing interval
        subscription.PublishingInterval = 2 * subscription.RevisedPublishingInterval;
        ModifySubscriptionHelper.Execute( { SubscriptionId: subscription } );


        // write a value and call Publish(); just to ensure that a datachange is received 
        // and that the new publishing interval will come into effect 
        UaVariant.Increment( { Value: monitoredItems[0].Value } );
        WriteHelper.Execute( { NodesToWrite:monitoredItems[0], ReadVerification:false } );

        // queue publish request
        var publishRequest = new UaPublishRequest;
        Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );
        publishRequest.RequestHeader.TimeoutHint = timeoutSetting;
        pubRequests.push( publishRequest.clone() );

        Test.Session.Session.beginPublish( publishRequest, publishCallback, null );
        addLog( "Publish() [async] called: " + pubRequests.length  + ". RequestHandle: " + publishRequest.RequestHeader.RequestHandle + "." );


        // wait for publish responses.
        abortWaitAtTime = UaDateTime.utcNow();
        abortWaitAtTime.addMilliSeconds( ( subscription.RevisedPublishingInterval * subscription.RevisedLifetimeCount ) + 500 );
        print( "Waiting for all async Publish responses: Publish test #2. Timeout at: " + abortWaitAtTime );
        do {
            wait( 10 );
        }while( getWaitingCount() > 0 && abortWaitAtTime > UaDateTime.utcNow() );
        print( "Publish responses received (#2): " + pubResponses.length );


        // in a loop of 3 iterations call Publish() and invoke a write (from within the Publish response handler).
        doWriteInCallback = true;
        wait( 10 );
        for( var t=0; t<3; t++ ) {
            // queue publish request
            var publishRequest = new UaPublishRequest;
            Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );
            publishRequest.RequestHeader.TimeoutHint = timeoutSetting;
            pubRequests.push( publishRequest.clone() );

            // just use the publish counter as callback data
            // we could also define any type of object and use that as callback data - now it's just a number
            Test.Session.Session.beginPublish( publishRequest, publishCallback, null );
            addLog( "Publish() [async] called: " + pubRequests.length  + ". RequestHandle: " + publishRequest.RequestHeader.RequestHandle + "." );
        }// for( var t=0; t<3; t++ ) 


        // wait for publish responses.
        abortWaitAtTime = UaDateTime.utcNow();
        abortWaitAtTime.addMilliSeconds( subscription.RevisedPublishingInterval * subscription.RevisedLifetimeCount + 500 );
        print( "Waiting for all async Publish responses: Publish test #3. Timeout at: " + abortWaitAtTime );
        var jj=0;
        do {
            wait( 10 );
            if( jj++ == 500 ) {
                print( "Publish waiting count #" + getWaitingCount() + "; pubResponses.length: " + pubResponses.length );
                jj = 0;
            }
        }while( getWaitingCount() > 0 && abortWaitAtTime > UaDateTime.utcNow() );
        print( "Publish responses received (#3): " + pubResponses.length );

//--------------------------------------------------------------

        // small delay and then clean-up
        for( var i=0; i<250; i++ ) wait( 1 );
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: subscription } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );


// -- NOW to check all of the async callbacks received

        // now check first 2 publishes match expectations:
        //publish #1
        var lowerBound = 4500;
        var upperBound = 5500;
        var pub1 = getPublishPair( pubRequests[0].RequestHeader.RequestHandle );
        if( Assert.StringNotNullOrEmpty( pub1, "Publish request did not receive a matching response; check RequestHandle: " + pubRequests[0].RequestHeader.RequestHandle ) ) {
            tDiff = pub1.Request.RequestHeader.Timestamp.msecsTo( pub1.Response.ResponseHeader.Timestamp );
            var msg = "Publish #1 (RequestHandle: " + pub1.Request.RequestHeader.RequestHandle + ") sent at: " + pub1.Request.RequestHeader.Timestamp + "; received at: " + pub1.Response.ResponseHeader.Timestamp + " -- difference: " + tDiff + " - ";
            msg += Assert.InRange( lowerBound, upperBound, tDiff, "Publish() response did not complete within the expected time-frame." )? "acceptable" : "unacceptable";
            messages.push( msg );
            msg += Assert.StringNotNullOrEmpty( pub1.Response.NotificationMessage.NotificationData[0], "Expected Publish() #1 to receive a data change notification (initial values)." )? "; data change received." : "NO DATA CHANGE!";
        }
        else messages.push( "Publish.Request.RequestHandle '" + pubRequests[0].RequestHeader.RequestHandle + "' did not receive a matching Publish.Response." );

        // publish #2. We need to double the bounds because the first publish will contain the data-change.
        var pub2 = getPublishPair( pubRequests[1].RequestHeader.RequestHandle );
        if( Assert.StringNotNullOrEmpty( pub2, "Publish request did not receive a matching response; check RequestHandle: " + pubRequests[1].RequestHeader.RequestHandle ) ) {
            lowerBound *= 2;
            upperBound *= 2;
            tDiff = pub2.Request.RequestHeader.Timestamp.msecsTo( pub2.Response.ResponseHeader.Timestamp );
            msg = "Publish #2 (RequestHandle: " + pub1.Request.RequestHeader.RequestHandle + ") sent at: " + pub2.Request.RequestHeader.Timestamp + "; received at: " + pub2.Response.ResponseHeader.Timestamp + " -- difference: " + tDiff + " - ";
            msg += Assert.InRange( lowerBound, upperBound, tDiff, "Publish() response did not complete within the expected time-frame." )? "acceptable" : "unacceptable";
            msg += Assert.StringNotNullOrEmpty( pub2.Response.NotificationMessage.NotificationData[0], "Expected Publish() #2 to receive a data change notification (initial values)." )? "; data change received." : "NO DATA CHANGE!";
            messages.push( msg );
        }
        else messages.push( "Publish.Request.RequestHandle '" + pubRequests[1].RequestHeader.RequestHandle + "' did not receive a matching Publish.Response." );


        // publish #3
        // can be ignored
        var pub3 = getPublishPair( pubRequests[2].RequestHeader.RequestHandle );
        if( Assert.StringNotNullOrEmpty( pub3, "Publish request did not receive a matching response; check RequestHandle: " + pubRequests[2].RequestHeader.RequestHandle ) ) {
            msg = "Publish #3 (RequestHandle: " + pub1.Request.RequestHeader.RequestHandle + ") sent at: " + pub3.Request.RequestHeader.Timestamp + "; received at: " + pub3.Response.ResponseHeader.Timestamp + "; Publish() called to ensure the next call sees a difference in the Publish interval.";
            messages.push( msg );
        }
        else messages.push( "Publish.Request.RequestHandle '" + pubRequests[2].RequestHeader.RequestHandle + "' did not receive a matching Publish.Response." );


        // publish #3, 4, 5 -- keep the same +/- 500ms range for receiving the publish responses
        lowerBound = 9500;
        upperBound = 10500;
        for( var t=3; t<6; t++ ) {
            var lastPub = getPublishPair( pubRequests[t].RequestHeader.RequestHandle );
            if( Assert.StringNotNullOrEmpty( lastPub, "Publish request did not receive a matching response; check RequestHandle: " + pubRequests[2].RequestHeader.RequestHandle ) ) {
                tDiff = lastPub.Request.RequestHeader.Timestamp.msecsTo( lastPub.Response.ResponseHeader.Timestamp );
                msg = "Publish() #" + (1+t) + " (RequestHandle: " + lastPub.Request.RequestHeader.RequestHandle + ") sent at: " + lastPub.Request.RequestHeader.Timestamp + "; received at: " + lastPub.Response.ResponseHeader.Timestamp + " -- difference: " + tDiff + " msec - ";
                msg += Assert.InRange( lowerBound, upperBound, tDiff, "Publish() #" + (1+t) +" (RequestHandle: " + lastPub.Request.RequestHeader.RequestHandle + ") response did not complete within the expected time-frame." )? "acceptable" : "unacceptable";
                messages.push( msg );
            }
            else messages.push( "Publish.Request.RequestHandle '" + pubRequests[t].RequestHeader.RequestHandle + "' did not receive a matching Publish.Response." );
            upperBound += subscription.KeepAlivePeriod();
        }


        // show all messages
        for( var m=0; m<messages.length; m++ )print( messages[m] );

        //delete everything below
        print( "pubRequests.length: " + pubRequests.length + "; pubResponses.length: " + pubResponses.length );
        for( var i=0; i<pubRequests.length; i++ ) print( "Request[" + i + "].RequestHeader.RequestHandle: " + pubRequests[i].RequestHeader.RequestHandle );
        for( var i=0; i<pubResponses.length; i++ ) print( "Response[" + i + "].ResponseHeader.RequestHandle: " + pubResponses[i].ResponseHeader.RequestHandle );
    }
    return( true );
}// function asyncPublish5102022()

Test.Execute( { Procedure: asyncPublish5102022 } );