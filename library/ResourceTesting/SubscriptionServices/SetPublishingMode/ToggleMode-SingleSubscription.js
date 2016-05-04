/*  RESOURCE TESTING;
    prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        Creates a Subscription (default parameters);
        Call CreateMonitoredItems passing in all configured Static Scalar nodes.
        In a loop:
            1. Modify the Subscription's mode: 
                Enabled -> Disabled -> Enabled etc.
        Finally call DeleteMonitoredItems, delete the Subscription and close the connection.

    Settings used:
        /Server Test/NodeIds/Static/All Profiles/Scalar

    Revision History
        06-Jan-2010 NP: Initial version.
*/

include( "./library/ResourceTesting/repetitiveCall.js" );
include( "./library/Base/Objects/subscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/CreateSubscription/createSubscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/SetPublishingMode.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/DeleteSubscription/deleteSubscription.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/DeleteMonitoredItems.js" );

// this is the function that will be called repetitvely
function setPublishingModeSingleSub()
{
    // toggle publishing Enabled
    currentMode = !currentMode;
    // invoke the call to change the publishInterval
    SetPublishingModeHelper.Execute( { SubscriptionIds: testSubscription, PublishingEnabled: currentMode } );
}

function initialize()
{
    if( !CreateSubscriptionHelper.Execute( { Subscription: testSubscription } ) )
    {
        return;
    }
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: originalScalarItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: testSubscription } ) )
    {
        return;
    }
    SetPublishingModeHelper = new SetPublishingModeService( Test.Session.Session );
}

function disconnectOverride()
{
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: originalScalarItems, SubscriptionId: testSubscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: testSubscription } );
    disconnect( g_channel, Test.Session.Session );
}

// Get a list of items to read from settings
var originalScalarItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
if( originalScalarItems === null || originalScalarItems.length === 0 ){ return; }

// Set all items to be mode=Disabled
for( var i=0; i<originalScalarItems.length; i++ )
{
    originalScalarItems[i].MonitoringMode = MonitoringMode.Disabled;
}

// Create our Subscription 
var testSubscription = new Subscription();
var currentMode = !Subscription.PublishingEnabled;

// Create service call helper(s)
var SetPublishingModeHelper;

// Get the test control parameters from the settings
var loopCount = parseInt( readSetting( "/Advanced/ResourceTesting/MonitoredItemServicesCallCount" ).toString() );

// Perform the iterative call loop
repetitivelyInvoke( initialize, setPublishingModeSingleSub, loopCount, undefined, disconnectOverride );

// clean-up
originalScalarItems = null;
SetPublishingModeHelper = null;