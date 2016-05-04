/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Add monitored item for each supported data-type to an enabled subscription. Write the max value of the corresponding data-type. call Publish(). */

function subscribe614014 ()
{
    // Get acces to nodes
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings, 0, Attribute.Value, "", MonitoringMode.Reporting );
    if( items.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }

    // Create subscription for this test
    subscription = new Subscription();
    if( !CreateSubscriptionHelper.Execute( { Subscription: subscription } ) )
    {
        return( false );
    }
    
    // Create and add the items to the subscription
    if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscription } ) )
    {
        addError( "Create monitored items failed with status '" + uaStatus + "'.");
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
        return( false );
    }

    // Assign write value for each item
    for( var w=0; w<items.length; w++ )
    {
        var currentNodeDataType = UaNodeId.GuessType( items[w].NodeSetting );
        var maxDataTypevalue = getMaxValueDataType ( currentNodeDataType );
        items[w].SafelySetValueTypeKnown( maxDataTypevalue, currentNodeDataType );
        print ( "Writing max datatype value for dataitem node '" + items[w].NodeSetting + "': " + UaVariantToSimpleType ( items[w].Value.Value ) );
    }    
    // Issue the write    
    if ( WriteHelper.Execute( { NodesToWrite: items } ) == false )
    {
        addError( "Write failed for the DataItem nodes, writing MAX value for each data-type." );
    }
    else
    {
        // Wait such that the latest writes get polled by the server
        PublishHelper.WaitInterval( { Items: items, Subscription: subscription } );
    
        // 2nd publish call
        print ( "Making the publish call..." );
        if( PublishHelper.Execute() )
        {
            if ( PublishHelper.CurrentlyContainsData() ) 
            {
                PublishHelper.PrintDataChanges();
                // Now compare the values received with those written
                for( var w=0; w<items.length; w++ )
                {
                    var writeVal = UaVariantToSimpleType ( items[w].Value.Value );
                    var publishVal = UaVariantToSimpleType ( PublishHelper.CurrentDataChanges[0].MonitoredItems[w].Value.Value ); 

                    var match = true;
                    if( writeVal !== publishVal && writeVal != publishVal )
                    {
                        if( writeVal === null ) { writeVal = ""; }
                        if( publishVal === null ) { publishVal = ""; }
                        if( publishVal.toString() !== publishVal.toString() )
                        { 
                            match = false;
                        }
                    }

                    if (match)
                    {
                        addLog ( "Value received on publish for node '" + items[w].NodeSetting + "' matches what was written. Value = " + writeVal );
                    }
                    else
                    {
                        addError ( "Value received on publish for node '" + items[w].NodeSetting + "' does not matches what was written.\n\tWrite value: " + writeVal + "\n\tValue received on publish: " + publishVal );
                    }
                }
            }
            else
            {
                addLog ( "No dataChange notifications received." );
            }
        }
    }
    // Clean-up
    DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: items, SubscriptionId: subscription } );
    DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: subscribe614014 } );