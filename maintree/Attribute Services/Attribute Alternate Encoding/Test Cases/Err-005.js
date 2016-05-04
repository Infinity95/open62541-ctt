/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify an invalid dataEncoding (e.g., the NamespaceIndex doesn`t exist). */ 

function createMonitoredItemsErr015() { 
    // get an item and specify the invalid encoding
    var item = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server_ServerStatus ) )[0];
    var invalidEncoding = new UaQualifiedName();
    invalidEncoding.NamespaceIndex = 0x123;
    invalidEncoding.Name = "Default Binary";

    item.DataEncoding = invalidEncoding;

    var sub1 = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: sub1 } ) ) return( false );

    // Invoke the call and test the result.
    // Expected BadDataEncodingUnsupported because the "Default Binary" encoding doesn't exist in the specified namespace and
    // is therefore invalid!
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: sub1, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadDataEncodingUnsupported ) } );

    // clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: sub1 } );
    return( true );
}//function

Test.Execute( { Procedure: createMonitoredItemsErr015 } );