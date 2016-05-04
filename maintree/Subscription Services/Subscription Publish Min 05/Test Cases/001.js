/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: call Publish() asynchronously, trying to invoke 5 concurrent publish requests. */

const PUBLISH_QUEUE_SIZE = 5;
const PUBLISH_CALLBACKS_NEEDED = 10;

var publishQueueIsFull = false;
var numDataChangeNotifications = 0;
var numPublishRequests = 0;
var publishCounter = 0;

// define callback object
function CallbackObject() {
    this.handleCallbackFunction = function( response, callbackData ) {
        addLog( "Response " + response );
        addLog( "CallbackData " + callbackData );
    }// this.handleCallbackFunction = function( response, callbackData )
}// function CallbackObject()

// define callback function
// call it however you like - the signature is mandatory
// first parameter is the service responce 
// second parameter is an object you can define however you want
function publishCallback( response, callbackData ) {
    // add this response to our publish helper, if data is present
    var callbacksNeeded = ( PUBLISH_CALLBACKS_NEEDED - numDataChangeNotifications );
    addLog( "Publish Callback! call # " + callbackData + "; Outstanding (waiting) Publish requests: " + numPublishRequests + "; Callbacks remaining for test: " + ( callbacksNeeded > 0? callbacksNeeded : 0 ) );
    if( publishQueueIsFull ) {
        // allow a +/- of 1 because we may query the queue size during the transition of one item being dequeued and another queued...
        Assert.InRange( (PUBLISH_QUEUE_SIZE-1), PUBLISH_QUEUE_SIZE, numPublishRequests, "Expecting the Server to queue " + PUBLISH_QUEUE_SIZE + " Publish notifications." );
    }
    if( response.NotificationMessage.NotificationData.size > 0 ) {
        // cast message to dataChange, if applicable
        var dataChangeEvent = response.NotificationMessage.NotificationData[0].toDataChangeNotification();
        if( dataChangeEvent !== undefined && dataChangeEvent !== null ) addLog( "Publish callback: " + PublishService.PrintDataChange( dataChangeEvent, true ) ); // PrintDataChange() is a static method on the Publish [script] object.
    }
    else addLog( "\tkeep-alive." );
   numPublishRequests--;
   numDataChangeNotifications++;
}// function publishCallback( response, callbackData )


function asyncPublish5104008() {
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) addError( "Error creating subscription." );
    else {
        CreateMonitoredItemsHelper.Execute( { ItemsToCreate: testItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } );

        // we will modify the call timeout settings to take into consideration the last 
        // publish request in the queue to prevent it from timing out.
        var timeoutHintSettingValue = parseInt( readSetting( "/Server Test/Session/DefaultTimeoutHint" ).toString(), 10 );
        print( "Default timeout setting: " + timeoutHintSettingValue + "; multiplying by 5." );
        timeoutHintSettingValue *= 5;

        // go into a loop: we want 20 callbacks, during this time ONLY queue a publish request 
        // if there's less than 10 publish calls outstanding...
        // allow a max of 1 minute for this test to execute
        var timeExpires = UaDateTime.utcNow();
        timeExpires.addSeconds( 60 );
        while( numDataChangeNotifications < PUBLISH_CALLBACKS_NEEDED ) {
            // exit loop for taking too long?
            if( timeExpires < UaDateTime.utcNow() ) {
                addWarning( "Exiting loop early. Test taking too long. Waited 60 seconds." );
                break;
            }
            // create new publish request
            if( numPublishRequests < PUBLISH_QUEUE_SIZE ) {
                // queue publish request
                var publishRequest = new UaPublishRequest;
                Test.Session.Session.buildRequestHeader( publishRequest.RequestHeader );
                publishRequest.RequestHeader.TimeoutHint = timeoutHintSettingValue;
                numPublishRequests++;
                // just use the publish counter as callback data
                // we could also define any type of object and use that as callback data - now it's just a number
                Test.Session.Session.beginPublish( publishRequest, publishCallback, publishCounter );
                print( "Publish called: " + publishCounter++ );
            }
            else publishQueueIsFull = true;
            // prevent CPU racing
            wait( 10 );
        }

        // allow remaining Publish requests to come back...
        // clear the flag to stop the assertion (check outstanding publish calls = 10 );
        publishQueueIsFull = false;
        addLog( "Issued all Publish calls... now waiting for the outstanding calls to complete..." );
        timeExpires = UaDateTime.utcNow();
        timeExpires.addSeconds( 60 );
        while( numPublishRequests > 0 ) {
            // exit loop for taking too long?
            if( timeExpires < UaDateTime.utcNow() ) {
                addWarning( "Exiting loop early. Test taking too long. Waited 60 seconds." );
                break;
            }
            // small delay so as to prevent CPU overload; also prevent thread-block.
            wait( 100 );
        }
        
        // small delay and then clean-up
        wait( 2000 );
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: testItems, SubscriptionId: subscription } );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );

        // did we receive all callbacks?
        Assert.GreaterThan( (PUBLISH_CALLBACKS_NEEDED - 1), numDataChangeNotifications, "Did not receive the expected number of Publish responses." );
    }
    return( true );
}// function asyncPublish5104008()

Test.Execute( { Procedure: asyncPublish5104008 } );