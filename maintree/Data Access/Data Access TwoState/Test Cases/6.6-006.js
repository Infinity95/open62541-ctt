/*  Test 6.6 Test 6; prepared by Nathan Pocock nathan.pocock@opcfoundation.org

    Description:
        Create a MonitoredItem where the node is of /derives from type TwoStateDiscrete
        (DA Profile).
        In a loop: write a value to the Node, call Publish()() and compare the value
        received to the value wrote.
    Expectations:
        All service and operation level results are Good.
        The values received in Publish() match the values written, and the quality isGood
        with a valid timestamp.

    Revision History:
        17-Feb-2010 NP: Initial version.
        23-May-2012 NP: Reviewed.
*/

function subscription66006()
{
    const NUM_WRITES = 10;
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        addSkipped( TSDT );
        return( false );
    }

    // read the nodes first, because we'll toggle the values
    if (!ReadHelper.Execute( { NodesToRead: twoStateItems } ) )
    {
        return( false );
    }
    // store the initial values
    for( var i=0; i<twoStateItems.length; i++ )
    {
        twoStateItems[i].InitialValue = twoStateItems[i].Value.Value.clone();
    }

    // create the subscription
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) )
    {
        //create the monitored items within the subscription
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: twoStateItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) )
        {
            // get the initial values first, before testing...
            PublishHelper.WaitPublishInterval ( { items: item, Subscription: subscription } );
            PublishHelper.Execute();
            // here's the loop, write a value; wait; publish; compare
            for( var i=0; i<NUM_WRITES; i++ )
            {
                // set the new values
                for( var m=0; m<twoStateItems.length; m++ )
                {
                    var newBitVal = !twoStateItems[m].Value.Value.toBoolean();
                    twoStateItems[m].Value.Value.setBoolean( newBitVal );
                    twoStateItems[m].WrittenValue = twoStateItems[m].Value.Value.clone();
                }
                // write
                if( WriteHelper.Execute( { NodesToWrite: twoStateItems } ) )
                {
                    // wait
                    PublishHelper.WaitPublishInterval ( { items: item, Subscription: subscription } );
                    // publish
                    if( PublishHelper.Execute() )
                    {
                        // we expect a data change
                        if( Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a DataChange!" ) )
                        {
                            PublishHelper.SetItemValuesFromDataChange( twoStateItems, "v" );
                            // we expect multiple notifications
                            Assert.Equal( twoStateItems.length, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, ("Expected " + twoStateItems.length + " notifications!") );
                            // we expect to receive the same value we wrote
                            for( var r=0; r<twoStateItems.length; r++ )
                            {
                                Assert.Equal( twoStateItems[r].Value.Value.toBoolean(), twoStateItems[r].WrittenValue.toBoolean(), "Expected to receive the same value as previously written on Node '" + twoStateItems[r].NodeSetting + "'" );
                            }
                        }
                    }// publish
                }// write
                else
                {
                    break;
                }
            }// for i...
        }// createmonitoreditems
    }// createsubscription
    // clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: twoStateItems, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    // revert the nodes back to their original values
    print( "\n\n\nReverting to original values." );
    for( var i=0; i<twoStateItems.length; i++ )
    {
        twoStateItems[i].Value.Value = twoStateItems[i].InitialValue.clone();
    }
    WriteHelper.Execute( { NodesToWrite: twoStateItems } );
}

safelyInvoke( subscription66006 );