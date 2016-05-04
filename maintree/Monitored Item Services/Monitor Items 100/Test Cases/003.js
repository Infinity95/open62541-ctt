/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Modify multiple items with following diferences: SamplingInterval, MonitoringMode, QueueSize. */

function modifyMonitoredItems010() { 
    PublishHelper.Clear();
    // create a typical subscription
    var subscription = new Subscription();
    if( CreateSubscriptionHelper.Execute( { Subscription: subscription } ) ) { 
        // add the monitored items; standard parameter values again 
        if( CreateMonitoredItemsHelper.Execute( { ItemsToCreate: originalItems100, SubscriptionId: subscription, SuppressMessaging: true } ) ) { 
            // call Publish() just to get the first set of data
            PublishHelper.WaitInterval( { Items: originalItems100, Subscription: subscription } );
            PublishHelper.Execute( { FirstPublish: true } );
            Assert.True( PublishHelper.CurrentlyContainsData(), "Publish() did not yield the initial data-change as expected.", "Publish() correctly received initial data-change." );
            // now to modify the items: 
            //  1. the SamplingInterval 
            for( var i=0; i<originalItems100.length; i++ ) { 
                originalItems100[i].OriginalSamplingInterval = originalItems100[i].SamplingInterval;
                if( i % 2 ) originalItems100[i].SamplingInterval = 1000;
                else originalItems100[i].SamplingInterval = 3000;
            }//for i

            //  2. first half of items are REPORTING and DISCARDOLEST=TRUE, remainder are DISABLED and DISCARDOLDEST=FALSE
            for( var i=0; i<originalItems100.length; i++ ) {
                originalItems100[i].OriginalMonitoringMode = originalItems100[i].MonitoringMode;
                originalItems100[i].OriginalDiscardOldest = originalItems100[i].DiscardOldest;
                if( i < ( originalItems100.length / 2 ) ) {
                    originalItems100[i].MonitoringMode = MonitoringMode.Reporting;
                    originalItems100[i].DiscardOldest = true;
                }
                else { 
                    originalItems100[i].MonitoringMode = MonitoringMode.Disabled;
                    originalItems100[i].DiscardOldest = false;
                }
            }//for i
            
            //  3. QueueSize increments by 2 each time, starting at zero
            for( var i=0; i<originalItems100.length; i++ ) { 
                originalItems100[i].OriginalQueueSize = originalItems100[i].QueueSize;
                originalItems100[i].QueueSize = 2 * i;
            }//for i

            // invoke the changes
            ModifyMonitoredItemsHelper.Execute( { ItemsToModify: originalItems100, SubscriptionId:  subscription, SuppressMessaging: true } );

            // now to make sure that NONE of the RevisedQueueSizes are zero
            for( var i=0; i<originalItems100.length; i++ ) Assert.NotEqual( 0, originalItems100[i].RevisedQueueSize, "ModifyMonitoredItems.Response.Results[" + i + "].RevisedQueueSize is zero, which is not allowed." );

            // clean-up
            DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: originalItems100, SubscriptionId: subscription, SuppressMessaging: true } );
        }// create monitored items
        // clean-up
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscription } );
    }// create subscription
    // revert the sampling intervals back to their originals values 
    for( var i=0; i<originalItems100.length; i++ ) {
        originalItems100[i].SamplingInterval = originalItems100[i].OriginalSamplingInterval;
        originalItems100[i].DiscardOldest = originalItems100[i].OriginalDiscardOldest;
        originalItems100[i].MonitoringMode = originalItems100[i].OriginalMonitoringMode;
        originalItems100[i].QueueSize = originalItems100[i].OriginalQueueSize;
    }
    return( true );
}//function 

Test.Execute( { Procedure: modifyMonitoredItems010 } );