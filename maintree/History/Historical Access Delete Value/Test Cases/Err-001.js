/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: delete a raw value where there is no value at the specified date */

function deleteValueTest() {
    // calculate a date where no data exists
    var startTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var stopCount = 999;
    while( true && stopCount-- > 0 ) {
        startTime.addSeconds( 1 );
        if( !OPCF.HA.Analysis.Exists.Date( { SourceTimestamp: startTime, RawData: CUVariables.Items[0].RawValues } ) ) break;
    }
    if( CUVariables.Debug ) print( "Found a timestamp (in cache) where no records exist: " + startTime + "." );

    CUVariables.HistoryUpdateParameters = {
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaDeleteRawModifiedDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    IsDeleteModified: false,
                                    StartTime: startTime,
                                    EndTime: startTime } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadNoData ) ] };

    var result = true;

    if( CUVariables.Debug ) print( "BEFORE TEST:\nNode[0] (" + CUVariables.Items[0].NodeId + ") has " + CUVariables.Items[0].RawValues.length + " raw values and " + CUVariables.Items[0].RawModifiedValues.length + " modified values." );
    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;


    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );