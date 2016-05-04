/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Insert multiple (5) values for multiple item in a single transaction; all BAD */

function hainsertval() {
    // do we have enough nodes?
    if( CUVariables.Items.length < 5 ) { 
        addSkipped( "Not enough nodes configured for this test. 5 nodes needed. Please check settings. Skipping test." );
        return( true );
    }

    const NUM_ITEMS = 5, NUM_VALUES = 5;
    var expectedResults = [];

    // prepare one large update request... and specify the expected 'insert' results... 
    var haparams = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [],
          OperationResults: expectedResults };

    for( var i=0; i<NUM_ITEMS; i++ ) {
        expectedResults[i] = new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted );
        expectedResults[i].TransactionResults = [];
        haparams.HistoryUpdateDetails[i] = UaUpdateDataDetails.New(
                                              { NodeId: CUVariables.Items[i],
                                                PerformInsertReplace: PerformUpdateType.Insert,
                                                UpdateValues: [] } );
        for( var v=0; v<NUM_VALUES; v++ ) {
            haparams.HistoryUpdateDetails[i].UpdateValues[v] = UaDataValue.New( {   StatusCode: StatusCode.Bad,
                                                                                Value: CUVariables.Items[0].Value[0].Value,
                                                                                SourceTimestamp: UaDateTime.utcNow(),
                                                                                SourcePicoseconds: 0,
                                                                                ServerTimestamp: UaDateTime.utcNow(),
                                                                                ServerPicoseconds: 0 } );
            if( i < NUM_VALUES - 1 ) wait( 100 );
            expectedResults[i].TransactionResults[v] = new ExpectedAndAcceptedResults( StatusCode.Good );
        }
    }

    // invoke the update
    return( HistoryUpdateHelper.Execute( haparams ) );
}

Test.Execute( { Procedure: hainsertval } );