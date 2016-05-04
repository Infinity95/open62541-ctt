/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org 
    Modify multiple items with following diferences: SamplingInterval, MonitoringMode, QueueSize. */

function modifyMonitoredItems010() { 
    // add the monitored items; standard parameter values again 
    if( CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: originalItems5000,
            SubscriptionId: defaultSubscription,
            SuppressMessaging: true
            } ) ) { 

        // call Publish() just to get the first set of data
        PublishHelper.WaitInterval( { Items: originalItems5000, Subscription: defaultSubscription } );
        PublishHelper.Execute( { FirstPublish: true } );
        Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not yield the initial data-change as expected on subscription 1 (SubscriptionId: " + defaultSubscription.SubscriptionId + ")." );

        // now to modify the items: 
        //  1. the SamplingInterval 
        for( var i=0; i<originalItems5000.length; i++ ) { 
            originalItems5000[i].OriginalSamplingInterval = originalItems5000[i].SamplingInterval;
            if( i % 2 ) originalItems5000[i].SamplingInterval = 1000;
            else originalItems5000[i].SamplingInterval = 3000;
        }//for i

        //  2. first half of items are REPORTING and DISCARDOLEST=TRUE, remainder are DISABLED and DISCARDOLDEST=FALSE
        for( var i=0; i<originalItems5000.length; i++ ) {
            originalItems5000[i].OriginalMonitoringMode = originalItems5000[i].MonitoringMode;
            originalItems5000[i].OriginalDiscardOldest = originalItems5000[i].DiscardOldest;
            if( i < ( originalItems5000.length / 2 ) ) {
                originalItems5000[i].MonitoringMode = MonitoringMode.Reporting;
                originalItems5000[i].DiscardOldest = true;
            }
            else { 
                originalItems5000[i].MonitoringMode = MonitoringMode.Disabled;
                originalItems5000[i].DiscardOldest = false;
            }
        }//for i
        
        //  3. QueueSize increments by 2 each time, starting at zero
        for( var i=0; i<originalItems5000.length; i++ ) { 
            originalItems5000[i].OriginalQueueSize = originalItems5000[i].QueueSize;
            originalItems5000[i].QueueSize = 2 * i;
        }//for i

        // invoke the changes
        ModifyMonitoredItemsHelper.Execute( { 
                ItemsToModify: originalItems5000,
                SubscriptionId:  defaultSubscription,
                SuppressMessaging: true
                } );

        // now to make sure that NONE of the RevisedQueueSizes are zero
        for( var i=0; i<originalItems5000.length; i++ ) Assert.NotEqual( 0, originalItems5000[i].RevisedQueueSize, "ModifyMonitoredItems.Response.Results[" + i + "].RevisedQueueSize is zero, which is not allowed." );


        // clean-up
        DeleteMonitoredItemsHelper.Execute( { 
                ItemsToDelete: originalItems5000,
                SubscriptionId: defaultSubscription,
                SuppressMessaging: true
                } );

    }// create monitored items


    // revert the sampling intervals back to their originals values 
    for( var i=0; i<originalItems5000.length; i++ ) {
        originalItems5000[i].SamplingInterval = originalItems5000[i].OriginalSamplingInterval;
        originalItems5000[i].DiscardOldest = originalItems5000[i].OriginalDiscardOldest;
        originalItems5000[i].MonitoringMode = originalItems5000[i].OriginalMonitoringMode;
        originalItems5000[i].QueueSize = originalItems5000[i].OriginalQueueSize;
    }
    return( true );
}//function 

Test.Execute( { Procedure: modifyMonitoredItems010 } );