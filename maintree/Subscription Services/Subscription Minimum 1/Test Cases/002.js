/*  Test 5.10.1 Test 33, prepared by Nathan Pocock; nathan.pocockopcfoundation.org
    Description: Create a subscription. Check the session diagnostics. Wait for subscription to expire. Check the session diagnostics. */

function createSubscription5101033() {
const ADDITIONAL_TIMEOUT_INTERVAL = 3000;
    // does the server support diagnostics? if not then skip the test
    if( !gServerCapabilities.ServerDiagnostics_EnabledFlag ) {
        addNotSupported( "Subscription Diagnostics are NOT supported (or enabled)" );
        return( false );
    }
    // setup subscription and items
    var subscription = new Subscription2( { MaxNotificationsPerPublish:1, MaxKeepAliveCount:3, RequestedPublishingInterval: 100, RequestedLifetimeCount: 5 } );
    var items = MonitoredItem.fromNodeIds( NodeIdSettings.GetScalarStaticNodeIds( 1 ) );
    // read the SubscriptionDiagnosticsArray node
    var diagsNode = MonitoredItem.fromNodeIds( [ new UaNodeId( Identifier.Server_ServerDiagnostics_SubscriptionDiagnosticsArray ) ] )[0];
    diagsNode.NodeSetting = "Identifier.Server_ServerDiagnostics_SubscriptionDiagnosticsArray"; // fake the setting, so this text appears in debug output
    ReadHelper.Execute( { NodesToRead: diagsNode, OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotReadable, StatusCode.BadNodeIdUnknown ] ) } );
    // is the diagnostics supported? if not then exit
    if( ReadHelper.Response.Results[0].StatusCode.isBad() ) { 
        addNotSupported( "Subscription Diagnostics not supported. This is allowed for EMBEDDED profiles only. Skipping tests." );
        return( false );
    }
    // get the initial values for all items
    ReadHelper.Execute( { NodesToRead: items } );
    // create the subscription
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }
    else addLog( "Created SubscriptionId: " + subscription.SubscriptionId );
    // read the diagnostics array
    if( ReadHelper.Execute( { NodesToRead: diagsNode } ) ) {
        if( Assert.Equal( VariantArrayType.toString( VariantArrayType.Array ), VariantArrayType.toString( diagsNode.Value.Value.ArrayType ), "Expected the ServerDiagnostics_SubscriptionDiagnosticsArray (Value.ArrayType) to be an array." ) ) {
            // locate our subscription in the array
            var subscriptionDiags = diagsNode.Value.Value.toExtensionObjectArray();
            Assert.GreaterThan( -1, UaSubscriptionDiagnosticsDataType.FindSubscription( { Diagnostics: subscriptionDiags, SubscriptionId: subscription } ), "Expected to find SubscriptionId '" + subscription.SubscriptionId + "' in the Diagnostics." );
            // allow subscription to timeout
            var lowPrioritySubExpiration = UaDateTime.utcNow();
            lowPrioritySubExpiration.addMilliSeconds( subscription.Expiration() + ADDITIONAL_TIMEOUT_INTERVAL ); // add 1-sec, just to be sure to exceed the lifetime
            print( "Low priority subscription should timeout/die at approx. " + lowPrioritySubExpiration + "." );
            while( UaDateTime.utcNow() < lowPrioritySubExpiration ) {
                print( "Waiting... (" + Math.abs( lowPrioritySubExpiration.secsTo( UaDateTime.utcNow() ) ) + " seconds to go)" );
                wait( 1000 );
            }// while
            // read the diagnostics again and now make sure the subscription does NOT show-up
            if( ReadHelper.Execute( { NodesToRead: diagsNode } ) ) {
                var subscriptionDiags = diagsNode.Value.Value.toExtensionObjectArray();
                Assert.Equal( -1, UaSubscriptionDiagnosticsDataType.FindSubscription( { Diagnostics: subscriptionDiags, SubscriptionId: subscription } ), "Did not expect to find SubscriptionId '" + subscription.SubscriptionId + "' in the Diagnostics." );
            }// read #2
        }
    }
    //clean-up
    // subscription #1 should have died (timeout) due to priority starvation
    var expectation = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadSubscriptionIdInvalid ] );
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: subscription, ServiceResult: expectation } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription, OperationResults: expectation } );
    // unregister subscriptions with Publish 
    PublishHelper.UnregisterSubscription( subscription );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createSubscription5101033 } );