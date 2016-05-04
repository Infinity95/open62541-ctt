/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Write a value of 0 (as an integer).
    Expectations:
        ServiceResult=Good. Results[0]=Bad_TypeMismatch. */

function browse66Err010()
{
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        addSkipped( TSDT );
        return( false );
    }
    WriteValue( twoStateItems[0], 0, BuiltInType.Int16, WriteHelper )
    return( true );
}

Test.Execute( { Procedure: browse66Err010 } );