/*  Test 6.6 Test 5; prepared by Nathan Pocock nathan.pocock@opcfoundation.org

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

function subscription66005()
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
        //create the monitored item within the subscription
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: twoStateItems[0], TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) )
        {
            // get the initial values first, before testing...
            PublishHelper.WaitPublishInterval ( { items: item, Subscription: subscription } );
            PublishHelper.Execute();
            // here's the loop, write a value; wait; publish; compare
            for( var i=0; i<NUM_WRITES; i++ )
            {
                // write
                twoStateItems[0].Value.Value.setBoolean( !twoStateItems[0].Value.Value.toBoolean() );
                if( WriteHelper.Execute( {
					NodesToWrite: twoStateItems[0] 
					} ) )
                {
                    // wait
                    PublishHelper.WaitPublishInterval ( { items: item, Subscription: subscription } );
                    // publish
                    if( PublishHelper.Execute() )
                    {
                        // we expect a data change
                        Assert.True( PublishHelper.CurrentlyContainsData(), "Expected a DataChange!" );
                        // we expect 1 notification
                        Assert.Equal( 1, PublishHelper.CurrentDataChanges[0].MonitoredItems.length, "Expected only 1 notification!" );
                        // we expect to receive the same value we wrote
                        Assert.Equal( twoStateItems[0].Value.Value.toBoolean(), PublishHelper.CurrentDataChanges[0].MonitoredItems[0].Value.Value.toBoolean(), "Expected to receive the same value we previously wrote!" );
                    }// publish
                }// write
                else
                {
                    addError( "Aborting test. Write failed!" );
                    break;
                }
            }// for i...
        }// createmonitoreditems
    }// createsubscription
    // clean-up
    DeleteMonitoredItemsHelper.Execute( {
		ItemsToDelete: twoStateItems[0], 
		SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    // revert the nodes back to their original values
    print( "\n\n\nReverting to original values." );
    for( var i=0; i<twoStateItems.length; i++ )
    {
        twoStateItems[i].Value.Value = twoStateItems[i].InitialValue.clone();
    }
    WriteHelper.Execute( { NodesToWrite: twoStateItems, ReadVerification: false } );
}

safelyInvoke( subscription66005 );