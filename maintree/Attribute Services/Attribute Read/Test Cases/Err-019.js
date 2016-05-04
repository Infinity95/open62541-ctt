/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read: Specify an invalid TimestampsToRead value. Expects Bad_TimestampsToReturnInvalid. */

function read581Err022() {
    return( ReadHelper.Execute( { NodesToRead: originalScalarItems[0], TimestampsToReturn: 0x12345, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadTimestampsToReturnInvalid ) } ) );
}

Test.Execute( { Procedure: read581Err022 } );