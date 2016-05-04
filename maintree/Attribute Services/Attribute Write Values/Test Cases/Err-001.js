/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: nodesToWrite array empty; expected service result = BadNothingToDo. */

function write582Err001() {
    return( WriteHelper.Execute( { NodesToWrite: [], ServiceResult: new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo ) } ) );
}

Test.Execute( { Procedure: write582Err001 } );