/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Write a value of �true� (as a string).
    Expectations:
        ServiceResult=Good. Results[0]=Bad_TypeMismatch. */

function write66Err001()
{
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        addSkipped( TSDT );
        return( false );
    }
    WriteValue( twoStateItems[0], "true", BuiltInType.String, WriteHelper )
    return( true );
}

Test.Execute( { Procedure: write66Err001 } );