/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script creates a MonitoredItem of type String with IndexRange that would retrieve the last 3 characters of the string. */

function createMonitoredItems591055() {
    var nodeSetting = "/Server Test/NodeIds/Static/All Profiles/Scalar/String";
    var item = MonitoredItem.fromSetting( nodeSetting, 0 );
    if( item === null ) { addSkipped( "String not configured." ); return( false ); }

    // init the value by writing a String that has a char at the test index
    var initialValue = WriteService.GenerateString( { length: maxStringLen } );
    item.Value.Value.setString( initialValue );
    if( !WriteHelper.Execute( { NodesToWrite: item, ReadVerification: false } ) ) {
        addError( "Exiting test. Unable to set the initial value of the String to: " + item.Value.Value );
        return( false );
    }

    // now add the item to a subscription and call Publish(), the subscription ONLY CARES ABOUT
    item.IndexRange = ( maxStringLen - 3 ) + ":" + ( maxStringLen - 1 );
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
        addError( "Exiting test. Couldn't add the monitoredItem to the subscription." );
        return( false );
    }

    addLog( "Just created the MonitoredItem; now waiting the RevisedPublishingInterval of " + MonitorBasicSubscription.RevisedPublishingInterval + " before calling Publish()..." );
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );

    if( PublishHelper.Execute() ) {
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive a data change notification!" ) ) {
            PublishHelper.SetItemValuesFromDataChange( [item] );
            // check to see the value received was the 2nd character of the value we initial wrote
            var expectedValue = initialValue.substring( ( maxStringLen - 3 ), ( maxStringLen ) );
            var receivedValue = item.Value.Value.toString();
            Assert.Equal( expectedValue, receivedValue, "Expected the Publish to yield ONLY the values within the specified IndexRange position.", "Publish() returned the expected value for IndexRange '" + item.IndexRange + "'. Expected '" + expectedValue + "'; Received: '" + receivedValue + "'." );
        }
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591055 } );