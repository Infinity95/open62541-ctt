/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Cancel a completed call.
        How this test works:
            1. Issue a ReadHelper request of a Valid node. The call will complete with success.
            2. Cancel the call to Read. */

function cancel564003() {
    var item1 = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item1 === null ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }

    ReadHelper.Execute( { NodesToRead: item1 } );

    CancelHelper.Execute( { RequestHandle: ReadHelper.Request.RequestHeader.RequestHandle, ServiceResult: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNothingToDo ] ) } );
    return( true );
}

Test.Execute( { Procedure: cancel564003 } );