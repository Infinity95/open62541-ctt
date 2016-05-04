/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: invalid enum */

function hainsertval() {
    var haparams = { 
          Debug: CUVariables.Debug,
          HistoryUpdateDetails: UaUpdateDataDetails.New(
                                  { NodeId: CUVariables.Items[0],
                                    PerformInsertReplace: 0x99,
                                    UpdateValues: [
                                        UaDataValue.New( { 
                                            Value: CUVariables.Items[0].Value[0].Value,
                                            StatusCode: StatusCode.Good,
                                            SourceTimestamp: UaDateTime.utcNow(),
                                            SourcePicoseconds: 0,
                                            ServerTimestamp: UaDateTime.utcNow(),
                                            ServerPicoseconds: 0 } )
                                         ] } ),
          OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadHistoryOperationInvalid ) ] };

    return( HistoryUpdateHelper.Execute( haparams ) );
}

Test.Execute( { Procedure: hainsertval } );