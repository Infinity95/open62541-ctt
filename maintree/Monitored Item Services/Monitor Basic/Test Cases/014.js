/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Repetitively call CreateMonitoredItems/DeleteMonitoredItems in a loop of 10k. */

function createDeleteMonitoredItemsLoop() { 
    const LOOPMAX = 1000;

    // use the existing subscription - initialize.js
    for( var i=0; i<LOOPMAX; i++) { 
        // create the items; break loop if the call fails
        if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: scalarItems, SubscriptionId: MonitorBasicSubscription, SuppressMessaging: true } ) ) {
            addError( "Exiting loop (iteration: " + i + ") on CreateMonitoredItems." );
            break;
        }//if CreateMonitoredItems

        // delete the items; break loop if call fails
        if( !DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: scalarItems, SubscriptionId: MonitorBasicSubscription, SuppressMessaging: true } ) ) { 
            addError( "Exiting loop (iteration: " + i + ") on DeleteMonitoredItems." );
            break;
        }// if DeleteMonitoredItems

        // on every 250th iteration call Publish() just to avoid subscription timeout
        if( i % 250 === 0 ) PublishHelper.Execute();
    }//for i...
    // call Publish() to and ack any sequenceNumbers received, but not acknowledged.
    PublishHelper.Execute();
    return( true );
}//function createDeleteMonitoredItemsLoop()

Test.Execute( { Procedure: createDeleteMonitoredItemsLoop } );