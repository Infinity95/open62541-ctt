/*  RESOURCE TESTING;
    prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        Creates a Subscription (default parameters);
        Call CreateMonitoredItems passing in all configured Dynamic Scalar nodes.
        In a loop:
            (1) call Publish(), do not acknowledge any dataChanges and/or Events
        Finally, DeleteMonitoredItems and also the Subscription and closes the connection.

    Settings used:
        /Server Test/NodeIds/Static/All Profiles/Scalar

    Parameters for tweaking test:
        SKIP_ACKNOWLEDGE   - False=acknowledge all dataChanges/events; True=no acknowledgements.
        ACKNOWLEDGE_AT_END - True=acknowledge any unacknowledged dataChanges/events at the end of the test.

    Revision History
        04-Jan-2010 NP: Initial version.
*/

const SKIP_ACKNOWLEDGE = true;
const ACKNOWLEDGE_AT_END = true;

include( "./library/ResourceTesting/repetitiveCall.js" );
include( "./library/Base/Objects/subscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/CreateSubscription/createSubscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/DeleteSubscription/deleteSubscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/Publish.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/DeleteMonitoredItems.js" );

// this is the function that will be called repetitvely
function publishNoAck()
{
    PublishHelper.Execute( { NoAcks: true } );
}

function initialize()
{
    createSubscriptionResult = CreateSubscriptionHelper.Execute( { Subscription: testSubscription } );
    if( !createSubscriptionResult )
    {
        return;
    }
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: originalScalarItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: testSubscription } ) )
    {
        return;
    }
    PublishHelper = new PublishService( Test.Session.Session );
}

function disconnectOverride()
{
    // do we need to acknowledge everything prior to disconnect?
    if( ACKNOWLEDGE_AT_END )
    {
        PublishHelper.Execute();
    }
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: originalScalarItems, SubscriptionId: testSubscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: testSubscription } );
    disconnect( g_channel, Test.Session.Session );
}

// Get a list of items to read from settings
var originalScalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings );
if( originalScalarItems === null || originalScalarItems.length === 0 ){ return; }

// Setup our monitoringMode value 
var currentMonitoringMode = MonitoringMode.Disabled;

// Set all items to be mode=Disabled
for( var i=0; i<originalScalarItems.length; i++ )
{
    originalScalarItems[i].MonitoringMode = currentMonitoringMode;
}

// Create our Subscription 
var testSubscription = new Subscription();
var createSubscriptionResult;

// Create service call helper(s)
var PublishHelper;

// Get the test control parameters from the settings
var loopCount = parseInt( readSetting( "/Advanced/ResourceTesting/SubscriptionServiceSetCallCount" ).toString() );

// Perform the iterative call loop
repetitivelyInvoke( initialize, publishNoAck, loopCount, undefined, disconnectOverride );

// clean-up
originalScalarItems = null;
SetMonitoringHelper = null;