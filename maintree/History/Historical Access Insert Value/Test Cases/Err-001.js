/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: specify an empty record */

function hainsertval() {
    var huRequest = new UaHistoryUpdateRequest();
    var huResponse = new UaHistoryUpdateResponse();
    Test.Session.buildRequestHeader( huRequest.RequestHeader );

    // issue the update
    var uaStatus = Test.Session.historyUpdate( huRequest, huResponse );
    if( uaStatus.isGood() ) {
        return( Assert.StatusCodeIs( new ExpectedAndAcceptedResults( [ StatusCode.BadNothingToDo, StatusCode.BadNodeIdInvalid ] ), huResponse.ResponseHeader.ServiceResult, "Expected service result to fail because the request is empty.", "Correct service result received." ) );
    }
    else return( false );
}

Test.Execute( { Procedure: hainsertval } );