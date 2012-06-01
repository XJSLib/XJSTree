function XJSToken( ) {
    XJSNode.apply( this, arguments );
}
XJSToken.inherits( XJSNode );
Object.defineProperties( XJSToken.prototype, {
    source: {
        get: function ( ) {
            return this.leaves.map( function ( leaf ) {
                return leaf.value;
            } ).join( '' );
        }
    }
} );