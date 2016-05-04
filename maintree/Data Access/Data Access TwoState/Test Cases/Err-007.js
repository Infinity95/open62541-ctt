/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Write a value of false (as a string).
    Expectations:
        ServiceResult=Good. Results[0]=Bad_TypeMismatch. */

function write66Err007()
{
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        addSkipped( TSDT );
        return( false );
    }
    WriteValue( twoStateItems[0], "false", BuiltInType.String, WriteHelper )
    return( true );
}

Test.Execute( { Procedure: write66Err007 } );