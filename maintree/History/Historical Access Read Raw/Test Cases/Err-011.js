/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request invalid dataEncoding. */

function readrawErr011() {
    var result = true;
    CUVariables.Items[0].DataEncoding = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/InvalidNodeId1" ).toString() );

    var haparams = {
          NodesToRead: CUVariables.Items[0],
          TimestampsToReturn: TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          HistoryReadDetails: UaReadRawModifiedDetails.New(
                                  { IsReadModified: false,
                                    StartTime: CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                    EndTime: CUVariables.Items[0].LastValueInHistory.SourceTimestamp,
                                    NumValuesPerNode: 0, 
                                    ReturnBounds: false } ),
          Debug: CUVariables.Debug,
          ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ) };

        if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead() [test #"+ (1+i) + "] ServiceResult 'Good' expected; error codes expected at the operation level." ) ) result = false;
        if( !Assert.StatusCodeIs( new ExpectedAndAcceptedResults( StatusCode.BadDataEncodingInvalid ), 
                                  HistoryReadHelper.Response.Results[0].StatusCode, 
                                  "Status code is wrong.", 
                                  "Status code is correct." ) ) result = false;

    // clean-up and exit
    CUVariables.Items[0].DataEncoding = "";
    return( result );
}// function readrawErr011()

Test.Execute( { Procedure: readrawErr011 } );