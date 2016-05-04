/*  Test prepared by Anand Taparia; ataparia@kepware.com    
   Description: Add monitored items of DataItem type (each supported datatype) to an enabled subscription. call Publish() to verify the values received match the expected values of each node. */

function subscribe614013 ()
{
    // Get accees to the DataItem nodes for this test
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 1 );
    if ( monitoredItems.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }

    // Create the subscription
    var subscription = new Subscription();
    if ( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) == false )
    {
        print( "Test aborted: Unable to create subscription." );
        return( false );
    }

    // Create and add monitored items to the subscription
    if ( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: monitoredItems, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) == false )
    {
        print( "Test aborted: Unable to add the monitored items to the subscription." );
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }
    
    // Wait for one publishing interval
    PublishHelper.WaitInterval( { Items: monitoredItems, Subscription: subscription } );
    
    // call Publish()
    print( "Calling publish." );
    if ( PublishHelper.Execute( { FirstPublish: true } ) )
    {
        if ( PublishHelper.CurrentlyContainsData )
        {
            for ( var d=0; d<PublishHelper.CurrentDataChanges.length; d++ ) // 'd' for DataChange 
            {
                for ( var m=0; m<PublishHelper.CurrentDataChanges[d].MonitoredItems.length; m++ ) // 'm' for MonitoredItem
                {
                    // Print the initial values of the nodes
                    if ( PublishHelper.CurrentDataChanges[d].MonitoredItems[m].Value.Value.isEmpty() )
                    {
                        addError ( "NULL value received for node '" + monitoredItems[m].NodeSetting + "'." );
                    }
                    else
                    {
                        addLog ( "Value received on publish for the dataitem node '" + monitoredItems[m].NodeSetting + "' is: " + UaVariantToSimpleType ( PublishHelper.CurrentDataChanges[d].MonitoredItems[m].Value.Value ) );
                    }
                }
            }
        }
        else
        {
            addError ( "No dataChange received after the publish as was expected." );
        }
    }
    // Clean up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: monitoredItems, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: subscribe614013 } );