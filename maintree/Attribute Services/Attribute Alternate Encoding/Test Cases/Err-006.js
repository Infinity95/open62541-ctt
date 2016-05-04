/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify a dataEncoding for an attribute that is not VALUE */

function createMonitoredItemsErr016() { 
    var item = MonitoredItem.Clone( scalarItems[0] );

    // specify the valid encoding
    var validEncoding = new UaQualifiedName();
    validEncoding.NamespaceIndex = 0;
    validEncoding.Name = "Default Binary";
    item.DataEncoding = validEncoding;

    // specify the non-Value attribute
    item.AttributeId = Attribute.BrowseName;

    var sub1 = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: sub1 } ) ) return( false );

    // Invoke the call and test the result 
    CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: sub1, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadDataEncodingInvalid ) } );

    // clean-up
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: sub1 } );
    return( true );
}//func

Test.Execute( { Procedure: createMonitoredItemsErr016 } );