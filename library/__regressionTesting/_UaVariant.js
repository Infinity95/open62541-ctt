include( "./library/Base/assertions.js" );

function UaVariantTesting(){};
UaVariantTesting.AssertIncEq = function( variant, expectedValue ) {
    if( variant === undefined || variant === null || variant.DataType === undefined || variant.DataType === null ) throw( "UaVariantTesting.AssertIncEq::variant not specified." );
    if( expectedValue === undefined || expectedValue === null ) throw( "UaVariantTesting.AssertIncEq::expectedValue not specified." );
    UaVariant.Increment( { Value: variant } ); //IncrementUaVariant( variant );
    return( Assert.Equal( expectedValue, UaVariantToSimpleType( variant ), "Variant type: " + BuiltInType.toString( variant.DataType ) ) );
}// UaVariantTesting.AssertIncEq = function( variant, value ) 

UaVariantTesting.AssertIncArEq = function( variant, startPos, endPos, expectedValue ) {
    if( variant === undefined || variant === null || variant.DataType === undefined || variant.DataType === null ) throw( "UaVariantTesting.AssertIncEq::variant not specified." );
    if( expectedValue === undefined || expectedValue === null ) throw( "UaVariantTesting.AssertIncEq::expectedValue not specified." );
    IncrementUaVariantArray( variant, startPos, endPos, 1 );
    var leftSide  = UaVariantToSimpleType( variant );
    var rightSide = UaVariantToSimpleType( expectedValue );
    return( Assert.ArraysEqual( leftSide, rightSide ) );
}// UaVariantTesting.AssertArIncEq = function( variant, value ) 

// IncrementUaVariantArray
include( "./library/Base/UaVariantToSimpleType.js" );
function testIncrementUaVariant() {
    var v = new UaVariant();
    v.setBoolean( true );    UaVariantTesting.AssertIncEq( v, false );
    v.setByte( 10 );         UaVariantTesting.AssertIncEq( v, 11 );
    v.setByteString( UaByteString.fromStringData( "hello" ) ); UaVariantTesting.AssertIncEq( v, UaByteString.fromStringData( "hellp" ) );
    v.setDateTime( Constants.DateTime_Min() );                 UaVariantTesting.AssertIncEq( v, UaDateTime.fromString( "1601-01-02T00:00:00.000Z" ) );
    v.setDouble( 99 );      UaVariantTesting.AssertIncEq( v, 100 );
    v.setFloat( 9 );        UaVariantTesting.AssertIncEq( v, 10 );
    v.setInt16( 99 );       UaVariantTesting.AssertIncEq( v, 100 );
    v.setInt32( 99 );       UaVariantTesting.AssertIncEq( v, 100 );
    v.setInt64( 99 );       UaVariantTesting.AssertIncEq( v, 100 );
    v.setSByte( 99 );       UaVariantTesting.AssertIncEq( v, 100 );
    v.setString( "hello" ); UaVariantTesting.AssertIncEq( v, "iello" );
    v.setUInt16( 99 );      UaVariantTesting.AssertIncEq( v, 100 );
    v.setUInt32( 99 );      UaVariantTesting.AssertIncEq( v, 100 );
    v.setUInt64( 99 );      UaVariantTesting.AssertIncEq( v, 100 );
    v.setUInt64( 9223372036854774784 );    UaVariantTesting.AssertIncEq( v, 0 );
    var x = new UaXmlElement();
    x.setString( "<tag>value</tag>" );
    v.setXmlElement( x ); UaVariantTesting.AssertIncEq( v, "<tag>value1</tag>" );
// override testing because of deficiencies with Assert.Equal
    //bytestring
    v.setByteString( UaByteString.fromStringData( "hello" ) ); UaVariant.Increment( { Value: v } ); 
    var b = v.toByteString();
    b = b.utf8ToString();
    print( ( b == "hellp" ? "Bytestring incremented ok 'hellp'=" + b : "ByteString failed: " + b ) );
    UaVariant.Increment( { Value: v } );
    b = v.toByteString();
    b = b.utf8ToString();
    print( ( b == "hellq" ? "Bytestring incremented ok 'hellq'=" + b : "ByteString failed: " + b ) );
    //string
    v.setString( "hello" );
    print( "v (before) 'hello'=" + v );
    UaVariant.Increment( { Value: v } );
    print( "v (after) 'hellp'=" + v );    
}//function testIncrementUaVariant()

function testIncrementUaVariantArray1d() {
    var v = new UaVariant(); var v2 = new UaVariant();
    var vl = new UaBooleans(); vl[0]=true; vl[1]=true; v.setBooleanArray(vl); var vr = new UaBooleans(); vr[0]=false; vr[1]=true; v2.setBooleanArray(vr);  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var vl = new UaDoubles(); vl[0]=5; vl[1]=6; v.setDoubleArray(vl); var vr = new UaDoubles(); vr[0]=6; vr[1]=6; v2.setDoubleArray(vr);  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var vl = new UaFloats(); vl[0]=5; vl[1]=6; v.setFloatArray(vl); var vr = new UaFloats(); vr[0]=6; vr[1]=6; v2.setFloatArray(vr);  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var vl = new UaFloats(); vl[0]=Constants.Float_Max; vl[1]=Constants.Float_Max; v.setFloatArray( vl ); var vr=new UaFloats(); vr[0]=0; vr[1]=Constants.Float_Max; v2.setFloatArray( vl ); UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var vl = new UaInt16s(); vl[0]=5; vl[1]=6; v.setInt16Array(vl); var vr = new UaInt16s(); vr[0]=6; vr[1]=6; v2.setInt16Array(vr);  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var vl = new UaInt32s(); vl[0]=5; vl[1]=6; v.setInt32Array(vl); var vr = new UaInt32s(); vr[0]=6; vr[1]=6; v2.setInt32Array(vr);  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var vl = new UaInt64s(); vl[0]=5; vl[1]=6; v.setInt64Array(vl); var vr = new UaInt64s(); vr[0]=6; vr[1]=6; v2.setInt64Array(vr);  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var vl = new UaUInt32s(); vl[0]=5; vl[1]=6; v.setUInt32Array(vl); var vr = new UaUInt32s(); vr[0]=6; vr[1]=6; v2.setUInt32Array(vr);  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var vl = new UaUInt64s(); vl[0]=5; vl[1]=6; v.setUInt64Array(vl); var vr = new UaUInt64s(); vr[0]=6; vr[1]=6; v2.setUInt64Array(vr);  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 );
    var bf = UaByteString.fromStringData( "hello world" ); v.setByteString( bf ); var ba = UaByteString.fromStringData( "iello world" ); v2.setByteString( ba );  UaVariantTesting.AssertIncArEq( v, 0, 1, v2 )
}//function testIncrementUaVariantArray1d()

testIncrementUaVariant();
testIncrementUaVariantArray1d();