/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Delete mutliple, valid, subscriptions in a single call. */

function DeleteSubscriptions009() { 

const SUBSCRIPTION_COUNT = 5;

    var subs = [];
    for( var i=0; i<SUBSCRIPTION_COUNT; i++ ) {

        // define the subscription
        subs.push( new Subscription() );

        // create the subscription; if it fails the undo the creation
        if( !CreateSubscriptionHelper.Execute( { 
                    Subscription: subs[i]
                    } ) ) {
            DeleteSubscriptions.Execute( { 
                    SubscriptionIds: subs
                    } );
        }
    }//for i...

    DeleteSubscriptionsHelper.Execute( { 
            SubscriptionIds: subs
            } );
    return( true );
}//func

Test.Execute( { Procedure: DeleteSubscriptions009 } );