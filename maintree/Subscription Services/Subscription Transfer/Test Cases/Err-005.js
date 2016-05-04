/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: TransferSubscriptions() without specifying any SubscriptionIds.
    Revision History: 
        2012-09-14: Initial version */

function TransferSubscriptionsErr005() {
    TransferSubscriptionsHelper = new TransferSubscriptionsService();
    TransferSubscriptionsHelper.Execute( { 
            SourceSession: Test.Session.Session[0],
            DestinationSession: Test.Session.Session[1],
            SubscriptionIds: [],
            ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo )
            } );
}//function XX

safelyInvoke( TransferSubscriptionsErr005 );