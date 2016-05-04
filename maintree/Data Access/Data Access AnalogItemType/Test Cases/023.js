/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org (29-Nov-2012)
    Description: Write NaN, call Publish; do this twice. A DataChange is received both times. */

function test023() {
    var item;
    const ERR_NAN_EXPECTED = "KeepAlive received. Expected a DataChange in Publish because NaN is always unique, even \"NaN == NaN\" returns False";
    const ERR_NOT_NAN = "Did not receive NaN; expected NaN.";
    const OK_NAN_RECEIVED = "Publish.Response.NotificationMessage.DataChange.MonitoredItems[0].Value = NaN as expected.";
    // do we have any items available that do not have an EURange?
    for( var i=0; i<AnalogItems.length; i++ ) { 
        if( isDefined( AnalogItems[i].EURange ) && AnalogItems[i].EURange.Low == 0 && AnalogItems[i].EURange.High == 0 ){
            item = AnalogItems[i];
            break;
        }
    }
    if( !isDefined( item ) ) {
        addSkipped( "All AnalogItems defined have an EURange specified.\nThis test needs an AnalogItem that does not use an EURange, e.g. High=0;Low=0." );
        return( false );
    }
    // read the value 
    ReadHelper.Execute( { NodesToRead: item } );
    item.OriginalValue = item.Value.Value.clone();
    // create a subscription and add the item to it 
    var sub = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: sub } ) ) { 
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: item, SubscriptionId: sub } ) ) { 
            // get the initial Publish and DataChange 
            PublishHelper.WaitInterval( { Items: item, Subscription: sub } );
            PublishHelper.Execute( { FirstPublish: true } );
            // do our test twice
            for( var i=0; i<2; i++ ) { 
                item.SafelySetValueTypeKnown( NaN, item.Value.Value.DataType );
                // write a NaN
                if( WriteHelper.Execute( { NodesToWrite: item, ReadVerification: true } ) ) {
                    // call Publish, get a DataChange 
                    PublishHelper.WaitInterval( { Items: item } );
                    PublishHelper.Execute();
                    if( Assert.True( PublishHelper.CurrentlyContainsData(), ERR_NAN_EXPECTED ) ) { 
                        Assert.True( isNaN( PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value ), ERR_NOT_NAN, OK_NAN_RECEIVED );
                    }
                }// if( WriteHelper.Execute
            }// for( var i=0; i<2; i++ ) 
            PublishHelper.Execute(); // ack the last sequence
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: sub } );
        }// if( CreateMonitoredItems.Execute( { ItemsToCreate: item } ) )
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: sub } );
    }// if( CreateSubscription.Execute( { SubscriptionId: sub } ) )
    return( true );
}// function test023() 

Test.Execute( { Procedure: test023 } );