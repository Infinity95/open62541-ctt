/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Modify the samplingInterval of multiple nodes, where the first half are set to 1000 msec and the latter half 3000 msec. */

function modifyMonitoredItems010() { 
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for Monitor Basic was not created" );
        return( false );
    }
    // add the monitored items; standard parameter values again 
    if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: scalarItems, SubscriptionId: MonitorBasicSubscription } ) ) { 
        // call Publish() just to get the first set of data
        PublishHelper.WaitInterval( { Items: scalarItems, Subscription: MonitorBasicSubscription } );
        PublishHelper.Execute( { FirstPublish: true } );
        Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not yield the initial data-change as expected.", "Publish() correctly received initial data-change." );

        // now to alternate item scan-rates and modify the items; record the original values first
        for( var i=0; i<scalarItems.length; i++ ) { 
            scalarItems[i].OriginalSamplingInterval = scalarItems[i].SamplingInterval;
            if( i % 2 ) scalarItems[i].SamplingInterval = 1000;
            else scalarItems[i].SamplingInterval = 3000;
        }//for i
        ModifyMonitoredItemsHelper.Execute( { ItemsToModify: scalarItems, SubscriptionId:  MonitorBasicSubscription } );

        // clean-up
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: scalarItems, SubscriptionId: MonitorBasicSubscription } );
    }// create monitored items

    // revert the sampling intervals back to their originals
    for( var i=0; i<scalarItems.length; i++ ) scalarItems[i].SamplingInterval = scalarItems[i].OriginalSamplingInterval;
    return( true );
}//function 

Test.Execute( { Procedure: modifyMonitoredItems010 } );