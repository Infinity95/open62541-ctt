/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: MaxAge is a negative number. Expect "Bad_MaxAgeInvalid". */

function read5810Err014() {
    return( ReadHelper.Execute( { NodesToRead: originalScalarItems[0], MaxAge: -100, ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadMaxAgeInvalid ) } ) );
}

Test.Execute( { Procedure: read5810Err014 } );