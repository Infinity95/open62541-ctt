include( "./library/Base/safeInvoke.js" );

// Simple key-pair collection, similar to a hashTable. 
// Nathan Pocock (nathan.pocock@opcfoundation.org) Dec-18-2012.
function KeyPairCollection() {
    // updates the value for the given key
    this.Set = function( key, value ) {
        if( !isDefined( [ key, value ] ) ) throw( "key/value not specified." );
        this[key] = value;
    }// this.Set = function( key, value )

    // retrieves the value of the specified key
    this.Get = function( key ) { 
        if( isDefined( this[key] ) ) return( this[key] );
        else return( null );
    }// this.Get = function( key )

    // removes the given key and value from the collection
    this.Remove = function( key ) {
        if( isDefined( this[key] ) ) {
            this[key] = null;
            delete this[key];
        }
    }// this.Remove = function( key )

    // returns the current length of the collection
    this.Length = function() {
        var i=0;
        for( k in this ) if( k !== "Set" && k !== "Get" && k !== "Remove" && k !== "Length" && k !== "Contains" && k!== "Keys" ) i++;
        return( i );
    }// this.Length = function()

    this.Contains = function( key ) { 
        return( isDefined( this[key] ) );
    }

    this.Keys = function() { 
        var keys = [];
        for( k in this ) if( k !== "Set" && k !== "Get" && k !== "Remove" && k !== "Length" && k !== "Contains" && k !== "Keys" && k !== "Values" && k !== "each" ) keys.push( k );
        return( keys );
    }

    this.Values = function() { 
        var values = [];
        for( k in this ) if( k !== "Set" && k !== "Get" && k !== "Remove" && k !== "Length" && k !== "Contains" && k !== "Keys" && k !== "Values" && k !== "each"  ) values.push( this.Get( k ) );
        return( values );
    }

}// function KeyPairCollection()


/* Static function that converts an array of nodes, as converted from a nodeset,
   into a keypair collection.
   Args: 
       Items: the array of items to convert */
KeyPairCollection.FromNodeSet = function( args ) { 
    var kpc = new KeyPairCollection();
    if( isDefined( args ) && isDefined( args.Items ) ) {
        if( !isDefined( args.Items.length ) ) args.Items = [ args.Items ];
        for( i in args.Items ) {
            kpc.Set( args.Items[i].NodeId, args.Items[i] );
        }//for i
    }
    return( kpc );
}//KeyPairCollection.FromNodeSet = function( args ) 