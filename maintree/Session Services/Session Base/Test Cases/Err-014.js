/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Close a session that was never created! Expect 'BadSessionIdInvalid'. */

function closeSession563Err002() {
    var session = new UaSession( Test.Channel );
    var expectedResults = new ExpectedAndAcceptedResults( StatusCode.BadSessionIdInvalid );
    expectedResults.addAcceptedResult( StatusCode.BadSessionClosed );
    return( CloseSessionHelper.Execute( { Session: session, ServiceResult: expectedResults } ) );
}

Test.Execute( { Procedure: closeSession563Err002 } );