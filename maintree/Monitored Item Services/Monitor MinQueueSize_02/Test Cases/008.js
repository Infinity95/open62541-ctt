/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Modify multiple items with following diferences: SamplingInterval, MonitoringMode, QueueSize.*/

function modifyMonitoredItems010() { 
    // create a typical subscription
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) { 

        // add the monitored items; standard parameter values again 
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: staticItems, SubscriptionId: subscription } ) ) { 

            // call Publish() just to get the first set of data
            PublishHelper.WaitInterval( { Items: staticItems, Subscription: subscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not yield the initial data-change as expected.", "Publish() correctly received initial data-change." );

            // now to modify the items: 
            //  1. the SamplingInterval 
            for( var i=0; i<staticItems.length; i++ ) { 
                staticItems[i].OriginalSamplingInterval = staticItems[i].SamplingInterval;
                if( i % 2 ) staticItems[i].SamplingInterval = 1000;
                else staticItems[i].SamplingInterval = 3000;
            }//for i

            //  2. first half of items are REPORTING and DISCARDOLEST=TRUE, remainder are DISABLED and DISCARDOLDEST=FALSE
            for( var i=0; i<staticItems.length; i++ ) {
                staticItems[i].OriginalMonitoringMode = staticItems[i].MonitoringMode;
                staticItems[i].OriginalDiscardOldest = staticItems[i].DiscardOldest;
                if( i < ( staticItems.length / 2 ) ) {
                    staticItems[i].MonitoringMode = MonitoringMode.Reporting;
                    staticItems[i].DiscardOldest = true;
                }
                else { 
                    staticItems[i].MonitoringMode = MonitoringMode.Disabled;
                    staticItems[i].DiscardOldest = false;
                }
            }//for i
            
            //  3. QueueSize increments by 2 each time, starting at zero
            for( var i=0; i<staticItems.length; i++ ) { 
                staticItems[i].OriginalQueueSize = staticItems[i].QueueSize;
                staticItems[i].QueueSize = 2 * i;
            }//for i

            // invoke the changes
            ModifyMonitoredItemsHelper.Execute( { ItemsToModify: staticItems, SubscriptionId:  subscription } );

            // now to make sure that NONE of the RevisedQueueSizes are zero
            for( var i=0; i<staticItems.length; i++ ) Assert.NotEqual( 0, staticItems[i].RevisedQueueSize, "ModifyMonitoredItems.Response.Results[" + i + "].RevisedQueueSize is zero, which is not allowed." );


            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: staticItems, SubscriptionId: subscription } );

        }// create monitored items

        // clean-up
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );

    }// create subscription

    // revert the sampling intervals back to their originals values 
    for( var i=0; i<staticItems.length; i++ ) {
        staticItems[i].SamplingInterval = staticItems[i].OriginalSamplingInterval;
        staticItems[i].DiscardOldest = staticItems[i].OriginalDiscardOldest;
        staticItems[i].MonitoringMode = staticItems[i].OriginalMonitoringMode;
        staticItems[i].QueueSize = staticItems[i].OriginalQueueSize;
    }
    return( true );
}//function 

Test.Execute( { Procedure: modifyMonitoredItems010 } );