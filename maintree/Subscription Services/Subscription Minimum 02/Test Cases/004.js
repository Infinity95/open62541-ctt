/*  Test 5.10.1 Test 33, prepared by Nathan Pocock; nathan.pocockopcfoundation.org
    Description: Create two subscriptions with one whose priority is larger. Check the session diagnostics. Wait for low-priority sub to expire. */

function createSubscription5101033() {
const ADDITIONAL_TIMEOUT_PERIOD =  2000;
    // does the server support diagnostics? if not then skip the test
    if( !gServerCapabilities.ServerDiagnostics_EnabledFlag ) { addNotSupported( "Subscription Diagnostics" ); return( false ); }
    else addLog( "Subscription Diagnostics Supported" );

    var summaryInformation = []; // will store text to say "priority x subscription callback count received X, expected to be in range of Y and Z." etc.
    var loPriSub = new Subscription2( { MaxKeepAliveCount: 1, RequestedLifetimeCount: 3, Priority: 100 } );
    var hiPriSub = new Subscription2( { MaxKeepAliveCount: 100, Priority: 200 } );

    var itemsLoPri = MonitoredItem.fromNodeIds( NodeIdSettings.GetScalarStaticNodeIds( 1 ) );
    var itemsHiPri = MonitoredItem.Clone( itemsLoPri );

    // get the initial values for all items
    ReadHelper.Execute( { NodesToRead: itemsLoPri.concat( itemsHiPri ) } );

    // create the low-priority subscription
    if( !CreateSubscriptionHelper.Execute( { Subscription: loPriSub } ) ) return( false );
    // create the hi-priority subscription
    if( !CreateSubscriptionHelper.Execute( { Subscription: hiPriSub } ) ) {
        DeleteSubscriptinHelper.Execute( { SubscriptionIds: loPriSub } );
        return( false );
    }
    // create items in low-priority sub
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: itemsLoPri, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: loPriSub } ) ) {
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: loPriSub } );
        return( false );
    }
    // create items in hi-priority sub
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: itemsHiPri, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: hiPriSub } ) ) {
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: itemsLoPri, SubscriptionId: loPriSub } );
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: loPriSub } );
        return( false );
    }

    summaryInformation.push( "Created low-priority subscription, Id: " + loPriSub.SubscriptionId + "; Priority: " + loPriSub.Priority );
    summaryInformation.push( "Created high-priority subscription, Id: " + hiPriSub.SubscriptionId + "; Priority: " + hiPriSub.Priority );

    // read the SubscriptionDiagnosticsArray node
    var diagsNode = MonitoredItem.fromNodeIds( [ new UaNodeId( Identifier.Server_ServerDiagnostics_SubscriptionDiagnosticsArray ) ] )[0];
    ReadHelper.Execute( { NodesToRead: diagsNode } );
    // find subscriptions in the diags
    if( Assert.StringNotNullOrEmpty( diagsNode.Value.Value, "Expected a non-<null> value when reading ServerDiagnostics_SubscriptionDiagnosticsArray." ) ) {
        if( Assert.Equal( VariantArrayType.Array, diagsNode.Value.Value.ArrayType, "Expected the ServerDiagnostics_SubscriptionDiagnosticsArray to be an array." ) ) {
            var subscriptionDiags = diagsNode.Value.Value.toExtensionObjectArray();
            Assert.GreaterThan( -1, UaSubscriptionDiagnosticsDataType.FindSubscription( { Diagnostics: subscriptionDiags, SubscriptionId: loPriSub } ), "Expected to find LOW priority SubscriptionId '" + loPriSub.SubscriptionId + "' in the Diagnostics." );
            Assert.GreaterThan( -1, UaSubscriptionDiagnosticsDataType.FindSubscription( { Diagnostics: subscriptionDiags, SubscriptionId: hiPriSub } ), "Expected to find HIGH priority SubscriptionId '" + hiPriSub.SubscriptionId + "' in the Diagnostics." );
        }
    }

    // for the duration of the write to all items and call Publish() we only expect the high priority subscription to be received
    // and the low-priority subscription to timeout/die.
    var lowPrioritySubExpiration = UaDateTime.utcNow();
    lowPrioritySubExpiration.addMilliSeconds( loPriSub.Expiration() + ADDITIONAL_TIMEOUT_PERIOD ); // add 2000, just to be sure to exceed the lifetime
    print( "Low priority subscription should timeout/die at approx. " + lowPrioritySubExpiration + "." );
    summaryInformation.push( "Waiting " + UaDateTime.utcNow().secsTo( lowPrioritySubExpiration ) + " seconds, to allow low-priority subscription to timeout and disappear." );
    while( UaDateTime.utcNow() < lowPrioritySubExpiration ) {
        // just wait...
        print( "Waiting " + UaDateTime.utcNow().secsTo( lowPrioritySubExpiration ) + " seconds..." );
        wait( 1000 );
    }// while


    // read the diagnostics again
    ReadHelper.Execute( { NodesToRead: diagsNode } );
    if( Assert.StringNotNullOrEmpty( diagsNode.Value.Value, "Expected a non-<null> value when reading ServerDiagnostics_SubscriptionDiagnosticsArray." ) ) {
        if( Assert.Equal( VariantArrayType.Array, diagsNode.Value.Value.ArrayType, "Expected the ServerDiagnostics_SubscriptionDiagnosticsArray to be an array." ) ) {
            var subscriptionDiags = diagsNode.Value.Value.toExtensionObjectArray();
            Assert.Equal( -1, UaSubscriptionDiagnosticsDataType.FindSubscription( { Diagnostics: subscriptionDiags, SubscriptionId: loPriSub } ), "Did not expect to find LOW priority SubscriptionId '" + loPriSub.SubscriptionId + "' in the Diagnostics." );
            Assert.GreaterThan( -1, UaSubscriptionDiagnosticsDataType.FindSubscription( { Diagnostics: subscriptionDiags, SubscriptionId: hiPriSub } ), "Expected to find HIGH priority SubscriptionId '" + hiPriSub.SubscriptionId + "' in the Diagnostics." );
        }
    }


    //clean-up
    // subscription #1 may have died (timeout) due to priority starvation
    var expectedResults = new ExpectedResults( { Accepted: StatusCode.BadSubscriptionIdInvalid, Expected: StatusCode.Good } );
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: itemsLoPri, SubscriptionId: loPriSub, ServiceResult: expectedResults } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: loPriSub, OperationResults: expectedResults } );
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: itemsHiPri, SubscriptionId: hiPriSub, OperationResults: expectedResults } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: hiPriSub, OperationResults: expectedResults } );

    // unregister subscriptions with Publish 
    PublishHelper.UnregisterSubscription( [ loPriSub, hiPriSub ] );
    PublishHelper.ClearServerNotifications();
    PublishHelper.Clear();
    print( summaryInformation.toString() );
    return( true );
}

Test.Execute( { Procedure: createSubscription5101033 } );