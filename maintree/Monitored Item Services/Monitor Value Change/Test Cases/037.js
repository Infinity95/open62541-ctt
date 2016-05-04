/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: CreateMonitoredItems: Non-variable node, non-Value attribute. */

function CreateMonitoredItems037() { 
    // create an item that is not a variable, and the attribute is not Value 
    var item = MonitoredItem.fromNodeIds( new UaNodeId( Identifier.Server ) )[0];
    item.AttributeId = Attribute.DisplayName;

    // create the item
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: MonitorBasicSubscription } ) ) return( false );

    // call Publish and make sure that there's an initial data-change
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
    PublishHelper.Execute( { FirstPublish: true } );
    Assert.True( PublishHelper.CurrentlyContainsData(), "Publish().Response contains the initial data-change notification as expected.", "Publish().Response is empty. The initial data-change was expected." );

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}//func

Test.Execute( { Procedure: CreateMonitoredItems037 } );