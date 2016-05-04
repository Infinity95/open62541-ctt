/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Write a value of FALSE (as a string).
    Expectations:
        ServiceResult=Good. Results[0]=Bad_TypeMismatch. */

function write66Err011()
{
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        _dataTypeUnavailable.store( TSDT );
        addSkipped( TSDT );
        return( false );
    }
    WriteValue( twoStateItems[0], "0", BuiltInType.String, WriteHelper )
    return( true );
}

Test.Execute( { Procedure: write66Err011 } );