/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: TransferSubscriptions() specifying an invalid SubscriptionId.
    Revision History: 
        2012-09-14: Initial version */

function TransferSubscriptionsErr007() {
    TransferSubscriptionsHelper = new TransferSubscriptionsService();
    TransferSubscriptionsHelper.Execute( { 
            SourceSession: Test.Session.Session[0],
            DestinationSession: Test.Session.Session[1],
            SubscriptionIds: 0x9999,
            OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid )
            } );
}//function XX

safelyInvoke( TransferSubscriptionsErr007 );