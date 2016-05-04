/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create 2 subscriptions per session. Create 2 sessions. */

function session5101018() {
var result = true, sessions = [], subs = [], items = [];
    // create the session; create subscriptions; add items; call publish for each subscription
    for( var s=0; s<2; s++ ) {
        var session = new CreateSessionService( { Channel: Test.Channel } );
        var createSubscription = new CreateSubscriptionService( { Session: session } );
        var createMonitoredItems = new CreateMonitoredItemsService( { Session: session } );
        var publish = new PublishService( { Session: session } );
        if( session.Execute() ) {
            if( ActivateSessionHelper.Execute( { Session: session } ) ) {
                for( var i=0; i<2; i++ ) {
                    var sub = new Subscription();
                    if( createSubscription.Execute( { Subscription: sub } ) ) {
                        subs.push( sub );
                        var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
                        if( createMonitoredItems.Execute( { ItemsToCreate: item, SubscriptionId: sub } ) ) {
                            items.push( item );
                            publish.WaitInterval( { Items: item, Subscription: sub } );
                            publish.Execute();
                            if( !Assert.True( publish.CurrentlyContainsData(), "Subscription #" + i + " did not receive a datachange notification." ) ) result = false;
                        }
                        else result = false;
                    }
                    else result = false;
                }
                CloseSessionHelper.Execute( { Session: session } );
            }//activate session
            else result = false;
        }//create session
        else result = false;
    }
    // clean up
    for( var s=0; s<sessions.length; s++ ) {
        var session = sessions.pop();
        var deleteSubscription = new DeleteSubscriptionService( { Session: session } );
        var deleteMonitoredItems = new DeleteMonitoredItemsService( { Session: session } );
        for( var i=0; i<2; i++ ) {
            var item = items.pop();
            var sub = subs.pop();
            deleteMonitoredItems.Execute( { ItemsToDelete: item, SubscriptionId: sub } );
            deleteSubscription.Execute( { SubscriptionIds: sub } );
        }
        CloseSessionHelper.Execure( { Session: sessions[s] } );
    }//for s...
    return( result );
}

Test.Execute( { Procedure: session5101018 } );