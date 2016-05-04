/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a Monitored Item and request an unsupported DataTypeEncoding, e.g. "Modbus". */

function CreateMonitoredItemsErr004() { 
    var item = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server_ServerStatus ) )[0];

    // specify the encoding
    item.DataEncoding.Name = "modbus";

    // create a subscription
    var subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) return( false );

    // create the item, and test the failure condition 
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: subscription, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadDataEncodingUnsupported ) } );

    // clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    return( true );
}//func

Test.Execute( { Procedure: CreateMonitoredItemsErr004 } );