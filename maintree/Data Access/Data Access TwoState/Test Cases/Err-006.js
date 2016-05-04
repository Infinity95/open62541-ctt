/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Write a value of -1 (as an integer).
    Expectations:
        ServiceResult=Good. Results[0]=Bad_TypeMismatch. 
*/

function write66Err004()
{
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        addSkipped( TSDT );
        return( false );
    }
    WriteValue( twoStateItems[0], -1, BuiltInType.Int16, WriteHelper )
    return( true );
}

Test.Execute( { Procedure: write66Err004 } );