/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Script creates a MonitoredItem of type ByteString with IndexRange of �1�. */

function createMonitoredItems591050() {
    var nodeSetting = "/Server Test/NodeIds/Static/All Profiles/Scalar/ByteString";
    var item = MonitoredItem.fromSetting( nodeSetting, 0 );
    if( item === null ) { addSkipped( "ByteString not configured." ); return( false ); }
    
    // create the monitored item and call Publish()
    var originalString = "CTT 5.9.1-050";
    item.Value.Value.setByteString( UaByteString.fromStringData( originalString ) );
    if( WriteHelper.Execute( { NodesToWrite: item } ) ) {
        item.IndexRange = "1";
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: MonitorBasicSubscription } ) ) {
            print( "Value successfully written... waiting " + MonitorBasicSubscription.RevisedPublishingInterval + " before calling Publish." );
            PublishHelper.WaitInterval( { Items: item, Subscription: MonitorBasicSubscription } );
            if( PublishHelper.Execute() ) {
                if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected to receive the initial value of the monitoredItems." ) ) {
                    Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected to receive just one monitoredItem dataChange notification." );
                    var receivedByteStringValue = PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.toByteString();
                    if( !isDefined( receivedByteStringValue ) ) {
                        print( "\tReceived ByteString value of: " + receivedByteStringValue );
                        Assert.Equal( 1, receivedByteStringValue.length, "Expected to receive just 1 length of the ByteString, based on the IndexRange specified." );
                        // now to convert the value received into a string, so we can compare it to 
                        // the character we expect in the original string
                        var receivedBsAsString = receivedByteStringValue.utf8ToString();
                        Assert.Equal( originalString[1], receivedBsAsString, "Expected to receive the first character ONLY of the ByteString, but received something else.", "Publish() returned the expected value when IndexRange '" + item.IndexRange + "' was provided. Expected '" + originalString[1] + "'; Received: '" + receivedBsAsString + "'." );
                    }
                    else addError( "Publish().Response.MonitoredItems[0].Value is not of type ByteString." );
                }
            }
            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591050 } );