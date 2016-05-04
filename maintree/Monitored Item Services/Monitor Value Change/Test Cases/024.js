/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script creates a MonitoredItem of type String with IndexRange of �1�. */

function createMonitoredItems591051() {
    var nodeSetting = "/Server Test/NodeIds/Static/All Profiles/Scalar/String";
    var item = MonitoredItem.fromSetting( nodeSetting, 0 );
    if( item === null ) { addSkipped( "String not configured." ); return( false ); }

    // init the value by writing a String that has a char at the test index
    var initialValue = WriteService.GenerateString( { length: maxStringLen } );
    item.Value.Value.setString( initialValue );
    if( !WriteHelper.Execute( { NodesToWrite: item, ReadVerification: true } ) ) {
        addError( "Exiting test. Unable to set the initial value of the String to: " + item.Value.Value );
        return( false );
    }

    // now add the item to a subscription and call Publish(), the subscription ONLY CARES ABOUT
    // IndexRange "1".
    item.IndexRange = "1";
    if( !CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: item, 
            TimestampsToReturn: TimestampsToReturn.Both, 
            SubscriptionId: MonitorBasicSubscription } ) ) {
        addError( "Exiting test. Couldn't add the monitoredItem to the subscription." );
        return( false );
    }

    // wait one publishing cycle before calling publish
    PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );

    if( PublishHelper.Execute() ) {
        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not receive the initial DataChange notification." ) ) { 
            PublishHelper.SetItemValuesFromDataChange( [item] );
            // check to see the value received was the 2nd character of the value we initial wrote
            var initialValue2ndCharacter = initialValue.substring( 1, 2 ); //2nd chr$
            var receivedValue = item.Value.Value.toString();
            Assert.Equal( initialValue2ndCharacter, receivedValue, "Expected the Publish to yield ONLY the values within the specified IndexRange position.", "Publish() returned the expected value for IndexRange: '" + item.IndexRange + "'. Expected: '" + initialValue2ndCharacter + "'; Received: '" + receivedValue + "'." );
        }
    }

    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591051 } );