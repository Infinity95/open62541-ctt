/*  Test for Error 1; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: call Publish() asynchronously, trying to invoke 4 concurrent publish requests which might be more than the server can handle. */

const MAXPUBLISHREQUESTS = 2;
var numPublishRequests = 0;
var publishCounter = 0;

// define callback function call it however you like - the signature is mandatory
// first parameter is the service responce second parameter is an object you can define however you want
function publishCallbackErr001( response, callbackData ) {
    addLog( "Publish Callback! call # " + callbackData );
}// function publishCallback( response, callbackData )


function asyncPublish5104err010() {
    monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    // create subscription
    var subscription = new Subscription2( { MaxKeepAliveCount: 2, RequestedLifetimeCount: 20 } );
    //subscription
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) addError( "Error creating subscription." );
    else {
        CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } );

        // we will modify the call timeout settings to take into consideration the last 
        // publish request in the queue to prevent it from timing out.
        var timeoutHintSettingValue = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ).toString(), 10 );
        print( "Default timeout setting: " + timeoutHintSettingValue + "; multiplying by 10." );
        timeoutHintSettingValue *= 5;

        // go into a loop: we want 20 callbacks, during this time ONLY queue a publish request 
        // if there's less than 10 publish calls outstanding...
        // allow a max of 1 minute for this test to execute
        var timeExpires = UaDateTime.utcNow();
        timeExpires.addSeconds( 60 );
        for( var i=0; i<(MAXPUBLISHREQUESTS+2); i++ ) {
            // exit loop for taking too long?
            if( timeExpires < UaDateTime.utcNow() ) {
                addWarning( "Exiting loop early. Test taking too long. Waited 60 seconds." );
                break;
            }
            // create new publish request
            var publishRequest = new UaPublishRequest;
            Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );
            publishRequest.RequestHeader.TimeoutHint = timeoutHintSettingValue;
            numPublishRequests++;
            // just use the publish counter as callback data
            // we could also define any type of object and use that as callback data - now it's just a number
            var uaStatus = Test.Session.Session.beginPublish( publishRequest, publishCallbackErr001, publishCounter );
            print( "Publish called: " + publishCounter++ + "; call result: " + uaStatus.toString() );

            // we expect the call to succeed, but not necessarily on the last.
            if( uaStatus.StatusCode === StatusCode.BadTooManyPublishRequests &&  i > MAXPUBLISHREQUESTS ) addLog( "Received 'BadTooManyPublishRequests', which is ok." );
            else Assert.True( uaStatus.isGood(), "Expected the Publish() call itself to succeed." );

            // prevent CPU racing
            wait( 10 );
        }
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: subscription } );
        DeleteSubscriptionsHelper.Execute ( { SubscriptionIds: subscription } );
    }
    return( true );
}// function asyncPublish5104err010()

Test.Execute( { Procedure: asyncPublish5104err010 } );