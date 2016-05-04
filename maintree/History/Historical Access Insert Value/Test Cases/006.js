/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Insert varying quality values, for multiple items in a single transaction */

function hainsertval() {
    var expectedResults = [];

    // prepare one large update request... and specify the expected 'insert' results... 
    var haparams = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: [],
          OperationResults: expectedResults };

    for( var i=0; i<CUVariables.Items.length; i++ ) {
        haparams.HistoryUpdateDetails[i] = UaUpdateDataDetails.New(
                                              { NodeId: CUVariables.Items[i],
                                                PerformInsertReplace: PerformUpdateType.Insert,
                                                UpdateValues: [
                                                    UaDataValue.New( { 
                                                        Value: CUVariables.Items[i].Value[0].Value,
                                                        SourceTimestamp: UaDateTime.utcNow(),
                                                        SourcePicoseconds: 0,
                                                        ServerTimestamp: UaDateTime.utcNow(),
                                                        ServerPicoseconds: 0 } )
                                                     ] } );

        // vary the quality code per item
        if( i % 2 === 0 ) haparams.HistoryUpdateDetails[i].UpdateValues[0].StatusCode.StatusCode = StatusCode.Good;
        else if( i % 2 === 1 ) haparams.HistoryUpdateDetails[i].UpdateValues[0].StatusCode.StatusCode = StatusCode.Bad;
        else haparams.HistoryUpdateDetails[i].UpdateValues[0].StatusCode.StatusCode = StatusCode.Uncertain;

        // specify the expected results (success)
        var expectedResult = new ExpectedAndAcceptedResults( StatusCode.GoodEntryInserted );
        expectedResult.TransactionResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
        expectedResults.push( expectedResult );
    }// for i

    // invoke the update
    return( HistoryUpdateHelper.Execute( haparams ) );
}

Test.Execute( { Procedure: hainsertval } );