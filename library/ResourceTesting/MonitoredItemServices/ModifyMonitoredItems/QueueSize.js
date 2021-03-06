/*  RESOURCE TESTING;
    prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        Creates a Subscription (default parameters);
        Call CreateMonitoredItems passing in all configured Static Scalar nodes.
        In a loop:
            1. Modify all monitoredItems by changing the QueueSize parameter:
                1 -> 5 -> 10 -> 1 etc.
        Finally call DeleteMonitoredItems, delete the Subscription and close the connection.

    Settings used:
        /Server Test/NodeIds/Static/All Profiles/Scalar

    Configurable Script Options:
      QUEUE_SIZE_SMALL, QUEUE_SIZE_MEDIUM, QUEUE_SIZE_LARGE 

    Revision History
        05-Jan-2010 NP: Initial version.
*/

const QUEUE_SIZE_SMALL  = 1;
const QUEUE_SIZE_MEDIUM = 5;
const QUEUE_SIZE_LARGE  = 10;

include( "./library/ResourceTesting/repetitiveCall.js" );
include( "./library/Base/Objects/subscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/CreateSubscription/createSubscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/DeleteSubscription/deleteSubscription.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/ModifyMonitoredItems.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/DeleteMonitoredItems.js" );

// this is the function that will be called repetitvely
function modifyMonitoredItemsQueueSize()
{
    // change the value of the currentMode parameter
    switch( currentQueueSize )
    {
        case QUEUE_SIZE_SMALL:  currentQueueSize = QUEUE_SIZE_MEDIUM; break;
        case QUEUE_SIZE_MEDIUM: currentQueueSize = QUEUE_SIZE_LARGE;  break;
        case QUEUE_SIZE_LARGE:  currentQueueSize = QUEUE_SIZE_SMALL;  break;
    }
    // change the queuesize for all items
    for( i=0; i<originalScalarItems.length; i++ )
    {
        originalScalarItems[i].QueueSize = currentQueueSize;
    }//for i
    // invoke the call to change the monitoringMode
    ModifyMIHelper.Execute( originalScalarItems, TimestampsToReturn.Neither, testSubscription, undefined, undefined, true );
}

function initialize()
{
    createSubscriptionResult = CreateSubscriptionHelper.Execute( { Subscription: testSubscription } );
    if( !createSubscriptionResult )
    {
        return;
    }
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: originalScalarItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: testSubscription, SuppressMessaging: true } ) )
    {
        return;
    }
    ModifyMIHelper = new ModifyMonitoredItemsService( Test.Session.Session );
}

function disconnectOverride()
{
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: originalScalarItems, SubscriptionId: testSubscription, SuppressMessaging: true } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: testSubscription } );
    disconnect( g_channel, Test.Session.Session );
}

// Get a list of items to read from settings
var originalScalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( originalScalarItems === null || originalScalarItems.length === 0 ){ return; }

// Setup our timestamp value 
var currentQueueSize = QUEUE_SIZE_SMALL;

// Set all items to be mode=Disabled
for( var i=0; i<originalScalarItems.length; i++ )
{
    originalScalarItems[i].MonitoringMode = MonitoringMode.Disabled;
}

// Create our Subscription 
var testSubscription = new Subscription();
var createSubscriptionResult;

// Create service call helper(s)
var ModifyMIHelper;

// Get the test control parameters from the settings
var loopCount = parseInt( readSetting( "/Advanced/ResourceTesting/MonitoredItemServicesCallCount" ).toString() );

// Perform the iterative call loop
repetitivelyInvoke( initialize, modifyMonitoredItemsQueueSize, loopCount, undefined, disconnectOverride );

// clean-up
originalScalarItems = null;
ModifyMIHelper = null;