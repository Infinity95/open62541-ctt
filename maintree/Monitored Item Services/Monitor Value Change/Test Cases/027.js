/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script creates a MonitoredItem of type ByteString with IndexRange that would retrieve the last 3 characters of the string. */

function createMonitoredItems591054() {
    var nodeSetting = "/Server Test/NodeIds/Static/All Profiles/Scalar/ByteString";
    var item = MonitoredItem.fromSetting( nodeSetting, 0 );
    if( item === null ) { addSkipped( "ByteString not configured." ); return( false ); }

    // init the value by writing a String that has a char at the test index
    var initialValue = UaByteString.fromHexString( "0x11223344556677889900" );
    item.Value.Value.setByteString( initialValue );
    if( !WriteHelper.Execute( { NodesToWrite: item } ) )
    {
        addError( "Exiting test. Unable to set the initial value of the ByteString to: " + item.Value.Value );
        return( false );
    }

    // now add the item to a subscription and call Publish(), the subscription ONLY CARES ABOUT
    // IndexRange "1".
    item.IndexRange = "5:8";
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) )
    {
        addError( "Exiting test. Couldn't add the monitoredItem to the subscription." );
        return( false );
    }

    // wait one publishing cycle before calling publish
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );

    if( PublishHelper.Execute() )
    {
        PublishHelper.SetItemValuesFromDataChange( [item] );
        // check to see the value received was the last 3 characters of the value we initially wrote
        var initialValue2ndCharacter = initialValue.getRange( 5, 8 );
        var receivedValue = item.Value.Value.toByteString();
        Assert.Equal( initialValue2ndCharacter, receivedValue, "Expected the Publish to yield ONLY the values within the specified IndexRange '" + item.IndexRange + "' position.", "Publish() returned the expected value for IndexRange '" + item.IndexRange + "'. Expected '" + initialValue2ndCharacter + "'; Received: '" + receivedValue + "'." );
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591054 } );