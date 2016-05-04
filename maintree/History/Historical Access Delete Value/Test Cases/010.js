/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: multiple transactions in a single call */

function deleteValueTest() {
    // do we have enough items? we need 3 
    if( CUVariables.Items.length < 3 ) { addSkipped( "Not enough history items configured. Need 3. Please check 'HA Profile' settings." ); return( false ); }

    // valid modified timestamp
    var startTime = CUVariables.Items[1].RawModifiedValues[0].SourceTimestamp;

    // none existent raw timestamp
    var noDataStartTime = CUVariables.Items[2].RawValues.FirstRecord().SourceTimestamp;
    var stopCount = 999;
    while( true && stopCount-- > 0 ) {
        noDataStartTime.addSeconds( 1 );
        if( !OPCF.HA.Analysis.Exists.Date( { SourceTimestamp: noDataStartTime, RawData: CUVariables.Items[2].RawValues } ) ) break;
    }

    /* three transactions in one call: 
        [0] = delete first valid raw value for the first item
        [1] = delete a specific valid raw value for the second item 
        [2] = delete a raw value where no values exist (should fail) */
    CUVariables.HistoryUpdateParameters = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [ UaDeleteRawModifiedDetails.New( { NodeId: CUVariables.Items[0],
                                        IsDeleteModified: false,
                                        StartTime:        CUVariables.Items[0].FirstValueInHistory.SourceTimestamp,
                                        EndTime:          CUVariables.Items[0].FirstValueInHistory.SourceTimestamp } ),
                                  UaDeleteRawModifiedDetails.New( { NodeId: CUVariables.Items[1],
                                        IsDeleteModified: false,
                                        StartTime:        startTime,
                                        EndTime:          startTime } ),
                                  UaDeleteRawModifiedDetails.New( { NodeId: CUVariables.Items[2],
                                        IsDeleteModified: false,
                                        StartTime:        noDataStartTime,
                                        EndTime:          noDataStartTime } ) ],
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good ),
                              new ExpectedAndAcceptedResults( StatusCode.Good ),
                              new ExpectedAndAcceptedResults( StatusCode.BadNoData ) ] };

    var result = true;

    if( !HistoryUpdateHelper.Execute( CUVariables.HistoryUpdateParameters ) ) result = false;
    else CUVariables.ArchiveRecords( { Records: CUVariables.Items[0].RawValues, Number: 1 } );

    return( result );
}

Test.Execute( { Procedure: deleteValueTest } );